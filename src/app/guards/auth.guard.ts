import { CanActivateFn, Router } from '@angular/router';
import { JwtUtilService } from '../utils/jwt-util.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtUtilService = inject(JwtUtilService);

  const token = jwtUtilService.getToken();

  if (token && jwtUtilService.isValidToken(token)) {
    router.navigate(['/management/products']);
    return false;
  }

  return true;
};
