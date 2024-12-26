import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly baseUrl = 'http://localhost:8080/brands';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl);
  }
}
