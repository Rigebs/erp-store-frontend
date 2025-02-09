import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/token-response';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { ApiResponse } from '../../models/api-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.NG_APP_URL_API_AUTH}`;

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/login`, loginRequest);
  }

  register(registerRequest: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/register`,
      registerRequest
    );
  }
}
