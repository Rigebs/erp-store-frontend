import { Component, inject, ChangeDetectionStrategy, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectSearchable } from '../../../../shared/ui/select-searchable/select-searchable';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../shared/services/modal-service';

@Component({
  selector: 'app-inventory-movement-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalContainer, SelectSearchable],
  templateUrl: './inventory-movement-form-modal.html',
  styleUrl: './inventory-movement-form-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryMovementFormModal {
  private fb = inject(NonNullableFormBuilder);
  private modalService = inject(ModalService);

  products = input<any[]>([]);
  warehouses = input<any[]>([]);

  movementForm = this.fb.group({
    product: [null as any, [Validators.required]],
    type: ['IN' as 'IN' | 'OUT' | 'TRANSFER', [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(0.01)]],
    reason: ['', [Validators.required, Validators.minLength(5)]],
    toWarehouse: [null as any],
    fromWarehouse: [null as any],
  });

  constructor() {
    this.movementForm.get('type')?.valueChanges.subscribe((type) => {
      this.updateValidators(type);
    });
    this.updateValidators('IN');
  }

  private updateValidators(type: 'IN' | 'OUT' | 'TRANSFER') {
    const toW = this.movementForm.get('toWarehouse');
    const fromW = this.movementForm.get('fromWarehouse');

    toW?.clearValidators();
    fromW?.clearValidators();

    if (type === 'IN') {
      toW?.setValidators([Validators.required]);
    } else if (type === 'OUT') {
      fromW?.setValidators([Validators.required]);
    } else if (type === 'TRANSFER') {
      toW?.setValidators([Validators.required]);
      fromW?.setValidators([Validators.required]);
    }

    toW?.updateValueAndValidity();
    fromW?.updateValueAndValidity();
  }

  cancel() {
    this.modalService.close();
  }

  submit() {
    if (this.movementForm.valid) {
      const rawValue = this.movementForm.getRawValue();
      const type = rawValue.type;

      const request: any = {
        productId: rawValue.product?.id,
        reason: rawValue.reason,
        quantity: rawValue.quantity,
        type: type,
      };

      if (type === 'IN' || type === 'TRANSFER') {
        request.toWarehouseId = rawValue.toWarehouse?.id;
      }

      if (type === 'OUT' || type === 'TRANSFER') {
        request.fromWarehouseId = rawValue.fromWarehouse?.id;
      }

      this.modalService.close(request);
    }
  }
}
