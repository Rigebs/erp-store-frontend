import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'management',
    loadChildren: () => import('./modules/inventory/management.routes'),
  },
];
