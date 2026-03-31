import { Routes } from '@angular/router';

export const ADMIN_EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/employee-list-page/employee-list-page').then((m) => m.EmployeeListPage),
  },
  {
    path: 'new', // Sin el '/' al inicio
    loadComponent: () =>
      import('./pages/employee-form-page/employee-form-page').then((m) => m.EmployeeFormPage),
  },
  {
    path: 'edit/:id', // Sin el '/' al inicio
    loadComponent: () =>
      import('./pages/employee-form-page/employee-form-page').then((m) => m.EmployeeFormPage),
  },
];
