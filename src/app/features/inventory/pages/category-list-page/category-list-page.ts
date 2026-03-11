import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { LineService } from '../../services/line-service';
import { CategoryService } from '../../services/category-service';
import { CategoryFormModal } from '../../components/category-form-modal/category-form-modal';
import { Category, CategoryPayload, Line } from '../../../../core/models/catalog.model';
import { LineFormModal } from '../../components/line-form-modal/line-form-modal';

@Component({
  selector: 'app-category-list-page',
  imports: [CategoryFormModal, LineFormModal],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListPage implements OnInit {
  private readonly lineService = inject(LineService);
  private readonly categoryService = inject(CategoryService);

  inventoryLines = this.lineService.lines;
  isLoading = this.lineService.isLoading;

  showModal = signal(false);
  selectedLineId = signal<number | null>(null);
  selectedCategory = signal<Category | null>(null);

  showLineModal = signal(false);
  selectedLine = signal<Line | null>(null);

  ngOnInit(): void {
    this.loadInitialData();
  }

  openModal(lineId: number) {
    this.selectedCategory.set(null);
    this.selectedLineId.set(lineId);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedCategory.set(null);
    this.selectedLineId.set(null);
  }

  handleSave(formData: { name: string; description: string }) {
    const lineId = this.selectedLineId();
    const category = this.selectedCategory();

    if (lineId === null) {
      console.error('No hay un LineId seleccionado');
      return;
    }

    const payload: CategoryPayload = {
      ...formData,
      lineId: lineId,
    };

    if (category) {
      this.categoryService.update(category.id, payload).subscribe(() => {
        this.closeModal();
        this.loadInitialData();
      });
    } else {
      this.categoryService.save(payload).subscribe(() => {
        this.closeModal();
        this.loadInitialData();
      });
    }
  }

  loadInitialData(): void {
    this.lineService.findAll(0, 50).subscribe();
  }

  addNewLine(): void {
    this.selectedLine.set(null);
    this.showLineModal.set(true);
  }

  addNewCategory(): void {
    console.log('Nueva categoría disparada');
  }

  editCategory(id: number, lineId: number): void {
    this.categoryService.findById(id).subscribe((category) => {
      this.selectedCategory.set(category);
      this.selectedLineId.set(lineId);
      this.showModal.set(true);
    });
  }

  configureLine(id: number): void {
    this.lineService.findById(id).subscribe((line) => {
      this.selectedLine.set(line);
      this.showLineModal.set(true);
    });
  }

  handleLineSave(formData: { name: string; description: string }) {
    const line = this.selectedLine();

    if (line) {
      // UPDATE
      this.lineService.update(line.id, formData).subscribe(() => {
        this.closeLineModal();
        this.loadInitialData();
      });
    } else {
      // CREATE
      this.lineService.save(formData).subscribe(() => {
        this.closeLineModal();
        this.loadInitialData();
      });
    }
  }

  closeLineModal() {
    this.showLineModal.set(false);
    this.selectedLine.set(null);
  }

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe();
    }
  }
}
