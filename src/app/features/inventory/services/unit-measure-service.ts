import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageResponse } from '../../../core/models/api.model';
import { UnitMeasure } from '../../../core/models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/units-measure`;

  #page = signal<PageResponse<UnitMeasure> | null>(null);
  #loading = signal<boolean>(false);

  units = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(page = 0, size = 10, searchTerm = ''): Observable<PageResponse<UnitMeasure>> {
    this.#loading.set(true);

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (searchTerm && searchTerm.trim().length > 0) {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<ApiResponse<PageResponse<UnitMeasure>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<UnitMeasure> {
    return this.http
      .get<ApiResponse<UnitMeasure>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  save(unit: Partial<UnitMeasure>): Observable<void> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, unit).pipe(
      map(() => {
        this.findAll(this.#page()?.number, this.#page()?.size).subscribe();
      }),
    );
  }

  update(id: number, unit: Partial<UnitMeasure>): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, unit).pipe(
      map(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((u) => (u.id === id ? { ...u, ...unit } : u)),
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
            content: state.content.filter((u) => u.id !== id),
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
            content: state.content.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)),
          };
        });
      }),
    );
  }
}
