import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';
import { SelectSearchable } from '../../../../shared/ui/select-searchable/select-searchable';
import { ModalService } from '../../../../shared/services/modal-service';

@Component({
  selector: 'app-product-filter-dialog',
  imports: [ReactiveFormsModule, ModalContainer, SelectSearchable],
  templateUrl: './product-filter-dialog.html',
  styleUrl: './product-filter-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterDialog {
  applyFilters = output<any>();
  onNextCategories = input<(term: string) => void>(() => {});
  onNextBrands = input<(term: string) => void>(() => {});
  onNextUnits = input<(term: string) => void>(() => {});

  private readonly fb = inject(NonNullableFormBuilder);

  private readonly modalService = inject(ModalService);

  categories = input<any[]>([]);
  brands = input<any[]>([]);
  unitMeasures = input<any[]>([]);
  initialFilters = input<any>(null);

  filterForm = this.fb.group({
    category: [null as any],
    brand: [null as any],
    unitMeasure: [null as any],
    minPrice: [null as number | null],
    maxPrice: [null as number | null],
    enabled: [null as boolean | null],
  });

  constructor() {
    effect(() => {
      const filters = this.initialFilters();
      if (filters) {
        this.filterForm.patchValue(filters);
      }
    });
  }
  // En el HTML o aquí, llamamos a la función recibida
  handleNextCategories(term: string) {
    this.onNextCategories()(term); // Llamamos a la función que viene por el input
  }

  handleNextBrands(term: string) {
    this.onNextBrands()(term);
  }

  handleNextUnits(term: string) {
    this.onNextUnits()(term);
  }

  onApply(): void {
    const rawValue = this.filterForm.getRawValue();
    const formattedFilters = {
      categoryId: rawValue.category?.id || null,
      brandId: rawValue.brand?.id || null,
      unitMeasureId: rawValue.unitMeasure?.id || null,
      minPrice: rawValue.minPrice,
      maxPrice: rawValue.maxPrice,
      enabled: rawValue.enabled,
    };
    this.modalService.close(formattedFilters);
  }

  onReset(): void {
    this.filterForm.reset();
  }

  close(): void {
    this.modalService.close();
  }
}
