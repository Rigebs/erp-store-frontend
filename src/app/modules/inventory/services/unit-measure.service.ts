import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnitMeasure } from '../models/unit-measure';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureService {
  private readonly baseUrl = 'http://localhost:8080/units-measure';

  constructor(private http: HttpClient) {}

  findAll(): Observable<UnitMeasure[]> {
    return this.http.get<UnitMeasure[]>(this.baseUrl);
  }
}
