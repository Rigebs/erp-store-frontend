import { Routes } from '@angular/router';

export const BRANCHES_ROUTES: Routes = [
  {
    path: 'branches',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/branch-list-page/branch-list-page').then((m) => m.BranchListPage),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/branch-form-page/branch-form-page').then((m) => m.BranchFormPage),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./pages/branch-form-page/branch-form-page').then((m) => m.BranchFormPage),
      },
    ],
  },
];
