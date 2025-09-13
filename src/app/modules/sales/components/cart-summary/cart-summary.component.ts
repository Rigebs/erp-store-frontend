import { Component } from '@angular/core';
import { SaleService } from '../../services/sale-2.service';
import { CartItem } from '../../new-sale-2/new-sale-2.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.css',
})
export class CartSummaryComponent {
  cart$: Observable<CartItem[]>;

  constructor(private saleService: SaleService) {
    this.cart$ = this.saleService.cart$;
  }

  increase(id: string) {
    this.saleService.increase(id);
  }

  decrease(id: string) {
    this.saleService.decrease(id);
  }

  remove(id: string) {
    this.saleService.remove(id);
  }

  total(items: CartItem[]): number {
    return items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  }

  igv(items: CartItem[]): number {
    return this.total(items) * 0.18;
  }

  generarVenta() {
    alert('Venta generada');
    this.saleService.clearCart();
  }
}
