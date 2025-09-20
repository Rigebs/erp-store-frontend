import { Routes } from '@angular/router';
import { tokenGuard } from './guards/token.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./modules/management.routes'),
    canActivate: [tokenGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
];
