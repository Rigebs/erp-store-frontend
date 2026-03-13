import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, forkJoin, map } from 'rxjs';
import { StockBadge } from '../../components/stock-badge/stock-badge';
import { ModalService } from '../../../../shared/services/modal-service';
import { ProductFilterDialog } from '../../components/product-filter-dialog/product-filter-dialog';
import { CategoryService } from '../../services/category-service';
import { BrandService } from '../../services/brand-service';
import { UnitMeasureService } from '../../services/unit-measure-service';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe, StockBadge, NgOptimizedImage],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly unitService = inject(UnitMeasureService);
  private readonly modalService = inject(ModalService);

  categoryPage = signal(0);
  brandPage = signal(0);
  unitPage = signal(0);

  modalCategories = signal<any[]>([]);
  modalBrands = signal<any[]>([]);
  modalUnits = signal<any[]>([]);

  isFetchingCategories = signal(false);
  hasMoreCategories = signal(true);
  isFetchingBrands = signal(false);
  hasMoreBrands = signal(true);
  isFetchingUnits = signal(false);
  hasMoreUnits = signal(true);

  searchTerm = signal('');
  currentPage = signal(0);
  pageSize = signal(10);

  products = this.productService.products;
  totalElements = this.productService.totalElements;
  isLoading = this.productService.isLoading;
  currentFilters = signal<any>(null);

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
      ...(this.currentFilters() || {}),
    };

    this.productService.findAll(params, this.currentPage(), this.pageSize()).subscribe({
      error: (err) => console.error('Error fetching products', err),
    });
  }

  openFilters(): void {
    this.resetModalStates();

    forkJoin({
      categories: this.categoryService.findAll(0, 20).pipe(map((res) => res.content)),
      brands: this.brandService.findAll(0, 20).pipe(map((res) => res.content)),
      units: this.unitService.findAll(0, 20).pipe(map((res) => res.content)),
    }).subscribe({
      next: (data) => {
        this.modalCategories.set(data.categories);
        this.modalBrands.set(data.brands);
        this.modalUnits.set(data.units);

        this.modalService
          .open(ProductFilterDialog, {
            categories: this.modalCategories(),
            brands: this.modalBrands(),
            unitMeasures: this.modalUnits(),
            initialFilters: this.currentFilters(),
            onNextCategories: (term: string) => this.loadMoreCategories(term),
            onNextBrands: (term: string) => this.loadMoreBrands(term),
            onNextUnits: (term: string) => this.loadMoreUnits(term),
          })
          .subscribe((result) => {
            if (result) {
              this.currentFilters.set(result);
              this.currentPage.set(0);
              this.fetchProducts();
            }
          });
      },
      error: (err) => console.error('Error inicializando filtros', err),
    });
  }

  private resetModalStates(): void {
    this.categoryPage.set(0);
    this.brandPage.set(0);
    this.unitPage.set(0);
    this.hasMoreCategories.set(true);
    this.hasMoreBrands.set(true);
    this.hasMoreUnits.set(true);
    this.isFetchingCategories.set(false);
    this.isFetchingBrands.set(false);
    this.isFetchingUnits.set(false);
  }

  private loadMoreCategories(term: string): void {
    if (this.isFetchingCategories() || !this.hasMoreCategories()) return;

    this.isFetchingCategories.set(true);
    const nextPage = this.categoryPage() + 1;

    this.categoryService.findAll(nextPage, 20).subscribe({
      next: (res) => {
        if (res.content.length < 20) this.hasMoreCategories.set(false);
        if (res.content.length > 0) {
          this.categoryPage.set(nextPage);
          this.modalCategories.update((current) => [...current, ...res.content]);
        }
        this.isFetchingCategories.set(false);
      },
      error: () => this.isFetchingCategories.set(false),
    });
  }

  private loadMoreBrands(term: string): void {
    if (this.isFetchingBrands() || !this.hasMoreBrands()) return;

    this.isFetchingBrands.set(true);
    const nextPage = this.brandPage() + 1;

    this.brandService.findAll(nextPage, 20).subscribe({
      next: (res) => {
        if (res.content.length < 20) this.hasMoreBrands.set(false);
        if (res.content.length > 0) {
          this.brandPage.set(nextPage);
          this.modalBrands.update((current) => [...current, ...res.content]);
        }
        this.isFetchingBrands.set(false);
      },
      error: () => this.isFetchingBrands.set(false),
    });
  }

  private loadMoreUnits(term: string): void {
    if (this.isFetchingUnits() || !this.hasMoreUnits()) return;

    this.isFetchingUnits.set(true);
    const nextPage = this.unitPage() + 1;

    this.unitService.findAll(nextPage, 20).subscribe({
      next: (res) => {
        if (res.content.length < 20) this.hasMoreUnits.set(false);
        if (res.content.length > 0) {
          this.unitPage.set(nextPage);
          this.modalUnits.update((current) => [...current, ...res.content]);
        }
        this.isFetchingUnits.set(false);
      },
      error: () => this.isFetchingUnits.set(false),
    });
  }

  getRelativePath(fullUrl: string): string {
    if (!fullUrl) return '';
    const parts = fullUrl.split('/upload/');
    return parts.length > 1 ? parts[1] : fullUrl;
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
        a.download = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error al exportar el inventario', err);
        alert('No se pudo generar el reporte.');
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
