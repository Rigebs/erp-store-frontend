import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { UnitMeasure } from '../../models/unit-measure';
import { Router } from '@angular/router';
import { UnitMeasureService } from '../../services/unit-measure.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { NotificationUtilService } from '../../../../utils/notification-util.service';

@Component({
  selector: 'app-unit-measure-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './unit-measure-list.component.html',
  styleUrl: './unit-measure-list.component.css',
})
export class UnitMeasureListComponent implements OnInit {
  constructor(
    private router: Router,
    private unitMeasureService: UnitMeasureService,
    private productService: ProductService,
    private dialog: MatDialog,
    private notificationUtilService: NotificationUtilService
  ) {}

  columns = [
    { field: 'name', header: 'Nombre' },
    { field: 'abbreviation', header: 'Abreviación' },
    { field: 'description', header: 'Descripción', hidden: true },
    { field: 'status', header: 'Estado' },
  ];

  unitMeasuresData: UnitMeasure[] = [];
  total: number = 0;

  createUnitMeasure() {
    this.router.navigateByUrl('management/units-measure/new');
  }

  ngOnInit(): void {
    this.loadUnitMeasures(0, 10);
  }

  loadUnitMeasures(page: number, size: number) {
    this.unitMeasureService.findAll(page, size).subscribe({
      next: (data) => {
        this.unitMeasuresData = data.content;
        this.total = data.totalElements;
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  onEdit(unitMeasure: UnitMeasure) {
    this.router.navigateByUrl(
      `management/unit-measures/${unitMeasure.id}/edit`
    );
  }

  onDelete(unitMeasure: UnitMeasure) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de eliminar la unidad de medida ${unitMeasure.name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unitMeasureService.delete(unitMeasure.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            this.unitMeasuresData = this.unitMeasuresData.filter(
              (u) => u.id !== unitMeasure.id
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

  onToggleStatus(unitMeasure: UnitMeasure) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          unitMeasure.status ? 'desactivar' : 'activar'
        } la unidad de medida ${unitMeasure.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unitMeasureService.toggleStatus(unitMeasure.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            const unitMeasureToUpdate = this.unitMeasuresData.find(
              (u) => u.id === unitMeasure.id
            );
            if (unitMeasureToUpdate) {
              if (unitMeasureToUpdate.status) {
                this.productService
                  .deleteRelationships(unitMeasureToUpdate.id, 'units_measure')
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
              unitMeasureToUpdate.status = !unitMeasureToUpdate.status;
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
