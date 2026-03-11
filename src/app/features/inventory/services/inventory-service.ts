import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { InventoryMovement, InventoryMovementPayload } from '../../../core/models/inventory.model';
import { PageResponse } from '../../../core/models/api.model';

export interface InventoryMovementFilter {
  type?: string;
  warehouseId?: number;
  dateFrom?: string;
  searchTerm?: string;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/inventory`;

  getAllMovements(filter: InventoryMovementFilter): Observable<PageResponse<InventoryMovement>> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString());

    if (filter.type && filter.type !== 'Todos') {
      params = params.set('type', filter.type);
    }

    if (filter.warehouseId) {
      params = params.set('warehouseId', filter.warehouseId.toString());
    }

    if (filter.dateFrom) {
      params = params.set('dateFrom', filter.dateFrom);
    }

    if (filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }

    return this.http.get<PageResponse<InventoryMovement>>(this.apiUrl, { params });
  }

  createMovement(payload: InventoryMovementPayload): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(`${this.apiUrl}/movements`, payload);
  }
}
