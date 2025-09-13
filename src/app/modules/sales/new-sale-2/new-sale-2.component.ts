import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleService } from '../services/sale-2.service';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { CartSummaryComponent } from '../components/cart-summary/cart-summary.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-new-sale-2',
  imports: [
    ProductCardComponent,
    CartSummaryComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './new-sale-2.component.html',
  styleUrl: './new-sale-2.component.css',
})
export class NewSale2Component {
  products$: Observable<Product[]>;
  cart$: Observable<CartItem[]>;
  search = '';
  selectedCategory = '';
  showMobileSummary = false;

  constructor(private saleService: SaleService) {
    this.products$ = this.saleService.products$;
    this.cart$ = this.saleService.cart$;
  }

  filterProducts(products: Product[]): Product[] {
    return products.filter(
      (p) =>
        (!this.search ||
          p.name.toLowerCase().includes(this.search.toLowerCase())) &&
        (!this.selectedCategory || p.category === this.selectedCategory)
    );
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
  }

  total(items: CartItem[]): number {
    return items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  }

  toggleMobileSummary() {
    this.showMobileSummary = !this.showMobileSummary;
  }
}
