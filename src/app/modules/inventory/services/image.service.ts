import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageResponse } from '../models/image-response';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/images`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File, folder: string): Observable<ImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageResponse>(
      `${this.baseUrl}/upload/${folder}`,
      formData
    );
  }
}
