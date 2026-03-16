'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import mountainTourImage from '../../../assest/images/adventure.jpg'
import { useLanguage } from '../../../contexts/LanguageContext'
import '../../../itineraries/styles.css'
import '../../styles.css'

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface WhereYouCanExperience {
  id: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
}

interface Experience {
  id: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  fullDescription?: string
  fullDescriptionTranslations?: Translations
  slug: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  mainImage?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  whereYouCanExperience?: WhereYouCanExperience[]
}

export default function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { language, t } = useLanguage()
  const [slug, setSlug] = useState<string>('')
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    const fetchExperience = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/experience-pages?where[slug][equals]=${slug}&limit=1&depth=2`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch experience')
        }
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setExperience(data.docs[0])
        } else {
          setError(t('common.experienceNotFound'))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching experience:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [slug])

  const getImageUrl = (image?: { url?: string; filename?: string }) => {
    if (image?.url) {
      return image.url
    }
    if (image?.filename) {
      return `/api/media/file/${image.filename}`
    }
    return null
  }

  const getHeroImageUrl = (experience: Experience | null) => {
    if (!experience) return mountainTourImage
    const imageUrl = getImageUrl(experience.mainImage) || getImageUrl(experience.image)
    return imageUrl || mountainTourImage
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="loading-container">
          <p>{t('cms.discover.experiences.loading') || 'Loading experience...'}</p>
        </div>
      </div>
    )
  }

  if (error || !experience) {
    return (
      <div className="itinerary-page">
        <section className="itinerary-intro">
          <div className="container">
            <div className="itinerary-intro-content">
              <h2>{t('cms.discover.experiences.notFound') || 'Experience Not Found'}</h2>
              <p>
                {error ||
                  t('cms.discover.experiences.notFoundDescription') ||
                  'The experience you are looking for does not exist.'}
              </p>
              <Link href="/discover-sri-lanka/experiences" className="tour-enquire-btn">
                {t('cms.discover.experiences.backToExperiences') || 'Back to Experiences'}
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="itinerary-page">
      {/* Hero Section with Curved Image */}
      <section className="discover-hero-section">
        <div className="container">
          <div className="discover-hero-grid">
            {/* Left: Curved Hero Image */}
            <div className="discover-hero-image-wrapper">
              <Image
                src={getHeroImageUrl(experience)}
                alt={experience.mainImage?.alt || experience.image?.alt || experience.title}
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Right: Title, Description and Buttons */}
            <div className="discover-hero-content">
              <h1 className="discover-title">
                {getTranslatedValue(experience.title, experience.titleTranslations)}
              </h1>
              <p className="discover-description">
                {getTranslatedValue(
                  experience.fullDescription || experience.description,
                  experience.fullDescriptionTranslations || experience.descriptionTranslations,
                )}
              </p>
              <div className="discover-action-buttons">
                <Link href="/enquiry" className="discover-btn discover-btn-primary">
                  <span>✓</span> {t('cms.discover.exploreMore') || 'EXPLORE MORE'}
                </Link>
                <Link href="/enquiry" className="discover-btn discover-btn-secondary">
                  <span>+</span> {t('cms.discover.tailorMakeTour') || 'TAILOR-MAKE A TOUR'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where You Can Experience Section */}
      {experience.whereYouCanExperience && experience.whereYouCanExperience.length > 0 && (
        <section className="itinerary-tours" style={{ background: '#f8f9fa' }}>
          <div className="container">
            <h2 className="section-title">
              {t('cms.discover.experiences.whereYouCanExperience') || 'Where you can experience'}
            </h2>
            <div className="tours-grid">
              {experience.whereYouCanExperience.map((location) => {
                const locationImageUrl = (() => {
                  if (location.image?.url) return location.image.url
                  if (location.image?.filename) return `/api/media/file/${location.image.filename}`
                  return null
                })()

                return (
                  <div key={location.id} className="tour-card">
                    {locationImageUrl && (
                      <div className="tour-card-image">
                        <Image
                          src={locationImageUrl}
                          alt={location.image?.alt || location.title}
                          width={400}
                          height={300}
                          className="tour-img"
                        />
                      </div>
                    )}
                    <div className="tour-card-content">
                      <h3>{getTranslatedValue(location.title, location.titleTranslations)}</h3>
                      <p>
                        {getTranslatedValue(location.description, location.descriptionTranslations)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="itinerary-intro">
        <div className="container">
          <div className="itinerary-intro-content">
            <Link
              href="/discover-sri-lanka/experiences"
              className="tour-enquire-btn tour-enquire-btn-secondary"
            >
              {t('cms.discover.experiences.backToExperiences') || 'Back to Experiences'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
