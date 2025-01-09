import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../services/category.service';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { Category } from '../../models/category';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../services/product.service';

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
    private snackBar: MatSnackBar
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'status', header: 'Estado' },
  ];

  categoriesData: Category[] = [];

  createCategory() {
    this.router.navigateByUrl('management/categories/new');
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.categoriesData = data;
        console.log(data);
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(category: Category) {
    this.router.navigateByUrl(`management/categories/${category.id}/edit`);
  }

  onDelete(category: Category) {
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
            this.showMessage(response.message);
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

  onToggleStatus(category: Category) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          category.status ? 'desactivar' : 'activar'
        } la categoría ${category.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.toggleStatus(category.id).subscribe({
          next: (response) => {
            this.showMessage(response.message);
            const categoryToUpdate = this.categoriesData.find(
              (c) => c.id === category.id
            );
            if (categoryToUpdate) {
              if (categoryToUpdate.status) {
                this.productService
                  .deleteRelationships(categoryToUpdate.id, 'categories')
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
              categoryToUpdate.status = !categoryToUpdate.status;
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
