import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

import { PRIME_AUTH_IMPORTS } from '../../../core/shared/ui/primeng-imports';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ...PRIME_AUTH_IMPORTS],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  isLoading = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ 
            severity: 'success', 
            summary: '¡Éxito!', 
            detail: 'Sesión iniciada correctamente.' 
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error de Acceso', 
            detail: err.error?.detail || 'Ocurrió un error al intentar iniciar sesión.' 
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}