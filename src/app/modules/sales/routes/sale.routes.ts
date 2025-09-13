import { Routes } from '@angular/router';

export const SALE_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('../new-sale/new-sale.component').then((m) => m.NewSaleComponent),
  },
  {
    path: 'new2',
    loadComponent: () =>
      import('../new-sale-2/new-sale-2.component').then(
        (m) => m.NewSale2Component
      ),
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../sales-list/sales-list.component').then(
        (m) => m.SalesListComponent
      ),
  },
  {
    path: 'find/:saleId',
    loadComponent: () =>
      import('../sale-details/sale-details.component').then(
        (m) => m.SaleDetailsComponent
      ),
  },
];
