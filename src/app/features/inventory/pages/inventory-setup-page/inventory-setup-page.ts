import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SetupCard } from '../../components/setup-card/setup-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-setup-page',
  imports: [SetupCard],
  templateUrl: './inventory-setup-page.html',
  styleUrl: './inventory-setup-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySetupPage {
  private readonly router = inject(Router);

  menuOptions = signal([
    {
      // Icono: Squares / Categories
      icon: 'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zm-11 0h7v7H3z',
      title: 'Categorías y Líneas',
      description: 'Organiza tus productos en jerarquías para reportes de ventas y filtrado.',
      stats: '24 categorías',
      link: '/inventory/setup/categories',
    },
    {
      icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
      title: 'Marcas',
      description: 'Administra los fabricantes y marcas comerciales para segmentar el catálogo.',
      stats: '15 marcas',
      link: '/inventory/setup/brands',
    },
    {
      icon: 'M21.3 8.11l-8.41 8.41a2 2 0 0 1-2.83 0L3.34 9.7a2 2 0 0 1 0-2.83l1.41-1.41a2 2 0 0 1 2.83 0l1.25 1.25 M8 11l2 2 M11 8l2 2 M14 5l2 2',
      title: 'Unidades de Medida',
      description: 'Define magnitudes de venta y compra (Kg, Un, Cajas) con sus conversiones.',
      stats: '8 unidades',
      link: '/inventory/setup/units-measure',
    },
  ]);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
