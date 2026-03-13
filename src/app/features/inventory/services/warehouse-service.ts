import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api.model';
import { Warehouse, WarehousePayload } from '../../../core/models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/warehouses`;

  #page = signal<PageResponse<Warehouse> | null>(null);
  #loading = signal(false);

  warehouses = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(
    filters: Record<string, string | number | boolean | null | undefined> = {},
    page = 0,
    size = 10,
  ): Observable<PageResponse<Warehouse>> {
    this.#loading.set(true);
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<PageResponse<Warehouse>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Warehouse> {
    return this.http
      .get<ApiResponse<Warehouse>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  save(warehouse: WarehousePayload): Observable<Warehouse> {
    return this.http.post<ApiResponse<Warehouse>>(this.apiUrl, warehouse).pipe(
      map((res) => res.data),
      tap((newWarehouse) => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: [newWarehouse, ...state.content],
            totalElements: state.totalElements + 1,
          };
        });
      }),
    );
  }

  update(id: number, warehouse: WarehousePayload): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, warehouse).pipe(
      tap(() => this.#updateLocalItem(id, warehouse)),
      map(() => void 0),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.filter((w) => w.id !== id),
            totalElements: Math.max(0, state.totalElements - 1),
          };
        });
      }),
      map(() => void 0),
    );
  }

  toggleEnabled(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}`, {}).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
          };
        });
      }),
      map(() => void 0),
    );
  }

  transferStock(payload: {
    originId: number;
    destinationId: number;
    productId: string;
    quantity: number;
  }): Observable<void> {
    this.#loading.set(true);
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/transfer`, payload).pipe(
      map(() => void 0),
      finalize(() => this.#loading.set(false)),
    );
  }

  #updateLocalItem(id: number, data: Partial<Warehouse>): void {
    this.#page.update((state) => {
      if (!state) return null;
      return {
        ...state,
        content: state.content.map((w) => (w.id === id ? { ...w, ...data } : w)),
      };
    });
  }
}
