import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize } from 'rxjs';
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
  #loading = signal<boolean>(false);

  categories = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(page = 0, size = 10): Observable<PageResponse<Category>> {
    this.#loading.set(true);
    const params = new HttpParams().set('page', page).set('size', size);

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

  save(category: CategoryPayload): Observable<void> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, category).pipe(map(() => void 0));
  }

  update(id: number, category: Partial<Category>): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, category).pipe(
      map(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((c) => (c.id === id ? { ...c, ...category } : c)),
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
            content: state.content.filter((c) => c.id !== id),
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
            content: state.content.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
          };
        });
      }),
    );
  }
}
