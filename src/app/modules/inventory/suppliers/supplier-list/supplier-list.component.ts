import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-supplier-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
})
export class SupplierListComponent implements OnInit {
  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'contactName', header: 'Nombre del contacto' },
    { field: 'contactEmail', header: 'Correo de contacto', hidden: true },
    { field: 'phoneNumber', header: 'Teléfono', hidden: true },
    { field: 'status', header: 'Estado' },
  ];

  suppliersData: Supplier[] = [];

  createSupplier() {
    this.router.navigateByUrl('management/suppliers/new');
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.findAll().subscribe({
      next: (data) => {
        this.suppliersData = data;
        console.log(data);
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(supplier: Supplier) {
    this.router.navigateByUrl(`management/suppliers/${supplier.id}/edit`);
  }

  onDelete(supplier: Supplier) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de eliminar el proveedor ${supplier.name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.supplierService.delete(supplier.id).subscribe({
          next: (response) => {
            this.showMessage(response.message);
            this.suppliersData = this.suppliersData.filter(
              (s) => s.id !== supplier.id
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

  onToggleStatus(supplier: Supplier) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          supplier.status ? 'desactivar' : 'activar'
        } el proveedor ${supplier.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.supplierService.toggleStatus(supplier.id).subscribe({
          next: (response) => {
            this.showMessage(response.message);
            const supplierToUpdate = this.suppliersData.find(
              (s) => s.id === supplier.id
            );
            if (supplierToUpdate) {
              if (supplierToUpdate.status) {
                this.productService
                  .deleteRelationships(supplierToUpdate.id, 'suppliers')
                  .subscribe({
                    next: (response) => {
                      this.showMessage(response.message);
                    },
                    error: (err) => {
                      console.error(
                        'Error deleting brand relationships: ',
                        err
                      );
                    },
                  });
              }
              supplierToUpdate.status = !supplierToUpdate.status;
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
