import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-category-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form-modal.html',
  styleUrl: './category-form-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormModal implements OnInit {
  private fb = inject(FormBuilder);

  category = input<Category | null>(null);

  save = output<{ name: string; description: string }>();
  cancel = output<void>();

  categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const data = this.category();
    if (data) {
      this.categoryForm.patchValue({
        name: data.name,
        description: data.description,
      });
    }
  }

  title = computed(() => (this.category() ? 'Editar Categoría' : 'Registrar Categoría'));

  isFieldInvalid(field: string): boolean {
    const control = this.categoryForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.save.emit(this.categoryForm.getRawValue());
      this.categoryForm.reset();
    }
  }

  close(): void {
    this.cancel.emit();
  }
}
