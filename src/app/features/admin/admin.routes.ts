import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'branches',
    loadChildren: () => import('./branches/branches.routes').then((m) => m.BRANCHES_ROUTES),
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./employees/employees.routes').then((m) => m.ADMIN_EMPLOYEES_ROUTES),
  },
  {
    path: '',
    redirectTo: 'branches',
    pathMatch: 'full',
  },
];
