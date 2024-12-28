import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import(
        '../../layouts/management-layout/management-layout.component'
      ).then((m) => m.ManagementLayoutComponent),
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('../inventory/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import(
            '../inventory/products/product-form/product-form.component'
          ).then((m) => m.ProductFormComponent),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import(
            '../inventory/products/product-form/product-form.component'
          ).then((m) => m.ProductFormComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            '../inventory/categories/category-list/category-list.component'
          ).then((m) => m.CategoryListComponent),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import(
            '../inventory/categories/category-form/category-form.component'
          ).then((m) => m.CategoryFormComponent),
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import(
            '../inventory/categories/category-form/category-form.component'
          ).then((m) => m.CategoryFormComponent),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import(
            '../inventory/suppliers/supplier-list/supplier-list.component'
          ).then((m) => m.SupplierListComponent),
      },
      {
        path: 'suppliers/new',
        loadComponent: () =>
          import(
            '../inventory/suppliers/supplier-form/supplier-form.component'
          ).then((m) => m.SupplierFormComponent),
      },
      {
        path: 'suppliers/:id/edit',
        loadComponent: () =>
          import(
            '../inventory/suppliers/supplier-form/supplier-form.component'
          ).then((m) => m.SupplierFormComponent),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import('../inventory/lines/line-list/line-list.component').then(
            (m) => m.LineListComponent
          ),
      },
      {
        path: 'lines/new',
        loadComponent: () =>
          import('../inventory/lines/line-form/line-form.component').then(
            (m) => m.LineFormComponent
          ),
      },
      {
        path: 'lines/:id/edit',
        loadComponent: () =>
          import('../inventory/lines/line-form/line-form.component').then(
            (m) => m.LineFormComponent
          ),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('../inventory/brands/brand-list/brand-list.component').then(
            (m) => m.BrandListComponent
          ),
      },
      {
        path: 'brands/new',
        loadComponent: () =>
          import('../inventory/brands/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent
          ),
      },
      {
        path: 'brands/:id/edit',
        loadComponent: () =>
          import('../inventory/brands/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent
          ),
      },
      {
        path: 'units-measure',
        loadComponent: () =>
          import(
            '../inventory/units-measure/unit-measure-list/unit-measure-list.component'
          ).then((m) => m.UnitMeasureListComponent),
      },
      {
        path: 'units-measure/new',
        loadComponent: () =>
          import(
            '../inventory/units-measure/unit-measure-form/unit-measure-form.component'
          ).then((m) => m.UnitMeasureFormComponent),
      },
      {
        path: 'units-measure/:id/edit',
        loadComponent: () =>
          import(
            '../inventory/units-measure/unit-measure-form/unit-measure-form.component'
          ).then((m) => m.UnitMeasureFormComponent),
      },
    ],
  },
] as Routes;
