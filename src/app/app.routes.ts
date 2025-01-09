import { Routes } from '@angular/router';
import { tokenGuard } from './guards/token.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'management/products',
    pathMatch: 'full',
  },
  {
    path: 'management',
    loadChildren: () => import('./modules/inventory/management.routes'),
    canActivate: [tokenGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
];
