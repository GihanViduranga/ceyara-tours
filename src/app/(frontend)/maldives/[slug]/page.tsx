'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface DayImage {
  id: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
}

interface ItineraryDay {
  id: string
  dayNumber: number
  title: string
  titleTranslations?: Translations
  activities: Array<{
    id: string
    activity: string
    translations?: Translations
  }>
  images?: DayImage[]
}

interface MaldivesPackage {
  id: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  fullDescription?: any
  fullDescriptionTranslations?: any
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
  heroImage?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  itineraryDays?: ItineraryDay[]
}

type TabType = 'itinerary'

export default function MaldivesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, language } = useLanguage()
  const [slug, setSlug] = useState<string>('')
  const [packageData, setPackageData] = useState<MaldivesPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('itinerary')

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug)
    })
  }, [params])

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

  useEffect(() => {
    if (!slug) return

    const fetchPackage = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/maldives?where[slug][equals]=${slug}&limit=1&depth=2`)
        if (!response.ok) {
          throw new Error('Failed to fetch package')
        }
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setPackageData(data.docs[0])
        } else {
          setError(t('common.packageNotFound'))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching package:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [slug])

  const getImageUrl = (image?: { url?: string; filename?: string }) => {
    if (image?.url) return image.url
    if (image?.filename) return `/api/media/file/${image.filename}`
    return '/api/placeholder/800/600'
  }

  const getHeroImageUrl = () => {
    if (!packageData) return '/api/placeholder/1920/800'
    return (
      getImageUrl(packageData.heroImage) ||
      getImageUrl(packageData.image) ||
      '/api/placeholder/1920/800'
    )
  }

  const getDayImageUrl = (dayImage?: DayImage) => {
    if (!dayImage?.image) return null
    return getImageUrl(dayImage.image)
  }

  if (loading) {
    return (
      <div className="maldives-detail-page">
        <div className="maldives-loading">
          <p>{t('maldives.detailLoading')}</p>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="maldives-detail-page">
        <section className="maldives-detail-intro">
          <div className="container">
            <div className="maldives-detail-intro-content">
              <h2>{t('maldives.detailNotFound')}</h2>
              <p>{error || t('maldives.detailNotFoundDesc')}</p>
              <Link href="/maldives" className="maldives-btn-primary">
                {t('maldives.backToPackages')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="maldives-detail-page">
      {/* Hero Section */}
      <section className="maldives-detail-hero">
        <div className="maldives-detail-hero-background">
          <Image
            src={getHeroImageUrl()}
            alt={getTranslatedValue(packageData.title, packageData.titleTranslations)}
            fill
            priority
            className="maldives-detail-hero-image"
            style={{ objectFit: 'cover' }}
          />
          <div className="maldives-detail-hero-overlay"></div>
        </div>
        <div className="maldives-detail-hero-content">
          <h1>{getTranslatedValue(packageData.title, packageData.titleTranslations)}</h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="maldives-detail-intro">
        <div className="container">
          <div className="maldives-detail-intro-content">
            <h2>{getTranslatedValue(packageData.title, packageData.titleTranslations)}</h2>
            <p>
              {getTranslatedValue(packageData.description, packageData.descriptionTranslations)}
            </p>
            {packageData.fullDescription && (
              <div className="maldives-full-description">
                <p>
                  {getTranslatedValue(
                    packageData.fullDescription,
                    packageData.fullDescriptionTranslations,
                  )}
                </p>
              </div>
            )}
            <div className="maldives-detail-actions">
              <Link href="/enquiry" className="maldives-btn-primary">
                {t('maldives.exploreMore')}
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
              <Link href="/tailor-made-tours" className="maldives-btn-secondary">
                {t('maldives.tailormadeThisTours')}
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
        </div>
      </section>

      {/* Tabs Section */}
      <section className="maldives-detail-tabs">
        <div className="container">
          <div className="maldives-tabs-nav">
            <button
              className={`maldives-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2L3 7V17H8V12H12V17H17V7L10 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('maldives.travelItinerary')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="maldives-tab-content">
            {activeTab === 'itinerary' && packageData.itineraryDays && (
              <div className="maldives-itinerary-days">
                {packageData.itineraryDays
                  .sort((a, b) => a.dayNumber - b.dayNumber)
                  .map((day) => (
                    <div key={day.id} className="maldives-day-card">
                      <div className="maldives-day-header">
                        <div className="maldives-day-badge">
                          {t('maldives.day')} {day.dayNumber}
                        </div>
                        <h3 className="maldives-day-title">
                          {getTranslatedValue(day.title, day.titleTranslations)}
                        </h3>
                      </div>
                      <div className="maldives-day-content">
                        <div className="maldives-day-activities">
                          <ul>
                            {day.activities.map((activity) => (
                              <li key={activity.id}>
                                {getTranslatedValue(activity.activity, activity.translations)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {day.images && day.images.length > 0 && (
                          <div className="maldives-day-images">
                            {day.images.slice(0, 2).map((dayImage, idx) => {
                              const imageUrl = getDayImageUrl(dayImage)
                              return imageUrl ? (
                                <div key={idx} className="maldives-day-image">
                                  <Image
                                    src={imageUrl}
                                    alt={`Day ${day.dayNumber} - Image ${idx + 1}`}
                                    width={400}
                                    height={300}
                                    className="maldives-day-img"
                                  />
                                </div>
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
