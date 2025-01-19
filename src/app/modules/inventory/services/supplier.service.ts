import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';
import { SupplierRequest } from '../models/request/supplier-request';
import { SupplierDto } from '../models/dto/supplier-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/users/suppliers';

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  findAllActive(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(
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
