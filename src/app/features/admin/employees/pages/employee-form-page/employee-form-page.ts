import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form-page.html',
  styleUrls: ['./employee-form-page.css'],
})
export class EmployeeFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId?: number;

  ngOnInit(): void {
    this.#initForm();
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.employeeId) {
      this.isEditMode = true;
      this.#loadEmployee(this.employeeId);
    }
  }

  #initForm(): void {
    this.employeeForm = this.fb.group({
      person: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        paternalName: ['', Validators.required],
        maternalName: [''],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.pattern('^[0-9]{9,15}$')],
      }),
      jobTitle: ['', Validators.required],
      employmentType: ['FULL_TIME', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: [new Date().toISOString().split('T')[0], Validators.required],
      employmentStatus: ['ACTIVE'],
    });
  }

  #loadEmployee(id: number): void {
    this.employeeService.findById(id).subscribe({
      next: (emp) => this.employeeForm.patchValue(emp),
      error: () => this.router.navigate(['/employees']),
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const value = this.employeeForm.value;

    const request: Observable<unknown> = this.isEditMode
      ? this.employeeService.update(this.employeeId!, value)
      : this.employeeService.save(value);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/users/employees']);
      },
      error: (err) => {
        console.error('Error al procesar el empleado', err);
      },
    });
  }

  isInvalid(path: string): boolean {
    const control = this.employeeForm.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
