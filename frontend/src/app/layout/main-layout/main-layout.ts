import { Component, HostListener, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';

import { MenuItem } from 'primeng/api';
import { PRIME_LAYOUT_IMPORTS } from '../../core/shared/ui/primeng-imports';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ...PRIME_LAYOUT_IMPORTS],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-layout.scss'
})
export class MainLayout implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  firstName: string = '';
  userInitials: string = '';

  // Controls the visibility of the left sidebar
  sidebarVisible = true;
  // Control the visibility of menu in mobile
  isMobile = false;

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

  constructor() {
    this.checkScreenSize(); // To verify the initial size
  }

  ngOnInit() {
    this.loadUserData();

    // Close the menu at navigation time (mobile only)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile && this.sidebarVisible) {
        this.sidebarVisible = false;
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const wasMobile = this.isMobile;
    // 992px breakpoint 'lg' of PrimeFlex
    this.isMobile = window.innerWidth < 992; 

    // Hide when pass from desktop to mobile
    if (this.isMobile && !wasMobile) {
      this.sidebarVisible = false;
    }
    // Show on desktop
    if (!this.isMobile && wasMobile) {
      this.sidebarVisible = true;
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Clears tokens and redirects to login
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadUserData() {
    // Extraemos el nombre directamente del token JWT
    const fullName = this.authService.getUserFullNameFromToken(); 

    this.firstName = fullName.split(' ')[0];
    this.userInitials = this.getInitials(fullName);
  }

  private getInitials(name: string): string {
    if (!name || name === 'Usuario') return 'U';

    const parts = name.trim().split(' ').filter(n => n.length > 0);
    
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  }
}