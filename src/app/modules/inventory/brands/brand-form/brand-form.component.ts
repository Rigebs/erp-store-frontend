import { Component, OnInit } from '@angular/core';
import { BrandRequest } from '../../models/request/brand-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrandService } from '../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-brand-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.css',
})
export class BrandFormComponent implements OnInit {
  brandForm: FormGroup;
  isEditMode = false;
  brandId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private brandService: BrandService,
    private snackBar: MatSnackBar
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.brandId = this.route.snapshot.paramMap.get('id');
    if (this.brandId) {
      this.isEditMode = true;
      this.loadBrand(Number(this.brandId));
    }
  }

  onSubmit(): void {
    if (this.brandForm.valid) {
      if (this.isEditMode) {
        this.update(Number(this.brandId), this.brandForm.value);
        return;
      }
      this.save(this.brandForm.value);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('management/brands');
  }

  loadBrand(id: number): void {
    this.brandService.findById(id).subscribe({
      next: (brand) => {
        this.brandForm.patchValue({
          name: brand.name,
          description: brand.description,
        });
      },
      error: (err) => {
        console.error('Error al cargar la marca:', err);
      },
    });
  }

  save(brand: BrandRequest): void {
    this.brandService.save(brand).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al guardar la marca:', err);
      },
    });
  }

  update(id: number, brand: BrandRequest): void {
    this.brandService.update(id, brand).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al actualizar la marca:', err);
      },
    });
  }
}
