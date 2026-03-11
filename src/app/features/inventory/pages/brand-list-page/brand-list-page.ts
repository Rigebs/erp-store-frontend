import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Brand {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  linkedProducts: number;
}

@Component({
  selector: 'app-brand-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-list-page.html',
  styleUrls: ['./brand-list-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'container',
  },
})
export class BrandlistPage {
  brands = signal<Brand[]>([
    { id: '1', name: 'Apple Inc.', status: 'active', linkedProducts: 12 },
    { id: '2', name: 'Samsung', status: 'active', linkedProducts: 45 },
    { id: '3', name: 'Dell Technologies', status: 'active', linkedProducts: 28 },
    { id: '4', name: 'Sony (Legacy)', status: 'inactive', linkedProducts: 0 },
    { id: '5', name: 'HP Enterprise', status: 'active', linkedProducts: 19 },
  ]);

  searchTerm = signal('');
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');

  filteredBrands = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const filter = this.statusFilter();

    return this.brands().filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(term);
      const matchesStatus = filter === 'all' || brand.status === filter;
      return matchesSearch && matchesStatus;
    });
  });

  totalBrands = computed(() => this.brands().length);
  showingCount = computed(() => this.filteredBrands().length);

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value as any);
  }
}
