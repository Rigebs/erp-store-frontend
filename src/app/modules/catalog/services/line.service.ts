import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LineRequest, LineResponse } from '../models/line';
import { ApiResponse } from '../../../models/api-response';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class LineService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/lines`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number,
    size: number
  ): Observable<ApiResponse<Page<LineResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<LineResponse>>>(this.baseUrl, {
      params,
    });
  }

  findById(id: number): Observable<ApiResponse<LineResponse>> {
    return this.http.get<ApiResponse<LineResponse>>(`${this.baseUrl}/${id}`);
  }

  save(lineRequest: LineRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.baseUrl, lineRequest);
  }

  update(id: number, lineRequest: LineRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/${id}`,
      lineRequest
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  toggleEnabled(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, {});
  }
}
