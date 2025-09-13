import { Routes } from '@angular/router';

export const UNIT_MEASURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../units-measure/unit-measure-list/unit-measure-list.component'
      ).then((m) => m.UnitMeasureListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import(
        '../units-measure/unit-measure-form/unit-measure-form.component'
      ).then((m) => m.UnitMeasureFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        '../units-measure/unit-measure-form/unit-measure-form.component'
      ).then((m) => m.UnitMeasureFormComponent),
  },
];
