import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageResponse } from '../../../core/models/api.model';
import { Product, ProductPayload } from '../../../core/models/catalog.model';
import { ToastService } from '../../../shared/services/toast-service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly toast = inject(ToastService);

  #page = signal<PageResponse<Product> | null>(null);
  #loading = signal(false);

  products = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(
    filters: Record<string, any> = {},
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
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }

  save(product: ProductPayload): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product).pipe(
      map((res) => res.data),
      tap((newP) => {
        this.#page.update((s) =>
          s ? { ...s, content: [newP, ...s.content], totalElements: s.totalElements + 1 } : null,
        );
        // Notificación de éxito
        this.toast.success('Producto Creado', `El producto ${newP.name} ha sido registrado.`);
      }),
    );
  }

  update(id: number, product: ProductPayload): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, product).pipe(
      tap(() => {
        this.#page.update((s) =>
          s
            ? {
                ...s,
                content: s.content.map((p) => (p.id === id ? { ...p, ...(product as any) } : p)),
              }
            : null,
        );
        // Notificación de éxito
        this.toast.success(
          'Actualización Exitosa',
          'Los datos del producto han sido actualizados.',
        );
      }),
      map(() => void 0),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.#page.update((s) =>
          s
            ? {
                ...s,
                content: s.content.filter((p) => p.id !== id),
                totalElements: Math.max(0, s.totalElements - 1),
              }
            : null,
        );
        this.toast.warning('Producto Eliminado', 'El registro ha sido removido del sistema.');
      }),
      map(() => void 0),
    );
  }

  toggleEnabled(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}`, {}).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          const updatedContent = state.content.map((p) =>
            p.id === id ? { ...p, enabled: !p.enabled } : p,
          );

          const product = updatedContent.find((p) => p.id === id);
          const status = product?.enabled ? 'activado' : 'desactivado';
          this.toast.info('Estado Actualizado', `El producto ahora está ${status}.`);

          return { ...state, content: updatedContent };
        });
      }),
      map(() => void 0),
    );
  }

  exportToExcel(query: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/export`, { params: { query }, responseType: 'blob' })
      .pipe(tap(() => this.toast.info('Exportación', 'Iniciando descarga del archivo Excel...')));
  }
}
