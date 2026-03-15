import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { BrandService } from '../../services/brand-service';
import { SlideToggle } from '../../../../shared/ui/slide-toggle/slide-toggle';
import { Brand } from '../../../../core/models/catalog.model';
import { ModalService } from '../../../../shared/services/modal-service';
import { BrandFormModal } from '../../components/brand-form-modal/brand-form-modal';

@Component({
  selector: 'app-brand-management',
  imports: [CommonModule, FormsModule, SlideToggle],
  templateUrl: './brand-list-page.html',
  styleUrls: ['./brand-list-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandlistPage implements OnInit {
  private readonly brandService = inject(BrandService);
  private readonly modalService = inject(ModalService);

  brands = this.brandService.brands;
  isLoading = this.brandService.isLoading;
  totalElements = this.brandService.totalElements;

  searchTerm = signal('');
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');
  currentPage = signal(0);
  pageSize = signal(10);

  canNext = computed(() => (this.currentPage() + 1) * this.pageSize() < this.totalElements());
  canPrev = computed(() => this.currentPage() > 0);

  showingRange = computed(() => {
    const start = this.currentPage() * this.pageSize() + 1;
    const end = Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements());
    return `${start} - ${end}`;
  });

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadBrands();
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm.set(term);
      this.currentPage.set(0);
      this.loadBrands();
    });
  }

  loadBrands(): void {
    this.brandService.findAll(this.currentPage(), this.pageSize(), this.searchTerm()).subscribe();
  }

  openBrandModal(brand?: Brand): void {
    const modal$ = this.modalService.open(BrandFormModal, {
      brand: brand ?? null,
    });

    modal$.subscribe((result) => {
      if (!result) return;

      const request$: Observable<unknown> = result.id
        ? this.brandService.update(result.id, result)
        : this.brandService.save(result);

      request$.subscribe(() => this.loadBrands());
    });
  }

  toggleBrandStatus(brand: Brand): void {
    this.brandService.toggleStatus(brand.id).subscribe({
      error: (err) => {
        console.error('Error al cambiar el estado:', err);
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.currentPage.set(0);
    this.loadBrands();
  }

  nextPage(): void {
    if (this.canNext()) {
      this.currentPage.update((p) => p + 1);
      this.loadBrands();
    }
  }

  prevPage(): void {
    if (this.canPrev()) {
      this.currentPage.update((p) => p - 1);
      this.loadBrands();
    }
  }
}
