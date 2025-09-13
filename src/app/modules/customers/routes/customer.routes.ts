import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../customers/customer-list/customer-list.component').then(
        (m) => m.CustomerListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../customers/customer-form/customer-form.component').then(
        (m) => m.CustomerFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../customers/customer-form/customer-form.component').then(
        (m) => m.CustomerFormComponent
      ),
  },
];
