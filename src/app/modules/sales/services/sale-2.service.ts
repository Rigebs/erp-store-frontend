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
        id: '5',
        name: 'Producto E',
        image:
          'https://http2.mlstatic.com/D_NQ_NP_689046-MPE72466443365_102023-O.webp',
        price: 15,
        category: 'Cat3',
      },
      {
        id: '6',
        name: 'Producto F',
        image:
          'https://www.galeriadelcoleccionista.com/medias/Smartwatch-Fitness-300-negro.jpg?context=bWFzdGVyfGltYWdlc3w2Mzc2NHxpbWFnZS9qcGVnfGhiMi9oZDIvMTA1ODI0NjMxNTgxOTAuanBnfDkxNTc3MjI5NDgwNDg5ZWFlZjExNDM2ZTE0ZThlYmVhMTZkYjA5MzYwZGRjYzY5NTg1ZTAwZDhiZGY2MzdlOWU',
        price: 50,
        category: 'Cat1',
      },
      {
        id: '7',
        name: 'Producto G',
        image:
          'https://img10.naventcdn.com/avisos/11/00/90/79/55/56/720x532/328211759.jpg',
        price: 60,
        category: 'Cat2',
      },
      {
        id: '8',
        name: 'Producto H',
        image:
          'https://m.media-amazon.com/images/I/61v36u4CvjL._AC_SL1500_.jpg',
        price: 25,
        category: 'Cat3',
      },
      {
        id: '9',
        name: 'Producto I',
        image:
          'https://www.megatone.net/Images/Articulos/zoom2x/200/0/400047.jpg',
        price: 35,
        category: 'Cat1',
      },
      {
        id: '10',
        name: 'Producto J',
        image:
          'https://www.libreriasdeletras.com.ar/wp-content/uploads/2023/01/cuaderno-a4-rayado-tapas-duras.jpg',
        price: 12,
        category: 'Cat2',
      },
      {
        id: '11',
        name: 'Producto K',
        image: 'https://m.media-amazon.com/images/I/51cXzyLqM5L._AC_SX425_.jpg',
        price: 80,
        category: 'Cat3',
      },
      {
        id: '12',
        name: 'Producto L',
        image:
          'https://www.lacuracao.pe/media/catalog/product/cache/926507dc7f93631a094422215b778fe0/a/l/alienwarex17r2.jpg',
        price: 1500,
        category: 'Cat1',
      },
      {
        id: '13',
        name: 'Producto M',
        image:
          'https://m.media-amazon.com/images/I/81zgkt+y5qL._AC_SL1500_.jpg',
        price: 200,
        category: 'Cat2',
      },
      {
        id: '14',
        name: 'Producto N',
        image:
          'https://tiendamia.com/pe/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/m/p/mp8q3am_a-1_2.jpg',
        price: 100,
        category: 'Cat3',
      },
      {
        id: '15',
        name: 'Producto O',
        image:
          'https://oechsle.vteximg.com.br/arquivos/ids/16593855-1000-1000/image-8b9fc77d5e4c4db58b8f96f0505cb85b.jpg?v=637928821980570000',
        price: 250,
        category: 'Cat1',
      },
      {
        id: '16',
        name: 'Producto P',
        image:
          'https://plazavea.vteximg.com.br/arquivos/ids/21464669-512-512/20207048.jpg',
        price: 8,
        category: 'Cat2',
      },
      {
        id: '17',
        name: 'Producto Q',
        image: 'https://m.media-amazon.com/images/I/71D9ImsvEtL._AC_SX466_.jpg',
        price: 300,
        category: 'Cat3',
      },
      {
        id: '18',
        name: 'Producto R',
        image:
          'https://http2.mlstatic.com/D_NQ_NP_663688-MLA71717079862_092023-O.webp',
        price: 20,
        category: 'Cat1',
      },
      {
        id: '19',
        name: 'Producto S',
        image:
          'https://http2.mlstatic.com/D_NQ_NP_808674-MLA69364446936_052023-O.webp',
        price: 18,
        category: 'Cat2',
      },
      {
        id: '20',
        name: 'Producto T',
        image:
          'https://www.lacuracao.pe/media/catalog/product/cache/926507dc7f93631a094422215b778fe0/s/m/smarttv-uhd-4k-55-55uq8050psb-lg-01.jpg',
        price: 1200,
        category: 'Cat3',
      },
    ];
  }
}
