import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationUtilService } from '../../../../utils/notification-util.service';
import { ProductResponse } from '../../models/product';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  constructor(
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog,
    private notificationUtilService: NotificationUtilService
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'purchasePrice', header: 'Precio compra', hidden: true },
    { field: 'salePrice', header: 'Precio venta' },
    { field: 'enabled', header: 'Estado' },
    { field: 'imageUrl', header: 'Imagen' },
    { field: 'category.name', header: 'Categoría' },
    { field: 'brand.name', header: 'Marca' },
    { field: 'unitMeasure.abbreviation', header: 'U/M', hidden: true },
    { field: 'line.name', header: 'Línea', hidden: true },
    { field: 'supplier.name', header: 'Proveedor', hidden: true },
  ];

  productsData: ProductResponse[] = [];
  total: number = 0;

  createProduct() {
    this.router.navigateByUrl('management/products/new');
  }

  ngOnInit(): void {
    this.loadProducts(0, 10);
  }

  loadProducts(page: number, size: number) {
    this.productService.findAll(page, size).subscribe({
      next: (response) => {
        this.productsData = response.data.content;
        this.total = response.data.totalElements;
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  pageChange(event: { items: number; page: number }) {
    this.productService.findAll(event.page, event.items).subscribe({
      next: (response) => {
        this.productsData = response.data.content;
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(product: ProductResponse) {
    this.router.navigateByUrl(`management/products/${product.id}/edit`);
  }

  onDelete(product: ProductResponse) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de eliminar el producto ${product.name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.delete(product.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            this.productsData = this.productsData.filter(
              (p) => p.id !== product.id
            );
          },
          error: (err) => {
            console.log('Error: ', err);
          },
        });
      } else {
        console.log('El usuario canceló la acción');
      }
    });
  }

  onToggleEnabled(product: ProductResponse) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          product.enabled ? 'desactivar' : 'activar'
        } el producto ${product.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.toggleEnabled(product.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            const productToUpdate = this.productsData.find(
              (p) => p.id === product.id
            );
            if (productToUpdate) {
              productToUpdate.enabled = !productToUpdate.enabled;
            }
          },
          error: (err) => {
            console.log('Error: ', err);
          },
        });
      } else {
        console.log('El usuario canceló la acción');
      }
    });
  }
}
