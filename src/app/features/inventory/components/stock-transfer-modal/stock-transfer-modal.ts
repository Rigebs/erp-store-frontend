import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalService } from '../../../../shared/services/modal-service';
import { WarehouseService } from '../../services/warehouse-service';
import { SelectSearchable } from '../../../../shared/ui/select-searchable/select-searchable';
import { Product } from '../../../../core/models/catalog.model';
import { ProductService } from '../../services/product-service';
import { Warehouse } from '../../../../core/models/inventory.model';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';

@Component({
  selector: 'app-stock-transfer-modal',
  imports: [ReactiveFormsModule, SelectSearchable, ModalContainer],
  templateUrl: './stock-transfer-modal.html',
  styleUrl: './stock-transfer-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockTransferModal implements OnInit {
  private readonly modal = inject(ModalService);
  private readonly warehouseService = inject(WarehouseService);
  private readonly productService = inject(ProductService);
  private readonly fb = inject(NonNullableFormBuilder);

  originWarehouse = input.required<any>();

  protected readonly warehouses = this.warehouseService.warehouses;
  protected readonly products = this.productService.products;

  protected readonly transferForm = this.fb.group({
    destination: [null as any, [Validators.required]],
    product: [null as any, [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(1)]],
  });

  private readonly formValue = toSignal(this.transferForm.valueChanges, {
    initialValue: this.transferForm.getRawValue(),
  });

  protected readonly isStockLow = computed(() => {
    const qty = this.formValue().quantity ?? 0;
    const available = this.originWarehouse()?.productsCount ?? 0;
    return qty > available;
  });

  ngOnInit(): void {
    this.productService.findAll({}, 0, 100).subscribe();
  }

  confirm(): void {
    if (this.transferForm.valid && !this.isStockLow()) {
      const val = this.transferForm.getRawValue();
      const payload = {
        originId: this.originWarehouse().id,
        destinationId: val.destination?.id,
        productId: val.product?.id,
        quantity: val.quantity,
      };
      this.modal.close(payload);
    }
  }

  close(): void {
    this.modal.close();
  }
}
