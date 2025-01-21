import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { ProductRequest } from '../models/request/product-request';
import { ProductDto } from '../models/dto/product-dto';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.NG_APP_URL_ROOT}/products`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAllByUser(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  findAllActive(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/from/${this.userId}/active`
    );
  }

  findById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/${id}`);
  }

  save(productRequest: ProductRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, productRequest);
  }

  update(id: number, productRequest: ProductRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, productRequest);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  deleteRelationships(id: number, tableName: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${tableName}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}`, {});
  }
}
