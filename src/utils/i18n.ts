// Static i18n utilities for loading and managing translations
import deTranslations from '@/locales/de.json'
import enTranslations from '@/locales/en.json'
import esTranslations from '@/locales/es.json'
import frTranslations from '@/locales/fr.json'
import itTranslations from '@/locales/it.json'
import nlTranslations from '@/locales/nl.json'
import ruTranslations from '@/locales/ru.json'

// Type definitions
export type TranslationKeys = typeof enTranslations

// Language translations mapping
const rawTranslations = {
  EN: enTranslations,
  DE: deTranslations,
  FR: frTranslations,
  NL: nlTranslations,
  IT: itTranslations,
  ES: esTranslations,
  RU: ruTranslations,
} as const

export type LanguageCode = keyof typeof rawTranslations

const translations = rawTranslations as unknown as Record<LanguageCode, TranslationKeys>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

// Available languages
export const availableLanguages: LanguageCode[] = Object.keys(rawTranslations) as LanguageCode[]

/**
 * Get translations for a specific language
 */
export const getTranslations = (language: LanguageCode): TranslationKeys => {
  return translations[language] || translations['EN']
}

/**
 * Get a nested translation value by key path
 * @param language - Language code
 * @param key - Dot-separated key path (e.g., 'nav.title', 'features.expertGuides.title')
 * @returns Translated string or the key if not found
 */
export const getTranslation = (language: LanguageCode, key: string): string => {
  const translation = getTranslations(language)
  const keys = key.split('.')
  let value: unknown = translation

  for (const k of keys) {
    if (isRecord(value) && k in value) {
      value = value[k as keyof typeof value]
    } else {
      // Fallback to English
      const fallbackTranslation = getTranslations('EN')
      let fallbackValue: unknown = fallbackTranslation

      for (const fallbackKey of keys) {
        if (isRecord(fallbackValue) && fallbackKey in fallbackValue) {
          fallbackValue = fallbackValue[fallbackKey as keyof typeof fallbackValue]
        } else {
          return key // Return the key if not found in any language
        }
      }
      return typeof fallbackValue === 'string' ? fallbackValue : key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Get all translations for a specific namespace
 * @param language - Language code
 * @param namespace - Top-level namespace (e.g., 'nav', 'hero', 'about')
 * @returns Object containing all translations for the namespace
 */
export const getNamespaceTranslations = <T extends keyof TranslationKeys>(
  language: LanguageCode,
  namespace: T,
): TranslationKeys[T] => {
  const translation = getTranslations(language)
  return translation[namespace] || ({} as TranslationKeys[T])
}

/**
 * Check if a language is supported
 */
export const isLanguageSupported = (language: string): language is LanguageCode => {
  return availableLanguages.includes(language as LanguageCode)
}

/**
 * Get the default language (English)
 */
export const getDefaultLanguage = (): LanguageCode => 'EN'

/**
 * Get all available language codes
 */
export const getAvailableLanguages = (): LanguageCode[] => {
  return [...availableLanguages]
}

/**
 * Create a translation function for a specific language
 * @param language - Language code
 * @returns Function that takes a key and returns the translated string
 */
export const createTranslationFunction = (language: LanguageCode) => {
  return (key: string): string => getTranslation(language, key)
}

/**
 * Batch translate multiple keys
 * @param language - Language code
 * @param keys - Array of keys to translate
 * @returns Object with keys mapped to their translations
 */
export const batchTranslate = (language: LanguageCode, keys: string[]): Record<string, string> => {
  const result: Record<string, string> = {}
  const translate = createTranslationFunction(language)

  keys.forEach((key) => {
    result[key] = translate(key)
  })

  return result
}
