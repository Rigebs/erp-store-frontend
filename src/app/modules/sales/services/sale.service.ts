import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleRequest } from '../models/request/sale-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/users/sales';

  constructor(private http: HttpClient) {}

  save(saleRequest: SaleRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, saleRequest);
  }
}
