import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { ProductRequest } from '../models/request/product-request';
import { ProductDto } from '../models/dto/product-dto';
import { JwtUtilService } from '../../../utils/jwt-util.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/users/products';

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  /**
   * Retrieve all products for the current user.
   */
  findAllByUser(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  /**
   * Retrieve all active products for the current user.
   */
  findAllActive(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/from/${this.userId}/active`
    );
  }

  /**
   * Retrieve a product by its ID.
   */
  findById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new product.
   */
  save(productRequest: ProductRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, productRequest);
  }

  /**
   * Update an existing product.
   */
  update(id: number, productRequest: ProductRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, productRequest);
  }

  /**
   * Delete a product by its ID.
   */
  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Delete relationships for a given table and ID.
   */
  deleteRelationships(id: number, tableName: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${tableName}/${id}`);
  }

  /**
   * Toggle the status of a product.
   */
  toggleStatus(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}`, {});
  }
}
