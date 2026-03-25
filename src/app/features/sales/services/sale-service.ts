import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, tap, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PageResponse, ApiResponse } from '../../../core/models/api.model';
import { Sale, SalePayload } from '../../../core/models/sales.model';
import { ToastService } from '../../../shared/services/toast-service';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sales`;
  private readonly toast = inject(ToastService);

  #page = signal<PageResponse<Sale> | null>(null);
  #loading = signal(false);

  sales = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(filters: Record<string, any> = {}, page = 0, size = 10): Observable<PageResponse<Sale>> {
    this.#loading.set(true);
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<PageResponse<Sale>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Sale> {
    return this.http.get<ApiResponse<Sale>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }

  save(payload: SalePayload): Observable<void> {
    this.#loading.set(true);
    return this.http.post<ApiResponse<void>>(this.apiUrl, payload).pipe(
      tap(() => {
        this.toast.success('Venta Exitosa', 'La transacción se ha registrado correctamente.');
        // Opcional: Podrías refrescar la lista aquí si estás en una vista de historial
      }),
      map(() => void 0),
      finalize(() => this.#loading.set(false)),
    );
  }

  getSummary(start: string, end: string): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/summary`, { params })
      .pipe(map((res) => res.data));
  }
}
