'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import hotAirBallooningImage from '../../assest/images/HotAirBallooning.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'
import dambullaHotAirBalloonVideo from '../../assest/images/DambullaHotAirBalloon.mp4'

export default function HotAirBallooningDayTourPage() {
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
              src={hotAirBallooningImage}
              alt={t('dayTours.hotAirBallooningDayTour.title') || 'Hot Air Ballooning Day Tour'}
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
            {t('dayTours.hotAirBallooningDayTour.title') || 'Hot Air Ballooning Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.hotAirBallooningDayTour.introDescription') ||
              t('dayTours.hotAirBallooningDayTour.description') ||
              'Enjoy an experience of a lifetime as you feel the adrenaline rush while drifting off over breathtaking views of the tropical paradise of Sri Lanka.'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.hotAirBallooningDayTour.buttons.exploreMore') || 'EXPLORE MORE'}
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
                {t('dayTours.hotAirBallooningDayTour.buttons.bookThisTour') || 'BOOK THIS TOUR'}
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
              {t('dayTours.hotAirBallooningDayTour.detailedDescription.intro') ||
                "Experience the magic of floating above Sri Lanka's stunning landscapes in a hot air balloon. This unforgettable adventure offers panoramic views of ancient ruins, lush forests, and picturesque countryside as you gently drift through the morning sky."}
            </p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="day-tour-video-section">
        <div className="container">
          <div className="day-tour-video-wrapper">
            <video
              src={dambullaHotAirBalloonVideo}
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
