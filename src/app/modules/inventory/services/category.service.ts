import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryRequest } from '../models/request/category-request';
import { CategoryDto } from '../models/dto/category-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/categories`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  findAllActive(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.baseUrl}/from/${this.userId}/active`
    );
  }

  findById(id: number): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.baseUrl}/${id}`);
  }

  save(categoryRequest: CategoryRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, categoryRequest);
  }

  update(
    id: number,
    categoryRequest: CategoryRequest
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, categoryRequest);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}`, {});
  }
}
