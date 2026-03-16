'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import belihuloyaDayTourImage from '../../assest/images/Belihuloya.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

export default function BelihuloyaDayTourPage() {
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
              src={belihuloyaDayTourImage}
              alt={t('dayTours.belihuloyaDayTour.title') || 'Belihuloya Day Tour'}
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
            {t('dayTours.belihuloyaDayTour.title') || 'Belihuloya Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.belihuloyaDayTour.introDescription')}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>{t('dayTours.belihuloyaDayTour.buttons.exploreMore')}</span>
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
              <span>{t('dayTours.belihuloyaDayTour.buttons.bookThisTour')}</span>
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
              {t('dayTours.belihuloyaDayTour.detailedDescription.intro')}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t('dayTours.belihuloyaDayTour.detailedDescription.historicalProminenceTitle')}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t('dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.scenicBeauty')}
              </li>
              <li>
                {t('dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.hillStation')}
              </li>
              <li>
                {t('dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.climate')}
              </li>
              <li>
                {t('dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.biodiversity')}
              </li>
              <li>
                {t(
                  'dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.adventureActivities',
                )}
              </li>
              <li>
                {t(
                  'dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.culturalHeritage',
                )}
              </li>
              <li>
                {t(
                  'dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.naturalWonders',
                )}
              </li>
              <li>
                {t(
                  'dayTours.belihuloyaDayTour.detailedDescription.historicalPoints.touristDestination',
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
