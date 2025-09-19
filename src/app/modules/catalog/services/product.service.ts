import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductResponse } from '../models/product';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/pageable';
import { ProductFilter } from '../models/product-filter';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/products`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number,
    size: number,
    sort: string[] = ['id,desc'],
    filter?: ProductFilter
  ): Observable<ApiResponse<Page<ProductResponse>>> {
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

    return this.http.get<ApiResponse<Page<ProductResponse>>>(this.baseUrl, {
      params,
    });
  }

  findById(id: number): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(`${this.baseUrl}/${id}`);
  }

  save(productRequest: ProductResponse): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.baseUrl, productRequest);
  }

  update(
    id: number,
    productRequest: ProductResponse
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/${id}`,
      productRequest
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  deleteRelationships(
    id: number,
    tableName: string
  ): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/${tableName}/${id}`
    );
  }

  toggleEnabled(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, {});
  }
}
