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
      // Asegúrate de agregar otras rutas hijas aquí
    ],
  },
] as Routes;
