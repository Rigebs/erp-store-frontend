import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../../core/models/catalog.model';
import { ProductSearch } from '../../components/product-search/product-search';
import { ProductCard } from '../../components/product-card/product-card';
import { CartSummary } from '../../components/cart-summary/cart-summary';
import { ProductService } from '../../../inventory/services/product-service';

@Component({
  selector: 'app-pos-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    ProductSearch,
    ProductCard,
    CartSummary,
  ],
  templateUrl: './pos-page.html',
  styleUrl: './pos-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosPage implements OnInit {
  private readonly productService = inject(ProductService);
  private scrollContainer = viewChild<ElementRef>('scrollContainer');

  // Señal local para acumular productos sin tocar el service
  #accumulatedProducts = signal<Product[]>([]);

  // Exponemos la señal acumulada al template
  products = computed(() => this.#accumulatedProducts());
  isLoading = this.productService.isLoading;

  cart = signal<(Product & { quantity: number })[]>([]);
  isPaymentModalOpen = signal(false);

  #currentPage = 0;
  #currentFilters = {};
  #hasMore = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(append = false): void {
    if (!append) {
      this.#currentPage = 0;
      this.#hasMore = true;
      // No limpiamos #accumulatedProducts aquí para evitar saltos visuales
      // hasta que llegue la respuesta (opcional)
    }

    if (!this.#hasMore || this.isLoading()) return;

    this.productService.findAll(this.#currentFilters, this.#currentPage, 20).subscribe((page) => {
      if (append) {
        // Acumulamos localmente
        this.#accumulatedProducts.update((prev) => [...prev, ...page.content]);
      } else {
        // Reset de búsqueda: reemplazamos todo
        this.#accumulatedProducts.set(page.content);
        this.scrollContainer()?.nativeElement.scrollTo(0, 0);
      }

      this.#hasMore = page.number + 1 < page.totalPages;
      this.#currentPage++;
    });
  }

  handleSearch(query: string): void {
    this.#currentFilters = { name: query };
    this.loadProducts(false);
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const threshold = 150;
    const position = element.scrollHeight - element.scrollTop - element.clientHeight;

    if (position < threshold && this.#hasMore && !this.isLoading()) {
      this.loadProducts(true);
    }
  }

  addToCart(product: Product): void {
    this.cart.update((items) => {
      const existingItem = items.find((i) => i.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return items;
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(index: number): void {
    this.cart.update((items) => items.filter((_, i) => i !== index));
  }

  clearCart(): void {
    this.cart.set([]);
  }

  totalCart = computed(() => {
    const subtotal = this.cart().reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
    return subtotal * 1.16;
  });

  togglePaymentModal(state: boolean): void {
    if (state && this.cart().length === 0) return;
    this.isPaymentModalOpen.set(state);
  }

  processSale(): void {
    this.clearCart();
    this.togglePaymentModal(false);
  }
}
