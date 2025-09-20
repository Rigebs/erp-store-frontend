import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { environment } from '../../../../environments/environment';
import { DashboardSummary } from '../models/dashboard-summary';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_GENERAL}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<DashboardSummary>> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApiResponse<DashboardSummary>>(this.baseUrl, {
      params,
    });
  }
}
