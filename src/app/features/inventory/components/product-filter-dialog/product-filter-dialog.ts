import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';
import { SelectSearchable } from '../../../../shared/ui/select-searchable/select-searchable';
import { ModalService } from '../../../../shared/services/modal-service';
import { forkJoin, map } from 'rxjs';
import { BrandService } from '../../services/brand-service';
import { CategoryService } from '../../services/category-service';
import { UnitMeasureService } from '../../services/unit-measure-service';

@Component({
  selector: 'app-product-filter-dialog',
  imports: [ReactiveFormsModule, ModalContainer, SelectSearchable],
  templateUrl: './product-filter-dialog.html',
  styleUrl: './product-filter-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterDialog {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly unitService = inject(UnitMeasureService);

  initialFilters = input<any>(null);

  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  unitMeasures = signal<any[]>([]);

  isFetchingCategories = signal(false);
  isFetchingBrands = signal(false);
  isFetchingUnits = signal(false);

  private categoryPage = signal(0);
  private brandPage = signal(0);
  private unitPage = signal(0);

  private hasMoreCategories = signal(true);
  private hasMoreBrands = signal(true);
  private hasMoreUnits = signal(true);

  private lastCategoryTerm = signal('');
  private lastBrandTerm = signal('');
  private lastUnitTerm = signal('');

  filterForm = this.fb.group({
    category: [null as any],
    brand: [null as any],
    unitMeasure: [null as any],
    minPrice: [null as number | null],
    maxPrice: [null as number | null],
    enabled: [null as boolean | null],
  });

  constructor() {
    this.loadInitialData();

    effect(() => {
      const filters = this.initialFilters();
      if (filters) {
        // 1. Verificamos y agregamos elementos faltantes a las listas
        this.ensureSelectedItemsAreInLists(filters);

        // 2. Aplicamos los valores al formulario
        this.filterForm.patchValue(filters);
      }
    });
  }

  private ensureSelectedItemsAreInLists(filters: any) {
    // Lógica para Categoría
    if (filters.category && !this.categories().some((c) => c.id === filters.category.id)) {
      this.categories.update((prev) => [filters.category, ...prev]);
    }

    // Lógica para Marca
    if (filters.brand && !this.brands().some((b) => b.id === filters.brand.id)) {
      this.brands.update((prev) => [filters.brand, ...prev]);
    }

    // Lógica para Unidad de Medida
    if (filters.unitMeasure && !this.unitMeasures().some((u) => u.id === filters.unitMeasure.id)) {
      this.unitMeasures.update((prev) => [filters.unitMeasure, ...prev]);
    }
  }

  private loadInitialData() {
    forkJoin({
      categories: this.categoryService.findAll(0, 20).pipe(map((res) => res.content)),
      brands: this.brandService.findAll(0, 20).pipe(map((res) => res.content)),
      units: this.unitService.findAll(0, 20).pipe(map((res) => res.content)),
    }).subscribe((data) => {
      this.categories.set(data.categories);
      this.brands.set(data.brands);
      this.unitMeasures.set(data.units);
    });
  }

  handleSearchCategories(term: string) {
    const cleanTerm = (term ?? '').trim();
    this.lastCategoryTerm.set(cleanTerm);
    this.categoryPage.set(0);
    this.hasMoreCategories.set(true);

    this.categoryService.findAll(0, 20, cleanTerm).subscribe((res) => {
      this.categories.set(res.content);
      this.hasMoreCategories.set(res.content.length === 20);
    });
  }

  handleNextCategories() {
    if (this.isFetchingCategories() || !this.hasMoreCategories()) return;
    this.isFetchingCategories.set(true);
    const nextPage = this.categoryPage() + 1;

    this.categoryService.findAll(nextPage, 20, this.lastCategoryTerm()).subscribe({
      next: (res) => {
        this.hasMoreCategories.set(res.content.length === 20);
        if (res.content.length > 0) {
          this.categoryPage.set(nextPage);
          this.categories.update((prev) => [...prev, ...res.content]);
        }
        this.isFetchingCategories.set(false);
      },
      error: () => this.isFetchingCategories.set(false),
    });
  }

  handleSearchBrands(term: string) {
    const cleanTerm = (term ?? '').trim();
    this.lastBrandTerm.set(cleanTerm);
    this.brandPage.set(0);
    this.hasMoreBrands.set(true);

    this.brandService.findAll(0, 20, cleanTerm).subscribe((res) => {
      this.brands.set(res.content);
      this.hasMoreBrands.set(res.content.length === 20);
    });
  }

  handleNextBrands() {
    if (this.isFetchingBrands() || !this.hasMoreBrands()) return;
    this.isFetchingBrands.set(true);
    const nextPage = this.brandPage() + 1;

    this.brandService.findAll(nextPage, 20, this.lastBrandTerm()).subscribe({
      next: (res) => {
        this.hasMoreBrands.set(res.content.length === 20);
        if (res.content.length > 0) {
          this.brandPage.set(nextPage);
          this.brands.update((prev) => [...prev, ...res.content]);
        }
        this.isFetchingBrands.set(false);
      },
      error: () => this.isFetchingBrands.set(false),
    });
  }

  handleSearchUnits(term: string) {
    const cleanTerm = (term ?? '').trim();
    this.lastUnitTerm.set(cleanTerm);
    this.unitPage.set(0);
    this.hasMoreUnits.set(true);

    this.unitService.findAll(0, 20, cleanTerm).subscribe((res) => {
      this.unitMeasures.set(res.content);
      this.hasMoreUnits.set(res.content.length === 20);
    });
  }

  handleNextUnits() {
    if (this.isFetchingUnits() || !this.hasMoreUnits()) return;
    this.isFetchingUnits.set(true);
    const nextPage = this.unitPage() + 1;

    this.unitService.findAll(nextPage, 20, this.lastUnitTerm()).subscribe({
      next: (res) => {
        this.hasMoreUnits.set(res.content.length === 20);
        if (res.content.length > 0) {
          this.unitPage.set(nextPage);
          this.unitMeasures.update((prev) => [...prev, ...res.content]);
        }
        this.isFetchingUnits.set(false);
      },
      error: () => this.isFetchingUnits.set(false),
    });
  }

  onApply(): void {
    const val = this.filterForm.getRawValue();
    this.modalService.close({
      ...val,
      categoryId: val.category?.id || null,
      brandId: val.brand?.id || null,
      unitMeasureId: val.unitMeasure?.id || null,
    });
  }

  onReset(): void {
    this.filterForm.reset();
  }

  close(): void {
    this.modalService.close();
  }
}
