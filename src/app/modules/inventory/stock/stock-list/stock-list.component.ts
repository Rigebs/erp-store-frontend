import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { StockResponse } from '../../models/stock';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { ExportService } from '../../../../services/export.service';
import { StockService } from '../../services/stock.service';
import { EditStockDialogComponent } from '../../components/edit-stock-dialog/edit-stock-dialog.component';

@Component({
  selector: 'app-stock-list',
  imports: [
    DynamicTableComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
  ],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css',
})
export class StockListComponent implements OnInit {
  columns = [
    { field: 'product.name', header: 'Producto' },
    { field: 'sku', header: 'SKU' },
    { field: 'category.name', header: 'Categoría' },
    { field: 'warehouse.name', header: 'Almacén' },
    { field: 'quantity', header: 'Cantidad' },
    { field: 'minQuantity', header: 'Stock Mínimo' },
    { field: 'status', header: 'Estado' },
  ];

  data: StockResponse[] = [];
  total = 0;
  page = 0;

  constructor(
    private stockService: StockService,
    private exportService: ExportService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStock(this.page, 10);
  }

  loadStock(page: number, pageSize: number) {
    this.stockService.getAllStock(page, pageSize).subscribe((res) => {
      console.log(res);

      this.data = res.data.content.map((item) => ({
        ...item,
        status: item.quantity < item.minQuantity ? 'Bajo' : 'OK',
      }));
      this.total = res.data.totalElements;
    });
  }

  onEdit(row: StockResponse) {
    const dialogRef = this.dialog.open(EditStockDialogComponent, {
      width: '300px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.stockService
          .manageStock({
            ...result,
            action: 'ADJUSTMENT',
          })
          .subscribe(() => this.loadStock(this.page, 10));
      }
    });
  }

  onTransfer(row: StockResponse) {
    console.log('Transferir stock', row);
  }

  onViewMovements(row: StockResponse) {
    console.log('Ver movimientos', row);
  }

  onPageChange(event: any) {
    this.loadStock(event.page, event.items);
  }

  onExport(format: 'excel' | 'pdf') {
    this.exportService.exportStock(this.data, format);
  }
}
