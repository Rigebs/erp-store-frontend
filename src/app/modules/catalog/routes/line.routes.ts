import { Routes } from '@angular/router';

export const LINE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../lines/line-list/line-list.component').then(
        (m) => m.LineListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../lines/line-form/line-form.component').then(
        (m) => m.LineFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../lines/line-form/line-form.component').then(
        (m) => m.LineFormComponent
      ),
  },
];
