import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  let token: string | null = null;

  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('authToken');
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && error.error?.error === 'Expired Token') {
        snackBar.open(
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          'Cerrar',
          {
            duration: 3000,
          }
        );

        localStorage.clear();
        sessionStorage.clear();
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};
