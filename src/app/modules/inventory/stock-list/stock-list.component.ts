import { Component, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { StockResponse } from '../models/stock';
import { StockService } from '../services/stock.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-stock-list',
  imports: [
    DynamicTableComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
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

  constructor(private stockService: StockService) {}

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
    console.log('Editar stock', row);
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
}
