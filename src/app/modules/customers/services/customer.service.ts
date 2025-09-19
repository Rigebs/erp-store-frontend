import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/pageable';
import { CustomerRequest, CustomerResponse } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/customers`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number,
    size: number,
    query?: string,
    enabled?: boolean
  ): Observable<ApiResponse<Page<CustomerResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (query) {
      params = params.set('query', query);
    }

    if (enabled !== undefined && enabled !== null) {
      params = params.set('enabled', enabled);
    }

    return this.http.get<ApiResponse<Page<CustomerResponse>>>(this.baseUrl, {
      params,
    });
  }

  findById(id: number): Observable<ApiResponse<CustomerResponse>> {
    return this.http.get<ApiResponse<CustomerResponse>>(
      `${this.baseUrl}/${id}`
    );
  }

  save(request: CustomerRequest): Observable<ApiResponse<CustomerResponse>> {
    return this.http.post<ApiResponse<CustomerResponse>>(this.baseUrl, request);
  }

  update(id: number, request: CustomerRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, request);
  }

  toggleEnabled(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, {});
  }
}
