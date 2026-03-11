import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageResponse } from '../../../core/models/api.model';
import { Brand } from '../../../core/models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/brands`;

  #page = signal<PageResponse<Brand> | null>(null);
  #loading = signal<boolean>(false);

  brands = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(page = 0, size = 10): Observable<PageResponse<Brand>> {
    this.#loading.set(true);
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<ApiResponse<PageResponse<Brand>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Brand> {
    return this.http.get<ApiResponse<Brand>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }

  save(brand: Partial<Brand>): Observable<void> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, brand).pipe(
      map(() => {
        this.findAll(this.#page()?.number, this.#page()?.size).subscribe();
      }),
    );
  }

  update(id: number, brand: Partial<Brand>): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, brand).pipe(
      map(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((b) => (b.id === id ? { ...b, ...brand } : b)),
          };
        });
      }),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.filter((b) => b.id !== id),
            totalElements: state.totalElements - 1,
          };
        });
      }),
    );
  }

  toggleStatus(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}`, {}).pipe(
      map(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)),
          };
        });
      }),
    );
  }
}
