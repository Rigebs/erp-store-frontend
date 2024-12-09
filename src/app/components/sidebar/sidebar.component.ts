import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() isOpen = false;
  dropdownStates: { [key: string]: boolean } = {};
  sidebarData: any;

  ngOnInit() {
    this.sidebarData = {
      items: [
        {
          label: 'Home',
          route: '/home',
          hasDropdown: false,
        },
        {
          label: 'Acerca de',
          route: '/acerca',
          hasDropdown: true,
          dropdownItems: [
            { label: 'Historia', route: '/acerca/historia' },
            { label: 'Equipo', route: '/acerca/equipo' },
            { label: 'Misión', route: '/acerca/mision' },
          ],
        },
        {
          label: 'Configuración',
          route: '/configuracion',
          hasDropdown: true,
          dropdownItems: [
            { label: 'Color', route: '/configuracion/color' },
            { label: 'Equipo', route: '/configuracion/equipo' },
            { label: 'Misión', route: '/configuracion/mision' },
          ],
        },
        {
          label: 'Contacto',
          route: '/contacto',
          hasDropdown: false,
        },
      ],
    };
  }

  toggleDropdown(key: string): void {
    this.dropdownStates[key] = !this.dropdownStates[key];
  }
}
