'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import kandyDayTourImage from '../../assest/images/KandyDayTour.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Placeholder images - replace with actual images when available
import kandyLake from '../../assest/images/kandyLake.jpg'
import royalBotanicalGardens from '../../assest/images/royalBotanicalGardens.jpg'
import kandyViewPoint from '../../assest/images/kandyViewPoint.jpg'
import kandyMarket from '../../assest/images/kandyMarket.jpg'
import bahirawakandaBuddha from '../../assest/images/bahirawakandaBuddha.jpg'
import kandyMuseum from '../../assest/images/kandyMuseum.jpg'
import udawattekeleSanctuary from '../../assest/images/udawattekeleSanctuary.jpg'

interface Place {
  id: number
  title: string
  description: string
  image: typeof kandyDayTourImage
}

interface PlacesCarouselData {
  featured: Place
  otherPlaces: Place[]
}

const getPlacesData = (t: (key: string) => string): PlacesCarouselData[] => [
  {
    featured: {
      id: 1,
      title: t('dayTours.kandyDayTour.placesCarousel.places.templeOfTheTooth.title'),
      description: t('dayTours.kandyDayTour.placesCarousel.places.templeOfTheTooth.description'),
      image: kandyDayTourImage,
    },
    otherPlaces: [
      {
        id: 2,
        title: t('dayTours.kandyDayTour.placesCarousel.places.kandyLake.title'),
        description: t('dayTours.kandyDayTour.placesCarousel.places.kandyLake.description'),
        image: kandyLake,
      },
      {
        id: 3,
        title: t('dayTours.kandyDayTour.placesCarousel.places.royalBotanicalGardens.title'),
        description: t(
          'dayTours.kandyDayTour.placesCarousel.places.royalBotanicalGardens.description',
        ),
        image: royalBotanicalGardens,
      },
      {
        id: 4,
        title: t('dayTours.kandyDayTour.placesCarousel.places.kandyViewPoint.title'),
        description: t('dayTours.kandyDayTour.placesCarousel.places.kandyViewPoint.description'),
        image: kandyViewPoint,
      },
    ],
  },
  {
    featured: {
      id: 5,
      title: t('dayTours.kandyDayTour.placesCarousel.places.kandyMarket.title'),
      description: t('dayTours.kandyDayTour.placesCarousel.places.kandyMarket.description'),
      image: kandyMarket,
    },
    otherPlaces: [
      {
        id: 6,
        title: t('dayTours.kandyDayTour.placesCarousel.places.bahirawakandaBuddha.title'),
        description: t(
          'dayTours.kandyDayTour.placesCarousel.places.bahirawakandaBuddha.description',
        ),
        image: bahirawakandaBuddha,
      },
      {
        id: 7,
        title: t('dayTours.kandyDayTour.placesCarousel.places.kandyMuseum.title'),
        description: t('dayTours.kandyDayTour.placesCarousel.places.kandyMuseum.description'),
        image: kandyMuseum,
      },
      {
        id: 8,
        title: t('dayTours.kandyDayTour.placesCarousel.places.udawattekeleSanctuary.title'),
        description: t(
          'dayTours.kandyDayTour.placesCarousel.places.udawattekeleSanctuary.description',
        ),
        image: udawattekeleSanctuary,
      },
    ],
  },
]

export default function KandyDayTourPage() {
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
              src={kandyDayTourImage}
              alt={t('dayTours.kandyDayTour.title') || 'Kandy Day Tour'}
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
            {t('dayTours.kandyDayTour.title') || 'Kandy Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.kandyDayTour.introDescription') ||
              t('dayTours.kandyDayTour.description') ||
              'Kandy, more popularly known as the hill capital of Sri Lanka, is an attractive tourist destination. Its history dates back to the 15th century…'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>{t('dayTours.kandyDayTour.buttons.exploreMore') || 'EXPLORE MORE'}</span>
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
              <span>{t('dayTours.kandyDayTour.buttons.bookThisTour') || 'BOOK THIS TOUR'}</span>
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
              {t('dayTours.kandyDayTour.detailedDescription.intro') ||
                'Kandy, more popularly known as the hill capital of Sri Lanka, is an attractive tourist destination. Its history dates back to the 15th century when it was established as the last capital of the ancient kings era of Sri Lanka. The city is nestled in the hills of the Kandy plateau, which crosses areas of tropical plantations, mainly tea. Kandy is both an administrative and religious city and is also the capital of the Central Province.'}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t('dayTours.kandyDayTour.detailedDescription.historicalProminenceTitle') ||
                'Historical Prominence of Kandy'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t('dayTours.kandyDayTour.detailedDescription.historicalPoints.15thCentury') ||
                  '15th Century: Kandy was established as the last capital of the ancient kings era of Sri Lanka.'}
              </li>
              <li>
                {t('dayTours.kandyDayTour.detailedDescription.historicalPoints.templeOfTheTooth') ||
                  'Temple of the Tooth Relic: The sacred Temple of the Tooth Relic (Sri Dalada Maligawa) houses the tooth relic of the Buddha, making it one of the most important Buddhist sites in the world.'}
              </li>
              <li>
                {t('dayTours.kandyDayTour.detailedDescription.historicalPoints.unescoHeritage') ||
                  'UNESCO World Heritage Site: Kandy was declared a UNESCO World Heritage Site in 1988, recognizing its cultural and historical significance.'}
              </li>
              <li>
                {t('dayTours.kandyDayTour.detailedDescription.historicalPoints.kandyanKingdom') ||
                  'Kandyan Kingdom: The city served as the capital of the Kandyan Kingdom, which successfully resisted European colonial powers for over 300 years.'}
              </li>
              <li>
                {t('dayTours.kandyDayTour.detailedDescription.historicalPoints.britishColonial') ||
                  'British Colonial Period: Kandy fell to the British in 1815, ending the independent Kandyan Kingdom.'}
              </li>
              <li>
                {t('dayTours.kandyDayTour.detailedDescription.historicalPoints.culturalCenter') ||
                  'Cultural Center: Today, Kandy remains a major cultural center, known for its traditional arts, crafts, and the annual Esala Perahera festival.'}
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
          {t('dayTours.kandyDayTour.placesCarousel.title') || 'Places you will visit'}
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
