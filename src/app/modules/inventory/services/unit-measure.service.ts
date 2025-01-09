import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnitMeasure } from '../models/unit-measure';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { UnitMeasureRequest } from '../models/request/unit-measure-request';
import { UnitMeasureDto } from '../models/dto/unit-measure-dto';

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/users/units-measure';

  constructor(private http: HttpClient) {}

  findAll(): Observable<UnitMeasure[]> {
    return this.http.get<UnitMeasure[]>(this.baseUrl);
  }

  findAllActive(): Observable<UnitMeasure[]> {
    return this.http.get<UnitMeasure[]>(`${this.baseUrl}/active`);
  }

  findById(id: number): Observable<UnitMeasureDto> {
    return this.http.get<UnitMeasureDto>(`${this.baseUrl}/${id}`);
  }

  save(unitMeasureRequest: UnitMeasureRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, unitMeasureRequest);
  }

  update(
    id: number,
    unitMeasureRequest: UnitMeasureRequest
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/${id}`,
      unitMeasureRequest
    );
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}`, {});
  }
}
