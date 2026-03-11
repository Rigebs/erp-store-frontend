import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import { ModalService } from '../../../../shared/services/modal-service';
import { InventoryFiltersModal } from '../../components/inventory-filters-modal/inventory-filters-modal';
import { ProductService } from '../../services/product-service';
import { WarehouseService } from '../../services/warehouse-service';
import { InventoryMovementFormModal } from '../../components/inventory-movement-form-modal/inventory-movement-form-modal';

@Component({
  selector: 'app-inventory-movements',
  imports: [CommonModule],
  templateUrl: './inventory-movements-page.html',
  styleUrls: ['./inventory-movements-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryMovementsPage implements OnInit {
  private inventoryService = inject(InventoryService);
  private warehouseService = inject(WarehouseService);
  private productService = inject(ProductService);
  private modalService = inject(ModalService);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  movements = signal<any[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);

  currentPage = signal(0);
  pageSize = signal(10);
  typeFilter = signal<string>('Todos');
  warehouseFilter = signal<number | undefined>(undefined);
  dateFilter = signal<string>('');
  searchQuery = signal<string>('');

  products = this.productService.products;
  warehouses = this.warehouseService.warehouses;

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.typeFilter() !== 'Todos') count++;
    if (this.warehouseFilter() !== undefined) count++;
    if (this.dateFilter() !== '') count++;
    return count;
  });

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchQuery.set(value);
        this.currentPage.set(0);
        this.loadMovements();
      });

    this.loadMovements();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMovements() {
    const filter = {
      page: this.currentPage(),
      size: this.pageSize(),
      type: this.typeFilter() !== 'Todos' ? this.typeFilter() : undefined,
      warehouseId: this.warehouseFilter(),
      dateFrom: this.dateFilter() || undefined,
      searchTerm: this.searchQuery() || undefined,
    };

    this.inventoryService.getAllMovements(filter).subscribe({
      next: (response) => {
        this.movements.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
      },
    });
  }

  loadCatalog() {
    this.productService.findAll({}, 0, 100).subscribe();

    this.warehouseService.findAll({}, 0, 100).subscribe();
  }

  openFilters() {
    this.modalService
      .open(InventoryFiltersModal, {
        type: this.typeFilter(),
        warehouseId: this.warehouseFilter(),
        dateFrom: this.dateFilter(),
      })
      .subscribe((result) => {
        if (result) {
          this.typeFilter.set(result.type);
          this.warehouseFilter.set(result.warehouseId);
          this.dateFilter.set(result.dateFrom);
          this.currentPage.set(0);
          this.loadMovements();
        }
      });
  }

  openForm() {
    forkJoin({
      products: this.productService.findAll({}, 0, 100),
      warehouses: this.warehouseService.findAll({}, 0, 100),
    }).subscribe({
      next: () => {
        this.modalService
          .open(InventoryMovementFormModal, {
            products: this.products(),
            warehouses: this.warehouses(),
          })
          .subscribe((formData) => {
            if (formData) {
              this.saveMovement(formData);
            }
          });
      },
      error: (err) => console.error('Error al cargar catálogo:', err),
    });
  }

  private saveMovement(payload: any) {
    this.inventoryService.createMovement(payload).subscribe({
      next: () => {
        this.currentPage.set(0);
        this.loadMovements();
      },
      error: (err) => console.error('Error al guardar movimiento:', err),
    });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.currentPage.set(newPage);
      this.loadMovements();
    }
  }

  getBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      IN: 'bg-in',
      OUT: 'bg-out',
      TRANSFER: 'bg-trans',
    };
    return classes[type] || 'bg-default';
  }
}
