import { Component, ChangeDetectionStrategy, signal, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'banner',
    class: 'main-navbar',
  },
})
export class Navbar {
  userDisplayName = input<string>('Guest User');
  notificationCount = signal(5);

  logout = output<void>();
  menuOpened = output<void>();

  onLogout(): void {
    this.logout.emit();
  }

  toggleMobileMenu(): void {
    console.log('dkdf');

    this.menuOpened.emit();
  }
}
