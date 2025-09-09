import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryRequest, CategoryResponse } from '../models/category';
import { ApiResponse } from '../../../models/api-response';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/categories`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number,
    size: number
  ): Observable<ApiResponse<Page<CategoryResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<CategoryResponse>>>(this.baseUrl, {
      params,
    });
  }

  findById(id: number): Observable<ApiResponse<CategoryResponse>> {
    return this.http.get<ApiResponse<CategoryResponse>>(
      `${this.baseUrl}/${id}`
    );
  }

  save(categoryRequest: CategoryRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.baseUrl, categoryRequest);
  }

  update(
    id: number,
    categoryRequest: CategoryRequest
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/${id}`,
      categoryRequest
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  toggleEnabled(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, {});
  }
}
