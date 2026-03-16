'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import anuradhapuraDayTourImage from '../../assest/images/AnuradhapuraDayTour.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Placeholder images - replace with actual images when available
import isurumuniyaImage from '../../assest/images/isurumuniyaImage.jpg'
import thuparamaImage from '../../assest/images/AnuradhapuraDayTour.jpg'
import kuttamPokunaImage from '../../assest/images/kuttamPokunaImage.jpg'
import mirisavatiyaImage from '../../assest/images/mirisavatiyaImage.jpg'
import Ruwanwalisaya from '../../assest/images/Ruwanwalisaya.jpg'
import JetavanaramaDagoba from '../../assest/images/JetavanaramaDagoba.jpg'
import AbhayagiriDagoba from '../../assest/images/AbhayagiriDagoba.jpg'
import SrimahaBodi from '../../assest/images/SrimahaBodi.jpg'

interface Place {
  id: number
  title: string
  description: string
  image: typeof anuradhapuraDayTourImage
}

interface PlacesCarouselData {
  featured: Place
  otherPlaces: Place[]
}

const getPlacesData = (t: (key: string) => string): PlacesCarouselData[] => [
  {
    featured: {
      id: 1,
      title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.jetavanaramaDagoba.title'),
      description: t(
        'dayTours.anuradhapuraDayTour.placesCarousel.places.jetavanaramaDagoba.description',
      ),
      image: JetavanaramaDagoba,
    },
    otherPlaces: [
      {
        id: 2,
        title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.isurumuniyaVihara.title'),
        description: t(
          'dayTours.anuradhapuraDayTour.placesCarousel.places.isurumuniyaVihara.description',
        ),
        image: isurumuniyaImage,
      },
      {
        id: 3,
        title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.thuparamaDagoba.title'),
        description: t(
          'dayTours.anuradhapuraDayTour.placesCarousel.places.thuparamaDagoba.description',
        ),
        image: thuparamaImage,
      },
      {
        id: 4,
        title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.kuttamPokuna.title'),
        description: t(
          'dayTours.anuradhapuraDayTour.placesCarousel.places.kuttamPokuna.description',
        ),
        image: kuttamPokunaImage,
      },
    ],
  },
  {
    featured: {
      id: 5,
      title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.mirisavatiyaDagoba.title'),
      description: t(
        'dayTours.anuradhapuraDayTour.placesCarousel.places.mirisavatiyaDagoba.description',
      ),
      image: mirisavatiyaImage,
    },
    otherPlaces: [
      {
        id: 6,
        title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.ruwanwalisayaDagoba.title'),
        description: t(
          'dayTours.anuradhapuraDayTour.placesCarousel.places.ruwanwalisayaDagoba.description',
        ),
        image: Ruwanwalisaya,
      },
      {
        id: 7,
        title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.abhayagiriDagoba.title'),
        description: t(
          'dayTours.anuradhapuraDayTour.placesCarousel.places.abhayagiriDagoba.description',
        ),
        image: AbhayagiriDagoba,
      },
      {
        id: 8,
        title: t('dayTours.anuradhapuraDayTour.placesCarousel.places.sriMahaBodhi.title'),
        description: t(
          'dayTours.anuradhapuraDayTour.placesCarousel.places.sriMahaBodhi.description',
        ),
        image: SrimahaBodi,
      },
    ],
  },
]

export default function AnuradhapuraDayTourPage() {
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
              src={anuradhapuraDayTourImage}
              alt={t('dayTours.anuradhapuraDayTour.title') || 'Anuradhapura Day Tour'}
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
            {t('dayTours.anuradhapuraDayTour.title') || 'Anuradhapura Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.anuradhapuraDayTour.introDescription')}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>{t('dayTours.anuradhapuraDayTour.buttons.exploreMore')}</span>
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
              <span>{t('dayTours.anuradhapuraDayTour.buttons.bookThisTour')}</span>
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
              {t('dayTours.anuradhapuraDayTour.detailedDescription.intro')}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t('dayTours.anuradhapuraDayTour.detailedDescription.historicalProminenceTitle')}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.4thCenturyBC',
                )}
              </li>
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.3rdCenturyBC',
                )}
              </li>
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.kingTissaFirstStupa',
                )}
              </li>
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.sacredBoSapling',
                )}
              </li>
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.kingTissaIrrigation',
                )}
              </li>
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.end3rdCenturyBC',
                )}
              </li>
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.2ndCenturyBC',
                )}
              </li>
              <li>
                {t(
                  'dayTours.anuradhapuraDayTour.detailedDescription.historicalPoints.kingDutugemunuConstruction',
                )}
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
          {t('dayTours.anuradhapuraDayTour.placesCarousel.title')}
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
