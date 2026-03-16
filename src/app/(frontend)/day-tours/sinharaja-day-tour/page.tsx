'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import sinharajaImage from '../../assest/images/RainforestTour.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Placeholder images - replace with actual images when available
import rainforestTourImage from '../../assest/images/RainforestTour.jpg'
import Birds from '../../assest/images/Birds.jpg'
import Mammals from '../../assest/images/Mammals.jpg'
import Reptiles from '../../assest/images/Reptiles.jpg'
import SinharajaRainforestReserve from '../../assest/images/SinharajaRainforestReserve.jpg'

interface Place {
  id: number
  title: string
  description: string
  image: typeof sinharajaImage
}

interface PlacesCarouselData {
  featured: Place
  otherPlaces: Place[]
}

const getPlacesData = (t: (key: string) => string): PlacesCarouselData[] => [
  {
    featured: {
      id: 1,
      title: t('dayTours.sinharajaDayTour.placesCarousel.places.birds.title') || 'Birds',
      description:
        t('dayTours.sinharajaDayTour.placesCarousel.places.birds.description') ||
        'The Sinharaja Rain Forest in Sri Lanka is renowned for its unique and diverse bird species, many of which are endemic to the island, making it a haven for birdwatchers and conservationists. Below are some of the birds you will witness: Sri Lankan Blue Magpie, Grey Hornbill, Red Faced Malkoha, Scaly Thrush, Wood Pigeon, Yellow Eared Bulbul, Dusky Blue Flycatcher.',
      image: Birds,
    },
    otherPlaces: [
      {
        id: 2,
        title: t('dayTours.sinharajaDayTour.placesCarousel.places.mammals.title') || 'Mammals',
        description:
          t('dayTours.sinharajaDayTour.placesCarousel.places.mammals.description') ||
          'The Sinharaja Rain Forest boasts a rich tapestry of mammalian life, with many species that are exclusively found in Sri Lanka, offering a captivating experience for wildlife enthusiasts.',
        image: Mammals,
      },
      {
        id: 3,
        title: t('dayTours.sinharajaDayTour.placesCarousel.places.reptiles.title') || 'Reptiles',
        description:
          t('dayTours.sinharajaDayTour.placesCarousel.places.reptiles.description') ||
          'The Sinharaja Rain Forest is a treasure trove of reptilian diversity, harboring a range of species that have made this Sri Lankan gem their exclusive home.',
        image: Reptiles,
      },
      {
        id: 4,
        title:
          t('dayTours.sinharajaDayTour.placesCarousel.places.rainforestReserve.title') ||
          'Sinharaja Rainforest Reserve',
        description:
          t('dayTours.sinharajaDayTour.placesCarousel.places.rainforestReserve.description') ||
          'Due to the dense vegetation, animal spotting is a challenge. This kind of atmosphere is a real treat to wildlife enthusiasts though who are eagerly waiting to travel deep into the forests in search of rare wildlife.',
        image: SinharajaRainforestReserve,
      },
    ],
  },
]

export default function SinharajaDayTourPage() {
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
              src={sinharajaImage}
              alt={t('dayTours.sinharajaDayTour.title') || 'Sinharaja Day Tour'}
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
            {t('dayTours.sinharajaDayTour.title') || 'Sinharaja Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.sinharajaDayTour.introDescription') ||
              'UNESCO World Heritage site since 1988. Currently, the reserve spans 8864 hectares and the country plans to quadruple the size of the area to respect the ecological significance of the region.'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>{t('dayTours.sinharajaDayTour.buttons.exploreMore') || 'Explore More'}</span>
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
              <span>{t('dayTours.sinharajaDayTour.buttons.bookThisTour') || 'Book This Tour'}</span>
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
              {t('dayTours.sinharajaDayTour.detailedDescription.intro') ||
                "The rich and unique animal and plant life in the Sinharaja Rainforest Reserve is the reason why it was marked as a UNESCO World Heritage site in 1988. Currently, the reserve spans 8864 hectares and the country plans to quadruple the size of the area to respect the ecological significance of the region. The hilly virgin rainforest is a treasure trove of endemic species including mammals, reptiles, birds, amphibians and of course, an abundance of trees and insects. Particularly known for bird watching, an interesting phenomenon here is that birds move in mixed feeding flocks, led by the great Racket-tailed Drongo and the noisy Orange-billed Babbler. 20 of the 26 endemic bird species in Sri Lanka are seen at the Sinharaja Rainforest. In addition to bids, more than 60% of the plants are endemic, many of which are rare. The reserve is also home to more than 50% of the country's endemic mammal, butterfly, reptile, amphibian and insect species."}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t('dayTours.sinharajaDayTour.detailedDescription.journeyTitle') ||
                'Journey into the Wild Heart of Sinharaja'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.trek') ||
                  "Trek through the Sinharaja Rainforest, a UNESCO World Heritage Site and Sri Lanka's last significant stretch of primary tropical rainforest."}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.biodiversity') ||
                  "Discover an incredible biodiversity hotspot where a majority of Sri Lanka's endemic species of mammals and insects thrive."}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.junglefowl') ||
                  'Keep your eyes on the canopy to spot rare endemic birds like the vibrant red-faced Sri Lanka Junglefowl.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.owl') ||
                  'Listen for the distinctive call of the Serendib Scops-Owl, one of the many rare birds found only here.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.guide') ||
                  "Your expert naturalist guide will help you locate elusive wildlife and explain the forest's complex, delicate ecosystem."}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.canopy') ||
                  'Marvel at the lush emerald-green canopy filled with a vast variety of native trees and medicinal plants.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.reptiles') ||
                  'Witness a stunning array of unique reptiles and amphibians that call this protected rainforest their home.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.atmosphere') ||
                  'Experience the tranquil atmosphere and cool, moist air under the dense shade of the interlocking forest canopy.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.paths') ||
                  'Follow winding paths past gentle streams and small, picturesque waterfalls hidden deep within the virgin woodland.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.beauty') ||
                  'Be captivated by the sheer beauty of this untouched wilderness, a true paradise for nature lovers and photographers.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.immersive') ||
                  'This guided tour offers an immersive and educational journey into the heart of a living, breathing ecosystem.'}
              </li>
              <li>
                {t('dayTours.sinharajaDayTour.detailedDescription.journeyPoints.magpie') ||
                  'Encounter the unforgettable sight of the brilliant Sri Lanka Blue Magpie, a flagship species of Sinharaja.'}
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
          {t('dayTours.sinharajaDayTour.placesCarousel.title') || 'Places you will visit'}
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
