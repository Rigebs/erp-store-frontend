import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { ProductRequest } from '../models/request/product-request';
import { ProductDto } from '../models/dto/product-dto';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';
import { Pageable } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/products`;

  constructor(
    private http: HttpClient,
    private jwtUtilService: JwtUtilService
  ) {}

  private get userId(): number | undefined {
    return this.jwtUtilService.getId();
  }

  findAll(page: number, size: number): Observable<Pageable<Product>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Pageable<Product>>(
      `${this.baseUrl}/from/${this.userId}`,
      {
        params,
      }
    );
  }

  findAllActive(): Observable<Pageable<Product>> {
    return this.http.get<Pageable<Product>>(
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
