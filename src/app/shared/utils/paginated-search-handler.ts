import { signal } from '@angular/core';
import { Observable } from 'rxjs';

export class PaginatedSearchHandler<T> {
  items = signal<T[]>([]);
  isFetching = signal(false);
  private page = signal(0);
  private hasMore = signal(true);
  private lastFilters = signal<any>(null);

  constructor(
    private fetchDataFn: (page: number, filters: any) => Observable<{ content: T[] }>,
    private pageSize: number = 20,
  ) {}

  load(page: number = 0, filters: any = this.lastFilters(), accumulate: boolean = false) {
    if (this.isFetching() && accumulate) return;

    this.isFetching.set(true);
    this.lastFilters.set(filters);

    this.fetchDataFn(page, filters).subscribe({
      next: (res) => {
        this.hasMore.set(res.content.length === this.pageSize);
        this.page.set(page);
        this.items.update((prev) => (accumulate ? [...prev, ...res.content] : res.content));
        this.isFetching.set(false);
      },
      error: () => this.isFetching.set(false),
    });
  }

  search(term: string = '') {
    this.load(0, term, false);
  }

  loadNext() {
    if (!this.hasMore()) return;
    this.load(this.page() + 1, this.lastFilters(), true);
  }

  ensureItemExists(item: T | null) {
    if (item && !this.items().some((existing: any) => existing.id === (item as any).id)) {
      this.items.update((prev) => [item, ...prev]);
    }
  }
}
