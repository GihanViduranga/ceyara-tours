'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
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

interface Facility {
  id: string
  facility: string
  translations?: Translations
}

interface RoomFeature {
  id: string
  feature: string
  translations?: Translations
}

interface RoomType {
  id: string
  roomName: string
  roomNameTranslations?: Translations
  roomDescription?: string
  roomDescriptionTranslations?: Translations
  roomSize?: string
  roomImage?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  roomFeatures?: RoomFeature[]
}

interface Accommodation {
  id: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  fullDescription?: string
  fullDescriptionTranslations?: Translations
  location?: string
  locationTranslations?: Translations
  slug: string
  numberOfRooms?: number
  numberOfRestaurants?: number
  managedBy?: string
  managedByTranslations?: Translations
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
  facilities?: Facility[]
  roomTypes?: RoomType[]
}

export default function AccommodationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { language, t } = useLanguage()
  const [slug, setSlug] = useState<string>('')
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, setCurrentRoomIndex] = useState(0)
  const roomTypesScrollRef = React.useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isPaused, setIsPaused] = useState(false)

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

    const fetchAccommodation = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/accommodation-pages?where[slug][equals]=${slug}&limit=1&depth=2`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch accommodation')
        }
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setAccommodation(data.docs[0])
        } else {
          setError(t('common.accommodationNotFound'))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.anErrorOccurred'))
        console.error('Error fetching accommodation:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodation()
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

  const getHeroImageUrl = (accommodation: Accommodation | null) => {
    if (!accommodation) return mountainTourImage
    const imageUrl = getImageUrl(accommodation.mainImage) || getImageUrl(accommodation.image)
    return imageUrl || mountainTourImage
  }

  // Auto-scroll functionality for Room Types
  useEffect(() => {
    if (!accommodation?.roomTypes || accommodation.roomTypes.length === 0) return
    if (isPaused) return

    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentRoomIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % accommodation.roomTypes!.length
        if (roomTypesScrollRef.current) {
          const cardWidth = roomTypesScrollRef.current.children[0]?.clientWidth || 0
          const gap = 32 // 2rem gap
          const scrollPosition = nextIndex * (cardWidth + gap)
          roomTypesScrollRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth',
          })
        }
        return nextIndex
      })
    }, 2000) // Move every 2 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [accommodation?.roomTypes, isPaused])

  const scrollRooms = (direction: 'left' | 'right') => {
    if (!accommodation?.roomTypes || !roomTypesScrollRef.current) return

    const cardWidth = roomTypesScrollRef.current.children[0]?.clientWidth || 0
    const gap = 32
    const scrollAmount = cardWidth + gap

    if (direction === 'left') {
      setCurrentRoomIndex((prev) => {
        const newIndex = prev === 0 ? accommodation.roomTypes!.length - 1 : prev - 1
        roomTypesScrollRef.current!.scrollTo({
          left: newIndex * scrollAmount,
          behavior: 'smooth',
        })
        return newIndex
      })
    } else {
      setCurrentRoomIndex((prev) => {
        const newIndex = (prev + 1) % accommodation.roomTypes!.length
        roomTypesScrollRef.current!.scrollTo({
          left: newIndex * scrollAmount,
          behavior: 'smooth',
        })
        return newIndex
      })
    }
  }

  if (loading) {
    return (
      <div className="itinerary-page">
        <div className="loading-container">
          <p>{t('cms.accommodation.loading') || 'Loading accommodation...'}</p>
        </div>
      </div>
    )
  }

  if (error || !accommodation) {
    return (
      <div className="itinerary-page">
        <section className="itinerary-intro">
          <div className="container">
            <div className="itinerary-intro-content">
              <h2>{t('cms.accommodation.notFound') || 'Accommodation Not Found'}</h2>
              <p>
                {error ||
                  t('cms.accommodation.notFoundDescription') ||
                  'The accommodation you are looking for does not exist.'}
              </p>
              <Link href="/accommodation" className="tour-enquire-btn">
                {t('cms.accommodation.backToAccommodations') || 'Back to Accommodations'}
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="itinerary-page">
      {/* Hero Section with Image and Info Cards */}
      <section className="accommodation-hero-section">
        <div className="container">
          <div className="accommodation-hero-grid">
            {/* Left: Hero Image */}
            <div className="accommodation-hero-image-wrapper">
              <Image
                src={getHeroImageUrl(accommodation)}
                alt={
                  accommodation.mainImage?.alt || accommodation.image?.alt || accommodation.title
                }
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Right: Info Cards and Actions */}
            <div>
              <h1 className="accommodation-title">
                {getTranslatedValue(accommodation.title, accommodation.titleTranslations)}
              </h1>

              {/* Info Cards Grid */}
              <div className="accommodation-info-cards">
                {accommodation.numberOfRooms !== undefined && (
                  <div className="accommodation-info-card">
                    <div className="accommodation-info-icon">🛏️</div>
                    <div className="accommodation-info-value">
                      {accommodation.numberOfRooms}{' '}
                      {accommodation.numberOfRooms === 1
                        ? t('cms.accommodation.room') || 'Room'
                        : t('cms.accommodation.rooms') || 'Rooms'}
                    </div>
                    <div className="accommodation-info-label">
                      {t('cms.accommodation.roomsAndSuites') || 'Rooms & Suites'}
                    </div>
                  </div>
                )}

                {accommodation.numberOfRestaurants !== undefined && (
                  <div className="accommodation-info-card">
                    <div className="accommodation-info-icon">🍴</div>
                    <div className="accommodation-info-value">
                      {accommodation.numberOfRestaurants}{' '}
                      {accommodation.numberOfRestaurants === 1
                        ? t('cms.accommodation.restaurant') || 'Restaurant'
                        : t('cms.accommodation.restaurants') || 'Restaurants'}
                    </div>
                    <div className="accommodation-info-label">
                      {t('cms.accommodation.noOfRestaurants') || 'No of Restaurants'}
                    </div>
                  </div>
                )}

                {accommodation.location && (
                  <div className="accommodation-info-card">
                    <div className="accommodation-info-icon">📍</div>
                    <div className="accommodation-info-value">
                      {getTranslatedValue(
                        accommodation.location,
                        accommodation.locationTranslations,
                      )}
                    </div>
                    <div className="accommodation-info-label">
                      {t('cms.accommodation.locatedIn') || 'Located in'}
                    </div>
                  </div>
                )}

                {accommodation.managedBy && (
                  <div className="accommodation-info-card">
                    <div className="accommodation-info-icon">📄</div>
                    <div className="accommodation-info-value">
                      {getTranslatedValue(
                        accommodation.managedBy,
                        accommodation.managedByTranslations,
                      )}
                    </div>
                    <div className="accommodation-info-label">
                      {t('cms.accommodation.managedBy') || 'Managed by'}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="accommodation-action-buttons">
                <a
                  href="#room-types"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById('room-types')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className="accommodation-btn accommodation-btn-primary"
                >
                  <span>✓</span> {t('cms.accommodation.exploreMore') || 'EXPLORE MORE'}
                </a>
                <Link href="/enquiry" className="accommodation-btn accommodation-btn-secondary">
                  <span>+</span> {t('cms.accommodation.planATourForMe') || 'PLAN A TOUR FOR ME'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {accommodation.fullDescription && (
        <section className="itinerary-intro">
          <div className="container">
            <div className="itinerary-intro-content" style={{ textAlign: 'left' }}>
              <p className="accommodation-description">
                {getTranslatedValue(
                  accommodation.fullDescription,
                  accommodation.fullDescriptionTranslations,
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Facilities Section */}
      {accommodation.facilities && accommodation.facilities.length > 0 && (
        <section className="itinerary-tours" style={{ background: 'white' }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              {t('cms.accommodation.mostPopularFacilities') || 'Most popular facilities'}
            </h2>
            <div className="accommodation-facilities-grid">
              {accommodation.facilities.map((facility) => (
                <div key={facility.id} className="accommodation-facility-item">
                  <span className="accommodation-facility-check">✓</span>
                  <span className="accommodation-facility-text">
                    {getTranslatedValue(facility.facility, facility.translations)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Room Types Section */}
      {accommodation.roomTypes && accommodation.roomTypes.length > 0 && (
        <section id="room-types" className="itinerary-tours">
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              {t('cms.accommodation.roomTypes') || 'Room Types'}
            </h2>
            <div className="room-types-container">
              {/* Left Arrow */}
              <button
                onClick={() => scrollRooms('left')}
                className="room-types-arrow room-types-arrow-left"
                aria-label="Scroll left"
              >
                ‹
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scrollRooms('right')}
                className="room-types-arrow room-types-arrow-right"
                aria-label="Scroll right"
              >
                ›
              </button>

              {/* Scrollable Container */}
              <div
                ref={roomTypesScrollRef}
                className="room-types-scroll"
                style={{
                  display: 'flex',
                  gap: '2rem',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                  padding: '1rem 0',
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE/Edge
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {accommodation.roomTypes.map((room) => {
                  const roomImageUrl = getImageUrl(room.roomImage)
                  return (
                    <div key={room.id} className="room-type-card">
                      {roomImageUrl && (
                        <div className="room-type-image-wrapper">
                          <Image
                            src={roomImageUrl}
                            alt={
                              room.roomImage?.alt ||
                              getTranslatedValue(room.roomName, room.roomNameTranslations)
                            }
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className="room-type-content">
                        <h3 className="room-type-title">
                          {getTranslatedValue(room.roomName, room.roomNameTranslations)}
                        </h3>
                        {room.roomDescription && (
                          <p className="room-type-description">
                            {(() => {
                              const description = getTranslatedValue(
                                room.roomDescription,
                                room.roomDescriptionTranslations,
                              )
                              const words = description.split(' ')
                              return words.length > 25
                                ? words.slice(0, 25).join(' ') + '...'
                                : description
                            })()}
                          </p>
                        )}
                        {(room.roomSize || (room.roomFeatures && room.roomFeatures.length > 0)) && (
                          <div className="room-type-features-container">
                            <div className="room-type-features-grid">
                              {room.roomSize && (
                                <div className="room-type-feature">
                                  <span className="room-type-feature-check">✓</span>
                                  <span>
                                    {t('cms.accommodation.roomSize') || 'Room size'}:{' '}
                                    {room.roomSize}
                                  </span>
                                </div>
                              )}
                              {room.roomFeatures &&
                                room.roomFeatures.map((feature) => (
                                  <div key={feature.id} className="room-type-feature">
                                    <span className="room-type-feature-check">✓</span>
                                    <span>
                                      {getTranslatedValue(feature.feature, feature.translations)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="itinerary-intro">
        <div className="container">
          <div className="itinerary-intro-content">
            <Link href="/accommodation" className="tour-enquire-btn tour-enquire-btn-secondary">
              {t('cms.accommodation.backToAccommodations') || 'Back to Accommodations'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
