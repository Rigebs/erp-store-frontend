import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-person-form',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css',
})
export class PersonFormComponent {
  @Input({ required: true }) form!: FormGroup;

  static buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      name: ['', Validators.required],
      paternalName: [''],
      maternalName: [''],
      email: ['', Validators.email],
      phone: [''],
      address: [''],
    });
  }
}
