import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';
import { SupplierRequest } from '../models/request/supplier-request';
import { SupplierDto } from '../models/dto/supplier-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';
import { Pageable } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/suppliers`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(page: number, size: number): Observable<Pageable<Supplier>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Pageable<Supplier>>(
      `${this.baseUrl}/from/${this.userId}`,
      {
        params,
      }
    );
  }

  findAllActive(): Observable<Pageable<Supplier>> {
    return this.http.get<Pageable<Supplier>>(
      `${this.baseUrl}/from/${this.userId}/active`
    );
  }

  findById(id: number): Observable<SupplierDto> {
    return this.http.get<SupplierDto>(`${this.baseUrl}/${id}`);
  }

  save(supplierRequest: SupplierRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, supplierRequest);
  }

  update(
    id: number,
    supplierRequest: SupplierRequest
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, supplierRequest);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}`, {});
  }
}
