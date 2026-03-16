'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import sigiriyaDambullaImage from '../../assest/images/Sigiriya Rock.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Placeholder images - replace with actual images when available
import sigiriyaRockImage from '../../assest/images/Sigiriya Rock.jpg'
import culturalTriangleImage from '../../assest/images/CulturalTriangle.jpg'
import DambullaCaveTemple from '../../assest/images/DambullaCaveTemple.jpg'
import SigiriyaFrescoes from '../../assest/images/SigiriyaFrescoes.jpg'
import MirrorWall from '../../assest/images/MirrorWall.jpg'
import LionGate from '../../assest/images/LionGate.jpg'
import WaterGardens from '../../assest/images/WaterGardens.jpg'

interface Place {
  id: number
  title: string
  description: string
  image: typeof sigiriyaDambullaImage
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
        t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.sigiriyaRock.title') ||
        'Sigiriya Rock Fortress',
      description:
        t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.sigiriyaRock.description') ||
        'An ancient rock fortress and palace ruins located in the Matale District. Sigiriya is a UNESCO World Heritage Site, famous for its ancient frescoes and the mirror wall.',
      image: sigiriyaRockImage,
    },
    otherPlaces: [
      {
        id: 2,
        title:
          t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.dambullaCaveTemple.title') ||
          'Dambulla Cave Temple',
        description:
          t(
            'dayTours.sigiriyaDambullaDayTour.placesCarousel.places.dambullaCaveTemple.description',
          ) ||
          'Also known as the Golden Temple of Dambulla, this is the largest and best-preserved cave temple complex in Sri Lanka, featuring over 150 Buddha statues.',
        image: DambullaCaveTemple,
      },
      {
        id: 3,
        title:
          t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.sigiriyaFrescoes.title') ||
          'Sigiriya Frescoes',
        description:
          t(
            'dayTours.sigiriyaDambullaDayTour.placesCarousel.places.sigiriyaFrescoes.description',
          ) ||
          'The famous ancient paintings of Sigiriya, depicting celestial maidens, are considered masterpieces of ancient Sri Lankan art.',
        image: SigiriyaFrescoes,
      },
      {
        id: 4,
        title:
          t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.mirrorWall.title') ||
          'Mirror Wall',
        description:
          t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.mirrorWall.description') ||
          'A polished plaster wall that once reflected like a mirror, now covered with ancient graffiti and poems dating back over 1,000 years.',
        image: MirrorWall,
      },
    ],
  },
  {
    featured: {
      id: 5,
      title:
        t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.lionGate.title') || 'Lion Gate',
      description:
        t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.lionGate.description') ||
        'The massive stone paws of a lion that once guarded the entrance to the palace at the summit of Sigiriya Rock.',
      image: LionGate,
    },
    otherPlaces: [
      {
        id: 6,
        title:
          t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.waterGardens.title') ||
          'Water Gardens',
        description:
          t('dayTours.sigiriyaDambullaDayTour.placesCarousel.places.waterGardens.description') ||
          'Sophisticated hydraulic systems and symmetrical water gardens at the base of Sigiriya Rock, showcasing ancient engineering marvels.',
        image: WaterGardens,
      },
    ],
  },
]

export default function SigiriyaDambullaDayTourPage() {
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
              src={sigiriyaDambullaImage}
              alt={t('dayTours.sigiriyaDambullaDayTour.title') || 'Sigiriya & Dambulla Day Tour'}
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
            {t('dayTours.sigiriyaDambullaDayTour.title') || 'Sigiriya & Dambulla Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.sigiriyaDambullaDayTour.introDescription') ||
              t('dayTours.sigiriyaDambullaDayTour.description') ||
              'Sigiriya, an ancient palace, was once nominated as the 8th wonder of the world. Today, Sigiriya and Dambulla are a UNESCO recognized heritage site and a major tourist attraction.'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.sigiriyaDambullaDayTour.buttons.exploreMore') || 'EXPLORE MORE'}
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
                {t('dayTours.sigiriyaDambullaDayTour.buttons.bookThisTour') || 'BOOK THIS TOUR'}
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
              {t('dayTours.sigiriyaDambullaDayTour.detailedDescription.intro') ||
                "Sigiriya, an ancient palace and rock fortress, was once nominated as the 8th wonder of the world. Today, Sigiriya and Dambulla are UNESCO recognized heritage sites and major tourist attractions. This day tour takes you through two of Sri Lanka's most iconic historical sites, showcasing ancient architecture, stunning frescoes, and remarkable cave temples that tell the story of a rich cultural heritage spanning over two millennia."}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t(
                'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalProminenceTitle',
              ) || 'Historical Prominence of Sigiriya & Dambulla'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.5thCenturyAD',
                ) ||
                  '5th Century AD: King Kassapa I built the palace fortress on top of Sigiriya Rock, creating one of the most remarkable architectural achievements of ancient Sri Lanka.'}
              </li>
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.sigiriyaFrescoes',
                ) ||
                  'Sigiriya Frescoes: The famous paintings of celestial maidens (apsaras) are considered masterpieces of ancient Sri Lankan art, dating back over 1,500 years.'}
              </li>
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.dambullaCaves',
                ) ||
                  '1st Century BC: Dambulla Cave Temple was established by King Valagamba, who took refuge in the caves during an invasion. The temple complex has been continuously used for over 2,000 years.'}
              </li>
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.unescoHeritage',
                ) ||
                  'UNESCO World Heritage Sites: Both Sigiriya (1982) and Dambulla (1991) were declared UNESCO World Heritage Sites, recognizing their outstanding universal value and cultural significance.'}
              </li>
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.architecturalMarvels',
                ) ||
                  'Architectural Marvels: Sigiriya features sophisticated water gardens, mirror walls, and the iconic Lion Gate, while Dambulla houses over 150 Buddha statues and extensive cave paintings.'}
              </li>
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.culturalTriangle',
                ) ||
                  "Cultural Triangle: Both sites are part of Sri Lanka's Cultural Triangle, along with Anuradhapura and Polonnaruwa, representing the golden age of ancient Sinhalese civilization."}
              </li>
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.kingParakramabahu',
                ) ||
                  '12th Century AD: King Parakramabahu I renovated and expanded the Dambulla Cave Temple, adding many of the statues and paintings that can be seen today.'}
              </li>
              <li>
                {t(
                  'dayTours.sigiriyaDambullaDayTour.detailedDescription.historicalPoints.modernSignificance',
                ) ||
                  'Modern Significance: Today, these sites attract millions of visitors annually and remain active places of worship, requiring respect and proper attire from visitors.'}
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
          {t('dayTours.sigiriyaDambullaDayTour.placesCarousel.title') || 'Places you will visit'}
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
