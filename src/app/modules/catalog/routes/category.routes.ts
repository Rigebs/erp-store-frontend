import { Routes } from '@angular/router';

export const CATEGORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../categories/category-list/category-list.component').then(
        (m) => m.CategoryListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../categories/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../categories/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
  },
];
