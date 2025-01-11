import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtUtilService } from '../utils/jwt-util.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtUtilService = inject(JwtUtilService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = jwtUtilService.getToken();

    if (token && jwtUtilService.isValidToken()) {
      console.log('Token presente, redirigiendo a /management/products');
      router.navigate(['/management/products']);
      return false;
    }
  }

  console.log('SSR: Permitiendo acceso al login');
  return true;
};
