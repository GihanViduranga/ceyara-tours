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

export default function ExperiencesPage() {
  const { t, language } = useLanguage()
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
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/experience-pages?limit=100&sort=-createdAt&depth=2`)
        if (!response.ok) {
          throw new Error('Failed to fetch experiences')
        }
        const data = await response.json()
        setExperiences(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching experiences:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  const getImageUrl = (experience: Experience) => {
    if (experience.image?.url) {
      return experience.image.url
    }
    if (experience.image?.filename) {
      return `/api/media/file/${experience.image.filename}`
    }
    return mountainTourImage
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>{t('cms.discover.experiences.loading') || 'Loading experiences...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="itinerary-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>
            {t('cms.discover.experiences.errorLoading') || 'Error loading experiences'}: {error}
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
              {t('cms.discover.experiences.title') || 'Experiences'}
            </h2>
            <p>
              {t('cms.discover.experiences.pageDescription') ||
                'Immerse yourself in authentic Sri Lankan experiences that will create lasting memories and deepen your connection with this beautiful island.'}
            </p>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="itinerary-tours">
        <div className="container">
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
        </div>
      </section>
    </div>
  )
}
