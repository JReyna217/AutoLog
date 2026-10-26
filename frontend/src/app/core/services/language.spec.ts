import { resolveLanguage } from './language';

describe('resolveLanguage', () => {
  it('selects Spanish for any es-* locale', () => {
    expect(resolveLanguage(['es'])).toBe('es');
    expect(resolveLanguage(['es-MX'])).toBe('es');
    expect(resolveLanguage(['ES_419'])).toBe('es');
  });

  it('falls back to English for unsupported languages', () => {
    expect(resolveLanguage(['fr-FR', 'de'])).toBe('en');
    expect(resolveLanguage([])).toBe('en');
    expect(resolveLanguage([null, undefined])).toBe('en');
  });

  it('respects candidate priority order', () => {
    expect(resolveLanguage(['en-US', 'es-MX'])).toBe('en');
    expect(resolveLanguage(['fr', 'es-MX'])).toBe('es');
  });
});
