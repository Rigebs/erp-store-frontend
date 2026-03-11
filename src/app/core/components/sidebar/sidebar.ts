import { Component, ChangeDetectionStrategy, signal, output, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  iconSvgPath: string;
  route: string;
  children?: Omit<NavItem, 'iconSvgPath' | 'children'>[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-collapsed]': 'isCollapsed()',
    role: 'navigation',
    'aria-label': 'Main Sidebar',
  },
})
export class Sidebar {
  items = input.required<NavItem[]>();
  isCollapsed = signal(false);
  expandedItems = signal<Record<string, boolean>>({});

  collapsedChanged = output<boolean>();

  toggleSidebar(): void {
    this.isCollapsed.update((v) => !v);
    this.collapsedChanged.emit(this.isCollapsed());
    if (this.isCollapsed()) {
      this.expandedItems.set({});
    }
  }

  toggleSubmenu(route: string, event: Event): void {
    if (this.isCollapsed()) {
      this.isCollapsed.set(false);
      this.collapsedChanged.emit(false);
      this.expandedItems.update((prev) => ({ ...prev, [route]: true }));
      return;
    }

    this.expandedItems.update((prev) => ({
      ...prev,
      [route]: !prev[route],
    }));
  }

  isExpanded(route: string): boolean {
    return !!this.expandedItems()[route];
  }
}
