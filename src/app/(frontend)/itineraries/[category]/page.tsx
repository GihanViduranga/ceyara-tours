'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import mountainTourImage from '../../assest/images/adventure.jpg'
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

interface Tour {
  id: string
  category: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  duration: string
  durationTranslations?: Translations
  slug: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
}

// Map category slugs to translation keys
const categoryTranslationMap: Record<string, string> = {
  'adventure-nature-based-tours': 'adventureNature',
  'culture-heritage-tours': 'cultureHeritage',
  'family-tours': 'familyTours',
  'luxury-bespoke-tours': 'luxuryBespoke',
  'north-east-coast-tours': 'northEastCoast',
  'popular-tours': 'popularTours',
  'purpose-built-tours': 'purposeBuilt',
  'romantic-tours': 'romanticTours',
  'special-transit-tours': 'specialTransit',
  'sports-based-tours': 'sportsBased',
  'sustainable-tours': 'sustainableTours',
  'wellness-tours': 'wellnessTours',
  'wildlife-tours': 'wildlifeTours',
}

export default function ItineraryCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { t, language } = useLanguage()
  const [category, setCategory] = useState<string>('')
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then((resolvedParams) => {
      setCategory(resolvedParams.category)
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
    if (!category) return

    const fetchTours = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/itinerary-pages?where[category][equals]=${category}&limit=100&depth=2`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch tours')
        }
        const data = await response.json()
        setTours(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching tours:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [category])

  const getImageUrl = (tour: Tour) => {
    if (tour.image?.url) {
      return tour.image.url
    }
    if (tour.image?.filename) {
      return `/api/media/file/${tour.image.filename}`
    }
    return mountainTourImage
  }

  const translationKey = category
    ? categoryTranslationMap[category] || 'adventureNature'
    : 'adventureNature'

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading tours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Error loading tours: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="itinerary-page">
      {/* Hero Section */}
      <section className="itinerary-hero">
        <div className="itinerary-hero-background">
          <Image
            src={mountainTourImage}
            alt={t(`${translationKey}.title`) || 'Tours'}
            fill
            priority
            className="itinerary-hero-image"
            style={{ objectFit: 'cover' }}
          />
          <div className="itinerary-hero-overlay"></div>
        </div>
        <div className="itinerary-hero-content">
          <h1>{t(`${translationKey}.title`) || 'Tours'}</h1>
          <p className="itinerary-hero-subtitle">{t(`${translationKey}.subtitle`) || ''}</p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="itinerary-intro">
        <div className="container">
          <div className="itinerary-intro-content">
            <h2>{t(`${translationKey}.introTitle`) || ''}</h2>
            <p>{t(`${translationKey}.introDescription1`) || ''}</p>
            <p>{t(`${translationKey}.introDescription2`) || ''}</p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="itinerary-tours">
        <div className="container">
          <h2 className="section-title">{t(`${translationKey}.toursTitle`) || 'Tours'}</h2>
          <div className="tours-grid">
            {tours.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>No tours available at the moment.</p>
              </div>
            ) : (
              tours.map((tour) => (
                <div key={tour.id} className="tour-card">
                  <div className="tour-card-image">
                    <Image
                      src={getImageUrl(tour)}
                      alt={tour.image?.alt || tour.title}
                      width={400}
                      height={300}
                      className="tour-img"
                    />
                    <div className="tour-duration-badge">
                      {getTranslatedValue(tour.duration, tour.durationTranslations)}
                    </div>
                  </div>
                  <div className="tour-card-content">
                    <h3>{getTranslatedValue(tour.title, tour.titleTranslations)}</h3>
                    <p>{getTranslatedValue(tour.description, tour.descriptionTranslations)}</p>
                    <div className="tour-card-footer">
                      <Link
                        href={`/itineraries/${category}/${tour.slug}`}
                        className="tour-enquire-btn"
                      >
                        {t(`${translationKey}.readMore`) || 'Read More'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
