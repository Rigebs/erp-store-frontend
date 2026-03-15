import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';
import { ModalService } from '../../../../shared/services/modal-service';
import { Brand } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-brand-form-modal',
  imports: [ReactiveFormsModule, ModalContainer],
  templateUrl: './brand-form-modal.html',
  styleUrl: './brand-form-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandFormModal {
  private readonly fb = inject(FormBuilder);
  protected readonly modalService = inject(ModalService);

  brand = input<Brand | null>(null);

  brandForm = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const brandData = this.brand();
      if (brandData) {
        this.brandForm.patchValue(brandData);
      }
    });
  }

  submit(): void {
    if (this.brandForm.valid) {
      this.modalService.close(this.brandForm.getRawValue());
    }
  }
}
