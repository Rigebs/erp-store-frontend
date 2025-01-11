import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SaleDetail } from '../../models/sale-detail';
import { FormatUtilService } from '../../../../utils/format-util.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
})
export class SummaryComponent {
  @Input() selectedProducts: SaleDetail[] = [];
  @Input() discount = 0;
  @Input() taxRate = 0.18;
  @Input() subtotal!: number;
  @Input() total!: number;

  constructor(public formatUtilService: FormatUtilService) {}

  calculateSubtotal(): number {
    return this.selectedProducts.reduce(
      (subtotal, product) => subtotal + product.price * product.quantity,
      0
    );
  }

  calculateTax(): number {
    const subtotal = this.calculateSubtotal();
    return subtotal * this.taxRate;
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    return subtotal + tax - this.discount;
  }
}
