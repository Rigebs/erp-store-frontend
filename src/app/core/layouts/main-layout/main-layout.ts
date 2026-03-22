import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavItem, Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  isSidebarCollapsed = signal(false);
  isMobileOpen = signal(false);

  navItems = signal<NavItem[]>([
    {
      label: 'Dashboard',
      iconSvgPath: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
      route: '/dashboard',
    },
    {
      label: 'Inventario',
      // Icono de caja isométrica (basado en tu referencia)
      iconSvgPath:
        'M21 16.5c0 .38-.21.71-.53.88l-7.97 4.43c-.16.09-.33.14-.5.14s-.34-.05-.5-.14l-7.97-4.43A.997.997 0 013 16.5v-9c0-.38.21-.71.53-.88l7.97-4.43c.16-.09.33-.14.5-.14s.34.05.5.14l7.97 4.43c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.33v-6.71l-6-3.33v6.71z',
      route: '/inventory',
      children: [
        { label: 'Maestro de Artículos', route: '/inventory/products' },
        { label: 'Clasificación', route: '/inventory/setup' },
        { label: 'Almacenes (Multialmacén)', route: '/inventory/warehouses' },
        { label: 'Movimientos de Stock', route: '/inventory/movements' },
        { label: 'Alertas de Stock', route: '/inventory/alerts' },
      ],
    },
    {
      label: 'Ventas y POS',
      iconSvgPath:
        'M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6.5-6V9c0-3.07-1.63-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 3.36 6 5.92 6 9v7l-2 2v1h16v-1l-2-2z',
      route: '/sales',
      children: [
        { label: 'Terminal POS', route: '/sales/pos' }, // Interfaz rápida
        { label: 'Cotizaciones', route: '/sales/quotes' },
        { label: 'Facturación Electrónica', route: '/sales/invoices' },
        { label: 'Devoluciones', route: '/sales/returns' },
      ],
    },
    {
      label: 'Compras',
      iconSvgPath:
        'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
      route: '/purchases',
      children: [
        { label: 'Proveedores', route: '/purchases/suppliers' },
        { label: 'Órdenes de Compra', route: '/purchases/orders' },
        { label: 'Facturas de Compra', route: '/purchases/receive' },
      ],
    },
    {
      label: 'Tesorería',
      iconSvgPath:
        'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
      route: '/finance',
      children: [
        { label: 'Cuentas por Cobrar', route: '/finance/receivables' },
        { label: 'Cuentas por Pagar', route: '/finance/payables' },
        { label: 'Flujo de Caja', route: '/finance/cash-flow' },
        { label: 'Conciliación de Caja', route: '/finance/reconciliation' },
      ],
    },
    {
      label: 'Clientes (CRM)',
      iconSvgPath:
        'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      route: '/crm',
      children: [
        { label: 'Directorio Clientes', route: '/crm/directory' },
        { label: 'Historial de Consumo', route: '/crm/history' },
      ],
    },
    {
      label: 'Configuración',
      iconSvgPath:
        'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z',
      route: '/settings',
    },
  ]);

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
  }

  toggleMobileMenu(): void {
    this.isMobileOpen.update((v) => !v);
  }

  handleLogout(): void {
    console.log('User logged out');
  }
}
