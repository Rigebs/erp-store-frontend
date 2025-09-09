import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandRequest, BrandResponse } from '../models/brand';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/brands`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(
    page: number,
    size: number
  ): Observable<ApiResponse<Page<BrandResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<BrandResponse>>>(`${this.baseUrl}`, {
      params,
    });
  }

  findById(id: number): Observable<ApiResponse<BrandResponse>> {
    return this.http.get<ApiResponse<BrandResponse>>(`${this.baseUrl}/${id}`);
  }

  save(brandRequest: BrandRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.baseUrl, brandRequest);
  }

  update(
    id: number,
    brandRequest: BrandRequest
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/${id}`,
      brandRequest
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  toggleEnabled(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}`, {});
  }
}
