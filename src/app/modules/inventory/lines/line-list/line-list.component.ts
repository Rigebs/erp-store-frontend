import { Component, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LineService } from '../../services/line.service';
import { MatDialog } from '@angular/material/dialog';
import { Line } from '../../models/line';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../services/product.service';
import { NotificationUtilService } from '../../../../utils/notification-util.service';

@Component({
  selector: 'app-line-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './line-list.component.html',
  styleUrl: './line-list.component.css',
})
export class LineListComponent implements OnInit {
  constructor(
    private router: Router,
    private lineService: LineService,
    private productService: ProductService,
    private dialog: MatDialog,
    private notificationUtilService: NotificationUtilService
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'status', header: 'Estado' },
  ];

  linesData: Line[] = [];
  total: number = 0;

  createLine() {
    this.router.navigateByUrl('management/lines/new');
  }

  ngOnInit(): void {
    this.loadLines(0, 10);
  }

  loadLines(page: number, size: number) {
    this.lineService.findAll(page, size).subscribe({
      next: (data) => {
        this.linesData = data.content;
        this.total = data.totalElements;
        console.log(data);
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(line: Line) {
    this.router.navigateByUrl(`management/lines/${line.id}/edit`);
  }

  onDelete(line: Line) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de eliminar la línea ${line.name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lineService.delete(line.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            this.linesData = this.linesData.filter((l) => l.id !== line.id);
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

  onToggleStatus(line: Line) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          line.status ? 'desactivar' : 'activar'
        } la línea ${line.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lineService.toggleStatus(line.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            const lineToUpdate = this.linesData.find((l) => l.id === line.id);
            if (lineToUpdate) {
              if (lineToUpdate.status) {
                this.productService
                  .deleteRelationships(line.id, 'lines')
                  .subscribe({
                    next: (response) => {
                      this.notificationUtilService.showMessage(
                        response.message
                      );
                    },
                    error: (err) => {
                      console.error('Error deleting line relationships: ', err);
                    },
                  });
              }
              lineToUpdate.status = !lineToUpdate.status;
            }
          },
          error: (err) => {
            console.error('Error toggling line status: ', err);
          },
        });
      } else {
        console.log('El usuario canceló la acción');
      }
    });
  }

  pageChange(event: { items: number; page: number }) {
    this.lineService.findAll(event.page, event.items).subscribe({
      next: (data) => {
        this.linesData = data.content;
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }
}
