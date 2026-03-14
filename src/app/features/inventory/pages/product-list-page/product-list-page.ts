import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, finalize, forkJoin, map } from 'rxjs';
import { StockBadge } from '../../components/stock-badge/stock-badge';
import { ModalService } from '../../../../shared/services/modal-service';
import { ProductFilterDialog } from '../../components/product-filter-dialog/product-filter-dialog';
import { SlideToggle } from '../../../../shared/ui/slide-toggle/slide-toggle';
import { ToastService } from '../../../../shared/services/toast-service';

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
  private readonly toast = inject(ToastService);

  searchTerm = signal('');
  currentPage = signal(0);
  pageSize = signal(10);
  currentFilters = signal<any>(null);

  products = this.productService.products;
  totalElements = this.productService.totalElements;
  isLoading = this.productService.isLoading;

  showExportMenu = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.export-container')) {
      this.showExportMenu.set(false);
    }
  }

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

  exportData(format: 'excel' | 'pdf'): void {
    this.showExportMenu.set(false);

    const filtersForExport = {
      query: this.searchTerm().trim(),
      ...this.currentFilters(),
    };

    this.productService.exportInventory(format, filtersForExport).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const extension = format === 'excel' ? 'xlsx' : 'pdf';
        const filename = `inventario_${new Date().toISOString().split('T')[0]}.${extension}`;

        a.download = filename;
        a.click();

        window.URL.revokeObjectURL(url);
        this.toast.success(
          'Descarga iniciada',
          `El archivo ${filename} se ha generado correctamente.`,
        );
      },
      error: (err) => {
        console.error('Error al exportar:', err);
        this.toast.error('Error', 'No se pudo generar el archivo de exportación.');
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
