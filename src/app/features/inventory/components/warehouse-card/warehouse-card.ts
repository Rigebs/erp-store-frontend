import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { Warehouse, WarehouseType } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-warehouse-card',
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './warehouse-card.html',
  styleUrls: ['./warehouse-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card',
    '[class.main-warehouse]': 'warehouse().main',
    '[class.disabled-card]': '!warehouse().enabled',
  },
})
export class WarehouseCard {
  // Cambiamos any por el tipo real Warehouse
  warehouse = input.required<Warehouse>();
  isMenuOpen = input<boolean>(false);

  toggleMenu = output<MouseEvent>();
  edit = output<void>();
  delete = output<void>();
  toggleStatus = output<void>();
  viewInventory = output<void>();
  transferStock = output<void>();

  // Mapeo de valores de Enum a etiquetas en español
  private readonly typeLabels: Record<WarehouseType, string> = {
    CENTRAL: 'Central',
    POINT_OF_SALE: 'Punto de Venta',
    TRANSIT: 'Tránsito',
    QUARANTINE: 'Cuarentena',
    INTERNAL_CONSUMPTION: 'Consumo Interno',
  };

  // Computed para obtener la etiqueta traducida
  displayType = computed(() => this.typeLabels[this.warehouse().type] || this.warehouse().type);

  occupationStatus = computed(() => {
    const val = this.warehouse().occupation;
    return {
      warning: val > 75 && val <= 90,
      danger: val > 90,
    };
  });

  onToggleStatus(): void {
    this.toggleStatus.emit();
  }
}
