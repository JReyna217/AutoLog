import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Landing } from './landing';

describe('Landing', () => {
  let component: Landing;
  let fixture: ComponentFixture<Landing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the landing component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contact form with empty values', () => {
    expect(component.contactForm.get('fullName')?.value).toBe('');
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('subject')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
    expect(component.contactForm.valid).toBe(false);
  });

  it('should toggle mobile menu state', () => {
    expect(component.mobileMenuOpen).toBe(false);
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBe(true);
    component.closeMobileMenu();
    expect(component.mobileMenuOpen).toBe(false);
  });
});
