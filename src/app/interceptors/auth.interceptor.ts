import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtUtilService } from '../utils/jwt-util.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (isBrowser) {
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);
    const jwtUtilService = inject(JwtUtilService);

    const token: string | null = jwtUtilService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        jwtUtilService.removeToken();
        router.navigate(['/auth/login']);
        snackBar.open(
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
          'cerrar',
          {
            duration: 3000,
          }
        );
        console.log('error');

        return throwError(() => error);
      })
    );
  } else {
    return of();
  }
};
