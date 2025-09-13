import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-company-form',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css',
})
export class CompanyFormComponent {
  @Input({ required: true }) form!: FormGroup;

  static buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      name: ['', Validators.required],
      address: [''],
      phone: [''],
      email: ['', Validators.email],
    });
  }
}
