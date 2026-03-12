import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { map, Observable, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api.model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/images`;

  #loading = signal<boolean>(false);
  isLoading = computed(() => this.#loading());

  upload(file: File, folder: string = 'products'): Observable<{ imageUrl: string }> {
    this.#loading.set(true);

    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<{ imageUrl: string }>>(`${this.apiUrl}/upload/${folder}`, formData)
      .pipe(
        map((res) => ({
          imageUrl: res.data.imageUrl,
        })),
        finalize(() => this.#loading.set(false)),
      );
  }
}
