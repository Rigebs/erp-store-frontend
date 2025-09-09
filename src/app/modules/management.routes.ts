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
        loadComponent: () =>
          import('./catalog/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./catalog/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./catalog/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './catalog/categories/category-list/category-list.component'
          ).then((m) => m.CategoryListComponent),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import(
            './catalog/categories/category-form/category-form.component'
          ).then((m) => m.CategoryFormComponent),
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import(
            './catalog/categories/category-form/category-form.component'
          ).then((m) => m.CategoryFormComponent),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import(
            './catalog/suppliers/supplier-list/supplier-list.component'
          ).then((m) => m.SupplierListComponent),
      },
      {
        path: 'suppliers/new',
        loadComponent: () =>
          import(
            './catalog/suppliers/supplier-form/supplier-form.component'
          ).then((m) => m.SupplierFormComponent),
      },
      {
        path: 'suppliers/:id/edit',
        loadComponent: () =>
          import(
            './catalog/suppliers/supplier-form/supplier-form.component'
          ).then((m) => m.SupplierFormComponent),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import('./catalog/lines/line-list/line-list.component').then(
            (m) => m.LineListComponent
          ),
      },
      {
        path: 'lines/new',
        loadComponent: () =>
          import('./catalog/lines/line-form/line-form.component').then(
            (m) => m.LineFormComponent
          ),
      },
      {
        path: 'lines/:id/edit',
        loadComponent: () =>
          import('./catalog/lines/line-form/line-form.component').then(
            (m) => m.LineFormComponent
          ),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./catalog/brands/brand-list/brand-list.component').then(
            (m) => m.BrandListComponent
          ),
      },
      {
        path: 'brands/new',
        loadComponent: () =>
          import('./catalog/brands/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent
          ),
      },
      {
        path: 'brands/:id/edit',
        loadComponent: () =>
          import('./catalog/brands/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent
          ),
      },
      {
        path: 'units-measure',
        loadComponent: () =>
          import(
            './catalog/units-measure/unit-measure-list/unit-measure-list.component'
          ).then((m) => m.UnitMeasureListComponent),
      },
      {
        path: 'units-measure/new',
        loadComponent: () =>
          import(
            './catalog/units-measure/unit-measure-form/unit-measure-form.component'
          ).then((m) => m.UnitMeasureFormComponent),
      },
      {
        path: 'units-measure/:id/edit',
        loadComponent: () =>
          import(
            './catalog/units-measure/unit-measure-form/unit-measure-form.component'
          ).then((m) => m.UnitMeasureFormComponent),
      },
      {
        path: 'sales/new',
        loadComponent: () =>
          import('./sales/new-sale/new-sale.component').then(
            (m) => m.NewSaleComponent
          ),
      },
      {
        path: 'sales/list',
        loadComponent: () =>
          import('./sales/sales-list/sales-list.component').then(
            (m) => m.SalesListComponent
          ),
      },
      {
        path: 'sales/find/:saleId',
        loadComponent: () =>
          import('./sales/sale-details/sale-details.component').then(
            (m) => m.SaleDetailsComponent
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./inventory/stock-list/stock-list.component').then(
            (m) => m.StockListComponent
          ),
      },
    ],
  },
] as Routes;
