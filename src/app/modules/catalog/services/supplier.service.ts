import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/pageable';
import { SupplierRequest, SupplierResponse } from '../models/supplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/suppliers`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number,
    size: number
  ): Observable<ApiResponse<Page<SupplierResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<SupplierResponse>>>(this.baseUrl, {
      params,
    });
  }

  findById(id: number): Observable<ApiResponse<SupplierResponse>> {
    return this.http.get<ApiResponse<SupplierResponse>>(
      `${this.baseUrl}/${id}`
    );
  }

  save(supplierRequest: SupplierRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.baseUrl, supplierRequest);
  }

  update(
    id: number,
    supplierRequest: SupplierRequest
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/${id}`,
      supplierRequest
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  toggleEnabled(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, {});
  }
}
