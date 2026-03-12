import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { StockBadge } from '../../components/stock-badge/stock-badge';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe, StockBadge, NgOptimizedImage],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly productService = inject(ProductService);

  searchTerm = signal('');
  currentPage = signal(0);
  pageSize = signal(10);

  products = this.productService.products;
  isLoading = this.productService.isLoading;
  totalElements = this.productService.totalElements;

  private debouncedSearch = toObservable(this.searchTerm).pipe(
    debounceTime(400),
    distinctUntilChanged(),
  );

  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  filteredProducts = this.products;

  constructor() {
    this.debouncedSearch.subscribe(() => {
      this.currentPage.set(0);
      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    const params = {
      query: this.searchTerm().trim(),
    };

    this.productService.findAll(params, this.currentPage(), this.pageSize()).subscribe({
      error: (err) => {
        console.error('Error fetching products', err);
      },
    });
  }

  getRelativePath(fullUrl: string): string {
    if (!fullUrl) return '';
    const parts = fullUrl.split('/upload/');
    if (parts.length > 1) {
      return parts[1];
    }
    return fullUrl;
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  exportInventory(): void {
    const currentQuery = this.searchTerm().trim();

    this.productService.exportToExcel(currentQuery).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const date = new Date().toISOString().split('T')[0];
        a.download = `inventario_${date}.xlsx`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error al exportar el inventario', err);
        alert('No se pudo generar el reporte. Intente más tarde.');
      },
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
      error: (err) => console.error('Error toggling status', err),
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        error: (err) => console.error('Error deleting product', err),
      });
    }
  }
}
