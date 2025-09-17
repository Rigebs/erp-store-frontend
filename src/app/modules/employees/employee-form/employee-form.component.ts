import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PersonFormComponent } from '../../customers/components/person-form/person-form.component';
import { EmployeeService } from '../services/employee.service';
import { EmployeeRequest, EmployeeResponse } from '../models/employee';
@Component({
  selector: 'app-employee-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    PersonFormComponent,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;

  employmentStatuses = ['ACTIVE', 'INACTIVE', 'TERMINATED'];
  employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      person: PersonFormComponent.buildForm(this.fb),
      hireDate: ['', Validators.required],
      terminationDate: [''],
      jobTitle: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      employmentStatus: ['ACTIVE', Validators.required],
      employmentType: ['FULL_TIME', Validators.required],
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(Number(this.employeeId));
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.findById(id).subscribe({
      next: (response) => {
        const employee: EmployeeResponse = response.data;
        this.employeeForm.patchValue({
          person: employee.person,
          hireDate: employee.hireDate,
          terminationDate: employee.terminationDate,
          jobTitle: employee.jobTitle,
          salary: employee.salary,
          employmentStatus: employee.employmentStatus,
          employmentType: employee.employmentType,
        });
      },
      error: (err) => console.error('Error loading employee:', err),
    });
  }

  get personGroup(): FormGroup {
    return this.employeeForm.get('person') as FormGroup;
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.getRawValue() as EmployeeRequest;

      if (this.isEditMode) {
        this.employeeService
          .update(Number(this.employeeId), formValue)
          .subscribe({
            next: (response) => {
              this.snackBar.open(response.message, 'Cerrar', {
                duration: 2000,
              });
              this.goBack();
            },
            error: (err) => console.error('Error updating employee', err),
          });
      } else {
        this.employeeService.save(formValue).subscribe({
          next: (response) => {
            this.snackBar.open(response.message, 'Cerrar', { duration: 2000 });
            this.goBack();
          },
          error: (err) => console.error('Error creating employee', err),
        });
      }
    }
  }

  goBack() {
    this.router.navigateByUrl('management/employees');
  }
}
