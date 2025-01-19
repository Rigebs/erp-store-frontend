import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtUtilService } from '../utils/jwt-util.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

export const tokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtUtilService = inject(JwtUtilService);
  const platformId = inject(PLATFORM_ID);
  const snackBar = inject(MatSnackBar);

  if (isPlatformBrowser(platformId)) {
    const token = jwtUtilService.getToken();

    if (token) {
      if (jwtUtilService.isValidToken()) {
        return true;
      } else {
        jwtUtilService.removeToken();
        router.navigate(['/auth/login']);
        snackBar.open('Tu sesión ha expirado', 'Cerrar', {
          duration: 2000,
        });
        return false;
      }
    } else {
      router.navigate(['/auth/login']);

      snackBar.open('Inicia sesión, por favor', 'Cerrar', {
        duration: 2000,
      });
      return false;
    }
  }
  return true;
};
