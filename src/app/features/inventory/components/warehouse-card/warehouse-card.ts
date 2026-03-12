import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-warehouse-card',
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './warehouse-card.html',
  styleUrls: ['./warehouse-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card',
    '[class.main-warehouse]': 'warehouse().main',
  },
})
export class WarehouseCard {
  warehouse = input.required<any>();
  isMenuOpen = input<boolean>(false);

  toggleMenu = output<MouseEvent>();
  edit = output<void>();
  delete = output<void>();
  toggleStatus = output<void>();
  viewInventory = output<void>();
  transferStock = output<void>();

  occupationStatus = computed(() => {
    const val = this.warehouse().occupation;
    return {
      warning: val > 75 && val <= 90,
      danger: val > 90,
    };
  });
}
