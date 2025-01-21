import { Component, OnInit } from '@angular/core';
import { SalesTableComponent } from '../components/sales-table/sales-table.component';
import { SaleService } from '../services/sale.service';
import { Sale } from '../models/sale';

@Component({
  selector: 'app-sales-list',
  imports: [SalesTableComponent],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
})
export class SalesListComponent implements OnInit {
  salesList: Sale[] = [];

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.saleService.getAllSales().subscribe({
      next: (data) => {
        this.salesList = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
