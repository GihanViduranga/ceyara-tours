'use client'

import React from 'react'
import { useI18n, useTranslations, useTranslationSection } from '@/hooks/useI18n'

// Example component demonstrating different ways to use the i18n hooks
export const ExampleI18nUsage: React.FC = () => {
  // Method 1: Using the main useI18n hook for individual translations
  const { t, language } = useI18n()

  // Method 2: Using useTranslations for a specific namespace
  const navTranslations = useTranslations('nav') as any

  // Method 3: Using useTranslationSection for a specific section with type safety
  const heroSection = useTranslationSection('hero')

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">i18n Usage Examples</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Method 1: Individual translations with useI18n</h3>
        <p>Current language: {language}</p>
        <p>Hero title: {t('hero.title')}</p>
        <p>About title: {t('about.title')}</p>
        <p>Nested key: {t('features.expertGuides.title')}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Method 2: Namespace translations with useTranslations
        </h3>
        <p>Nav tailor made tours: {navTranslations.tailorMadeTours}</p>
        <p>Nav itineraries: {navTranslations.itineraries}</p>
        <p>Nav enquire now: {navTranslations.enquireNow}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Method 3: Section translations with useTranslationSection
        </h3>
        <p>Hero title: {heroSection.title}</p>
        <p>Hero subtitle: {heroSection.subtitle}</p>
        <p>Hero tagline: {heroSection.tagline}</p>
        <p>Hero curated itineraries: {heroSection.curatedItineraries}</p>
        <p>Hero tailormade experiences: {heroSection.tailormadeExperiences}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Fallback behavior</h3>
        <p>Missing key (should show the key): {t('non.existent.key')}</p>
        <p>Empty key: {t('')}</p>
      </div>
    </div>
  )
}

export default ExampleI18nUsage
