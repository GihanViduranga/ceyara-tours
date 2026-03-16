'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import galleDayTourImage from '../../assest/images/GalleDayTour.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Placeholder images - replace with destination-specific assets when available
import galleFortImage from '../../assest/images/GalleDayTour.jpg'
import galleLighthouseImage from '../../assest/images/GalleLighthouse.jpg'
import dutchReformedChurchImage from '../../assest/images/DutchReformedChurch.jpg'
import maritimeMuseumImage from '../../assest/images/MaritimeMuseum.jpg'
import jungleBeachImage from '../../assest/images/JungleBeach.jpg'
import japanesePeacePagodaImage from '../../assest/images/JapanesePeacePagoda.jpg'
import unawatunaBeachImage from '../../assest/images/UnawatunaBeach.jpg'
import stiltFishermenImage from '../../assest/images/StiltFishermen.jpg'

interface Place {
  id: number
  title: string
  description: string
  image: typeof galleDayTourImage
}

interface PlacesCarouselData {
  featured: Place
  otherPlaces: Place[]
}

const getPlacesData = (t: (key: string) => string): PlacesCarouselData[] => [
  {
    featured: {
      id: 1,
      title: t('dayTours.galleDayTour.placesCarousel.places.galleFort.title') || 'Galle Fort',
      description:
        t('dayTours.galleDayTour.placesCarousel.places.galleFort.description') ||
        'Galle Fort is a UNESCO heritage site with colonial architecture, museums, charming streets, ocean views, cafes, and cultural landmarks, offering a unique blend of history.',
      image: galleFortImage,
    },
    otherPlaces: [
      {
        id: 2,
        title:
          t('dayTours.galleDayTour.placesCarousel.places.galleLighthouse.title') ||
          'Galle Lighthouse',
        description:
          t('dayTours.galleDayTour.placesCarousel.places.galleLighthouse.description') ||
          'Galle Lighthouse is an iconic coastal landmark offering ocean views, beautiful sunsets, refreshing sea breeze, and great photography opportunities, making it one of Galle’s highlights.',
        image: galleLighthouseImage,
      },
      {
        id: 3,
        title:
          t('dayTours.galleDayTour.placesCarousel.places.dutchReformedChurch.title') ||
          'Dutch Reformed Church',
        description:
          t('dayTours.galleDayTour.placesCarousel.places.dutchReformedChurch.description') ||
          'The Dutch Reformed Church, built in the 18th century, features colonial architecture, historic gravestones, and a peaceful interior, offering visitors a glimpse into Galle’s past.',
        image: dutchReformedChurchImage,
      },
      {
        id: 4,
        title:
          t('dayTours.galleDayTour.placesCarousel.places.maritimeMuseum.title') ||
          'Maritime Museum',
        description:
          t('dayTours.galleDayTour.placesCarousel.places.maritimeMuseum.description') ||
          'The Maritime Museum highlights Galle’s seafaring history through shipwreck exhibits, ancient trade artifacts, and underwater discoveries, offering visitors an educational experience.',
        image: maritimeMuseumImage,
      },
    ],
  },
  {
    featured: {
      id: 5,
      title: t('dayTours.galleDayTour.placesCarousel.places.jungleBeach.title') || 'Jungle Beach',
      description:
        t('dayTours.galleDayTour.placesCarousel.places.jungleBeach.description') ||
        'Jungle Beach is a hidden coastal escape with calm waters, soft sand, lush surroundings, and great snorkeling, offering visitors a peaceful place to relax.',
      image: jungleBeachImage,
    },
    otherPlaces: [
      {
        id: 6,
        title:
          t('dayTours.galleDayTour.placesCarousel.places.japanesePeacePagoda.title') ||
          'Japanese Peace Pagoda',
        description:
          t('dayTours.galleDayTour.placesCarousel.places.japanesePeacePagoda.description') ||
          'The Japanese Peace Pagoda sits on a quiet hilltop offering panoramic coastal views, peaceful surroundings, and a calming spiritual atmosphere, making it a beautiful spot.',
        image: japanesePeacePagodaImage,
      },
    ],
  },
  {
    featured: {
      id: 7,
      title:
        t('dayTours.galleDayTour.placesCarousel.places.unawatunaBeach.title') || 'Unawatuna Beach',
      description:
        t('dayTours.galleDayTour.placesCarousel.places.unawatunaBeach.description') ||
        'Unawatuna Beach is a lively coastal destination with golden sand, clear water, beachside restaurants, swimming spots, and nightlife, offering visitors a fun and relaxing experience.',
      image: unawatunaBeachImage,
    },
    otherPlaces: [
      {
        id: 8,
        title:
          t('dayTours.galleDayTour.placesCarousel.places.stiltFishermen.title') ||
          'Stilt Fishermen (Koggala)',
        description:
          t('dayTours.galleDayTour.placesCarousel.places.stiltFishermen.description') ||
          'Stilt fishermen in Koggala display traditional fishing methods beside scenic shores, offering visitors cultural insight, photo opportunities, and an authentic Sri Lankan experience.',
        image: stiltFishermenImage,
      },
    ],
  },
]

export default function GalleDayTourPage() {
  const { t, language } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)
  const descriptionSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

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
              src={galleDayTourImage}
              alt={t('dayTours.galleDayTour.title') || 'Galle Day Tour'}
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
            {t('dayTours.galleDayTour.title') || 'Galle Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.galleDayTour.introDescription') ||
              t('dayTours.galleDayTour.description') ||
              'Immerse yourself in the charm of Sri Lanka’s southern coast as you walk the storied ramparts of Galle Fort, visit heritage landmarks, and unwind on sun-kissed beaches.'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>{t('dayTours.galleDayTour.buttons.exploreMore') || 'EXPLORE MORE'}</span>
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
              <span>{t('dayTours.galleDayTour.buttons.bookThisTour') || 'BOOK THIS TOUR'}</span>
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
              {t('dayTours.galleDayTour.detailedDescription.intro') ||
                'Galle’s legacy as a maritime hub blends European fortifications with Sri Lankan spirit. Spend the day exploring cobbled alleys, lofty bastions, artisan boutiques, and the coastal escapes that make the southern capital unforgettable.'}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t('dayTours.galleDayTour.detailedDescription.historicalProminenceTitle') ||
                'Highlights of the Galle Experience'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t('dayTours.galleDayTour.detailedDescription.historicalPoints.unescoHeritage') ||
                  'UNESCO Heritage: Traverse the Galle Fort ramparts, watchtowers, and colonial mansions that earned the city its World Heritage status.'}
              </li>
              <li>
                {t(
                  'dayTours.galleDayTour.detailedDescription.historicalPoints.colonialArchitecture',
                ) ||
                  'Colonial Architecture: Spot Dutch-era churches, British administrative buildings, and pastel merchant houses lining the streets.'}
              </li>
              <li>
                {t('dayTours.galleDayTour.detailedDescription.historicalPoints.culturalBlend') ||
                  'Cultural Blend: Experience a harmonious mix of Sinhalese, Moor, Burgher, and expatriate communities shaping the city’s flavors and festivals.'}
              </li>
              <li>
                {t('dayTours.galleDayTour.detailedDescription.historicalPoints.artisanBoutiques') ||
                  'Artisan Boutiques: Browse handloom textiles, gem studios, handicraft shops, and chic cafes tucked into heritage buildings.'}
              </li>
              <li>
                {t('dayTours.galleDayTour.detailedDescription.historicalPoints.seasideViews') ||
                  'Seaside Views: Take in sweeping ocean panoramas from the lighthouse, sun-drenched beaches, and palm-fringed promenades.'}
              </li>
              <li>
                {t('dayTours.galleDayTour.detailedDescription.historicalPoints.culinaryFinds') ||
                  'Culinary Finds: Savor fresh seafood, fusion fare, and tropical treats at fort restaurants and seaside shacks.'}
              </li>
              <li>
                {t('dayTours.galleDayTour.detailedDescription.historicalPoints.adventureStops') ||
                  'Adventure Stops: Add optional activities like cycling, snorkeling, or boat rides through nearby mangroves for an active twist.'}
              </li>
              <li>
                {t('dayTours.galleDayTour.detailedDescription.historicalPoints.relaxationBreaks') ||
                  'Relaxation Breaks: Unwind with sunset picnics on the ramparts or spa treatments at boutique hotels tucked inside the fort.'}
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
  const allPlaces: Place[] = places.flatMap((group) => [group.featured, ...group.otherPlaces])

  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allPlaces.length)
    }, 5000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allPlaces.length) % allPlaces.length)
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
          {t('dayTours.galleDayTour.placesCarousel.title') || 'Places you will visit'}
        </h2>
        <div className="places-carousel-container">
          <div className="places-carousel-cards">
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
