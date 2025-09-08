import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { CategoryResponse } from '../../models/category';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../services/product.service';
import { NotificationUtilService } from '../../../../utils/notification-util.service';

@Component({
  selector: 'app-categoriy-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private dialog: MatDialog,
    private notificationUtilService: NotificationUtilService
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'enabled', header: 'Estado' },
  ];

  categoriesData: CategoryResponse[] = [];
  total: number = 0;

  createCategory() {
    this.router.navigateByUrl('management/categories/new');
  }

  ngOnInit(): void {
    this.loadCategories(0, 10);
  }

  loadCategories(page: number, size: number) {
    this.categoryService.findAll(page, size).subscribe({
      next: (response) => {
        this.categoriesData = response.data.content;
        this.total = response.data.totalElements;
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(category: CategoryResponse) {
    this.router.navigateByUrl(`management/categories/${category.id}/edit`);
  }

  onDelete(category: CategoryResponse) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de eliminar la categoría ${category.name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.delete(category.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            this.categoriesData = this.categoriesData.filter(
              (c) => c.id !== category.id
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

  onToggleEnabled(category: CategoryResponse) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          category.enabled ? 'desactivar' : 'activar'
        } la categoría ${category.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.toggleEnabled(category.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            const categoryToUpdate = this.categoriesData.find(
              (c) => c.id === category.id
            );
            if (categoryToUpdate) {
              if (categoryToUpdate.enabled) {
                this.productService
                  .deleteRelationships(categoryToUpdate.id, 'categories')
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
              categoryToUpdate.enabled = !categoryToUpdate.enabled;
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
