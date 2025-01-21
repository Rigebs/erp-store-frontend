import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Sale } from '../models/sale';
import { SaleService } from '../services/sale.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sale-details',
  imports: [
    MatDivider,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css',
})
export class SaleDetailsComponent implements OnInit {
  sale: Sale | undefined;
  displayedColumns: string[] = ['productName', 'quantity', 'price', 'subtotal'];

  constructor(
    private saleService: SaleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const saleId = Number(this.route.snapshot.paramMap.get('saleId'));
    this.saleService.getSale(saleId).subscribe({
      next: (data) => {
        this.sale = data;
      },
      error: (err) => {
        console.error('Error fetching sale:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigateByUrl('management/sales/list');
  }
}
