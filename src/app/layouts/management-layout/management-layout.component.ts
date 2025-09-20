import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterOutlet } from '@angular/router';
import { JwtUtilService } from '../../utils/jwt-util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../models/menu-item';

@Component({
  selector: 'app-management-layout',
  imports: [
    MatToolbarModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    CommonModule,
  ],
  templateUrl: './management-layout.component.html',
  styleUrls: ['./management-layout.component.css'],
})
export class ManagementLayoutComponent {
  isOpen: boolean = false;

  isLoading: boolean = false;
  openedSections: { [key: string]: boolean } = {};

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: 'dashboard',
    },
    {
      label: 'Ventas',
      isSection: true,
      children: [
        {
          label: 'Registrar venta',
          icon: 'shopping_cart',
          route: 'sales/new',
        },
        {
          label: 'Ver ventas',
          icon: 'fact_check',
          route: 'sales/list',
        },
        {
          label: 'Clientes',
          icon: 'group',
          children: [{ label: 'Clientes', route: 'customers' }],
        },
      ],
    },
    {
      label: 'Inventario',
      isSection: true,
      children: [
        {
          label: 'Inventario',
          icon: 'inventory',
          children: [
            { label: 'Stock', route: 'inventory/stock' },
            { label: 'Movimientos', route: 'inventory/movements' },
          ],
        },
        {
          label: 'Catálogo',
          icon: 'storefront',
          children: [
            { label: 'Productos', route: 'products' },
            { label: 'Categorías', route: 'categories' },
            { label: 'Proveedores', route: 'suppliers' },
            { label: 'Lineas', route: 'lines' },
            { label: 'Marcas', route: 'brands' },
            { label: 'Unid. de medida', route: 'units-measure' },
          ],
        },
      ],
    },
    {
      label: 'RR.HH',
      isSection: true,
      children: [
        {
          label: 'Empleados',
          icon: 'group',
          route: 'employees',
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private jwtUtilService: JwtUtilService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
      this.cdRef.detectChanges();
    });
  }

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  toggleSection(label: string): void {
    this.openedSections[label] = !this.openedSections[label];
  }

  isSectionOpen(label: string): boolean {
    return this.openedSections[label];
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  onSidenavClosed() {
    this.isOpen = false;
  }

  logout() {
    this.jwtUtilService.removeToken();
    this.snackBar.open('Sesión cerrada', 'Cerrar', {
      duration: 3000,
    });
    this.router.navigateByUrl('/auth/login');
  }

  getSidenavMode() {
    return window.innerWidth <= 768 ? 'over' : 'side';
  }
}
