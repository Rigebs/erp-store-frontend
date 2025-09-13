import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  {
    path: 'stock',
    loadComponent: () =>
      import('../stock/stock-list/stock-list.component').then(
        (m) => m.StockListComponent
      ),
  },
  {
    path: 'movements',
    loadComponent: () =>
      import('../movements/movement-list/movement-list.component').then(
        (m) => m.MovementListComponent
      ),
  },
];
