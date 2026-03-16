'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import mountainTourImage from '../assest/images/adventure.jpg'
import { useLanguage } from '../contexts/LanguageContext'
import '../itineraries/styles.css'
import './styles.css'

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

interface Experience {
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

export default function DiscoverSriLankaPage() {
  const { t, language } = useLanguage()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
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
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch 6 most recently added destinations
        const destinationsResponse = await fetch(
          `/api/destination-pages?limit=6&sort=-createdAt&depth=2`,
        )
        if (destinationsResponse.ok) {
          const destinationsData = await destinationsResponse.json()
          setDestinations(destinationsData.docs || [])
        }

        // Fetch 6 most recently added experiences
        const experiencesResponse = await fetch(
          `/api/experience-pages?limit=6&sort=-createdAt&depth=2`,
        )
        if (experiencesResponse.ok) {
          const experiencesData = await experiencesResponse.json()
          setExperiences(experiencesData.docs || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getImageUrl = (item: Destination | Experience) => {
    if (item.image?.url) {
      return item.image.url
    }
    if (item.image?.filename) {
      return `/api/media/file/${item.image.filename}`
    }
    return mountainTourImage
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>{t('cms.discover.loading') || 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>
            {t('cms.discover.errorLoading') || 'Error loading data'}: {error}
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
              {t('cms.discover.title') || 'Discover Sri Lanka'}
            </h2>
            <p>
              {t('cms.discover.description') ||
                'Explore the enchanting beauty, rich culture, and unforgettable experiences that make Sri Lanka a truly magical destination.'}
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="itinerary-tours">
        <div className="container">
          <h2 className="section-title">
            {t('cms.discover.destinations.title') || 'Destinations'}
          </h2>
          <p
            style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', color: '#555' }}
          >
            {t('cms.discover.destinations.description') ||
              'Discover the diverse and captivating destinations across Sri Lanka, each offering unique experiences and breathtaking beauty.'}
          </p>
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
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              href="/discover-sri-lanka/destinations"
              className="tour-enquire-btn tour-enquire-btn-secondary"
            >
              {t('cms.discover.destinations.discoverAll') || 'Discover all Destinations'}
            </Link>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="itinerary-tours" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">{t('cms.discover.experiences.title') || 'Experiences'}</h2>
          <p
            style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', color: '#555' }}
          >
            {t('cms.discover.experiences.description') ||
              'Immerse yourself in authentic Sri Lankan experiences that will create lasting memories and deepen your connection with this beautiful island.'}
          </p>
          <div className="tours-grid">
            {experiences.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>{t('cms.discover.experiences.noItems') || 'No experiences available.'}</p>
              </div>
            ) : (
              experiences.map((experience) => (
                <div key={experience.id} className="tour-card">
                  <div className="tour-card-image">
                    <Image
                      src={getImageUrl(experience)}
                      alt={experience.image?.alt || experience.title}
                      width={400}
                      height={300}
                      className="tour-img"
                    />
                  </div>
                  <div className="tour-card-content">
                    <h3>{getTranslatedValue(experience.title, experience.titleTranslations)}</h3>
                    <p>
                      {getTranslatedValue(
                        experience.description,
                        experience.descriptionTranslations,
                      )}
                    </p>
                    <div className="tour-card-footer">
                      <Link
                        href={`/discover-sri-lanka/experiences/${experience.slug}`}
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
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              href="/discover-sri-lanka/experiences"
              className="tour-enquire-btn tour-enquire-btn-secondary"
            >
              {t('cms.discover.experiences.discoverAll') || 'Discover all Experiences'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
