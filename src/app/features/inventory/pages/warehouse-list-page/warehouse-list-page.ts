import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalService } from '../../../../shared/services/modal-service';
import { StockTransferModal } from '../../components/stock-transfer-modal/stock-transfer-modal';
import { Warehouse } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-warehouse-list-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  openTransferModal(warehouse: Warehouse): void {
    this.openMenuId.set(null);

    this.modal
      .open(StockTransferModal, {
        originWarehouse: warehouse,
      })
      .subscribe((payload) => {
        if (payload) {
          this.executeTransfer(payload);
        }
      });
  }

  private executeTransfer(payload: any): void {
    // 2. Ejecutamos la transferencia mediante el service
    this.warehouseService.transferStock(payload).subscribe({
      next: () => {
        console.log('Transferencia completada con éxito');
        this.loadWarehouses(this.searchControl.value);
      },
      error: (err) => {
        console.error('Error al realizar la transferencia', err);
      },
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
