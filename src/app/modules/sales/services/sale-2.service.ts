import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../new-sale-2/new-sale-2.component';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private productsSubject = new BehaviorSubject<Product[]>(this.seedProducts());
  products$ = this.productsSubject.asObservable();

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  addToCart(p: Product) {
    const cart = [...this.cartSubject.value];
    const idx = cart.findIndex((c) => c.product.id === p.id);
    if (idx >= 0) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + 1 };
    } else {
      cart.push({ product: p, quantity: 1 });
    }
    this.cartSubject.next(cart);
  }

  increase(productId: string) {
    const cart = this.cartSubject.value.map((c) =>
      c.product.id === productId ? { ...c, quantity: c.quantity + 1 } : c
    );
    this.cartSubject.next(cart);
  }

  decrease(productId: string) {
    let cart = this.cartSubject.value.map((c) =>
      c.product.id === productId ? { ...c, quantity: c.quantity - 1 } : c
    );
    cart = cart.filter((c) => c.quantity > 0);
    this.cartSubject.next(cart);
  }

  remove(productId: string) {
    const cart = this.cartSubject.value.filter(
      (c) => c.product.id !== productId
    );
    this.cartSubject.next(cart);
  }

  clearCart() {
    this.cartSubject.next([]);
  }

  private seedProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Producto A',
        image:
          'https://th.bing.com/th/id/OIP.8sDF7uml2zp2CXT0m2HUiQHaFj?w=234&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
        price: 10,
        category: 'Cat1',
      },
      {
        id: '2',
        name: 'Producto B',
        image:
          'https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/f/a/faber-castell-lapiz-tecnico-f-16152014-default-1.jpg',
        price: 20,
        category: 'Cat2',
      },
      {
        id: '3',
        name: 'Producto C',
        image:
          'https://casadorita.com.uy/wp-content/uploads/2024/05/Photoroom_004_20240509_155832.jpeg',
        price: 30,
        category: 'Cat1',
      },
      {
        id: '4',
        name: 'Producto D',
        image:
          'https://d2o812a6k13pkp.cloudfront.net/fit-in/1200x1200/filters:quality(100)/Categorias/Gaseosas.jpeg20211006144131.jpg',
        price: 40,
        category: 'Cat2',
      },
      {
        id: '1',
        name: 'Producto A',
        image:
          'https://th.bing.com/th/id/OIP.8sDF7uml2zp2CXT0m2HUiQHaFj?w=234&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
        price: 10,
        category: 'Cat1',
      },
      {
        id: '2',
        name: 'Producto B',
        image:
          'https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/f/a/faber-castell-lapiz-tecnico-f-16152014-default-1.jpg',
        price: 20,
        category: 'Cat2',
      },
      {
        id: '3',
        name: 'Producto C',
        image:
          'https://casadorita.com.uy/wp-content/uploads/2024/05/Photoroom_004_20240509_155832.jpeg',
        price: 30,
        category: 'Cat1',
      },
      {
        id: '4',
        name: 'Producto D',
        image:
          'https://d2o812a6k13pkp.cloudfront.net/fit-in/1200x1200/filters:quality(100)/Categorias/Gaseosas.jpeg20211006144131.jpg',
        price: 40,
        category: 'Cat2',
      },
      {
        id: '1',
        name: 'Producto A',
        image:
          'https://th.bing.com/th/id/OIP.8sDF7uml2zp2CXT0m2HUiQHaFj?w=234&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
        price: 10,
        category: 'Cat1',
      },
      {
        id: '2',
        name: 'Producto B',
        image:
          'https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/f/a/faber-castell-lapiz-tecnico-f-16152014-default-1.jpg',
        price: 20,
        category: 'Cat2',
      },
      {
        id: '3',
        name: 'Producto C',
        image:
          'https://casadorita.com.uy/wp-content/uploads/2024/05/Photoroom_004_20240509_155832.jpeg',
        price: 30,
        category: 'Cat1',
      },
      {
        id: '4',
        name: 'Producto D',
        image:
          'https://d2o812a6k13pkp.cloudfront.net/fit-in/1200x1200/filters:quality(100)/Categorias/Gaseosas.jpeg20211006144131.jpg',
        price: 40,
        category: 'Cat2',
      },
      {
        id: '1',
        name: 'Producto A',
        image:
          'https://th.bing.com/th/id/OIP.8sDF7uml2zp2CXT0m2HUiQHaFj?w=234&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
        price: 10,
        category: 'Cat1',
      },
      {
        id: '2',
        name: 'Producto B',
        image:
          'https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/f/a/faber-castell-lapiz-tecnico-f-16152014-default-1.jpg',
        price: 20,
        category: 'Cat2',
      },
      {
        id: '3',
        name: 'Producto C',
        image:
          'https://casadorita.com.uy/wp-content/uploads/2024/05/Photoroom_004_20240509_155832.jpeg',
        price: 30,
        category: 'Cat1',
      },
      {
        id: '4',
        name: 'Producto D',
        image:
          'https://d2o812a6k13pkp.cloudfront.net/fit-in/1200x1200/filters:quality(100)/Categorias/Gaseosas.jpeg20211006144131.jpg',
        price: 40,
        category: 'Cat2',
      },
    ];
  }
}
