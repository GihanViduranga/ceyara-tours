'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import mountainTourImage from '../assest/images/adventure.jpg'
import { useLanguage } from '../contexts/LanguageContext'
import '../itineraries/styles.css'

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface Accommodation {
  id: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  location?: string
  locationTranslations?: Translations
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

export default function AccommodationPage() {
  const { t, language } = useLanguage()
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
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
    const fetchAccommodations = async () => {
      try {
        setLoading(true)
        // Fetch all accommodations, sorted by most recent first
        const response = await fetch(`/api/accommodation-pages?limit=100&sort=-createdAt&depth=2`)
        if (!response.ok) {
          throw new Error('Failed to fetch accommodations')
        }
        const data = await response.json()
        setAccommodations(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching accommodations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodations()
  }, [])

  const getImageUrl = (accommodation: Accommodation) => {
    if (accommodation.image?.url) {
      return accommodation.image.url
    }
    if (accommodation.image?.filename) {
      return `/api/media/file/${accommodation.image.filename}`
    }
    return mountainTourImage
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>{t('cms.accommodation.loading') || 'Loading accommodations...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>
            {t('cms.accommodation.errorLoading') || 'Error loading accommodations'}: {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="itinerary-page">
      {/* Introduction Section */}
      <section className="itinerary-intro" style={{ marginTop: '2rem' }}>
        <div className="container">
          <div className="itinerary-intro-content">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              {t('nav.accommodation') || 'Accommodation'}
            </h2>
            <p>
              {t('cms.accommodation.introDescription1') ||
                'Discover our carefully selected accommodations across Sri Lanka and the Maldives.'}
            </p>
            <p>
              {t('cms.accommodation.introDescription2') ||
                'From luxury resorts to boutique hotels, we offer a range of options to suit every traveler.'}
            </p>
          </div>
        </div>
      </section>

      {/* Accommodations Grid */}
      <section className="itinerary-tours">
        <div className="container">
          <h2 className="section-title">{t('cms.accommodation.title') || 'Our Accommodations'}</h2>
          <div className="tours-grid">
            {accommodations.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>
                  {t('cms.accommodation.noAccommodations') ||
                    'No accommodations available at the moment.'}
                </p>
              </div>
            ) : (
              accommodations.map((accommodation) => (
                <div key={accommodation.id} className="tour-card">
                  <div className="tour-card-image">
                    <Image
                      src={getImageUrl(accommodation)}
                      alt={accommodation.image?.alt || accommodation.title}
                      width={400}
                      height={300}
                      className="tour-img"
                    />
                    {accommodation.location && (
                      <div className="tour-duration-badge">
                        {getTranslatedValue(
                          accommodation.location,
                          accommodation.locationTranslations,
                        )}
                      </div>
                    )}
                  </div>
                  <div className="tour-card-content">
                    <h3>
                      {getTranslatedValue(accommodation.title, accommodation.titleTranslations)}
                    </h3>
                    <p>
                      {getTranslatedValue(
                        accommodation.description,
                        accommodation.descriptionTranslations,
                      )}
                    </p>
                    <div className="tour-card-footer">
                      <Link
                        href={`/accommodation/${accommodation.slug}`}
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
