import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // We do not intercept login/registration/refresh requests to prevent infinite loops
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');
  let authReq = req;

  // If there is a token, we include it in the headers
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // We continue with the request and handle errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the error is 401 (Token expired) and we aren't already refreshing
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          return authService.refreshToken({ accessToken, refreshToken }).pipe(
            switchMap((tokens) => {
              isRefreshing = false;
              // We retry the original request with the new token
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
              });
              return next(newReq);
            }),
            catchError((refreshError) => {
              // If the refresh also fails (session has completely expired)
              isRefreshing = false;
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // If there is no refresh token, log the user out
          authService.logout();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};