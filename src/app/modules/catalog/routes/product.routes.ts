import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../products/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../products/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../products/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
];
