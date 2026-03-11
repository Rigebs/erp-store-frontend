import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, PageResponse } from '../../../core/models/api.model';
import { Line } from '../../../core/models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class LineService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/lines`;

  #page = signal<PageResponse<Line> | null>(null);
  #loading = signal<boolean>(false);

  lines = computed(() => this.#page()?.content ?? []);
  totalElements = computed(() => this.#page()?.totalElements ?? 0);
  isLoading = computed(() => this.#loading());

  findAll(page = 0, size = 10): Observable<PageResponse<Line>> {
    this.#loading.set(true);
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<ApiResponse<PageResponse<Line>>>(this.apiUrl, { params }).pipe(
      map((res) => res.data),
      tap((data) => this.#page.set(data)),
      finalize(() => this.#loading.set(false)),
    );
  }

  findById(id: number): Observable<Line> {
    return this.http.get<ApiResponse<Line>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }

  save(line: Partial<Line>): Observable<void> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, line).pipe(
      map(() => {
        this.findAll(this.#page()?.number, this.#page()?.size).subscribe();
      }),
    );
  }

  update(id: number, line: Partial<Line>): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, line).pipe(
      map(() => {
        this.#page.update((state) => {
          if (!state) return null;
          return {
            ...state,
            content: state.content.map((l) => (l.id === id ? { ...l, ...line } : l)),
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
            content: state.content.filter((l) => l.id !== id),
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
            content: state.content.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)),
          };
        });
      }),
    );
  }
}
