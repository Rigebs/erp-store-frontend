import { Routes } from '@angular/router';

export const BRAND_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../brands/brand-list/brand-list.component').then(
        (m) => m.BrandListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../brands/brand-form/brand-form.component').then(
        (m) => m.BrandFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../brands/brand-form/brand-form.component').then(
        (m) => m.BrandFormComponent
      ),
  },
];
