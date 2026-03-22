import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css',
})
export class CartSummary {
  @Input({ required: true }) items: any[] = [];
  @Output() onRemove = new EventEmitter<number>();
  @Output() onClear = new EventEmitter<void>();
  @Output() onCheckout = new EventEmitter<void>();

  calculateSubtotal() {
    return this.items.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
  }

  get tax() {
    return this.calculateSubtotal() * 0.16;
  }
  get total() {
    return this.calculateSubtotal() + this.tax;
  }
}
