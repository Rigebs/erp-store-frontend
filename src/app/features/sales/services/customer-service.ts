import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, tap, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PageResponse, ApiResponse } from '../../../core/models/api.model';
import { ToastService } from '../../../shared/services/toast-service';
import { Customer } from '../../../core/models/sales.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/customers`;
  private readonly toast = inject(ToastService);

  #page = signal<PageResponse<Customer> | null>(null);
  #loading = signal(false);

  customers = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(
    filters: Record<string, any> = {},
    page = 0,
    size = 10,
  ): Observable<PageResponse<Customer>> {
    this.#loading.set(true);
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<PageResponse<Customer>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Customer> {
    return this.http
      .get<ApiResponse<Customer>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  save(customer: any): Observable<Customer> {
    return this.http.post<ApiResponse<Customer>>(this.apiUrl, customer).pipe(
      map((res) => res.data),
      tap((newC) => {
        const displayName = newC.person?.name || newC.company?.name || 'Cliente';
        this.#page.update((s) =>
          s ? { ...s, content: [newC, ...s.content], totalElements: s.totalElements + 1 } : null,
        );
        this.toast.success('Cliente Registrado', `${displayName} ha sido creado.`);
      }),
    );
  }

  update(id: number, customer: any): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, customer).pipe(
      tap(() => {
        this.#page.update((s) =>
          s
            ? {
                ...s,
                content: s.content.map((c) => (c.id === id ? { ...c, ...customer } : c)),
              }
            : null,
        );
        this.toast.success('Actualización Exitosa', 'Los datos del cliente han sido actualizados.');
      }),
      map(() => void 0),
    );
  }

  toggleEnabled(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}`, {}).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          const updatedContent = state.content.map((c) =>
            c.id === id ? { ...c, enabled: !c.enabled } : c,
          );

          const customer = updatedContent.find((c) => c.id === id);
          const status = customer?.enabled ? 'activado' : 'desactivado';
          this.toast.info('Estado de Cliente', `El cliente ha sido ${status}.`);

          return { ...state, content: updatedContent };
        });
      }),
      map(() => void 0),
    );
  }
}
