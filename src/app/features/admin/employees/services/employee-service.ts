import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, tap, finalize, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { PageResponse, ApiResponse } from '../../../../core/models/api.model';
import { Employee, EmploymentStatus } from '../../../../core/models/user.model';
import { ToastService } from '../../../../shared/services/toast-service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  #page = signal<PageResponse<Employee> | null>(null);
  #loading = signal(false);

  employees = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(page = 0, size = 10, query = ''): Observable<PageResponse<Employee>> {
    this.#loading.set(true);
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<ApiResponse<PageResponse<Employee>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      catchError((err) => {
        this.toast.error('Error', 'No se pudieron cargar los empleados');
        return throwError(() => err);
      }),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Employee> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`).pipe(
      map((res) => res.data),
      catchError((err) => {
        this.toast.error('Error', 'No se encontró al empleado solicitado');
        return throwError(() => err);
      }),
    );
  }

  save(employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, employee).pipe(
      tap(() => this.toast.success('Éxito', 'Empleado guardado correctamente')),
      catchError((err) => {
        this.toast.error('Error', 'No se pudo guardar el empleado');
        return throwError(() => err);
      }),
    );
  }

  createAccount(id: number, request: { email: string; role: string }): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/user-account`, request).pipe(
      tap(() => {
        this.#updateLocalItem(id, {} as Partial<Employee>);
        this.toast.success('Cuenta creada', 'Se ha enviado el acceso al correo del empleado');
      }),
      map(() => void 0),
      catchError((err) => {
        this.toast.error('Error', 'No se pudo crear la cuenta de usuario');
        return throwError(() => err);
      }),
    );
  }

  update(id: number, employee: Partial<Employee>): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, employee).pipe(
      tap(() => {
        this.#updateLocalItem(id, employee);
        this.toast.success('Actualizado', 'Datos modificados correctamente');
      }),
      map(() => void 0),
      catchError((err) => {
        this.toast.error('Error', 'Hubo un fallo al actualizar el perfil');
        return throwError(() => err);
      }),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.filter((e) => e.id !== id),
            totalElements: Math.max(0, state.totalElements - 1),
          };
        });
        this.toast.warning('Eliminado', 'El empleado ha sido removido del sistema');
      }),
      map(() => void 0),
      catchError((err) => {
        this.toast.error('Error', 'No se pudo eliminar el registro');
        return throwError(() => err);
      }),
    );
  }

  updateStatus(id: number, status: EmploymentStatus): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((e) =>
              e.id === id ? { ...e, employmentStatus: status } : e,
            ),
          };
        });
        this.toast.info('Estado actualizado', `El empleado ahora está ${status}`);
      }),
      map(() => void 0),
      catchError((err) => {
        this.toast.error('Error', 'No se pudo cambiar el estado del empleado');
        return throwError(() => err);
      }),
    );
  }

  #updateLocalItem(id: number, data: Partial<Employee>): void {
    this.#page.update((state) => {
      if (!state) return null;
      return {
        ...state,
        content: state.content.map((e) => (e.id === id ? { ...e, ...data } : e)),
      };
    });
  }
}
