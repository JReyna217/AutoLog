import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../../core/shared/ui/language-switcher/language-switcher';
import { PRIME_AUTH_IMPORTS } from '../../../core/shared/ui/primeng-imports';
import { MessageService } from 'primeng/api';

// Custom validator to ensure passwords match
const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe, LanguageSwitcher, ...PRIME_AUTH_IMPORTS],
  providers: [MessageService],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.scss'
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  isLoading = false;

  registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator }); // Attach the custom validator to the group

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const { confirmPassword, ...registerData } = this.registerForm.getRawValue();
      
      this.authService.register(registerData).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ 
            severity: 'success', 
            summary: this.translate.instant('auth.register.toast.successSummary'), 
            detail: this.translate.instant('auth.register.toast.successDetail') 
          });
          
          // Redirect to login after a short delay so the user can see the success toast
          setTimeout(() => this.router.navigate(['/login']), 700);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({ 
            severity: 'error', 
            summary: this.translate.instant('auth.register.toast.errorSummary'), 
            detail: err.error?.detail || this.translate.instant('auth.register.toast.errorDefault') 
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}