import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403 || error.status === 0) {
        return throwError(() => error);
      }

      console.log('Error manejado por errorInterceptor:', error);
      const errorMessage = error.error?.message || error.statusText || 'Error desconocido';

      return throwError(() => new Error(errorMessage));
    }),
  );
};
