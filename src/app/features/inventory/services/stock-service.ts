import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProductStockByWarehouse } from '../../../core/models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/stock`;
}
