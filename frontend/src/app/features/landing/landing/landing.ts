import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PRIME_LANDING_IMPORTS } from '../../../core/shared/ui/primeng-imports';
import { LanguageSwitcher } from '../../../core/shared/ui/language-switcher/language-switcher';
import { MessageService } from 'primeng/api';

interface NavItem { id: string; labelKey: string; icon: string; }
interface FeatureItem { key: string; icon: string; iconClass: string; }

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslatePipe, LanguageSwitcher, ...PRIME_LANDING_IMPORTS],
  providers: [MessageService],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class Landing implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  mobileMenuOpen = false;
  isLoggedIn = false;
  isSubmittingContact = false;
  currentYear = new Date().getFullYear();

  readonly navItems: NavItem[] = [
    { id: 'hero', labelKey: 'landing.nav.home', icon: 'pi-home' },
    { id: 'features', labelKey: 'landing.nav.features', icon: 'pi-star' },
    { id: 'border-solution', labelKey: 'landing.nav.border', icon: 'pi-compass' },
    { id: 'contact', labelKey: 'landing.nav.contact', icon: 'pi-envelope' }
  ];

  readonly features: FeatureItem[] = [
    { key: 'logging', icon: 'pi-gauge', iconClass: 'bg-blue-50 text-primary' },
    { key: 'currency', icon: 'pi-dollar', iconClass: 'bg-green-50 text-green-600' },
    { key: 'dof', icon: 'pi-sync', iconClass: 'bg-orange-50 text-orange-600' },
    { key: 'units', icon: 'pi-arrows-h', iconClass: 'bg-purple-50 text-purple-600' },
    { key: 'dashboard', icon: 'pi-chart-line', iconClass: 'bg-cyan-50 text-cyan-600' },
    { key: 'security', icon: 'pi-shield', iconClass: 'bg-teal-50 text-teal-600' }
  ];

  readonly borderBullets = ['noManual', 'traceability', 'multiVehicle'];

  readonly flowSteps = [
    { number: 1, key: 'one' },
    { number: 2, key: 'two' },
    { number: 3, key: 'three' }
  ];

  contactForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
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
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  hasError(controlName: 'fullName' | 'email' | 'subject' | 'message'): boolean {
    const control = this.contactForm.controls[controlName];
    return control.invalid && control.touched;
  }

  onContactSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmittingContact = true;

      // Simulated delivery (no backend endpoint yet)
      setTimeout(() => {
        this.isSubmittingContact = false;
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('landing.contact.toast.summary'),
          detail: this.translate.instant('landing.contact.toast.detail'),
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
