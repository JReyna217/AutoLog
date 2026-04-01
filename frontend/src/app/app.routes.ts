import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  { 
    // Added register route
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register) 
  },
  {
    // The Main Layout acts as a wrapper for all protected routes
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
      },
      // Default redirect inside the protected area
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  // Catch-all route to redirect unknown URLs to dashboard (which will then pass through the guard)
  { path: '**', redirectTo: '/dashboard' }
];