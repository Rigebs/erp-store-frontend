import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import {
  CustomerRequest,
  CustomerResponse,
} from '../../../customers/models/customer';
import { CustomerService } from '../../../customers/services/customer.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'app-assign-customer-dialog',
  imports: [
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './assign-customer-dialog.component.html',
  styleUrl: './assign-customer-dialog.component.css',
})
export class AssignCustomerDialogComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<AssignCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedCustomer?: CustomerResponse }
  ) {}

  searchCtrl!: FormControl;
  customers$!: Observable<CustomerResponse[]>;
  selectedCustomer: CustomerResponse | null = null;

  showCreate = false;
  personForm!: FormGroup;
  companyForm!: FormGroup;
  selectedTabIndex = 0; // 0 = person, 1 = company
  justAssigned = false;

  private searchTerms$ = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.searchCtrl = this.fb.control('');

    this.personForm = this.fb.group({
      name: ['', Validators.required],
      paternalName: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });

    if (this.data?.selectedCustomer) {
      this.selectedCustomer = this.data.selectedCustomer;
    }

    this.customers$ = this.searchTerms$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.customerService
          .findAll(0, 10, term)
          .pipe(map((res) => res.data.content))
      )
    );

    this.searchCtrl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((val) => {
        this.searchTerms$.next(val || '');
      });
  }

  selectCustomer(c: CustomerResponse) {
    this.selectedCustomer = c;
    this.justAssigned = false;
  }

  onAssign() {
    this.dialogRef.close(this.selectedCustomer);
  }

  onCancel() {
    this.dialogRef.close(undefined);
  }

  onClean() {
    this.searchCtrl.setValue('');
    this.showCreate = !this.showCreate;
  }

  selectConsumidorFinal() {
    this.dialogRef.close(null);
  }

  toggleCreate() {
    this.showCreate = !this.showCreate;
  }

  createCustomer() {
    let payload: CustomerRequest;

    if (this.selectedTabIndex === 0) {
      if (this.personForm.invalid) return;
      payload = { person: this.personForm.value };
    } else {
      if (this.companyForm.invalid) return;
      payload = { company: this.companyForm.value };
    }

    this.customerService.save(payload).subscribe({
      next: (res) => {
        this.selectedCustomer = res.data;
        this.justAssigned = true;
        this.dialogRef.close(res.data);
      },
      error: (err) => {
        console.error('Error creando cliente', err);
      },
    });
  }
}
