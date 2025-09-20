import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { MatDialog } from '@angular/material/dialog';
import { BrandResponse } from '../../models/brand';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { NotificationUtilService } from '../../../../utils/notification-util.service';
import { throwError } from 'rxjs';

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
    private notificationUtilService: NotificationUtilService
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'enabled', header: 'Estado' },
  ];

  brandsData: BrandResponse[] = [];
  total: number = 0;

  createBrand() {
    this.router.navigateByUrl('brands/new');
  }

  ngOnInit(): void {
    this.loadBrands(0, 10);
  }

  loadBrands(page: number, size: number) {
    this.brandService.findAll(page, size).subscribe({
      next: (response) => {
        this.brandsData = response.data.content;
        this.total = response.data.totalElements;
      },
      error: (err) => {
        throwError(() => err);
      },
    });
  }

  onEdit(brand: BrandResponse) {
    this.router.navigateByUrl(`brands/${brand.id}/edit`);
  }

  onDelete(brand: BrandResponse) {
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
            this.notificationUtilService.showMessage(response.message);
            this.brandsData = this.brandsData.filter((b) => b.id !== brand.id);
          },
          error: (err) => {
            throwError(() => err);
          },
        });
      } else {
        console.log('El usuario canceló la acción');
      }
    });
  }

  onToggleEnabled(brand: BrandResponse) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          brand.enabled ? 'desactivar' : 'activar'
        } la marca ${brand.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.brandService.toggleEnabled(brand.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            const brandToUpdate = this.brandsData.find(
              (b) => b.id === brand.id
            );
            if (brandToUpdate) {
              if (brandToUpdate.enabled) {
                this.productService
                  .deleteRelationships(brandToUpdate.id, 'brands')
                  .subscribe({
                    next: (response) => {
                      this.notificationUtilService.showMessage(
                        response.message
                      );
                    },
                    error: (err) => {
                      console.error(
                        'Error deleting brand relationships: ',
                        err
                      );
                    },
                  });
              }
              brandToUpdate.enabled = !brandToUpdate.enabled;
            }
          },
          error: (err) => {
            console.error('Error toggling brand enabled: ', err);
          },
        });
      } else {
        console.log('El usuario canceló la acción');
      }
    });
  }
}
