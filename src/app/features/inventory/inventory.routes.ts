import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'setup',
        loadComponent: () =>
          import('./pages/inventory-setup-page/inventory-setup-page').then(
            (m) => m.InventorySetupPage,
          ),
      },
      {
        path: 'setup/categories',
        loadComponent: () =>
          import('./pages/category-list-page/category-list-page').then((m) => m.CategoryListPage),
      },
      {
        path: 'setup/brands',
        loadComponent: () =>
          import('./pages/brand-list-page/brand-list-page').then((m) => m.BrandlistPage),
      },
      {
        path: 'setup/units-measure',
        loadComponent: () =>
          import('./pages/unit-measure-list-page/unit-measure-list-page').then(
            (m) => m.UnitMeasureListPage,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/product-list-page/product-list-page').then((m) => m.ProductListPage),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./pages/product-form-page/product-form-page').then((m) => m.ProductFormPage),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./pages/product-form-page/product-form-page').then((m) => m.ProductFormPage),
      },
      {
        path: 'warehouses',
        loadComponent: () =>
          import('./pages/warehouse-list-page/warehouse-list-page').then(
            (m) => m.WarehouseListPage,
          ),
      },
      {
        path: 'movements',
        loadComponent: () =>
          import('./pages/inventory-movements-page/inventory-movements-page').then(
            (m) => m.InventoryMovementsPage,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/inventory-reports-page/inventory-reports-page').then(
            (m) => m.InventoryReportsPage,
          ),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/stock-alerts-page/stock-alerts-page').then((m) => m.StockAlertsPage),
      },
    ],
  },
];
