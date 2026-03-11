import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../shared/services/modal-service';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';

export interface InventoryFilterData {
  type?: string;
  warehouseId?: number;
  dateFrom?: string;
}

@Component({
  selector: 'app-inventory-filters-modal',
  imports: [CommonModule, ModalContainer],
  templateUrl: './inventory-filters-modal.html',
  styleUrls: ['./inventory-filters-modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryFiltersModal {
  private readonly modalService = inject(ModalService);

  typeInitial = input<string>('Todos');
  warehouseIdInitial = input<number | undefined>();
  dateFromInitial = input<string>('');
  warehouses = input<any[]>([]);

  type = signal<string>('Todos');
  warehouseId = signal<number | undefined>(undefined);
  dateFrom = signal<string>('');

  ngOnInit() {
    this.type.set(this.typeInitial());
    this.warehouseId.set(this.warehouseIdInitial());
    this.dateFrom.set(this.dateFromInitial());
  }

  apply(): void {
    this.modalService.close({
      type: this.type(),
      warehouseId: this.warehouseId(),
      dateFrom: this.dateFrom(),
    });
  }

  reset(): void {
    this.type.set('Todos');
    this.warehouseId.set(undefined);
    this.dateFrom.set('');
  }

  close(): void {
    this.modalService.close();
  }

  updateType(event: Event): void {
    this.type.set((event.target as HTMLSelectElement).value);
  }

  updateWarehouse(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.warehouseId.set(val ? Number(val) : undefined);
  }

  updateDate(event: Event): void {
    this.dateFrom.set((event.target as HTMLInputElement).value);
  }
}
