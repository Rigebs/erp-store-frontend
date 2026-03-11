import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/auth/login']);
};

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const expectedRole = route.data['role'];

  return authService.userRole() === expectedRole;
};
