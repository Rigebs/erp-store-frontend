import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { UnitMeasure } from '../../../../core/models/catalog.model';
import { UnitMeasureService } from '../../services/unit-measure-service';
import { SlideToggle } from '../../../../shared/ui/slide-toggle/slide-toggle';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UnitMeasureFormModal } from '../../components/unit-measure-form-modal/unit-measure-form-modal';

@Component({
  selector: 'app-unit-measure-list-page',
  standalone: true,
  imports: [CommonModule, SlideToggle, UnitMeasureFormModal],
  templateUrl: './unit-measure-list-page.html',
  styleUrl: './unit-measure-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitMeasureListPage implements OnInit {
  private readonly unitService = inject(UnitMeasureService);

  units = this.unitService.units;
  isLoading = this.unitService.isLoading;
  totalElements = this.unitService.totalElements;

  isModalOpen = signal(false);
  selectedUnit = signal<UnitMeasure | null>(null);

  currentPage = signal(0);
  pageSize = signal(10);
  searchTerm = signal('');

  // Lógica de navegación
  canNext = computed(() => (this.currentPage() + 1) * this.pageSize() < this.totalElements());
  canPrev = computed(() => this.currentPage() > 0);

  // Texto informativo: "1-10 de 45"
  showingRange = computed(() => {
    const start = this.currentPage() * this.pageSize() + 1;
    const end = Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements());
    return `${start} - ${end}`;
  });

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadUnits();
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm.set(term);
      this.currentPage.set(0);
      this.loadUnits();
    });
  }

  onCreateUnit(): void {
    this.selectedUnit.set(null); // Reset por si había algo seleccionado
    this.isModalOpen.set(true);
  }

  loadUnits(): void {
    this.unitService.findAll(this.currentPage(), this.pageSize(), this.searchTerm()).subscribe();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.currentPage.set(0);
    this.loadUnits();
  }

  nextPage(): void {
    if (this.canNext()) {
      this.currentPage.update((p) => p + 1);
      this.loadUnits();
    }
  }
  prevPage(): void {
    if (this.canPrev()) {
      this.currentPage.update((p) => p - 1);
      this.loadUnits();
    }
  }

  onSaveUnit(unitData: Omit<UnitMeasure, 'id'>): void {
    const unitToEdit = this.selectedUnit();

    if (unitToEdit?.id) {
      // Lógica de Edición
      this.unitService.update(unitToEdit.id, unitData).subscribe({
        next: () => {
          this.onCloseModal();
          this.loadUnits(); // Recargar tabla
        },
      });
    } else {
      // Lógica de Creación
      this.unitService.save(unitData).subscribe({
        next: () => {
          this.onCloseModal();
          this.loadUnits(); // Recargar tabla
        },
      });
    }
  }

  onEditUnit(unit: UnitMeasure): void {
    this.selectedUnit.set(unit);
    this.isModalOpen.set(true);
  }

  onCloseModal(): void {
    this.isModalOpen.set(false);
    this.selectedUnit.set(null);
  }

  onToggleStatus(id: number): void {
    this.unitService.toggleStatus(id).subscribe();
  }
}
