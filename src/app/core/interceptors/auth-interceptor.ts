import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, finalize } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && !req.url.includes('/auth/')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error) => {
      // SOLO refrescamos si es 401 y NO es una petición de auth
      if (error.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((t) => t !== null),
          take(1),
          switchMap((newToken) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })),
          ),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((res) => {
          const newToken = res?.data?.token;
          if (!newToken) throw new Error('No token');
          refreshTokenSubject.next(newToken);
          return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
        }),
        catchError((err) => {
          authService.logout(); // Si el refresh falla, ahí sí echamos al usuario
          return throwError(() => err);
        }),
        finalize(() => (isRefreshing = false)),
      );
    }),
  );
};
