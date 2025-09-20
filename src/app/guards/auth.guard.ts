import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtUtilService } from '../utils/jwt-util.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtUtilService = inject(JwtUtilService);

  const token = jwtUtilService.getToken();

  if (token && jwtUtilService.isValidToken()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
