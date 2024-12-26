import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Line } from '../models/line';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LineService {
  private readonly baseUrl = 'http://localhost:8080/lines';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Line[]> {
    return this.http.get<Line[]>(this.baseUrl);
  }
}
