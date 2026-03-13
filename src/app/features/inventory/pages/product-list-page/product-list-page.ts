import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, forkJoin, map } from 'rxjs';
import { StockBadge } from '../../components/stock-badge/stock-badge';
import { ModalService } from '../../../../shared/services/modal-service';
import { ProductFilterDialog } from '../../components/product-filter-dialog/product-filter-dialog';
import { SlideToggle } from '../../../../shared/ui/slide-toggle/slide-toggle';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe, StockBadge, NgOptimizedImage, SlideToggle],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly productService = inject(ProductService);
  private readonly modalService = inject(ModalService);

  searchTerm = signal('');
  currentPage = signal(0);
  pageSize = signal(10);
  currentFilters = signal<any>(null);

  products = this.productService.products;
  totalElements = this.productService.totalElements;
  isLoading = this.productService.isLoading;

  private debouncedSearch = toObservable(this.searchTerm).pipe(
    debounceTime(400),
    distinctUntilChanged(),
  );

  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  constructor() {
    this.debouncedSearch.subscribe(() => {
      this.currentPage.set(0);
      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    const params = {
      query: this.searchTerm().trim(),
      ...this.currentFilters(),
    };

    this.productService.findAll(params, this.currentPage(), this.pageSize()).subscribe({
      error: (err) => console.error(err),
    });
  }

  openFilters(): void {
    this.modalService
      .open(ProductFilterDialog, {
        initialFilters: this.currentFilters(),
      })
      .subscribe((result) => {
        if (result) {
          this.currentFilters.set(result);
          this.currentPage.set(0);
          this.fetchProducts();
        }
      });
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  exportInventory(): void {
    this.productService.exportToExcel(this.searchTerm().trim()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => console.error(err),
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.fetchProducts();
    }
  }

  toggleStatus(id: number): void {
    this.productService.toggleEnabled(id).subscribe({
      error: (err) => console.error(err),
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        error: (err) => console.error(err),
      });
    }
  }

  getRelativePath(fullUrl: string): string {
    if (!fullUrl) return '';
    const parts = fullUrl.split('/upload/');
    return parts.length > 1 ? parts[1] : fullUrl;
  }
}
