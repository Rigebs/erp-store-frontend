import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/modal-service';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';
import { Warehouse, WarehouseType } from '../../../../core/models/inventory.model';
import { BranchService } from '../../../admin/branches/services/branch-service';
import { SelectSearchable } from '../../../../shared/ui/select-searchable/select-searchable';

@Component({
  selector: 'app-warehouse-form-modal',
  templateUrl: './warehouse-form-modal.html',
  imports: [ReactiveFormsModule, ModalContainer, SelectSearchable],
  styleUrl: './warehouse-form-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseFormModal implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly branchService = inject(BranchService);
  private readonly cdr = inject(ChangeDetectorRef);

  warehouse = input<Warehouse>();
  defaultBranchId = input<number | null>();

  readonly isSubmitting = signal(false);
  readonly branches = this.branchService.branches; // Usamos el signal del servicio

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
    branch: [null as any, Validators.required], // Objeto sucursal completo para el select
    main: [false],
    enabled: [true],
  });

  ngOnInit() {
    // Cargar sedes iniciales para el select
    this.branchService.findAll(0, 10).subscribe();

    if (this.warehouse()) {
      const data = this.warehouse()!;
      this.warehouseForm.patchValue({
        ...data,
        branch: data.branch, // El select espera el objeto que coincida con la lista
      });
    } else if (this.defaultBranchId()) {
      // Si venimos de una sucursal específica, la buscamos para pre-seleccionarla
      this.branchService.findById(this.defaultBranchId()!).subscribe((branch) => {
        this.warehouseForm.patchValue({ branch });
      });
    }
  }

  onSearchBranches(query: string) {
    this.branchService.findAll(0, 10).subscribe(); // Aquí podrías pasar el query si tu servicio lo soporta
  }

  handleClose(): void {
    this.modalService.close();
  }

  handleSubmit(): void {
    if (this.warehouseForm.invalid) {
      this.warehouseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const rawValue = this.warehouseForm.getRawValue();

    // Mapeamos para enviar solo el ID al backend si es necesario,
    // o el objeto completo según tu API
    const payload = {
      ...rawValue,
      branchId: rawValue.branch?.id,
    };

    setTimeout(() => {
      this.modalService.close(payload);
      this.isSubmitting.set(false);
      this.cdr.markForCheck();
    }, 600);
  }
}
