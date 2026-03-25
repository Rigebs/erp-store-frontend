import { CommonModule } from '@angular/common';
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
import { ModalService } from '../../../../shared/services/modal-service';
import { CustomerModal } from '../../components/customer-modal/customer-modal';
import { ToastService } from '../../../../shared/services/toast-service';
import { CheckoutModal } from '../../components/checkout-modal/checkout-modal';
import {
  Customer,
  SaleStatus,
  SalePayload,
  PaymentMethod,
} from '../../../../core/models/sales.model';
import { SaleService } from '../../services/sale-service';

interface CartItem extends Product {
  quantity: number;
  discount: number;
}

interface PendingSale {
  id: string;
  timestamp: Date;
  items: CartItem[];
  customer: any;
  total: number;
}

@Component({
  selector: 'app-pos-page',
  imports: [CommonModule, ReactiveFormsModule, ProductSearch, ProductCard, CartSummary],
  templateUrl: './pos-page.html',
  styleUrl: './pos-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly saleService = inject(SaleService);
  private readonly modalService = inject(ModalService);
  private readonly toast = inject(ToastService);

  private scrollContainer = viewChild<ElementRef>('scrollContainer');

  #accumulatedProducts = signal<Product[]>([]);
  products = computed(() => this.#accumulatedProducts());
  isLoading = computed(() => this.productService.isLoading() || this.saleService.isLoading());

  pendingSales = signal<PendingSale[]>([]);
  cart = signal<CartItem[]>([]);
  globalDiscount = signal(0);
  showPendingMenu = false;

  currentUser = signal({ name: 'Admin User', role: 'Cajero' });
  selectedCustomer = signal<Customer>({
    id: 0,
    enabled: true,
    person: {
      id: 0,
      name: 'Consumidor Final',
      paternalName: '',
      maternalName: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  totals = computed(() => {
    const items = this.cart();
    const subtotalWithItemDiscounts = items.reduce((acc, item) => {
      const priceWithDiscount = item.salePrice * (1 - item.discount / 100);
      return acc + priceWithDiscount * item.quantity;
    }, 0);

    const discountAmount = subtotalWithItemDiscounts * (this.globalDiscount() / 100);
    const totalBeforeTax = subtotalWithItemDiscounts - discountAmount;

    return {
      subtotal: subtotalWithItemDiscounts,
      discount: discountAmount,
      tax: totalBeforeTax * 0.16,
      total: totalBeforeTax * 1.16,
    };
  });

  totalCart = computed(() => this.totals().total);

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
    }
    if (!this.#hasMore || this.productService.isLoading()) return;

    this.productService.findAll(this.#currentFilters, this.#currentPage, 20).subscribe((page) => {
      if (append) {
        this.#accumulatedProducts.update((prev) => [...prev, ...page.content]);
      } else {
        this.#accumulatedProducts.set(page.content);
        this.scrollContainer()?.nativeElement.scrollTo(0, 0);
      }
      this.#hasMore = page.number + 1 < page.totalPages;
      this.#currentPage++;
    });
  }

  addToCart(product: Product): void {
    if (product.stock <= 0) {
      this.toast.error('Sin Stock', `El producto ${product.name} no tiene unidades disponibles.`);
      return;
    }

    this.cart.update((items) => {
      const existingItem = items.find((i) => i.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
          this.toast.warning('Límite de Stock', `Solo hay ${product.stock} unidades.`);
          return items;
        }
      }
      return [...items, { ...product, quantity: 1, discount: 0 }];
    });
  }

  handleSearch(query: string): void {
    this.#currentFilters = { query: query };
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

  updateQuantity(index: number, newQuantity: number): void {
    this.cart.update((items) => {
      const item = items[index];
      if (newQuantity > item.stock) {
        this.toast.warning('Stock insuficiente', `Máximo: ${item.stock}`);
        newQuantity = item.stock;
      }
      if (newQuantity <= 0) return items.filter((_, i) => i !== index);
      return items.map((it, i) => (i === index ? { ...it, quantity: newQuantity } : it));
    });
  }

  updateItemDiscount(index: number, discountPercent: number): void {
    this.cart.update((items) =>
      items.map((it, i) =>
        i === index ? { ...it, discount: Math.min(100, Math.max(0, discountPercent)) } : it,
      ),
    );
  }

  removeFromCart(index: number): void {
    this.cart.update((items) => items.filter((_, i) => i !== index));
  }

  clearCart(): void {
    this.cart.set([]);
    this.selectedCustomer.set({
      id: 0,
      enabled: true,
      person: {
        id: 0,
        name: 'Consumidor Final',
        paternalName: '',
        maternalName: '',
        email: '',
        phone: '',
        address: '',
      },
    });
  }

  openCustomerModal(): void {
    this.modalService.open(CustomerModal).subscribe((customer) => {
      if (customer) this.selectedCustomer.set(customer);
    });
  }

  openCheckout(): void {
    if (this.cart().length === 0) return;

    const currentTotals = this.totals();
    const currentCustomer = this.selectedCustomer();

    this.modalService
      .open(CheckoutModal, {
        total: currentTotals.total,
        customer: currentCustomer,
      })
      .subscribe((result) => {
        if (!result) return;

        if (result.status === SaleStatus.PAID || result.status === SaleStatus.CREDIT) {
          this.processSale(result);
        } else if (result.status === SaleStatus.PENDING) {
          this.saveToPending();
        }
      });
  }

  private processSale(checkoutResult: any): void {
    const payload: SalePayload = {
      subtotal: this.totals().subtotal,
      tax: this.totals().tax,
      discount: this.totals().discount,
      total: this.totals().total,
      status: checkoutResult.status as SaleStatus,
      documentType: checkoutResult.documentType || 'TICKET',
      customerId: this.selectedCustomer().id !== 0 ? this.selectedCustomer().id : null,
      saleDetails: this.cart().map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.salePrice,
        discountAmount: item.salePrice * (item.discount / 100) * item.quantity,
        totalPrice: item.salePrice * (1 - item.discount / 100) * item.quantity,
      })),
      paymentMethods: checkoutResult.payments.map((p: any) => ({
        method: p.method as PaymentMethod,
        amount: p.amount,
      })),
    };

    this.saleService.save(payload).subscribe({
      next: () => {
        this.clearCart();
        this.loadProducts(false);
      },
    });
  }

  private saveToPending(): void {
    const newPendingSale: PendingSale = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date(),
      items: this.cart(),
      customer: this.selectedCustomer(),
      total: this.totalCart(),
    };

    this.pendingSales.update((sales) => [newPendingSale, ...sales]);
    this.toast.info('Venta en Espera', `Código: ${newPendingSale.id}`);
    this.clearCart();
  }

  resumeSale(sale: PendingSale): void {
    if (this.cart().length > 0) {
      this.toast.warning(
        'Carrito ocupado',
        'Limpia el carrito actual antes de recuperar una venta.',
      );
      return;
    }

    this.cart.set(sale.items);
    this.selectedCustomer.set(sale.customer);
    this.pendingSales.update((sales) => sales.filter((s) => s.id !== sale.id));
    this.toast.success('Venta Recuperada', `Sesión ${sale.id} cargada.`);
  }
}
