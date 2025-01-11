import { Routes } from '@angular/router';
import { tokenGuard } from './guards/token.guard';
import { NewSaleComponent } from './modules/sales/new-sale/new-sale.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'management/products',
    pathMatch: 'full',
  },
  {
    path: 'management',
    loadChildren: () => import('./modules/management.routes'),
    canActivate: [tokenGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'new-sale',
    component: NewSaleComponent,
  },
];
