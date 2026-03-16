'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import negomboImage from '../../assest/images/NegomboLagoonFishing.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Card images
import negombolagoonsrilanka from '../../assest/images/negombolagoonsrilanka.jpg'
import negomboBeachImage from '../../assest/images/NegomboBeach.jpg'

export default function NegomboLagoonFishingDayTourPage() {
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
              src={negomboImage}
              alt={
                t('dayTours.negomboLagoonFishingDayTour.title') || 'Negombo Lagoon Fishing Day Tour'
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
            {t('dayTours.negomboLagoonFishingDayTour.title') || 'Negombo Lagoon Fishing Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.negomboLagoonFishingDayTour.introDescription') ||
              t('dayTours.negomboLagoonFishingDayTour.description') ||
              'Along the West Coast of Sri Lanka is the friendly city of Negombo, one of the oldest fishing towns in the country. In addition to its centuries-old fishing industry…'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.negomboLagoonFishingDayTour.buttons.exploreMore') || 'EXPLORE MORE'}
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
                {t('dayTours.negomboLagoonFishingDayTour.buttons.bookThisTour') || 'BOOK THIS TOUR'}
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
              {t('dayTours.negomboLagoonFishingDayTour.detailedDescription.intro') ||
                'Along the West Coast of Sri Lanka is the friendly city of Negombo, one of the oldest fishing towns in the country. In addition to its centuries-old fishing industry, Negombo is also known for its beautiful beaches, Dutch colonial architecture, and the famous Negombo Lagoon. This tour offers a unique opportunity to experience traditional fishing methods and explore the rich maritime culture of this coastal town.'}
            </p>
          </div>
        </div>
      </div>

      {/* Two Cards Section */}
      <div className="day-tour-cards-section">
        <div className="container">
          <div className="day-tour-cards-grid">
            <div className="tour-card">
              <div className="tour-card-image">
                <Image
                  src={negombolagoonsrilanka}
                  alt={
                    t('dayTours.negomboLagoonFishingDayTour.cards.negomboLagoon.title') ||
                    'Negombo Lagoon'
                  }
                  fill
                  className="tour-img"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="tour-card-content">
                <h3>
                  {t('dayTours.negomboLagoonFishingDayTour.cards.negomboLagoon.title') ||
                    'Negombo Lagoon'}
                </h3>
                <p>
                  {t('dayTours.negomboLagoonFishingDayTour.cards.negomboLagoon.description') ||
                    'Learn traditional and modern ways of fishing. Here you will see live cooking of the seafood you picked for lunch.'}
                </p>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-card-image">
                <Image
                  src={negomboBeachImage}
                  alt={
                    t('dayTours.negomboLagoonFishingDayTour.cards.negomboBeach.title') ||
                    'Negombo Beach'
                  }
                  fill
                  className="tour-img"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="tour-card-content">
                <h3>
                  {t('dayTours.negomboLagoonFishingDayTour.cards.negomboBeach.title') ||
                    'Negombo Beach'}
                </h3>
                <p>
                  {t('dayTours.negomboLagoonFishingDayTour.cards.negomboBeach.description') ||
                    'Relax on the beautiful golden sands of Negombo Beach, one of the most popular beaches on the west coast. Enjoy the calm waters, perfect for swimming, and take in the stunning sunset views over the Indian Ocean.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
