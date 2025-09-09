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
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JwtUtilService } from '../../../../utils/jwt-util.service';
import { SupplierRequest } from '../../models/supplier';

@Component({
  selector: 'app-supplier-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar,
    jwtUtilService: JwtUtilService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      website: ['', Validators.required],
      enabled: [true, Validators.required],
      userId: [jwtUtilService.getId()],
    });
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      this.isEditMode = true;
      this.loadSupplier(Number(this.supplierId));
    }
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      if (this.isEditMode) {
        this.update(Number(this.supplierId), this.supplierForm.value);
        return;
      }
      this.save(this.supplierForm.value);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('management/suppliers');
  }

  loadSupplier(id: number): void {
    this.supplierService.findById(id).subscribe({
      next: (response) => {
        this.supplierForm.patchValue({
          name: response.data.name,
          contactName: response.data.contactName,
          contactEmail: response.data.contactEmail,
          phoneNumber: response.data.phoneNumber,
          address: response.data.address,
          website: response.data.website,
          enabled: response.data.enabled,
        });
      },
      error: (err) => {
        console.error('Error al cargar el proveedor:', err);
      },
    });
  }

  save(supplier: SupplierRequest): void {
    this.supplierService.save(supplier).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al guardar el proveedor:', err);
      },
    });
  }

  update(id: number, supplier: SupplierRequest): void {
    this.supplierService.update(id, supplier).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al actualizar el proveedor:', err);
      },
    });
  }
}
