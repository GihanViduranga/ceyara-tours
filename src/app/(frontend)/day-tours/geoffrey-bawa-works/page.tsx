'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import geoffreyBawaWorksImage from '../../assest/images/GeoffreyBawaWorks.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Placeholder images - replace with actual images when available
import geoffreyBawaWorksImage1 from '../../assest/images/GeoffreyBawaWorks.jpg'
import Number11ColomboResidence from '../../assest/images/Number11ColomboResidence.jpg'
import ParadiseRoadGalleryCafé from '../../assest/images/ParadiseRoadGalleryCafé.jpg'
import TheRatnasivaratnamHouse from '../../assest/images/TheRatnasivaratnamHouse.jpg'
import LunugangaBentota from '../../assest/images/LunugangaBentota.jpg'
import Parliament from '../../assest/images/Parliament.jpg'
import SteelCorporationOffices from '../../assest/images/SteelCorporationOffices.jpg'

interface Place {
  id: number
  title: string
  description: string
  image: typeof geoffreyBawaWorksImage
}

interface PlacesCarouselData {
  featured: Place
  otherPlaces: Place[]
}

const getPlacesData = (t: (key: string) => string): PlacesCarouselData[] => [
  {
    featured: {
      id: 1,
      title:
        t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.lunuganga.title') ||
        'Lunuganga Garden',
      description:
        t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.lunuganga.description') ||
        "Lunuganga is Geoffrey Bawa's country estate and garden, a masterpiece of tropical landscape design that showcases his vision of blending architecture with nature.",
      image: LunugangaBentota,
    },
    otherPlaces: [
      {
        id: 3,
        title:
          t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.numberEleven.title') ||
          'Number Eleven',
        description:
          t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.numberEleven.description') ||
          "Number Eleven is Bawa's Colombo residence, now a museum showcasing his personal collection and design philosophy.",
        image: Number11ColomboResidence,
      },
    ],
  },
  {
    featured: {
      id: 5,
      title:
        t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.parliament.title') ||
        'Parliament Building',
      description:
        t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.parliament.description') ||
        "The Sri Lankan Parliament Building in Kotte is one of Bawa's most significant public works, reflecting his mastery of monumental architecture.",
      image: Parliament,
    },
    otherPlaces: [],
  },
  {
    featured: {
      id: 9,
      title:
        t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.paradiseRoadGallery.title') ||
        'Paradise Road Gallery Café',
      description:
        t(
          'dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.paradiseRoadGallery.description',
        ) ||
        "A vibrant conversion of Bawa's former office garage, now a celebrated café blending his architectural aesthetic with contemporary art and design.",
      image: ParadiseRoadGalleryCafé,
    },
    otherPlaces: [
      {
        id: 10,
        title:
          t(
            'dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.ratnasivaratnamHouse.title',
          ) || 'The Ratnasivaratnam House',
        description:
          t(
            'dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.ratnasivaratnamHouse.description',
          ) ||
          'A pioneering courtyard house in Colombo, celebrated for its ingenious use of a narrow urban plot to create a light-filled, private family home.',
        image: TheRatnasivaratnamHouse,
      },
      {
        id: 11,
        title:
          t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.steelCorporation.title') ||
          'Steel Corporation Offices and Housing',
        description:
          t(
            'dayTours.geoffreyBawaWorksSriLanka.placesCarousel.places.steelCorporation.description',
          ) ||
          'A robust industrial complex where modern forms are softened by landscaped courtyards and passive cooling techniques, creating a humane working environment.',
        image: SteelCorporationOffices,
      },
    ],
  },
]

export default function GeoffreyBawaWorksPage() {
  const { t, language } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)
  const descriptionSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Check on mount
    checkMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleExploreMore = () => {
    descriptionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const maskSvg = isMobile ? bannerMaskMobileSvg : bannerMaskSvg

  return (
    <div key={language} className="day-tour-detail-page">
      <div className="day-tour-detail-container">
        {/* Left Side - Curved Image */}
        <div className="day-tour-detail-image-wrapper">
          <div
            className="day-tour-detail-image-curved"
            style={{
              maskImage: `url(${maskSvg})`,
              WebkitMaskImage: `url(${maskSvg})`,
            }}
          >
            <Image
              src={geoffreyBawaWorksImage}
              alt={
                t('dayTours.geoffreyBawaWorksSriLanka.title') || 'Geoffrey Bawa Works in Sri Lanka'
              }
              fill
              priority
              className="day-tour-detail-image"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="day-tour-detail-content">
          <h1 className="day-tour-detail-title">
            {t('dayTours.geoffreyBawaWorksSriLanka.title') || 'Geoffrey Bawa Works in Sri Lanka'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.geoffreyBawaWorksSriLanka.introDescription') ||
              t('dayTours.geoffreyBawaWorksSriLanka.description') ||
              'When the late Geoffrey Manning Bawa entered the world of architecture, he made his mark with every design he produced. Exploring modernism and its cultural implications…'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.geoffreyBawaWorksSriLanka.buttons.exploreMore') || 'EXPLORE MORE'}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <Link href="/enquiry" className="day-tour-btn day-tour-btn-book">
              <span>
                {t('dayTours.geoffreyBawaWorksSriLanka.buttons.bookThisTour') || 'BOOK THIS TOUR'}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2H14V14H2V2ZM3 3V13H13V3H3ZM4 4H12V5H4V4ZM4 6H12V7H4V6ZM4 8H12V9H4V8ZM4 10H12V11H4V10Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Description Section */}
      <div ref={descriptionSectionRef} className="day-tour-detail-description-section">
        <div className="container">
          <div className="day-tour-detail-description-content">
            <p className="day-tour-detail-intro">
              {t('dayTours.geoffreyBawaWorksSriLanka.detailedDescription.intro') ||
                'When the late Geoffrey Manning Bawa entered the world of architecture, he made his mark with every design he produced. Exploring modernism and its cultural implications, Bawa created a unique architectural language that seamlessly blended tropical landscapes with contemporary design principles. His works across Sri Lanka stand as testaments to his vision of architecture that respects nature, celebrates local materials, and creates spaces that breathe with their environment.'}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t(
                'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalLegacyTitle',
              ) || 'The Architectural Legacy of Geoffrey Bawa'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.tropicalModernism',
                ) ||
                  'Tropical Modernism: Bawa pioneered a style that combined modernist principles with tropical sensibilities, creating buildings that respond to climate, landscape, and culture.'}
              </li>
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.integrationWithNature',
                ) ||
                  'Integration with Nature: His designs blur the boundaries between indoor and outdoor spaces, using courtyards, verandas, and open pavilions to connect architecture with the natural world.'}
              </li>
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.localMaterials',
                ) ||
                  'Local Materials: Bawa championed the use of local materials and traditional building techniques, adapting them to modern needs while preserving cultural authenticity.'}
              </li>
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.landscapeArchitecture',
                ) ||
                  'Landscape Architecture: Beyond buildings, Bawa was a master landscape architect, creating gardens and outdoor spaces that are works of art in themselves.'}
              </li>
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.internationalRecognition',
                ) ||
                  'International Recognition: His work has influenced architects worldwide and established Sri Lanka as a significant center of tropical architecture.'}
              </li>
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.adaptiveReuse',
                ) ||
                  'Adaptive Reuse: Bawa excelled at transforming historic buildings, respecting their heritage while adapting them for contemporary use.'}
              </li>
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.sustainableDesign',
                ) ||
                  "Sustainable Design: Long before sustainability became a buzzword, Bawa's designs demonstrated environmental sensitivity through passive cooling, natural ventilation, and minimal environmental impact."}
              </li>
              <li>
                {t(
                  'dayTours.geoffreyBawaWorksSriLanka.detailedDescription.architecturalPoints.culturalContext',
                ) ||
                  "Cultural Context: Each of Bawa's projects reflects a deep understanding of Sri Lankan culture, history, and way of life, creating architecture that is both modern and deeply rooted in place."}
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Places You Will Visit Carousel Section */}
      <PlacesCarousel key={language} places={getPlacesData(t)} />
    </div>
  )
}

// Places Carousel Component
function PlacesCarousel({ places }: { places: PlacesCarouselData[] }) {
  const { t } = useLanguage()
  // Flatten all places (featured + otherPlaces) into a single array
  const allPlaces: Place[] = places.flatMap((group) => [group.featured, ...group.otherPlaces])

  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Auto-play: change image every 5 seconds
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allPlaces.length)
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [allPlaces.length])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allPlaces.length)
    // Reset auto-play timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allPlaces.length)
    }, 5000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allPlaces.length) % allPlaces.length)
    // Reset auto-play timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allPlaces.length)
    }, 5000)
  }

  const currentPlace = allPlaces[currentIndex]

  return (
    <div className="places-carousel-section">
      <div className="container">
        <h2 className="places-carousel-title">
          {t('dayTours.geoffreyBawaWorksSriLanka.placesCarousel.title') || 'Places you will visit'}
        </h2>
        <div className="places-carousel-container">
          {/* Main Featured Card with Smaller Cards */}
          <div className="places-carousel-cards">
            {/* Main Featured Card */}
            <div className="places-featured-card">
              <div className="places-card-image-wrapper">
                <Image
                  src={currentPlace.image}
                  alt={currentPlace.title}
                  fill
                  className="places-card-image"
                  style={{ objectFit: 'cover' }}
                />
                <div className="places-card-overlay"></div>
              </div>
              <div className="places-card-content">
                <h3 className="places-card-title">{currentPlace.title}</h3>
                <p className="places-card-text">{currentPlace.description}</p>
              </div>
            </div>

            {/* Smaller Horizontal Cards at Bottom Right - Show other places excluding current */}
            <div className="places-small-cards">
              {allPlaces
                .filter((place) => place.id !== currentPlace.id)
                .slice(0, 4)
                .map((place, index) => (
                  <div key={place.id} className="places-small-card" style={{ zIndex: 10 - index }}>
                    <div className="places-small-card-image-wrapper">
                      <Image
                        src={place.image}
                        alt={place.title}
                        fill
                        className="places-small-card-image"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="places-small-card-overlay"></div>
                    </div>
                    <p className="places-small-card-title">{place.title}</p>
                  </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
              className="places-carousel-arrow places-carousel-arrow-left"
              onClick={goToPrevious}
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
          </div>
        </div>
      </div>
    </div>
  )
}
