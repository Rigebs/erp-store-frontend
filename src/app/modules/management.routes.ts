import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('../layouts/management-layout/management-layout.component').then(
        (m) => m.ManagementLayoutComponent
      ),
    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./catalog/routes/product.routes').then(
            (m) => m.PRODUCT_ROUTES
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./catalog/routes/category.routes').then(
            (m) => m.CATEGORY_ROUTES
          ),
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./catalog/routes/supplier.routes').then(
            (m) => m.SUPPLIER_ROUTES
          ),
      },
      {
        path: 'lines',
        loadChildren: () =>
          import('./catalog/routes/line.routes').then((m) => m.LINE_ROUTES),
      },
      {
        path: 'brands',
        loadChildren: () =>
          import('./catalog/routes/brand.routes').then((m) => m.BRAND_ROUTES),
      },
      {
        path: 'units-measure',
        loadChildren: () =>
          import('./catalog/routes/unit-measure.routes').then(
            (m) => m.UNIT_MEASURE_ROUTES
          ),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./sales/routes/sale.routes').then((m) => m.SALE_ROUTES),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory/routes/inventory.routes').then(
            (m) => m.INVENTORY_ROUTES
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./customers/routes/customer.routes').then(
            (m) => m.CUSTOMER_ROUTES
          ),
      },
    ],
  },
] as Routes;
