import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/modal-service';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';
import { Warehouse, WarehouseType } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-warehouse-form-modal',
  templateUrl: './warehouse-form-modal.html',
  imports: [ReactiveFormsModule, ModalContainer],
  styleUrl: './warehouse-form-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseFormModal {
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly isSubmitting = signal(false);
  warehouse = input<Warehouse>();

  readonly warehouseTypes: { value: WarehouseType; label: string }[] = [
    { value: 'CENTRAL', label: 'Central' },
    { value: 'POINT_OF_SALE', label: 'Punto de Venta' },
    { value: 'TRANSIT', label: 'Tránsito' },
    { value: 'QUARANTINE', label: 'Cuarentena' },
    { value: 'INTERNAL_CONSUMPTION', label: 'Consumo Interno' },
  ];

  readonly warehouseForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    location: ['', Validators.required],
    description: [''],
    type: ['', Validators.required],
    main: [false],
    enabled: [true],
  });

  readonly isInvalid = computed(() => {
    return this.warehouseForm.invalid || this.isSubmitting();
  });

  ngOnInit() {
    if (this.warehouse()) {
      this.warehouseForm.patchValue(this.warehouse()!);
    }

    this.warehouseForm.valueChanges.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  handleClose(): void {
    this.modalService.close();
  }

  handleSubmit(): void {
    if (this.warehouseForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.warehouseForm.getRawValue();

    setTimeout(() => {
      this.modalService.close(formData);
      this.isSubmitting.set(false);
      this.cdr.markForCheck();
    }, 600);
  }
}
