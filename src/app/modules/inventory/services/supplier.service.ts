import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Line } from '../models/line';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly baseUrl = 'http://localhost:8080/suppliers';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.baseUrl);
  }
}
