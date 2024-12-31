import { Component, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LineService } from '../../services/line.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Line } from '../../models/line';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../services/product.service';

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
    private snackBar: MatSnackBar
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'status', header: 'Estado' },
  ];

  linesData: Line[] = [];

  createLine() {
    this.router.navigateByUrl('management/lines/new');
  }

  ngOnInit(): void {
    this.loadLines();
  }

  loadLines() {
    this.lineService.findAll().subscribe({
      next: (data) => {
        this.linesData = data;
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
            this.showMessage(response.message);
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
        this.productService.deleteRelationships(line.id, 'lines').subscribe({
          next: (response) => {
            this.showMessage(response.message);
            const lineToUpdate = this.linesData.find((l) => l.id === line.id);
            if (lineToUpdate) {
              lineToUpdate.status = !lineToUpdate.status;
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
