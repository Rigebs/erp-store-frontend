import { Component, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MovementService } from '../../services/movements.service';

@Component({
  selector: 'app-movement-list',
  imports: [DynamicTableComponent],
  templateUrl: './movement-list.component.html',
  styleUrl: './movement-list.component.css',
})
export class MovementListComponent implements OnInit {
  columns = [
    { field: 'product.name', header: 'Producto' },
    { field: 'fromWarehouse.name', header: 'Desde' },
    { field: 'toWarehouse.name', header: 'Hacia' },
    { field: 'quantity', header: 'Cantidad' },
    { field: 'type', header: 'Tipo de Movimiento' },
    { field: 'date', header: 'Fecha' },
  ];

  data: any[] = [];
  total = 0;
  page = 0;

  constructor(private movementService: MovementService) {}

  ngOnInit(): void {
    this.loadMovements(this.page, 10);
  }

  loadMovements(page: number, pageSize: number) {
    this.movementService.getAllMovements(page, pageSize).subscribe((res) => {
      this.data = res.data.content;
      this.total = res.data.totalElements;
    });
  }

  onPageChange(event: any) {
    this.loadMovements(event.page, event.items);
  }
}
