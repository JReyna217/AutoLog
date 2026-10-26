import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { LanguageSwitcher } from './language-switcher';
import { LanguageService } from '../../../services/language';

describe('LanguageSwitcher', () => {
  let fixture: ComponentFixture<LanguageSwitcher>;
  let service: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher],
      providers: [provideTranslateService({ fallbackLang: 'en' }), PrimeNG]
    }).compileComponents();

    service = TestBed.inject(LanguageService);
    fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();
  });

  it('renders EN and ES options with accessible state', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.lang-btn'));
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['EN', 'ES']);
    // English is the default language
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('delegates selection to LanguageService', () => {
    const spy = vi.spyOn(service, 'setLanguage').mockImplementation(() => undefined);
    const esButton: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.lang-btn')[1];
    esButton.click();
    expect(spy).toHaveBeenCalledWith('es');
  });
});
