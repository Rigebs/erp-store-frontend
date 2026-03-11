import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  templateUrl: './stock-badge.html',
  styleUrl: './stock-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockBadge {
  quantity = input.required<number>();
  minStock = input.required<number>();

  badgeClass = computed(() => {
    if (this.quantity() <= 0) return 'badge error';
    if (this.quantity() <= this.minStock()) return 'badge warning';
    return 'badge success';
  });
}
