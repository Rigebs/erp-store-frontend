import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageResponse } from '../models/image-response';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/users/images';

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
