import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProductRequest } from '../../../inventory/models/product';
import { SaleDetail } from '../../models/sale-detail';
import { FormatUtilService } from '../../../../utils/format-util.service';

@Component({
  selector: 'app-selected-products',
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './selected-products.component.html',
  styleUrl: './selected-products.component.css',
})
export class SelectedProductsComponent {
  @Input() selectedProducts: SaleDetail[] = [];
  @Output() productRemoved = new EventEmitter<any>();
  @Output() productAdd = new EventEmitter<any>();
  @Output() productDeduct = new EventEmitter<any>();

  constructor(public formatUtilService: FormatUtilService) {}

  displayedColumns: string[] = [
    'name',
    'quantity',
    'price',
    'subtotal',
    'actions',
  ];

  remove(product: ProductRequest) {
    this.productRemoved.emit(product);
  }

  add(product: ProductRequest) {
    this.productAdd.emit(product);
  }

  deduct(product: ProductRequest) {
    this.productDeduct.emit(product);
  }
}
