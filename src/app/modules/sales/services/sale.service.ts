import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleRequest } from '../models/request/sale-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { Sale } from '../models/sale';
import { JwtUtilService } from '../../../utils/jwt-util.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly baseUrl = `${environment.NG_APP_URL_ROOT}/sales`;

  private readonly userId: number;

  constructor(private http: HttpClient, jwtUtilService: JwtUtilService) {
    this.userId = jwtUtilService.getId()!;
  }

  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.baseUrl}/from/${this.userId}`);
  }

  getSale(saleId: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.baseUrl}/${saleId}`);
  }

  save(saleRequest: SaleRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, saleRequest);
  }
}
