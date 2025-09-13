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
import { CustomerService } from '../../services/customer.service';
import { CustomerRequest, CustomerResponse } from '../../models/customer';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { CompanyFormComponent } from '../../components/company-form/company-form.component';
import { PersonFormComponent } from '../../components/person-form/person-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  imports: [
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    PersonFormComponent,
    CompanyFormComponent,
    CommonModule,
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      person: PersonFormComponent.buildForm(this.fb),
      company: CompanyFormComponent.buildForm(this.fb),
    });

    // Por defecto: habilitamos persona y deshabilitamos empresa
    this.personGroup.enable();
    this.companyGroup.disable();
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.isEditMode = true;
      this.loadCustomer(Number(this.customerId));
    }
  }

  loadCustomer(id: number): void {
    this.customerService.findById(id).subscribe({
      next: (response) => {
        const customer: CustomerResponse = response.data;
        this.customerForm.patchValue({
          person: customer.person || {},
          company: customer.company || {},
        });

        if (customer.person) {
          this.personGroup.enable();
          this.companyGroup.disable();
        } else if (customer.company) {
          this.companyGroup.enable();
          this.personGroup.disable();
        }
      },
      error: (err) => console.error('Error loading customer:', err),
    });
  }

  get personGroup(): FormGroup {
    return this.customerForm.get('person') as FormGroup;
  }

  get companyGroup(): FormGroup {
    return this.customerForm.get('company') as FormGroup;
  }

  onTabChange(index: number): void {
    if (index === 0) {
      this.personGroup.enable();
      this.companyGroup.disable();
    } else {
      this.companyGroup.enable();
      this.personGroup.disable();
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      let formValue = this.customerForm.getRawValue() as CustomerRequest;

      if (this.personGroup.enabled) {
        (formValue as any).company = null;
      } else {
        (formValue as any).person = null;
      }

      if (this.isEditMode) {
        this.customerService
          .update(Number(this.customerId), formValue)
          .subscribe({
            next: (response) => {
              this.snackBar.open(response.message, 'Cerrar', {
                duration: 2000,
              });
              this.goBack();
            },
            error: (err) => console.error('Error updating customer', err),
          });
      } else {
        this.customerService.save(formValue).subscribe({
          next: (response) => {
            this.snackBar.open(response.message, 'Cerrar', { duration: 2000 });
            this.goBack();
          },
          error: (err) => console.error('Error creating customer', err),
        });
      }
    }
  }

  goBack() {
    this.router.navigateByUrl('management/customers');
  }
}
