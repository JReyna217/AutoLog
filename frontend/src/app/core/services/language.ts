import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';
import { PRIMENG_TRANSLATIONS } from '../i18n/primeng-locale';

// Needed so Angular's DatePipe can format dates with locale 'es' ('en' is built in)
registerLocaleData(localeEs, 'es');

export type AppLang = 'en' | 'es';

export const SUPPORTED_LANGS: readonly AppLang[] = ['en', 'es'];
export const DEFAULT_LANG: AppLang = 'en';
export const LANG_STORAGE_KEY = 'autolog.lang';

/**
 * Resolves the app language from a list of candidate locale codes (in priority order).
 * The first candidate whose primary subtag is "es" selects Spanish ("es", "es-MX", "es_419"...).
 * Any other value falls back to English.
 */
export function resolveLanguage(candidates: readonly (string | null | undefined)[]): AppLang {
  for (const candidate of candidates) {
    const primary = candidate?.toLowerCase().split(/[-_]/)[0];
    if (primary === 'es') return 'es';
    if (primary === 'en') return 'en';
  }
  return DEFAULT_LANG;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);
  private primeng = inject(PrimeNG);

  /** Currently active language (reactive). */
  readonly current = signal<AppLang>(DEFAULT_LANG);

  /** Called once at startup (APP_INITIALIZER) so translations are ready before first render. */
  init(): Promise<unknown> {
    this.translate.addLangs([...SUPPORTED_LANGS]);
    return this.apply(this.detectInitialLanguage());
  }

  /** Manual switch from the UI. The choice is persisted for future visits. */
  setLanguage(lang: AppLang): void {
    if (lang === this.current()) return;
    this.persist(lang);
    void this.apply(lang);
  }

  private detectInitialLanguage(): AppLang {
    const nav = this.document.defaultView?.navigator;
    return resolveLanguage([
      this.readStored(),
      ...(nav?.languages ?? []),
      nav?.language
    ]);
  }

  private async apply(lang: AppLang): Promise<unknown> {
    const result = await firstValueFrom(this.translate.use(lang));
    // Localizes PrimeNG built-ins (DatePicker names, password strength, dialog buttons...)
    this.primeng.setTranslation(PRIMENG_TRANSLATIONS[lang]);
    this.current.set(lang);
    // Keeps screen readers / browser translation tools in sync with the visible language
    this.document.documentElement.lang = lang;
    return result;
  }

  private readStored(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(LANG_STORAGE_KEY) ?? null;
    } catch {
      return null; // storage blocked (private mode, etc.)
    }
  }

  private persist(lang: AppLang): void {
    try {
      this.document.defaultView?.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }
}
