import { Routes } from '@angular/router';

export const SUPPLIER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../suppliers/supplier-list/supplier-list.component').then(
        (m) => m.SupplierListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../suppliers/supplier-form/supplier-form.component').then(
        (m) => m.SupplierFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../suppliers/supplier-form/supplier-form.component').then(
        (m) => m.SupplierFormComponent
      ),
  },
];
