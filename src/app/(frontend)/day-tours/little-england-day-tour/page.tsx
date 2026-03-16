'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import littleEnglandImage from '../../assest/images/LittleEngland.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Placeholder images - replace with actual images when available
import pedroTeaEstate from '../../assest/images/pedroTeaEstate.jpg'
import gregoryLake from '../../assest/images/gregoryLake.jpg'
import hakgalaBotanicalGardens from '../../assest/images/hakgalaBotanicalGardens.jpg'
import victoriaPark from '../../assest/images/victoriaPark.jpg'
import seethaAmmamTemple from '../../assest/images/seethaAmmamTemple.jpg'
import loversLeap from '../../assest/images/loversLeap.jpg'
import moonPlains from '../../assest/images/moonPlains.jpg'
import teaTourImage from '../../assest/images/TeaTour.jpg'

interface Place {
  id: number
  title: string
  description: string
  image: typeof littleEnglandImage
}

interface PlacesCarouselData {
  featured: Place
  otherPlaces: Place[]
}

const getPlacesData = (t: (key: string) => string): PlacesCarouselData[] => [
  {
    featured: {
      id: 1,
      title: t('dayTours.littleEnglandDayTour.placesCarousel.places.gregoryLake.title'),
      description: t('dayTours.littleEnglandDayTour.placesCarousel.places.gregoryLake.description'),
      image: gregoryLake,
    },
    otherPlaces: [
      {
        id: 2,
        title: t(
          'dayTours.littleEnglandDayTour.placesCarousel.places.hakgalaBotanicalGardens.title',
        ),
        description: t(
          'dayTours.littleEnglandDayTour.placesCarousel.places.hakgalaBotanicalGardens.description',
        ),
        image: hakgalaBotanicalGardens,
      },
      {
        id: 3,
        title: t('dayTours.littleEnglandDayTour.placesCarousel.places.seethaAmmamTemple.title'),
        description: t(
          'dayTours.littleEnglandDayTour.placesCarousel.places.seethaAmmamTemple.description',
        ),
        image: seethaAmmamTemple,
      },
      {
        id: 4,
        title: t('dayTours.littleEnglandDayTour.placesCarousel.places.victoriaPark.title'),
        description: t(
          'dayTours.littleEnglandDayTour.placesCarousel.places.victoriaPark.description',
        ),
        image: victoriaPark,
      },
    ],
  },
  {
    featured: {
      id: 5,
      title: t('dayTours.littleEnglandDayTour.placesCarousel.places.teaPlantations.title'),
      description: t(
        'dayTours.littleEnglandDayTour.placesCarousel.places.teaPlantations.description',
      ),
      image: teaTourImage,
    },
    otherPlaces: [
      {
        id: 6,
        title: t('dayTours.littleEnglandDayTour.placesCarousel.places.loversLeap.title'),
        description: t(
          'dayTours.littleEnglandDayTour.placesCarousel.places.loversLeap.description',
        ),
        image: loversLeap,
      },
      {
        id: 7,
        title: t('dayTours.littleEnglandDayTour.placesCarousel.places.pedroTeaEstate.title'),
        description: t(
          'dayTours.littleEnglandDayTour.placesCarousel.places.pedroTeaEstate.description',
        ),
        image: pedroTeaEstate,
      },
      {
        id: 8,
        title: t('dayTours.littleEnglandDayTour.placesCarousel.places.moonPlains.title'),
        description: t(
          'dayTours.littleEnglandDayTour.placesCarousel.places.moonPlains.description',
        ),
        image: moonPlains,
      },
    ],
  },
]

export default function LittleEnglandDayTourPage() {
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
              src={littleEnglandImage}
              alt={t('dayTours.littleEnglandDayTour.title') || 'Little England Day Tour'}
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
            {t('dayTours.littleEnglandDayTour.title') || 'Little England Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.littleEnglandDayTour.introDescription') ||
              t('dayTours.littleEnglandDayTour.description') ||
              'Nuwara Eliya, also known as Sri Lanka\'s "Little England", is the prime hill resort of the country. At a height of approximately 2000m above sea level…'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.littleEnglandDayTour.buttons.exploreMore') || 'EXPLORE MORE'}
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
                {t('dayTours.littleEnglandDayTour.buttons.bookThisTour') || 'BOOK THIS TOUR'}
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
              {t('dayTours.littleEnglandDayTour.detailedDescription.intro') ||
                'Nuwara Eliya, also known as Sri Lanka\'s "Little England", is the prime hill resort of the country. At a height of approximately 2000m above sea level, this charming town offers a cool climate, lush tea plantations, and a distinctly British colonial atmosphere. The town is famous for its beautiful gardens, colonial architecture, and scenic landscapes that resemble the English countryside.'}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t('dayTours.littleEnglandDayTour.detailedDescription.historicalProminenceTitle') ||
                'Historical Prominence of Nuwara Eliya'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t(
                  'dayTours.littleEnglandDayTour.detailedDescription.historicalPoints.britishColonial',
                ) ||
                  'British Colonial Era: Nuwara Eliya was developed by the British in the 19th century as a hill station to escape the heat of the lowlands, creating a "Little England" atmosphere.'}
              </li>
              <li>
                {t(
                  'dayTours.littleEnglandDayTour.detailedDescription.historicalPoints.teaIndustry',
                ) ||
                  "Tea Industry: The region became the heart of Sri Lanka's tea industry, with many tea plantations established by British planters, making it one of the world's finest tea-growing regions."}
              </li>
              <li>
                {t(
                  'dayTours.littleEnglandDayTour.detailedDescription.historicalPoints.colonialArchitecture',
                ) ||
                  "Colonial Architecture: The town features well-preserved colonial buildings, including the Grand Hotel, St. Andrew's Hotel, and various bungalows that reflect British architectural styles."}
              </li>
              <li>
                {t(
                  'dayTours.littleEnglandDayTour.detailedDescription.historicalPoints.golfCourse',
                ) ||
                  "Golf Course: Nuwara Eliya is home to one of Asia's oldest golf courses, established in 1889, adding to its British colonial charm."}
              </li>
              <li>
                {t('dayTours.littleEnglandDayTour.detailedDescription.historicalPoints.climate') ||
                  'Cool Climate: The high altitude provides a temperate climate year-round, making it a perfect retreat from the tropical heat of the coastal areas.'}
              </li>
              <li>
                {t(
                  'dayTours.littleEnglandDayTour.detailedDescription.historicalPoints.touristDestination',
                ) ||
                  "Tourist Destination: Today, Nuwara Eliya is one of Sri Lanka's most popular tourist destinations, known for its natural beauty, tea estates, and unique colonial heritage."}
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
          {t('dayTours.littleEnglandDayTour.placesCarousel.title') || 'Places you will visit'}
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
