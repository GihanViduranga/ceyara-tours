'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import whaleWatchingImage from '../../assest/images/WhaleWatching.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'
import mirissaWhaleWatchingVideo from '../../assest/images/MirissaWhaleWatching.mp4'

export default function WhaleWatchingDayTourPage() {
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
              src={whaleWatchingImage}
              alt={t('dayTours.whaleWatchingDayTour.title') || 'Whale Watching Day Tour'}
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
            {t('dayTours.whaleWatchingDayTour.title') || 'Whale Watching Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.whaleWatchingDayTour.introDescription') ||
              t('dayTours.whaleWatchingDayTour.description') ||
              'Sri Lanka is one of the best destinations for whale watching in Asia. Sperm Whales and Blue Whales are a common occurrence off the southern coast…'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.whaleWatchingDayTour.buttons.exploreMore') || 'EXPLORE MORE'}
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
                {t('dayTours.whaleWatchingDayTour.buttons.bookThisTour') || 'BOOK THIS TOUR'}
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
              {t('dayTours.whaleWatchingDayTour.detailedDescription.intro') ||
                'Sri Lanka is one of the best destinations for whale watching in Asia. Sperm Whales and Blue Whales are a common occurrence off the southern coast, particularly around Mirissa. This day tour offers an unforgettable experience to witness these magnificent marine giants in their natural habitat. The best time for whale watching is from November to April, when the ocean conditions are ideal and whale sightings are most frequent.'}
            </p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="day-tour-video-section">
        <div className="container">
          <div className="day-tour-video-wrapper">
            <video
              src={mirissaWhaleWatchingVideo}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="day-tour-video-iframe"
              preload="auto"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  )
}
