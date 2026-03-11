import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageResponse } from '../../../core/models/api.model';
import { Product, ProductPayload } from '../../../core/models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  #productsPage = signal<PageResponse<Product> | null>(null);
  #loading = signal<boolean>(false);

  products = computed(() => this.#productsPage()?.content ?? []);
  totalElements = computed(() => this.#productsPage()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(
    filters: Record<string, string | number | boolean | null | undefined> = {},
    page = 0,
    size = 10,
  ): Observable<PageResponse<Product>> {
    this.#loading.set(true);

    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<PageResponse<Product>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#productsPage.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }

  save(product: ProductPayload): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product).pipe(
      map((res) => res.data),
      tap((newProduct) => {
        this.#productsPage.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: [newProduct, ...state.content],
            totalElements: state.totalElements + 1,
          };
        });
      }),
    );
  }

  update(id: number, product: ProductPayload): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, product).pipe(
      map(() => {
        this.#productsPage.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((p) =>
              p.id === id ? { ...p, ...(product as unknown as Partial<Product>) } : p,
            ),
          };
        });
      }),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        this.#productsPage.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.filter((p) => p.id !== id),
            totalElements: Math.max(0, state.totalElements - 1),
          };
        });
      }),
    );
  }

  toggleEnabled(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}`, {}).pipe(
      map(() => {
        this.#productsPage.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
          };
        });
      }),
    );
  }
}
