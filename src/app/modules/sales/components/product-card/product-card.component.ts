import { Component, Input } from '@angular/core';
import { Product } from '../../new-sale-2/new-sale-2.component';
import { SaleService } from '../../services/sale-2.service';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private saleService: SaleService) {}

  add() {
    this.saleService.addToCart(this.product);
  }
}
