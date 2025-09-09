import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StockRequest, StockResponse } from '../models/stock';
import { ApiResponse } from '../../../models/api-response';
import { Page } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/stocks`;

  constructor(private http: HttpClient) {}

  manageStock(request: StockRequest): Observable<ApiResponse<StockResponse>> {
    return this.http.post<ApiResponse<StockResponse>>(
      `${this.baseUrl}/manage`,
      request
    );
  }

  getAllStock(
    page: number,
    size: number,
    filters?: {
      productId?: number;
      warehouseId?: number;
      minQuantity?: number;
      maxQuantity?: number;
      belowMin?: boolean;
    }
  ): Observable<ApiResponse<Page<StockResponse>>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value as any);
        }
      });
    }

    return this.http.get<ApiResponse<Page<StockResponse>>>(this.baseUrl, {
      params,
    });
  }
}
