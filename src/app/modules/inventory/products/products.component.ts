import { Component } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [DynamicTableComponent, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(private router: Router) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'salePrice', header: 'Precio venta' },
    { field: 'status', header: 'Estado' },
    { field: 'category', header: 'Categoría' },
    { field: 'brand', header: 'Marca' },
    // Opcional: Usar como colapsable o detalles
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'purchasePrice', header: 'Precio compra', hidden: true },
    { field: 'unitMeasure', header: 'U/M', hidden: true },
    { field: 'line', header: 'Línea', hidden: true },
  ];

  data = [
    {
      id: 1,
      name: 'Product A',
      description: 'Description of Product A',
      purchasePrice: 10.5,
      salePrice: 15.0,
      status: 'A',
      flag: true,
      category: 'd',
    },
    {
      id: 2,
      name: 'Product B',
      description: 'Description of Product B',
      purchasePrice: 20.0,
      salePrice: 25.0,
      status: 'I',
      flag: false,
      category: 'd',
    },
  ];

  createProduct() {
    this.router.navigate(['/products/new']);
  }
}
