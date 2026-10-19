import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PRIME_LANDING_IMPORTS } from '../../../core/shared/ui/primeng-imports';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ...PRIME_LANDING_IMPORTS],
  providers: [MessageService],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class Landing implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);

  mobileMenuOpen = false;
  isLoggedIn = false;
  isSubmittingContact = false;
  currentYear = new Date().getFullYear();

  contactForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
    // Verificar si el usuario ya cuenta con un token de autenticación activo
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    this.isLoggedIn = !!token;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  scrollToSection(sectionId: string): void {
    this.closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onContactSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmittingContact = true;

      // Simulamos la recepción y procesamiento del mensaje con respuesta de usuario
      setTimeout(() => {
        this.isSubmittingContact = false;
        this.messageService.add({
          severity: 'success',
          summary: '¡Mensaje Enviado!',
          detail: 'Gracias por ponerte en contacto. Te responderemos a la brevedad.',
          life: 4000
        });
        this.contactForm.reset();
      }, 700);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
