import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Brand } from '../../models/brand';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-brand-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.css',
})
export class BrandListComponent implements OnInit {
  constructor(
    private router: Router,
    private brandService: BrandService,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'status', header: 'Estado' },
  ];

  brandsData: Brand[] = [];

  createBrand() {
    this.router.navigateByUrl('management/brands/new');
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.findAll().subscribe({
      next: (data) => {
        this.brandsData = data;
        console.log(data);
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(brand: Brand) {
    this.router.navigateByUrl(`management/brands/${brand.id}/edit`);
  }

  onDelete(brand: Brand) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de eliminar la marca ${brand.name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.brandService.delete(brand.id).subscribe({
          next: (response) => {
            this.showMessage(response.message);
            this.brandsData = this.brandsData.filter((b) => b.id !== brand.id);
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

  onToggleStatus(brand: Brand) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          brand.status ? 'desactivar' : 'activar'
        } la marca ${brand.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.brandService.toggleStatus(brand.id).subscribe({
          next: (response) => {
            this.showMessage(response.message);
            const brandToUpdate = this.brandsData.find(
              (b) => b.id === brand.id
            );
            if (brandToUpdate) {
              if (brandToUpdate.status) {
                this.productService
                  .deleteRelationships(brandToUpdate.id, 'brands')
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
              brandToUpdate.status = !brandToUpdate.status;
            }
          },
          error: (err) => {
            console.error('Error toggling brand status: ', err);
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
