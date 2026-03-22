import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pos',
        loadComponent: () => import('./pages/pos-page/pos-page').then((m) => m.PosPage),
      },
    ],
  },
];
