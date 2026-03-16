'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'
import udawalaweImage from '../../assest/images/UdawalaweNationalPark.jpg'
import bannerMaskSvg from '../../assest/images/banner_mask.svg'
import bannerMaskMobileSvg from '../../assest/images/banner_maskmobile.svg'

// Card images
import elephantSafariImage from '../../assest/images/ElephantSafari.jpg'
import wildlifeToursImage from '../../assest/images/WildlifeTours.jpg'

export default function UdawalaweNationalParkDayTourPage() {
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
              src={udawalaweImage}
              alt={
                t('dayTours.udawalaweNationalParkDayTour.title') ||
                'Udawalawe National Park Day Tour'
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
            {t('dayTours.udawalaweNationalParkDayTour.title') || 'Udawalawe National Park Day Tour'}
          </h1>
          <p className="day-tour-detail-description">
            {t('dayTours.udawalaweNationalParkDayTour.introDescription') ||
              t('dayTours.udawalaweNationalParkDayTour.description') ||
              'This park is the third most visited park in all of Sri Lanka and presents visitors with a fusion of flora and fauna. Herds of elephants, buffalos, deer…'}
          </p>
          <div className="day-tour-detail-buttons">
            <button onClick={handleExploreMore} className="day-tour-btn day-tour-btn-explore">
              <span>
                {t('dayTours.udawalaweNationalParkDayTour.buttons.exploreMore') || 'EXPLORE MORE'}
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
                {t('dayTours.udawalaweNationalParkDayTour.buttons.bookThisTour') ||
                  'BOOK THIS TOUR'}
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
              {t('dayTours.udawalaweNationalParkDayTour.detailedDescription.intro') ||
                "Udawalawe National Park is the third most visited park in all of Sri Lanka and presents visitors with a fusion of flora and fauna. The park is renowned for its large herds of elephants, buffalos, deer, and diverse bird species. This day tour offers an unforgettable wildlife safari experience in one of Sri Lanka's most accessible and wildlife-rich national parks."}
            </p>

            <h2 className="day-tour-detail-section-title">
              {t('dayTours.udawalaweNationalParkDayTour.detailedDescription.parkHighlightsTitle') ||
                'Park Highlights & Wildlife'}
            </h2>

            <ul className="day-tour-detail-historical-list">
              <li>
                {t(
                  'dayTours.udawalaweNationalParkDayTour.detailedDescription.highlights.elephants',
                ) ||
                  'Elephant Herds: Udawalawe is famous for its large elephant populations, offering excellent opportunities to observe these majestic creatures in their natural habitat.'}
              </li>
              <li>
                {t(
                  'dayTours.udawalaweNationalParkDayTour.detailedDescription.highlights.wildlife',
                ) ||
                  'Diverse Wildlife: Spot water buffalos, spotted deer, sambar deer, wild boar, and various other mammals throughout the park.'}
              </li>
              <li>
                {t('dayTours.udawalaweNationalParkDayTour.detailedDescription.highlights.birds') ||
                  'Bird Watching: The park is home to over 180 bird species, including endemic and migratory birds, making it a paradise for bird enthusiasts.'}
              </li>
              <li>
                {t(
                  'dayTours.udawalaweNationalParkDayTour.detailedDescription.highlights.reservoir',
                ) ||
                  'Udawalawe Reservoir: The park surrounds the Udawalawe Reservoir, creating a unique ecosystem that attracts diverse wildlife.'}
              </li>
              <li>
                {t('dayTours.udawalaweNationalParkDayTour.detailedDescription.highlights.safari') ||
                  "Jeep Safari Experience: Enjoy a thrilling jeep safari through the park's varied terrain, from grasslands to scrub forests."}
              </li>
              <li>
                {t(
                  'dayTours.udawalaweNationalParkDayTour.detailedDescription.highlights.accessibility',
                ) ||
                  'Easy Accessibility: Located just 180 km from Colombo, Udawalawe is easily accessible and perfect for a day trip.'}
              </li>
              <li>
                {t(
                  'dayTours.udawalaweNationalParkDayTour.detailedDescription.highlights.conservation',
                ) ||
                  'Conservation Success: The park plays a crucial role in elephant conservation and is home to the Udawalawe Elephant Transit Home.'}
              </li>
            </ul>
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
                  src={elephantSafariImage}
                  alt={
                    t('dayTours.udawalaweNationalParkDayTour.cards.elephantSafari.title') ||
                    'Elephant Safari'
                  }
                  fill
                  className="tour-img"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="tour-card-content">
                <h3>
                  {t('dayTours.udawalaweNationalParkDayTour.cards.elephantSafari.title') ||
                    'Elephant Safari'}
                </h3>
                <p>
                  {t('dayTours.udawalaweNationalParkDayTour.cards.elephantSafari.description') ||
                    'Experience close encounters with wild elephants in their natural habitat at Udawalawe National Park. Witness these majestic creatures as they roam freely, bathe in waterholes, and interact with their herds.'}
                </p>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-card-image">
                <Image
                  src={wildlifeToursImage}
                  alt={
                    t('dayTours.udawalaweNationalParkDayTour.cards.wildlifeSpotting.title') ||
                    'Wildlife Spotting'
                  }
                  fill
                  className="tour-img"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="tour-card-content">
                <h3>
                  {t('dayTours.udawalaweNationalParkDayTour.cards.wildlifeSpotting.title') ||
                    'Wildlife Spotting'}
                </h3>
                <p>
                  {t('dayTours.udawalaweNationalParkDayTour.cards.wildlifeSpotting.description') ||
                    'Spot diverse wildlife including elephants, water buffalos, spotted deer, sambar deer, wild boar, and over 180 bird species. The park offers excellent opportunities for wildlife photography and bird watching.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
