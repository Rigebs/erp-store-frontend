import { Component, EventEmitter, Output } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { SaleRequest } from '../../models/request/sale-request';
import { SaleDetailRequest } from '../../models/request/sale-detail-request';

@Component({
  selector: 'app-cart-summary',
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.css',
})
export class CartSummaryComponent {
  cart$: Observable<CartItem[]>;

  @Output() saleGenerated = new EventEmitter<SaleRequest>();

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.cart$;
  }

  increase(id: number) {
    this.cartService.increase(id);
  }

  decrease(id: number) {
    this.cartService.decrease(id);
  }

  remove(id: number) {
    this.cartService.remove(id);
  }

  total(items: CartItem[]): number {
    return items.reduce((acc, i) => acc + i.product.salePrice * i.quantity, 0);
  }

  igv(items: CartItem[]): number {
    return this.total(items) * 0.18;
  }

  generateSale() {
    this.cart$
      .pipe(
        take(1),
        map((cartItems) => {
          if (cartItems.length === 0) {
            alert('No hay productos en el carrito');
            return null;
          }

          const subtotal = this.total(cartItems);
          const tax = this.igv(cartItems);
          const total = subtotal + tax;

          const saleDetails: SaleDetailRequest[] = cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.salePrice,
            subtotal: item.product.salePrice * item.quantity,
          }));

          return {
            subtotal,
            tax,
            total,
            discount: 0,
            saleDetails,
          } as SaleRequest;
        })
      )
      .subscribe((saleRequest) => {
        if (!saleRequest) return;

        this.saleGenerated.emit(saleRequest);
        this.cartService.clearCart();
      });
  }
}
