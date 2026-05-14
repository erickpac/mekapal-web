import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import es from './locales/es.json'

/**
 * i18n setup for the console.
 *
 * Spanish is the default and fallback language — mirrors the monorepo
 * convention (mekapal-mobile uses the same `fallbackLng: 'es'`).
 *
 * Scope: only the `errors` namespace is populated for now. The console's
 * existing hardcoded Spanish UI strings are intentionally NOT migrated here;
 * that is a separate effort.
 */
export const resources = {
  es: { translation: es },
  en: { translation: en },
} as const

export const defaultLanguage = 'es'

void i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    // React already escapes values against XSS.
    escapeValue: false,
  },
  returnNull: false,
})

export default i18n
