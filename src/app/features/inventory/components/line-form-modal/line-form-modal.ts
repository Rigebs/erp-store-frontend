import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Line } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-line-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './line-form-modal.html',
  styleUrl: './line-form-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineFormModal implements OnInit {
  private fb = inject(FormBuilder);

  line = input<Line | null>(null);
  save = output<{ name: string; description: string }>();
  cancel = output<void>();

  lineForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.line()) {
      this.lineForm.patchValue({
        name: this.line()!.name,
        description: this.line()!.description,
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.lineForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  close(): void {
    this.cancel.emit();
  }

  onSubmit() {
    if (this.lineForm.valid) {
      this.save.emit(this.lineForm.getRawValue());
    }
  }
}
