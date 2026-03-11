import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment.development';
import { LoginRequest, RegisterRequest, TokenResponse } from '../models/auth.model';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  #token = signal<string | null>(localStorage.getItem('auth_token'));
  #refreshToken = signal<string | null>(localStorage.getItem('refresh_token'));

  isAuthenticated = computed(() => !!this.#token());

  userRole = computed(() => {
    const token = this.#token();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || decoded.roles?.[0] || null;
    } catch {
      return null;
    }
  });

  login(credentials: LoginRequest): Observable<ApiResponse<TokenResponse>> {
    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.saveTokens(response.data.token, response.data.refreshToken);
        }
      }),
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/register`, userData);
  }

  refreshToken(): Observable<ApiResponse<TokenResponse>> {
    console.log('djkfjdfk');

    const refreshToken = this.#refreshToken();
    return this.http
      .post<ApiResponse<TokenResponse>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.saveTokens(response.data.token, response.data.refreshToken);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    this.#token.set(null);
    this.#refreshToken.set(null);
  }

  private saveTokens(token: string, refreshToken: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    this.#token.set(token);
    this.#refreshToken.set(refreshToken);
  }

  getToken(): string | null {
    return this.#token();
  }
}
