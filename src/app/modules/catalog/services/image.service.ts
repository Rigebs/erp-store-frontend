import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/images`;

  constructor(private http: HttpClient) {}

  uploadImage(
    file: File,
    folder: string
  ): Observable<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ imageUrl: string }>>(
      `${this.baseUrl}/upload/${folder}`,
      formData
    );
  }
}
