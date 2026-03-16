'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import mountainTourImage from '../../assest/images/adventure.jpg'
import { useLanguage } from '../../contexts/LanguageContext'
import '../../itineraries/styles.css'
import '../styles.css'

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface Destination {
  id: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  slug: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  createdAt?: string
}

export default function DestinationsPage() {
  const { t, language } = useLanguage()
  const [destinations, setDestinations] = useState<Destination[]>([])
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
    const fetchDestinations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/destination-pages?limit=100&sort=-createdAt&depth=2`)
        if (!response.ok) {
          throw new Error('Failed to fetch destinations')
        }
        const data = await response.json()
        setDestinations(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching destinations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const getImageUrl = (destination: Destination) => {
    if (destination.image?.url) {
      return destination.image.url
    }
    if (destination.image?.filename) {
      return `/api/media/file/${destination.image.filename}`
    }
    return mountainTourImage
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>{t('cms.discover.destinations.loading') || 'Loading destinations...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>
            {t('cms.discover.destinations.errorLoading') || 'Error loading destinations'}: {error}
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
              {t('cms.discover.destinations.title') || 'Destinations'}
            </h2>
            <p>
              {t('cms.discover.destinations.pageDescription') ||
                'Discover the diverse and captivating destinations across Sri Lanka, each offering unique experiences and breathtaking beauty.'}
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="itinerary-tours">
        <div className="container">
          <div className="tours-grid">
            {destinations.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>{t('cms.discover.destinations.noItems') || 'No destinations available.'}</p>
              </div>
            ) : (
              destinations.map((destination) => (
                <div key={destination.id} className="tour-card">
                  <div className="tour-card-image">
                    <Image
                      src={getImageUrl(destination)}
                      alt={destination.image?.alt || destination.title}
                      width={400}
                      height={300}
                      className="tour-img"
                    />
                  </div>
                  <div className="tour-card-content">
                    <h3>{getTranslatedValue(destination.title, destination.titleTranslations)}</h3>
                    <p>
                      {getTranslatedValue(
                        destination.description,
                        destination.descriptionTranslations,
                      )}
                    </p>
                    <div className="tour-card-footer">
                      <Link
                        href={`/discover-sri-lanka/destinations/${destination.slug}`}
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
