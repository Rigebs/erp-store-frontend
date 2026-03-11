import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitMeasure } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-unit-measure-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './unit-measure-form-modal.html',
  styleUrl: './unit-measure-form-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitMeasureFormModal implements OnInit {
  private fb = inject(FormBuilder);

  unit = input<UnitMeasure | null>(null);
  save = output<Omit<UnitMeasure, 'id'>>();
  cancel = output<void>();

  unitForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    abbreviation: ['', [Validators.required, Validators.maxLength(5)]],
    description: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const unitData = this.unit();
    if (unitData) {
      this.unitForm.patchValue({
        name: unitData.name,
        abbreviation: unitData.abbreviation,
        description: unitData.description,
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.unitForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  close(): void {
    this.cancel.emit();
  }

  onSubmit() {
    if (this.unitForm.valid) {
      const formValues = this.unitForm.getRawValue();

      // Combinamos los valores del formulario con los valores por defecto
      // o los valores actuales si estamos editando
      this.save.emit({
        ...formValues,
        factor: this.unit()?.factor ?? 1, // Valor por defecto o actual
        enabled: this.unit()?.enabled ?? true, // Valor por defecto o actual
      });
    }
  }
}
