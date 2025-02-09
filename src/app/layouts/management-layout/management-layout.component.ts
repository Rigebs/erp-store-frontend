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
