import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductResponse } from '../../../catalog/models/product';

@Component({
  selector: 'app-product-selector',
  imports: [
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-selector.component.html',
  styleUrl: './product-selector.component.css',
})
export class ProductSelectorComponent {
  @Output() productSelected = new EventEmitter<any>();
  @Input() products: ProductResponse[] = [];
  searchTerm = '';

  selectProduct(product: any) {
    this.productSelected.emit(product);
  }

  filteredProducts() {
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
