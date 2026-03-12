import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
  styleUrl: './form-error.css',
})
export class FormError {
  @Input() control!: AbstractControl | null;
  @Input() customMessages: Record<string, string> = {};

  get errorMessage(): string {
    const errors = this.control?.errors;
    if (!errors) return '';

    const firstErrorKey = Object.keys(errors)[0];

    const defaultMessages: Record<string, string> = {
      required: 'Este campo es obligatorio.',
      minlength: `Mínimo ${errors['minlength']?.requiredLength} caracteres.`,
      min: `El valor mínimo es ${errors['min']?.min}.`,
    };

    return this.customMessages[firstErrorKey] || defaultMessages[firstErrorKey] || 'Campo inválido';
  }
}
