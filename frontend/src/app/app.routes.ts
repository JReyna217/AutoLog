import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    // Apply the functional guard here
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
  },
  { 
    // Added register route
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register) 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Catch-all route to redirect unknown URLs to dashboard (which will then pass through the guard)
  { path: '**', redirectTo: '/dashboard' }
];