import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      // 1. Si es 0, avisamos del problema de red (No logout)
      if (error.status === 0) {
        toastService.error('Error de Conexión', 'No se pudo contactar con el servidor.');
        return throwError(() => error);
      }

      // 2. Si es 401, el authInterceptor ya lo está manejando.
      // Solo mostramos mensaje si es un error de login (url /auth/)
      if (error.status === 401) {
        if (req.url.includes('/auth/login')) {
          toastService.error('Credenciales Inválidas', 'Usuario o contraseña incorrectos.');
        }
        return throwError(() => error);
      }

      // 3. Permisos denegados
      if (error.status === 403) {
        toastService.error('Acceso Denegado', 'No tienes permisos para esta acción.');
        return throwError(() => error);
      }

      // 4. Errores genéricos
      const errorMessage = error.error?.message || error.statusText || 'Error inesperado';
      toastService.error(`Error ${error.status}`, errorMessage);

      return throwError(() => new Error(errorMessage));
    }),
  );
};
