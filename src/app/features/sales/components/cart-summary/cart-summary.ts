import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DiscountInput } from '../discount-input/discount-input';
import { QuantitySelector } from '../quantity-selector/quantity-selector';

@Component({
  selector: 'app-cart-summary',
  imports: [CommonModule, CurrencyPipe, QuantitySelector, DiscountInput],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummary {
  items = input.required<any[]>();
  totals = input.required<any>();

  onRemove = output<number>();
  onUpdateQuantity = output<{ index: number; val: number }>();
  onUpdateDiscount = output<{ index: number; val: number }>();
  onClear = output<void>();
  onCheckout = output<void>();

  updateQuantity(index: number, val: number) {
    this.onUpdateQuantity.emit({ index, val });
  }

  updateDiscount(index: number, val: number) {
    this.onUpdateDiscount.emit({ index, val });
  }
}
