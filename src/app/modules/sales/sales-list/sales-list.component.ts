import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SaleService } from '../services/sale.service';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { SaleResponse } from '../models/sale';

@Component({
  selector: 'app-sales-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
})
export class SalesListComponent implements OnInit {
  constructor(private router: Router, private saleService: SaleService) {}

  columns = [
    { field: 'id', header: 'ID' },
    { field: 'dateTime', header: 'Fecha/Hora' },
    { field: 'subtotal', header: 'Subtotal', hidden: true },
    { field: 'discount', header: 'Descuento', hidden: true },
    { field: 'tax', header: 'Impuesto', hidden: true },
    { field: 'total', header: 'Total' },
    { field: 'enabled', header: 'Estado' },
    { field: 'customer.name', header: 'Cliente' },
    {
      field: 'cashier',
      header: 'Cajero',
      valueFn: (s: SaleResponse) =>
        s.cashier
          ? `${s.cashier.employee.person.name} ${s.cashier.employee.person.paternalName} ${s.cashier.employee.person.maternalName}`.trim()
          : '-',
    },
  ];

  salesData: SaleResponse[] = [];
  total: number = 0;

  createSale() {
    this.router.navigateByUrl('management/sales/new');
  }

  ngOnInit(): void {
    this.loadSales(0, 10);
  }

  loadSales(page: number, size: number) {
    this.saleService.findAll(page, size).subscribe({
      next: (response) => {
        this.salesData = response.data.content;
        this.total = response.data.totalElements;
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }

  pageChange(event: { items: number; page: number }) {
    this.saleService.findAll(event.page, event.items).subscribe({
      next: (response) => {
        this.salesData = response.data.content;
      },
      error: (err) => {
        console.log('ERROR: ', err);
      },
    });
  }
}
