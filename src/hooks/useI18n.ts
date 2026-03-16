import { useMemo, useCallback } from 'react'
import { useLanguage } from '@/app/(frontend)/contexts/LanguageContext'
import {
  getTranslations,
  getTranslation,
  getNamespaceTranslations,
  type TranslationKeys,
  type LanguageCode,
} from '@/utils/i18n'

/**
 * Hook for accessing translations with nested key support
 * Usage: t('nav.title') or t('features.expertGuides.title')
 */
export const useI18n = () => {
  const { language } = useLanguage()

  const translations = useMemo(() => {
    return getTranslations(language as LanguageCode)
  }, [language])

  const t = useCallback(
    (key: string): string => {
      return getTranslation(language as LanguageCode, key)
    },
    [language],
  )

  return { t, translations, language }
}

/**
 * Hook for getting nested translation objects
 * Usage: const nav = useTranslations('nav') - returns all nav translations
 */
export const useTranslations = (namespace: keyof TranslationKeys) => {
  const { language } = useLanguage()

  return useMemo(() => {
    return getNamespaceTranslations(language as LanguageCode, namespace)
  }, [language, namespace])
}

/**
 * Hook for getting a specific nested translation object
 * Usage: const hero = useTranslationSection('hero') - returns hero translations
 */
export const useTranslationSection = <T extends keyof TranslationKeys>(
  section: T,
): TranslationKeys[T] => {
  const { language } = useLanguage()

  return useMemo(() => {
    return getNamespaceTranslations(language as LanguageCode, section)
  }, [language, section])
}
