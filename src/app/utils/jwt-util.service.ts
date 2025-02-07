import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtUtilService {
  private readonly TOKEN_KEY = 'authToken';

  private token: string | null = null;

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);

    this.token = token;
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(this.TOKEN_KEY);
    }
    return this.token;
  }

  isValidToken(): boolean {
    try {
      const decoded = this.decodeToken<JwtPayload>();
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
    localStorage.removeItem(this.TOKEN_KEY);

    this.token = null;
  }

  decodeToken<T = JwtPayload>(): T | null {
    const jwt = this.getToken();
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
    return this.isValidToken();
  }

  getId(): number | undefined {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken<{ id: number }>();
      if (decoded?.id !== undefined) {
        return decoded.id;
      }
    }
    return undefined;
  }
}
