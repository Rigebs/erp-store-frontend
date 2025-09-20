import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LineService } from '../../services/line.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JwtUtilService } from '../../../../utils/jwt-util.service';
import { LineRequest } from '../../models/line';

@Component({
  selector: 'app-line-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './line-form.component.html',
  styleUrl: './line-form.component.css',
})
export class LineFormComponent implements OnInit {
  lineForm: FormGroup;
  isEditMode = false;
  lineId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private lineService: LineService,
    private snackBar: MatSnackBar,
    jwtUtilService: JwtUtilService
  ) {
    this.lineForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      userId: [jwtUtilService.getId()],
    });
  }

  ngOnInit(): void {
    this.lineId = this.route.snapshot.paramMap.get('id');
    if (this.lineId) {
      this.isEditMode = true;
      this.loadLine(Number(this.lineId));
    }
  }

  onSubmit(): void {
    if (this.lineForm.valid) {
      if (this.isEditMode) {
        this.update(Number(this.lineId), this.lineForm.value);
        return;
      }
      this.save(this.lineForm.value);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('lines');
  }

  loadLine(id: number): void {
    this.lineService.findById(id).subscribe({
      next: (response) => {
        this.lineForm.patchValue({
          name: response.data.name,
          description: response.data.description,
        });
      },
      error: (err) => {
        console.error('Error al cargar la línea:', err);
      },
    });
  }

  save(line: LineRequest): void {
    this.lineService.save(line).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al guardar la línea:', err);
      },
    });
  }

  update(id: number, line: LineRequest): void {
    this.lineService.update(id, line).subscribe({
      next: (response) => {
        this.snackBar.open(`${response.message}`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Error al actualizar la línea:', err);
      },
    });
  }
}
