'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import mountainTourImage from '../assest/images/adventure.jpg'
import mainPageCover from '../assest/images/mainPageCover.jpg'
import { useLanguage } from '../contexts/LanguageContext'
import './styles.css'

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
  createdAt?: string
  updatedAt?: string
}

// All available categories
const categories = [
  'adventure-nature-based-tours',
  'culture-heritage-tours',
  'family-tours',
  'luxury-bespoke-tours',
  'north-east-coast-tours',
  'popular-tours',
  'purpose-built-tours',
  'romantic-tours',
  'special-transit-tours',
  'sports-based-tours',
  'sustainable-tours',
  'wellness-tours',
  'wildlife-tours',
]

export default function ItinerariesPage() {
  const { t, language } = useLanguage()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    const fetchTours = async () => {
      try {
        setLoading(true)

        // Fetch 3 most recent tours from each category
        const allToursPromises = categories.map(async (category) => {
          try {
            // Sort by createdAt descending to get most recent first, limit to 3
            const response = await fetch(
              `/api/itinerary-pages?where[category][equals]=${category}&limit=3&sort=-createdAt&depth=2`,
            )
            if (!response.ok) {
              console.warn(`Failed to fetch tours for category: ${category}`)
              return []
            }
            const data = await response.json()
            return data.docs || []
          } catch (err) {
            console.error(`Error fetching tours for category ${category}:`, err)
            return []
          }
        })

        // Wait for all category requests to complete
        const categoryResults = await Promise.all(allToursPromises)

        // Flatten the array of arrays into a single array
        const allTours = categoryResults.flat()

        // Sort all tours by createdAt descending (most recent first)
        allTours.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })

        setTours(allTours)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching tours:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  const getImageUrl = (tour: Tour) => {
    if (tour.image?.url) {
      return tour.image.url
    }
    if (tour.image?.filename) {
      return `/api/media/file/${tour.image.filename}`
    }
    return mountainTourImage
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>{t('common.loadingTours')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>
            {t('common.errorLoadingTours')}: {error}
          </p>
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
            src={mainPageCover}
            alt="Itineraries"
            fill
            priority
            className="itinerary-hero-image"
            style={{ objectFit: 'cover' }}
          />
          <div className="itinerary-hero-overlay"></div>
        </div>
        <div className="itinerary-hero-content">
          <h1>{t('nav.itineraries')}</h1>
          <p className="itinerary-hero-subtitle">
            {t('hero.curatedItineraries') ||
              'Discover our carefully curated selection of tours and experiences'}
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="itinerary-intro">
        <div className="container">
          <div className="itinerary-intro-content">
            <h2>{t('hero.curatedItineraries') || 'Curated Itineraries'}</h2>
            <p>{t('cms.itineraries.introDescription1')}</p>
            <p>{t('cms.itineraries.introDescription2')}</p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="itinerary-tours">
        <div className="container">
          <h2 className="section-title">{t('hero.curatedItineraries') || 'Curated Itineraries'}</h2>
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
                            href={`/itineraries/${tour.category}/${tour.slug}`}
                            className="tour-enquire-btn"
                          >
                            {t('adventureNature.readMore') || 'Read More'}
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
