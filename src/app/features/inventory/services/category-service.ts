import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageResponse } from '../../../core/models/api.model';
import { Category, CategoryPayload } from '../../../core/models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  #page = signal<PageResponse<Category> | null>(null);
  #loading = signal(false);

  categories = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(page = 0, size = 10, searchTerm = ''): Observable<PageResponse<Category>> {
    this.#loading.set(true);
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (searchTerm?.trim()) {
      params = params.set('search', searchTerm.trim());
    }

    return this.http.get<ApiResponse<PageResponse<Category>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Category> {
    return this.http
      .get<ApiResponse<Category>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  save(category: CategoryPayload): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, category);
  }

  update(id: number, category: Partial<Category>): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, category).pipe(
      tap(() => this.#updateLocalItem(id, category)),
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
            content: state.content.filter((i) => i.id !== id),
            totalElements: Math.max(0, state.totalElements - 1),
          };
        });
      }),
      map(() => void 0),
    );
  }

  toggleStatus(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}`, {}).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          const content = state.content.map((i) =>
            i.id === id ? { ...i, enabled: !i.enabled } : i,
          );
          return { ...state, content };
        });
      }),
      map(() => void 0),
    );
  }

  #updateLocalItem(id: number, data: Partial<Category>): void {
    this.#page.update((state) => {
      if (!state) return null;
      return {
        ...state,
        content: state.content.map((i) => (i.id === id ? { ...i, ...data } : i)),
      };
    });
  }
}
