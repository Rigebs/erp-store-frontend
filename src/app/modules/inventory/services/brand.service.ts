import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { BrandRequest } from '../models/request/brand-request';
import { BrandDto } from '../models/dto/brand-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly baseUrl = `${environment.NG_APP_URL_ROOT}/brands`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  findAllActive(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/from/${this.userId}/active`);
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
