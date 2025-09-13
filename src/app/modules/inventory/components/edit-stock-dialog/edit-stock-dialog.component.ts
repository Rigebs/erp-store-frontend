import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { StockResponse } from '../../models/stock';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-stock-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './edit-stock-dialog.component.html',
  styleUrl: './edit-stock-dialog.component.css',
})
export class EditStockDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockResponse
  ) {
    this.form = this.fb.group({
      quantity: [data.quantity, [Validators.required, Validators.min(0)]],
      minQuantity: [data.minQuantity, [Validators.required, Validators.min(0)]],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({
        productId: this.data.product.id,
        warehouseId: this.data.warehouse.id,
        quantity: this.form.value.quantity,
        minQuantity: this.form.value.minQuantity,
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
