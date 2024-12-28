import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { BrandRequest } from '../models/request/brand-request';
import { BrandDto } from '../models/dto/brand-dto';
import { ApiResponse } from '../../../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly baseUrl = 'http://localhost:8080/brands';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl);
  }

  findAllActive(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/active`);
  }

  findById(id: number): Observable<BrandDto> {
    return this.http.get<BrandDto>(`${this.baseUrl}/${id}`);
  }

  save(brandRequest: BrandRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, brandRequest);
  }

  update(id: number, brandRequest: BrandRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, brandRequest);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}`, {});
  }
}
