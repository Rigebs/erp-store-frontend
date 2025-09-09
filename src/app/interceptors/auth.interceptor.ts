import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtUtilService } from '../utils/jwt-util.service';
import { LoadingService } from '../services/loading.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const jwtUtilService = inject(JwtUtilService);
  const loadingService = inject(LoadingService);

  const token: string | null = jwtUtilService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadingService.show();
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        jwtUtilService.removeToken();
      }
      router.navigate(['/auth/login']);
      snackBar.open(
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
        'cerrar',
        {
          duration: 3000,
        }
      );

      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.hide();
    })
  );
};
