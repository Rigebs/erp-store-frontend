import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitMeasure } from '../models/unit-measure';
import { UnitMeasureRequest } from '../models/request/unit-measure-request';
import { UnitMeasureDto } from '../models/dto/unit-measure-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureService {
  private readonly baseUrl = `${environment.NG_APP_URL_ROOT}/units-measure`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(): Observable<UnitMeasure[]> {
    return this.http.get<UnitMeasure[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  findAllActive(): Observable<UnitMeasure[]> {
    return this.http.get<UnitMeasure[]>(
      `${this.baseUrl}/from/${this.userId}/active`
    );
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
