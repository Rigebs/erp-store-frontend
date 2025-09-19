import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductResponse } from '../../catalog/models/product';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  addToCart(p: ProductResponse) {
    const cart = [...this.cartSubject.value];
    const idx = cart.findIndex((c) => c.product.id === p.id);

    if (idx >= 0) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + 1 };
    } else {
      cart.push({ product: p, quantity: 1 });
    }

    this.cartSubject.next(cart);
  }

  increase(productId: number) {
    const cart = this.cartSubject.value.map((c) =>
      c.product.id === productId ? { ...c, quantity: c.quantity + 1 } : c
    );
    this.cartSubject.next(cart);
  }

  decrease(productId: number) {
    let cart = this.cartSubject.value.map((c) =>
      c.product.id === productId ? { ...c, quantity: c.quantity - 1 } : c
    );
    cart = cart.filter((c) => c.quantity > 0);
    this.cartSubject.next(cart);
  }

  remove(productId: number) {
    const cart = this.cartSubject.value.filter(
      (c) => c.product.id !== productId
    );
    this.cartSubject.next(cart);
  }

  clearCart() {
    this.cartSubject.next([]);
  }
}
