import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

import { MenuItem } from 'primeng/api';
import { PRIME_LAYOUT_IMPORTS } from '../../core/shared/ui/primeng-imports';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ...PRIME_LAYOUT_IMPORTS],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Controls the visibility of the left sidebar
  sidebarVisible = true;

  // Sidebar navigation menu items
  sidebarItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Exchange Rates', icon: 'pi pi-money-bill', routerLink: '/exchange-rates' },
    { label: 'Vehicles', icon: 'pi pi-car', routerLink: '/vehicles' },
    { label: 'Fuel Logs', icon: 'pi pi-gauge', routerLink: '/fuel-logs' },
  ];

  // User profile dropdown menu items
  profileItems: MenuItem[] = [
    // { label: 'My Profile', icon: 'pi pi-user' },
    // { label: 'Settings', icon: 'pi pi-cog' },
    // { separator: true },
    { 
      label: 'Logout', 
      icon: 'pi pi-power-off', 
      command: () => this.logout() 
    }
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Clears tokens and redirects to login
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}