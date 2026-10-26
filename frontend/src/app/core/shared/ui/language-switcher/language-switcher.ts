import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AppLang, LanguageService } from '../../../services/language';

interface LangOption {
  code: AppLang;
  label: string;
  name: string;
}

/**
 * Accessible EN | ES segmented control. Shared by the public landing navbar and the
 * authenticated sidebar. State lives in LanguageService, so every instance stays in sync.
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class LanguageSwitcher {
  private languageService = inject(LanguageService);

  readonly lang = this.languageService.current;

  // Native language names are intentionally NOT translated (accessibility convention)
  readonly languages: LangOption[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'es', label: 'ES', name: 'Español' }
  ];

  select(code: AppLang): void {
    this.languageService.setLanguage(code);
  }
}
