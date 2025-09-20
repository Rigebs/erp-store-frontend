import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleRequest } from '../models/request/sale-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { SaleResponse } from '../models/sale';
import { environment } from '../../../../environments/environment';
import { SaleFilter } from '../models/sale-filter';
import { Page } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/sales`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number,
    size: number,
    sort: string[] = ['total,desc'],
    filter?: SaleFilter
  ): Observable<ApiResponse<Page<SaleResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    sort.forEach((s) => {
      params = params.append('sort', s);
    });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Page<SaleResponse>>>(this.baseUrl, {
      params,
    });
  }

  getSale(saleId: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(`${this.baseUrl}/${saleId}`);
  }

  save(saleRequest: SaleRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.baseUrl, saleRequest);
  }
}
