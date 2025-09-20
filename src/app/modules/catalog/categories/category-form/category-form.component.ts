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
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JwtUtilService } from '../../../../utils/jwt-util.service';
import { CategoryRequest } from '../../models/category';

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    jwtUtilService: JwtUtilService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      userId: [jwtUtilService.getId()],
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.isEditMode = true;
      this.loadCategory(Number(this.categoryId));
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      if (this.isEditMode) {
        this.update(Number(this.categoryId), this.categoryForm.value);
        return;
      }
      this.save(this.categoryForm.value);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('categories');
  }

  loadCategory(id: number): void {
    this.categoryService.findById(id).subscribe({
      next: (response) => {
        this.categoryForm.patchValue({
          name: response.data.name,
          description: response.data.description,
          enabled: response.data.enabled,
        });
      },
      error: (err) => {
        console.error('Error al cargar la categoría:', err);
      },
    });
  }

  save(category: CategoryRequest): void {
    this.categoryService.save(category).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al guardar la categoría:', err);
      },
    });
  }

  update(id: number, category: CategoryRequest): void {
    this.categoryService.update(id, category).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al actualizar la categoría:', err);
      },
    });
  }
}
