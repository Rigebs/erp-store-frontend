import { Routes } from '@angular/router';
import { ProductsComponent } from './modules/inventory/products/products.component';
import { ProductFormComponent } from './modules/inventory/products/product-form/product-form.component';

export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'products/new', component: ProductFormComponent },
];
