import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
} from 'rxjs';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { CartSummaryComponent } from '../components/cart-summary/cart-summary.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductResponse } from '../../catalog/models/product';
import { CategoryResponse } from '../../catalog/models/category';
import { CategoryService } from '../../catalog/services/category.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../../catalog/services/product.service';
import { CartItem } from '../models/cart-item';
import { SaleRequest } from '../models/request/sale-request';
import { SaleService } from '../services/sale.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomerResponse } from '../../customers/models/customer';
import { MatDialog } from '@angular/material/dialog';
import { AssignCustomerDialogComponent } from '../components/assign-customer-dialog/assign-customer-dialog.component';

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [
    ProductCardComponent,
    CartSummaryComponent,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './new-sale.component.html',
  styleUrl: './new-sale.component.css',
})
export class NewSaleComponent implements OnInit {
  products: ProductResponse[] = [];
  productsPage = 0;
  productsSize = 10;
  loading = false;
  allLoaded = false;

  cart$: Observable<CartItem[]>;
  categories$: Observable<CategoryResponse[]>;
  search = '';
  searchSubject = new Subject<string>();
  selectedCategoryId?: number;
  showMobileSummary = false;

  selectedCustomer: CustomerResponse | null = null;

  constructor(
    private cartService: CartService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private saleService: SaleService,
    private dialog: MatDialog
  ) {
    this.cart$ = this.cartService.cart$;
    this.categories$ = this.categoryService
      .findAll(0, 50)
      .pipe(map((res) => res.data.content));
  }

  ngOnInit() {
    this.loadMoreProducts();
    this.searchSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => this.resetAndLoad());
  }

  openAssignCustomer(): void {
    const ref = this.dialog.open(AssignCustomerDialogComponent, {
      width: '520px',
      data: { selectedCustomer: this.selectedCustomer },
    });

    ref
      .afterClosed()
      .subscribe((result: CustomerResponse | null | undefined) => {
        if (result === undefined) {
          return;
        }
        this.selectedCustomer = result;
        console.log(result);
      });
  }

  clearCustomer(): void {
    this.selectedCustomer = null; // sale customerId = null
  }

  loadMoreProducts() {
    if (this.loading || this.allLoaded) return;

    this.loading = true;

    this.productService
      .findAll(this.productsPage, this.productsSize, ['id,desc'], {
        query: this.search,
        categoryId: this.selectedCategoryId,
      })
      .pipe(map((res) => res.data))
      .subscribe({
        next: (page) => {
          if (page.content.length === 0) {
            this.allLoaded = true;
          } else {
            this.products = [...this.products, ...page.content];
            this.productsPage++;

            if (this.products.length >= page.totalElements) {
              this.allLoaded = true;
            }
          }
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onScroll(e: Event) {
    const target = e.target as HTMLElement;
    const atBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 50;
    if (atBottom) this.loadMoreProducts();
  }

  setCategory(catId?: number) {
    this.selectedCategoryId = catId;
    this.resetAndLoad();
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  private resetAndLoad() {
    this.products = [];
    this.productsPage = 0;
    this.allLoaded = false;
    this.loadMoreProducts();
  }

  total(items: CartItem[]): number {
    return items.reduce((acc, i) => acc + i.product.salePrice * i.quantity, 0);
  }

  toggleMobileSummary() {
    this.showMobileSummary = !this.showMobileSummary;
  }

  onSaleGenerated(sale: SaleRequest) {
    sale.customerId = this.selectedCustomer ? this.selectedCustomer.id : null;

    this.saleService.save(sale).subscribe({
      next: (data) => {
        console.log('se generó la venta', data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
