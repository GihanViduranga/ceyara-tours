'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import mountainTourImage from '../../../assest/images/adventure.jpg'
import { useLanguage } from '../../../contexts/LanguageContext'
import '../../styles.css'

interface DayImage {
  id: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
}

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
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
  fullDescription?: string
  fullDescriptionTranslations?: Translations
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
  itineraryDays?: ItineraryDay[]
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

export default function TourDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { t, language } = useLanguage()
  const [category, setCategory] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then((resolvedParams) => {
      setCategory(resolvedParams.category)
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
    if (!slug || !category) return

    const fetchTour = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/itinerary-pages?where[slug][equals]=${slug}&where[category][equals]=${category}&limit=1&depth=2`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch tour')
        }
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setTour(data.docs[0])
        } else {
          setError(t('common.tourNotFound'))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching tour:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [slug, category])

  const getImageUrl = (image?: { url?: string; filename?: string }) => {
    if (image?.url) {
      return image.url
    }
    if (image?.filename) {
      return `/api/media/file/${image.filename}`
    }
    return null
  }

  const getHeroImageUrl = (tour: Tour | null) => {
    if (!tour) return mountainTourImage
    // Use mainImage if available, otherwise fallback to image
    const imageUrl = getImageUrl(tour.mainImage) || getImageUrl(tour.image)
    return imageUrl || mountainTourImage
  }

  const getDayImageUrl = (dayImage?: DayImage) => {
    if (!dayImage?.image) return null
    return getImageUrl(dayImage.image)
  }

  const translationKey = category
    ? categoryTranslationMap[category] || 'adventureNature'
    : 'adventureNature'

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="loading-container">
          <p>Loading tour...</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="itinerary-page">
        <section className="itinerary-intro">
          <div className="container">
            <div className="itinerary-intro-content">
              <h2>{t(`${translationKey}.tourNotFound`) || 'Tour Not Found'}</h2>
              <p>
                {error ||
                  t(`${translationKey}.tourNotFoundDescription`) ||
                  'The tour you are looking for does not exist.'}
              </p>
              <Link href={`/itineraries/${category}`} className="tour-enquire-btn">
                {t(`${translationKey}.backToTours`) || 'Back to Tours'}
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="itinerary-page">
      {/* Hero Section */}
      <section className="itinerary-hero">
        <div className="itinerary-hero-background">
          <Image
            src={getHeroImageUrl(tour)}
            alt={tour.mainImage?.alt || tour.image?.alt || tour.title}
            fill
            priority
            className="itinerary-hero-image"
            style={{ objectFit: 'cover' }}
          />
          <div className="itinerary-hero-overlay"></div>
        </div>
        <div className="itinerary-hero-content">
          <h1>{getTranslatedValue(tour.title, tour.titleTranslations)}</h1>
          <p className="itinerary-hero-subtitle">
            {getTranslatedValue(tour.duration, tour.durationTranslations)}
          </p>
        </div>
      </section>

      {/* Tour Details Section */}
      <section className="itinerary-intro">
        <div className="container">
          <div className="itinerary-intro-content">
            <h2>{getTranslatedValue(tour.title, tour.titleTranslations)}</h2>
            <p>{getTranslatedValue(tour.description, tour.descriptionTranslations)}</p>
            {tour.fullDescription && (
              <p>{getTranslatedValue(tour.fullDescription, tour.fullDescriptionTranslations)}</p>
            )}
            <div className="tour-actions">
              <Link href="/enquiry" className="tour-enquire-btn">
                {t(`${translationKey}.enquireNow`) || 'Enquire Now'}
              </Link>
              <Link
                href={`/itineraries/${category}`}
                className="tour-enquire-btn tour-enquire-btn-secondary"
              >
                {t(`${translationKey}.backToTours`) || 'Back to Tours'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Days Section */}
      {tour.itineraryDays && tour.itineraryDays.length > 0 && (
        <section className="itinerary-days">
          <div className="container">
            <div className="days-list">
              {tour.itineraryDays
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((day) => (
                  <div key={day.id} className="day-card">
                    <div className="day-card-content">
                      <div className="day-number-circle">
                        <span className="day-label">Day</span>
                        <span className="day-number">{day.dayNumber}</span>
                      </div>
                      <div className="day-details">
                        <h3 className="day-title">
                          {getTranslatedValue(day.title, day.titleTranslations)}
                        </h3>
                        <ul className="day-activities">
                          {day.activities.map((activity) => (
                            <li key={activity.id}>
                              {getTranslatedValue(activity.activity, activity.translations)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {day.images && day.images.length > 0 && (
                      <div className="day-images">
                        {day.images.map((dayImage, idx) => {
                          const imageUrl = getDayImageUrl(dayImage)
                          return imageUrl ? (
                            <div key={dayImage.id || idx} className="day-image-wrapper">
                              <Image
                                src={imageUrl}
                                alt={dayImage.image?.alt || `${day.title} - Image ${idx + 1}`}
                                width={300}
                                height={200}
                                className="day-image"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
