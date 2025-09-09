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

  menuItems = [
    {
      label: 'Registrar venta',
      icon: 'shopping_cart',
      route: 'management/sales/new',
    },
    {
      label: 'Ver ventas',
      icon: 'fact_check',
      route: 'management/sales/list',
    },
    {
      label: 'Inventario',
      icon: 'inventory',
      route: 'management/inventory',
    },
    {
      label: 'Catálogo',
      icon: 'storefront',
      children: [
        {
          label: 'Productos',
          icon: 'inventory',
          route: 'management/products',
        },
        {
          label: 'Categorías',
          icon: 'category',
          route: 'management/categories',
        },
        {
          label: 'Proveedores',
          icon: 'local_shipping',
          route: 'management/suppliers',
        },
        {
          label: 'Lineas',
          icon: 'align_horizontal_right',
          route: 'management/lines',
        },
        {
          label: 'Marcas',
          icon: 'workspace_premium',
          route: 'management/brands',
        },
        {
          label: 'Unid. de medida',
          icon: 'square_foot',
          route: 'management/units-measure',
        },
      ],
    },

    {
      label: 'Reportes',
      icon: 'assessment',
      children: [
        {
          label: 'Ventas',
          icon: 'bar_chart',
          route: '/reportes/ventas',
        },
        {
          label: 'Inventario',
          icon: 'inventory',
          route: '/reportes/inventario',
        },
        {
          label: 'Clientes',
          icon: 'people',
          route: '/reportes/clientes',
        },
      ],
    },
    {
      label: 'Configuración',
      icon: 'settings',
      children: [
        {
          label: 'Usuarios',
          icon: 'manage_accounts',
          route: '/configuracion/usuarios',
        },
        {
          label: 'Preferencias',
          icon: 'tune',
          route: '/configuracion/preferencias',
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
