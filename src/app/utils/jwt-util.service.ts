import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtUtilService {
  private readonly TOKEN_KEY = 'authToken';

  private token: string | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem(this.TOKEN_KEY);
    }
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    this.token = token;
  }

  getToken(): string | null {
    if (!this.token && isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem(this.TOKEN_KEY);
    }
    return this.token;
  }

  isValidToken(token: string): boolean {
    try {
      const decoded = this.decodeToken<JwtPayload>(token);
      if (!decoded || !decoded.exp) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error al validar el token:', error);
      return false;
    }
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.token = null;
  }

  decodeToken<T = JwtPayload>(token?: string): T | null {
    const jwt = token || this.getToken();
    if (jwt) {
      try {
        return jwtDecode<T>(jwt);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return this.isValidToken(token);
  }
}
