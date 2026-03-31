import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Basic validation. In the future, we can add token expiration checks here.
  const token = localStorage.getItem('accessToken');

  if (token) {
    return true;
  }

  // Redirect to login if unauthorized
  router.navigate(['/login']);
  return false;
};