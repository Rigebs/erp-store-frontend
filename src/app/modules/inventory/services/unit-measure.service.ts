import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitMeasure } from '../models/unit-measure';
import { UnitMeasureRequest } from '../models/request/unit-measure-request';
import { UnitMeasureDto } from '../models/dto/unit-measure-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';
import { Pageable } from '../../../models/pageable';

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/units-measure`;

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(page: number, size: number): Observable<Pageable<UnitMeasure>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Pageable<UnitMeasure>>(
      `${this.baseUrl}/from/${this.userId}`,
      {
        params,
      }
    );
  }

  findAllActive(): Observable<Pageable<UnitMeasure>> {
    return this.http.get<Pageable<UnitMeasure>>(
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
