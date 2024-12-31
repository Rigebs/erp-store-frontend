import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

export default [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('../layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
] as Routes;
