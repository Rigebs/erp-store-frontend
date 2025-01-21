import { Component, Input } from '@angular/core';
import { Sale } from '../../models/sale';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-table',
  imports: [
    MatTableModule,
    DatePipe,
    CurrencyPipe,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sales-table.component.html',
  styleUrl: './sales-table.component.css',
})
export class SalesTableComponent {
  @Input() sales: Sale[] = [];

  constructor(private route: Router) {}

  displayedColumns: string[] = [
    'dateTime',
    'subtotal',
    'tax',
    'total',
    'customer',
    'view',
  ];

  goToSale(saleId: number) {
    this.route.navigateByUrl(`/management/sales/find/${saleId}`);
  }
}
