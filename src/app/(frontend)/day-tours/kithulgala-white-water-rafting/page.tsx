'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import kithulgalaImage from '../../assest/images/KithulgalaWhiteWaterRafting.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

export default function KithulgalaWhiteWaterRaftingPage() {
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
              src={kithulgalaImage}
              alt={
                t('dayTours.kithulgalaWhiteWaterRafting.title') || 'Kithulgala White Water Rafting'
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
            {t('dayTours.kithulgalaWhiteWaterRafting.title') || 'Kithulgala White Water Rafting'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.kithulgalaWhiteWaterRafting.introDescription') ||
              t('dayTours.kithulgalaWhiteWaterRafting.description') ||
              'The town of Kitulgala is where this tour will take you for a day filled with extreme adventure. Kitulgala is a small, yet beautiful town located in a wet zone rain forest…'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.kithulgalaWhiteWaterRafting.buttons.exploreMore') || 'EXPLORE MORE'}
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
                {t('dayTours.kithulgalaWhiteWaterRafting.buttons.bookThisTour') || 'BOOK THIS TOUR'}
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
              {t('dayTours.kithulgalaWhiteWaterRafting.detailedDescription.intro') ||
                'The town of Kitulgala is where this tour will take you for a day filled with extreme adventure. Kitulgala is a small, yet beautiful town located in a wet zone rain forest. This picturesque destination is famous for being the filming location of the classic movie "The Bridge on the River Kwai" and offers one of the best white water rafting experiences in Sri Lanka.'}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t(
                'dayTours.kithulgalaWhiteWaterRafting.detailedDescription.adventureExperienceTitle',
              ) || 'Adventure Experience'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t(
                  'dayTours.kithulgalaWhiteWaterRafting.detailedDescription.adventurePoints.raftingExperience',
                ) ||
                  "White Water Rafting: Experience the thrill of navigating through rapids on the Kelani River, one of Sri Lanka's most exciting rafting destinations with rapids ranging from Grade 2 to Grade 3."}
              </li>
              <li>
                {t(
                  'dayTours.kithulgalaWhiteWaterRafting.detailedDescription.adventurePoints.scenicBeauty',
                ) ||
                  'Scenic Beauty: Surrounded by lush rainforest, cascading waterfalls, and pristine natural landscapes, Kitulgala offers breathtaking views throughout your adventure.'}
              </li>
              <li>
                {t(
                  'dayTours.kithulgalaWhiteWaterRafting.detailedDescription.adventurePoints.safetyStandards',
                ) ||
                  'Safety Standards: All rafting activities are conducted with professional guides, safety equipment, and international safety standards to ensure a safe yet thrilling experience.'}
              </li>
              <li>
                {t(
                  'dayTours.kithulgalaWhiteWaterRafting.detailedDescription.adventurePoints.suitableForAll',
                ) ||
                  "Suitable for All Levels: Whether you're a beginner or an experienced rafter, the rapids are suitable for various skill levels, making it accessible to adventure enthusiasts of all ages."}
              </li>
              <li>
                {t(
                  'dayTours.kithulgalaWhiteWaterRafting.detailedDescription.adventurePoints.otherActivities',
                ) ||
                  'Additional Activities: Beyond rafting, Kitulgala offers opportunities for jungle trekking, bird watching, and exploring the rich biodiversity of the rainforest.'}
              </li>
              <li>
                {t(
                  'dayTours.kithulgalaWhiteWaterRafting.detailedDescription.adventurePoints.filmLocation',
                ) ||
                  'Film Location: Visit the iconic bridge location where the Academy Award-winning film "The Bridge on the River Kwai" was filmed, adding historical significance to your adventure.'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
