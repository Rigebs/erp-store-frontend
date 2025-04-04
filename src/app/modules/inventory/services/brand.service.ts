import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { BrandRequest } from '../models/request/brand-request';
import { BrandDto } from '../models/dto/brand-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';
import { Line } from '../models/line';
import { Pageable } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/brands`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(page: number, size: number): Observable<Pageable<Brand>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Pageable<Brand>>(
      `${this.baseUrl}/from/${this.userId}`,
      {
        params,
      }
    );
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
