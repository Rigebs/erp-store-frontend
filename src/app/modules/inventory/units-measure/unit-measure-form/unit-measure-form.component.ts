import { Component, OnInit } from '@angular/core';
import { UnitMeasureService } from '../../services/unit-measure.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { JwtUtilService } from '../../../../utils/jwt-util.service';
import { UnitMeasureRequest } from '../../models/unit-measure';

@Component({
  selector: 'app-unit-measure-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './unit-measure-form.component.html',
  styleUrl: './unit-measure-form.component.css',
})
export class UnitMeasureFormComponent implements OnInit {
  unitMeasureForm: FormGroup;
  isEditMode = false;
  unitMeasureId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private unitMeasureService: UnitMeasureService,
    private snackBar: MatSnackBar,
    jwtUtilService: JwtUtilService
  ) {
    this.unitMeasureForm = this.fb.group({
      name: ['', Validators.required],
      abbreviation: ['', Validators.required],
      description: [''],
      userId: [jwtUtilService.getId()],
    });
  }

  ngOnInit(): void {
    this.unitMeasureId = this.route.snapshot.paramMap.get('id');
    if (this.unitMeasureId) {
      this.isEditMode = true;
      this.loadUnitMeasure(Number(this.unitMeasureId));
    }
  }

  onSubmit(): void {
    if (this.unitMeasureForm.valid) {
      if (this.isEditMode) {
        this.update(Number(this.unitMeasureId), this.unitMeasureForm.value);
        return;
      }
      this.save(this.unitMeasureForm.value);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('management/units-measure');
  }

  loadUnitMeasure(id: number): void {
    this.unitMeasureService.findById(id).subscribe({
      next: (response) => {
        this.unitMeasureForm.patchValue({
          name: response.data.name,
          abbreviation: response.data.abbreviation,
          description: response.data.description,
        });
      },
      error: (err) => {
        console.error('Error al cargar la unidad de medida:', err);
      },
    });
  }

  save(unitMeasure: UnitMeasureRequest): void {
    this.unitMeasureService.save(unitMeasure).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al guardar la unidad de medida:', err);
      },
    });
  }

  update(id: number, unitMeasure: UnitMeasureRequest): void {
    this.unitMeasureService.update(id, unitMeasure).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al actualizar la unidad de medida:', err);
      },
    });
  }
}
