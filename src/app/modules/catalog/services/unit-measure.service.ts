import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UnitMeasureRequest,
  UnitMeasureResponse,
} from '../models/unit-measure';
import { ApiResponse } from '../../../models/api-response';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/units-measure`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number,
    size: number
  ): Observable<ApiResponse<Page<UnitMeasureResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<UnitMeasureResponse>>>(this.baseUrl, {
      params,
    });
  }

  findById(id: number): Observable<ApiResponse<UnitMeasureResponse>> {
    return this.http.get<ApiResponse<UnitMeasureResponse>>(
      `${this.baseUrl}/${id}`
    );
  }

  save(unitMeasureRequest: UnitMeasureRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.baseUrl, unitMeasureRequest);
  }

  update(
    id: number,
    unitMeasureRequest: UnitMeasureRequest
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/${id}`,
      unitMeasureRequest
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  toggleEnabled(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, {});
  }
}
