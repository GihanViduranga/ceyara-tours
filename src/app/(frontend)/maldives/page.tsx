'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import maldivesHeroImage from '../assest/images/Maldives.jpg'
import './styles.css'

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface MaldivesPackage {
  id: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  duration: string
  location: string
  type: 'maldives' | 'maldives-sri-lanka'
  slug: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
}

export default function MaldivesPage() {
  const { t, language } = useLanguage()
  const [packages, setPackages] = useState<MaldivesPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'maldives' | 'maldives-sri-lanka'>('all')

  // Fetch Maldives packages from CMS
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/maldives?limit=100&depth=2')
        if (!response.ok) {
          console.warn('Failed to fetch Maldives packages')
          setPackages([])
          return
        }
        const data = await response.json()
        setPackages(data.docs || [])
      } catch (err) {
        console.error('Error fetching Maldives packages:', err)
        setPackages([])
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  // Helper function to get translated value
  const getTranslatedValue = (defaultValue: string, translations?: Translations): string => {
    if (!translations || language === 'EN') return defaultValue

    const langMap: Record<string, keyof Translations> = {
      DE: 'de',
      FR: 'fr',
      NL: 'nl',
      IT: 'it',
      ES: 'es',
      RU: 'ru',
    }

    const langKey = langMap[language]
    return (langKey && translations[langKey]) || defaultValue
  }

  const getImageUrl = (image?: { url?: string; filename?: string }) => {
    if (image?.url) return image.url
    if (image?.filename) return `/api/media/file/${image.filename}`
    return '/api/placeholder/400/300'
  }

  const filteredPackages =
    filter === 'all' ? packages : packages.filter((pkg) => pkg.type === filter)

  return (
    <div className="maldives-page">
      {/* Hero Section */}
      <section className="maldives-hero">
        <div className="maldives-hero-background">
          <Image
            src={maldivesHeroImage}
            alt="Maldives"
            fill
            priority
            className="maldives-hero-image"
            style={{ objectFit: 'cover' }}
          />
          <div className="maldives-hero-overlay"></div>
        </div>
        <div className="maldives-hero-content">
          <p className="maldives-hero-subtitle">{t('maldives.heroSubtitle')}</p>
          <h1 className="maldives-hero-title">
            {t('maldives.heroTitle')}
            <br />
            <span className="maldives-hero-subtitle-small">{t('maldives.heroSubtitleSmall')}</span>
          </h1>
          <div className="maldives-hero-buttons">
            <Link
              href="#curated-itineraries"
              className="maldives-hero-btn maldives-hero-btn-primary"
            >
              {t('maldives.curatedItineraries')}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/tailor-made-tours"
              className="maldives-hero-btn maldives-hero-btn-secondary"
            >
              {t('maldives.tailormadeExperiences')}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 4L12 6L10 8M10 16L8 14L10 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Itineraries Section */}
      <section id="curated-itineraries" className="maldives-itineraries">
        <div className="container">
          <h2 className="maldives-section-title">{t('maldives.sectionTitle')}</h2>
          <div className="maldives-filters">
            <button
              className={`maldives-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('maldives.filterAll')}
            </button>
            <span className="maldives-filter-divider">|</span>
            <button
              className={`maldives-filter-btn ${filter === 'maldives' ? 'active' : ''}`}
              onClick={() => setFilter('maldives')}
            >
              {t('maldives.filterMaldives')}
            </button>
            <span className="maldives-filter-divider">|</span>
            <button
              className={`maldives-filter-btn ${filter === 'maldives-sri-lanka' ? 'active' : ''}`}
              onClick={() => setFilter('maldives-sri-lanka')}
            >
              {t('maldives.filterMaldivesSriLanka')}
            </button>
          </div>

          {loading ? (
            <div className="maldives-loading">
              <p>{t('maldives.loadingPackages')}</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="maldives-empty">
              <p>{t('maldives.noPackages')}</p>
            </div>
          ) : (
            <div className="maldives-grid">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="maldives-card">
                  <div className="maldives-card-image">
                    <Image
                      src={getImageUrl(pkg.image)}
                      alt={getTranslatedValue(pkg.title, pkg.titleTranslations)}
                      width={400}
                      height={300}
                      className="maldives-card-img"
                    />
                  </div>
                  <div className="maldives-card-content">
                    <h3 className="maldives-card-title">
                      {getTranslatedValue(pkg.title, pkg.titleTranslations)}
                    </h3>
                    <p className="maldives-card-location">
                      {pkg.location} - {pkg.duration}
                    </p>
                    <p className="maldives-card-description">
                      {getTranslatedValue(pkg.description, pkg.descriptionTranslations)}
                    </p>
                    <Link href={`/maldives/${pkg.slug}`} className="maldives-card-readmore">
                      {t('maldives.readMore')}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
