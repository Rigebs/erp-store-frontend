import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, map, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { PageResponse, ApiResponse } from '../../../../core/models/api.model';
import { Branch, BranchPayload } from '../../../../core/models/branch.model';
import { ToastService } from '../../../../shared/services/toast-service';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/branches`;
  private readonly toast = inject(ToastService);

  #page = signal<PageResponse<Branch> | null>(null);
  #loading = signal(false);

  branches = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(page = 0, size = 10): Observable<PageResponse<Branch>> {
    this.#loading.set(true);
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<ApiResponse<PageResponse<Branch>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  // Nuevo método FindById
  findById(id: number): Observable<Branch> {
    return this.http.get<ApiResponse<Branch>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }

  save(branch: BranchPayload): Observable<Branch> {
    return this.http.post<ApiResponse<Branch>>(this.apiUrl, branch).pipe(
      map((res) => res.data || (branch as unknown as Branch)),
      tap((newB) => {
        this.#page.update((s) =>
          s ? { ...s, content: [newB, ...s.content], totalElements: s.totalElements + 1 } : null,
        );
        this.toast.success('Sucursal Creada', `La sede ${branch.name} ha sido registrada.`);
      }),
    );
  }

  update(id: number, branch: BranchPayload): Observable<Branch> {
    return this.http.put<ApiResponse<Branch>>(`${this.apiUrl}/${id}`, branch).pipe(
      map((res) => res.data || (branch as unknown as Branch)),
      tap((updatedB) => {
        this.#page.update((state) => {
          if (!state) return null;
          const updatedContent = state.content.map((b) => (b.id === id ? updatedB : b));
          return { ...state, content: updatedContent };
        });
        this.toast.success('Sucursal Actualizada', `Los cambios en ${branch.name} se guardaron.`);
      }),
    );
  }

  toggleEnabled(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          const updated = state.content.map((b) =>
            b.id === id ? { ...b, enabled: !b.enabled } : b,
          );
          this.toast.info('Estado Actualizado', 'El estado de la sucursal ha cambiado.');
          return { ...state, content: updated };
        });
      }),
      map(() => void 0),
    );
  }
}
