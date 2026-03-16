'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import mountainTourImage from '../../../assest/images/adventure.jpg'
import { useLanguage } from '../../../contexts/LanguageContext'
import '../../../day-tours/styles.css'
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

interface TopAttraction {
  id: string
  attractionName: string
  attractionNameTranslations?: Translations
  attractionDescription?: string
  attractionDescriptionTranslations?: Translations
  attractionImage?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
}

interface Destination {
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
  topAttractions?: TopAttraction[]
}

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { language, t } = useLanguage()
  const [slug, setSlug] = useState<string>('')
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentAttractionIndex, setCurrentAttractionIndex] = useState(0)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

    const fetchDestination = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/destination-pages?where[slug][equals]=${slug}&limit=1&depth=2`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch destination')
        }
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setDestination(data.docs[0])
        } else {
          setError(t('common.destinationNotFound'))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching destination:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDestination()
  }, [slug])

  // Auto-play functionality for Attractions Carousel
  useEffect(() => {
    if (!destination?.topAttractions || destination.topAttractions.length === 0) return

    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentAttractionIndex((prevIndex) => (prevIndex + 1) % destination.topAttractions!.length)
    }, 5000) // Every 5 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [destination?.topAttractions])

  const goToNext = () => {
    if (!destination?.topAttractions || destination.topAttractions.length === 0) return
    const length = destination.topAttractions.length
    setCurrentAttractionIndex((prevIndex) => (prevIndex + 1) % length)
    // Reset auto-play timer
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
    }
    autoScrollIntervalRef.current = setInterval(() => {
      if (!destination?.topAttractions || destination.topAttractions.length === 0) return
      const len = destination.topAttractions.length
      setCurrentAttractionIndex((prevIndex) => (prevIndex + 1) % len)
    }, 5000)
  }

  const goToPrevious = () => {
    if (!destination?.topAttractions || destination.topAttractions.length === 0) return
    const length = destination.topAttractions.length
    setCurrentAttractionIndex((prevIndex) => (prevIndex - 1 + length) % length)
    // Reset auto-play timer
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
    }
    autoScrollIntervalRef.current = setInterval(() => {
      if (!destination?.topAttractions || destination.topAttractions.length === 0) return
      const len = destination.topAttractions.length
      setCurrentAttractionIndex((prevIndex) => (prevIndex + 1) % len)
    }, 5000)
  }

  const getImageUrl = (image?: { url?: string; filename?: string }) => {
    if (image?.url) {
      return image.url
    }
    if (image?.filename) {
      return `/api/media/file/${image.filename}`
    }
    return null
  }

  const getHeroImageUrl = (destination: Destination | null) => {
    if (!destination) return mountainTourImage
    const imageUrl = getImageUrl(destination.mainImage) || getImageUrl(destination.image)
    return imageUrl || mountainTourImage
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="loading-container">
          <p>{t('cms.discover.destinations.loading') || 'Loading destination...'}</p>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="itinerary-page">
        <section className="itinerary-intro">
          <div className="container">
            <div className="itinerary-intro-content">
              <h2>{t('cms.discover.destinations.notFound') || 'Destination Not Found'}</h2>
              <p>
                {error ||
                  t('cms.discover.destinations.notFoundDescription') ||
                  'The destination you are looking for does not exist.'}
              </p>
              <Link href="/discover-sri-lanka/destinations" className="tour-enquire-btn">
                {t('cms.discover.destinations.backToDestinations') || 'Back to Destinations'}
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
                src={getHeroImageUrl(destination)}
                alt={destination.mainImage?.alt || destination.image?.alt || destination.title}
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Right: Title, Description and Buttons */}
            <div className="discover-hero-content">
              <h1 className="discover-title">
                {getTranslatedValue(destination.title, destination.titleTranslations)}
              </h1>
              <p className="discover-description">
                {getTranslatedValue(
                  destination.fullDescription || destination.description,
                  destination.fullDescriptionTranslations || destination.descriptionTranslations,
                )}
              </p>
              <div className="discover-action-buttons">
                <a
                  href="#top-attractions"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById('top-attractions')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className="discover-btn discover-btn-primary"
                >
                  <span>✓</span> {t('cms.discover.exploreMore') || 'EXPLORE MORE'}
                </a>
                <Link href="/enquiry" className="discover-btn discover-btn-secondary">
                  <span>+</span> {t('cms.discover.tailorMakeTour') || 'TAILOR-MAKE A TOUR'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Attractions Section */}
      {destination.topAttractions && destination.topAttractions.length > 0 && (
        <section id="top-attractions" className="places-carousel-section">
          <div className="container">
            <h2 className="places-carousel-title">
              {t('cms.discover.topAttractions') || 'Top Attractions'}
            </h2>
            <div className="places-carousel-container">
              <div className="places-carousel-cards">
                {/* Main Featured Card */}
                {destination.topAttractions[currentAttractionIndex] && (
                  <div className="places-featured-card">
                    <div className="places-card-image-wrapper">
                      <Image
                        src={
                          getImageUrl(
                            destination.topAttractions[currentAttractionIndex].attractionImage,
                          ) || mountainTourImage
                        }
                        alt={
                          destination.topAttractions[currentAttractionIndex].attractionImage?.alt ||
                          getTranslatedValue(
                            destination.topAttractions[currentAttractionIndex].attractionName,
                            destination.topAttractions[currentAttractionIndex]
                              .attractionNameTranslations,
                          )
                        }
                        fill
                        className="places-card-image"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="places-card-overlay"></div>
                    </div>
                    <div className="places-card-content">
                      <h3 className="places-card-title">
                        {getTranslatedValue(
                          destination.topAttractions[currentAttractionIndex].attractionName,
                          destination.topAttractions[currentAttractionIndex]
                            .attractionNameTranslations,
                        )}
                      </h3>
                      {destination.topAttractions[currentAttractionIndex].attractionDescription && (
                        <p className="places-card-text">
                          {getTranslatedValue(
                            destination.topAttractions[currentAttractionIndex]
                              .attractionDescription,
                            destination.topAttractions[currentAttractionIndex]
                              .attractionDescriptionTranslations,
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Smaller Horizontal Cards at Bottom Right - Show other places excluding current */}
                {destination.topAttractions.length > 1 && (
                  <div className="places-small-cards">
                    {destination.topAttractions
                      .filter((_, index) => index !== currentAttractionIndex)
                      .slice(0, 4)
                      .map((attraction, index) => (
                        <div
                          key={attraction.id}
                          className="places-small-card"
                          style={{ zIndex: 10 - index }}
                          onClick={() => {
                            if (!destination.topAttractions) return
                            const newIndex = destination.topAttractions.findIndex(
                              (a) => a.id === attraction.id,
                            )
                            if (newIndex !== -1) {
                              setCurrentAttractionIndex(newIndex)
                            }
                          }}
                        >
                          {attraction.attractionImage && (
                            <div className="places-small-card-image-wrapper">
                              <Image
                                src={getImageUrl(attraction.attractionImage) || mountainTourImage}
                                alt={
                                  attraction.attractionImage?.alt ||
                                  getTranslatedValue(
                                    attraction.attractionName,
                                    attraction.attractionNameTranslations,
                                  )
                                }
                                fill
                                className="places-small-card-image"
                                style={{ objectFit: 'cover' }}
                              />
                              <div className="places-small-card-overlay"></div>
                            </div>
                          )}
                          <p className="places-small-card-title">
                            {getTranslatedValue(
                              attraction.attractionName,
                              attraction.attractionNameTranslations,
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* Navigation Arrows */}
                {destination.topAttractions.length > 1 && (
                  <>
                    <button
                      className="places-carousel-arrow places-carousel-arrow-left"
                      onClick={goToPrevious}
                      aria-label="Previous attraction"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="places-carousel-arrow places-carousel-arrow-right"
                      onClick={goToNext}
                      aria-label="Next attraction"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="itinerary-intro">
        <div className="container">
          <div className="itinerary-intro-content">
            <Link
              href="/discover-sri-lanka/destinations"
              className="tour-enquire-btn tour-enquire-btn-secondary"
            >
              {t('cms.discover.destinations.backToDestinations') || 'Back to Destinations'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
