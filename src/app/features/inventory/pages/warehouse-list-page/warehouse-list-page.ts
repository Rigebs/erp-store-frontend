import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalService } from '../../../../shared/services/modal-service';
import { WarehouseCard } from '../../components/warehouse-card/warehouse-card';
import { StockTransferModal } from '../../components/stock-transfer-modal/stock-transfer-modal';

@Component({
  selector: 'app-warehouse-list-page',
  imports: [ReactiveFormsModule, WarehouseCard],
  templateUrl: './warehouse-list-page.html',
  styleUrls: ['./warehouse-list-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseListPage implements OnInit {
  private readonly warehouseService = inject(WarehouseService);
  private readonly modal = inject(ModalService);

  searchControl = new FormControl('', { nonNullable: true });

  warehouses = this.warehouseService.warehouses;
  isLoading = this.warehouseService.isLoading;
  totalElements = this.warehouseService.totalElements;

  openMenuId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadWarehouses();

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((query) => {
        this.loadWarehouses(query);
      });
  }

  loadWarehouses(query?: string): void {
    this.warehouseService.findAll({ query }).subscribe();
  }

  toggleMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.openMenuId.update((prev) => (prev === id ? null : id));
  }

  openTransferModal(warehouse: any): void {
    this.openMenuId.set(null);
    this.modal.open(StockTransferModal, { originWarehouse: warehouse }).subscribe((payload) => {
      if (payload) this.executeTransfer(payload);
    });
  }

  private executeTransfer(payload: any): void {
    this.warehouseService.transferStock(payload).subscribe({
      next: () => this.loadWarehouses(this.searchControl.value),
      error: (err) => console.error(err),
    });
  }

  onDeleteWarehouse(id: number): void {
    if (confirm('¿Estás seguro de eliminar este almacén?')) {
      this.warehouseService.delete(id).subscribe(() => {
        this.openMenuId.set(null);
      });
    }
  }

  goToInventory(warehouse: any): void {
    console.log(`Navegando al inventario de: ${warehouse.name}`);
  }

  onCreateWarehouse(): void {
    console.log('Navegando a formulario de creación...');
  }
}
