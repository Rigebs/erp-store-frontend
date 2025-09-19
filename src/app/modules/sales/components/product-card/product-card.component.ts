import { Component, Input } from '@angular/core';
import { ProductResponse } from '../../../catalog/models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: ProductResponse;

  constructor(private cartService: CartService) {}

  add() {
    this.cartService.addToCart(this.product);
  }
}
