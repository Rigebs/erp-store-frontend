import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Line } from '../models/line';
import { LineRequest } from '../models/request/line-request';
import { LineDto } from '../models/dto/line-dto';
import { ApiResponse } from '../../../models/api-response';
import { JwtUtilService } from '../../../utils/jwt-util.service';

@Injectable({
  providedIn: 'root',
})
export class LineService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/users/lines';

  private readonly userId: number;
  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  findAll(): Observable<Line[]> {
    return this.http.get<Line[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  findAllActive(): Observable<Line[]> {
    return this.http.get<Line[]>(`${this.baseUrl}/from/${this.userId}/active`);
  }

  findById(id: number): Observable<LineDto> {
    return this.http.get<LineDto>(`${this.baseUrl}/${id}`);
  }

  save(lineRequest: LineRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, lineRequest);
  }

  update(id: number, lineRequest: LineRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, lineRequest);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}`, {});
  }
}
