import { Component, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  constructor(
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'quantity', header: 'Cantidad' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'purchasePrice', header: 'Precio compra', hidden: true },
    { field: 'salePrice', header: 'Precio venta' },
    { field: 'status', header: 'Estado' },
    { field: 'categoryName', header: 'Categoría' },
    { field: 'brandName', header: 'Marca' },
    { field: 'unitMeasureName', header: 'U/M', hidden: true },
    { field: 'lineName', header: 'Línea', hidden: true },
    { field: 'supplierName', header: 'Proveedor', hidden: true },
  ];

  columnsProduct = [
    { key: 'name', label: 'Nombre' },
    { key: 'salePrice', label: 'Precio venta' },
    { key: 'status', label: 'Estado' },
    { key: 'categoryName', label: 'Categoría' },
    { key: 'brandName', label: 'Marca' },
  ];

  productsData: Product[] = [];

  createProduct() {
    this.router.navigateByUrl('management/products/new');
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.findAll().subscribe({
      next: (data) => {
        this.productsData = data;
        console.log(data);
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(product: Product) {
    this.router.navigateByUrl(`management/products/${product.id}/edit`);
  }

  onDelete(product: Product) {
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
            this.showMessage(response.message);
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

  onToggleStatus(product: Product) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          product.status ? 'desactivar' : 'activar'
        } el producto ${product.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.toggleStatus(product.id).subscribe({
          next: (response) => {
            this.showMessage(response.message);
            const productToUpdate = this.productsData.find(
              (p) => p.id === product.id
            );
            if (productToUpdate) {
              productToUpdate.status = !productToUpdate.status;
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

  showMessage(message: string) {
    this.snackBar.open(`${message}`, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
