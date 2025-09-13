import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { Page } from '../../../models/pageable';
import { InventoryMovementResponse } from '../models/inventory-movement';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private readonly backendUrl = `${environment.NG_APP_URL_API_GENERAL}/movements`;

  constructor(private http: HttpClient) {}

  getAllMovements(
    page: number,
    size: number
  ): Observable<ApiResponse<Page<InventoryMovementResponse>>> {
    return this.http.get<ApiResponse<Page<InventoryMovementResponse>>>(
      `${this.backendUrl}?page=${page}&size=${size}`
    );
  }
}
