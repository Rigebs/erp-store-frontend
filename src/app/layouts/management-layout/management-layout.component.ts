import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-management-layout',
  imports: [
    MatToolbarModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './management-layout.component.html',
  styleUrls: ['./management-layout.component.css'],
})
export class ManagementLayoutComponent {
  isOpen: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  onSidenavClosed() {
    this.isOpen = false;
  }

  getSidenavMode() {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth <= 768 ? 'over' : 'side';
    }
    return 'side';
  }
}
