import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../../core/shared/ui/language-switcher/language-switcher';

import { PRIME_AUTH_IMPORTS } from '../../../core/shared/ui/primeng-imports';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe, LanguageSwitcher, ...PRIME_AUTH_IMPORTS],
  providers: [MessageService],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

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
            summary: this.translate.instant('auth.login.toast.successSummary'), 
            detail: this.translate.instant('auth.login.toast.successDetail') 
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({ 
            severity: 'error', 
            summary: this.translate.instant('auth.login.toast.errorSummary'), 
            // Backend-provided detail is shown as-is; otherwise fall back to a translated message
            detail: err.error?.detail || this.translate.instant('auth.login.toast.errorDefault') 
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}