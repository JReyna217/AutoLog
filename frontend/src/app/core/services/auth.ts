import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, TokenResponse } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: LoginRequest) {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.saveTokens(response))
    );
  }

  register(userData: RegisterRequest) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userData);
  }

  refreshToken(tokenRequest: { accessToken: string, refreshToken: string }) {
    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, tokenRequest).pipe(
      tap(response => this.saveTokens(response))
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getUserFullNameFromToken(): string {
    const token = this.getToken();
    if (!token) return 'Usuario';

    const decoded = this.decodeJwtPayload(token);
    if (!decoded) return 'Usuario';

    // By default, ASP.NET Core uses this URI for ClaimTypes.Name
    const dotNetNameClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    
    return dotNetNameClaim || decoded.name || decoded.unique_name || 'Usuario';
  }

  //TODO: Move this to HttpOnly Cookies for security
  private saveTokens(tokens: TokenResponse) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private decodeJwtPayload(token: string): any {
    try {
      // We take only the payload (the middle part)
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;

      // We replace Base64Url characters with standard Base64 characters
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // We correctly decode and handle special characters (UTF-8), such as accents and ñ's
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding native JWT', error);
      return null;
    }
  }
}