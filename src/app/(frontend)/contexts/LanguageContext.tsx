'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTranslation, isLanguageSupported, type LanguageCode } from '@/utils/i18n'

export interface Language {
  code: string
  flag: string
  name: string
}

export interface Translations {
  [key: string]: string
}

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  languages: Language[]
  t: (key: string) => string
  td: (text: string) => string
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const languages: Language[] = [
  { code: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'FR', flag: '🇫🇷', name: 'Français' },
  { code: 'NL', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'IT', flag: '🇮🇹', name: 'Italiano' },
  { code: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'RU', flag: '🇷🇺', name: 'Русский' },
]

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('EN')
  const [isTranslating] = useState(false)

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage && isLanguageSupported(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language.toLowerCase()
    }
  }, [language])

  const setLanguage = (lang: string) => {
    if (isLanguageSupported(lang)) {
      setLanguageState(lang)
      localStorage.setItem('selectedLanguage', lang)
      // Dispatch custom event for same-tab language changes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('languageChanged'))
      }
    }
  }

  // Translation function using JSON files directly - memoized for performance
  const t = useCallback(
    (key: string): string => {
      // Use static JSON files for translations
      return getTranslation(language as LanguageCode, key)
    },
    [language],
  )

  // Translate dynamic/freeform strings (e.g., CMS-provided labels) - memoized for performance
  // Uses JSON files from cms section (destinations, itineraries, dayTours, menu)
  const td = useCallback(
    (text: string): string => {
      if (!text) return text
      if (language === 'EN') return text

      // Try to find translation in cms section of JSON files
      // Search through: cms.destinations, cms.itineraries, cms.dayTours, cms.menu
      const cmsSections = ['destinations', 'itineraries', 'dayTours', 'menu']

      for (const section of cmsSections) {
        const key = `cms.${section}.${text}`
        const translation = getTranslation(language as LanguageCode, key)
        // If translation found and different from key, return it
        if (translation && translation !== key) {
          return translation
        }
      }

      // Fallback: return original text if not found
      return text
    },
    [language],
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages, t, td, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
