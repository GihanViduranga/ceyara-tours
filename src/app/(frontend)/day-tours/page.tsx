'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import './styles.css'
import defaultDayTourImage from '../assest/images/DayTour.jpg'

import anuradhapuraDayTour from '../assest/images/AnuradhapuraDayTour.jpg'
import belihuloya from '../assest/images/Belihuloya.jpg'
import colombo from '../assest/images/colombo.jpg'
import galleDayTour from '../assest/images/GalleDayTour.jpg'
import geoffreyBawaWorks from '../assest/images/GeoffreyBawaWorks.jpg'
import hotAirBallooning from '../assest/images/HotAirBallooning.jpg'
import kandyDayTour from '../assest/images/KandyDayTour.jpg'
import kayakingTour from '../assest/images/KayakingTour.jpg'
import littleEngland from '../assest/images/LittleEngland.jpg'
import negomboLagoonFishing from '../assest/images/NegomboLagoonFishing.jpg'
import culturalTour from '../assest/images/CulturalTour.jpg'
import sigiriyaRock from '../assest/images/Sigiriya Rock.jpg'
import wildlifeTours from '../assest/images/WildlifeTours.jpg'
import udawalaweNationalPark from '../assest/images/UdawalaweNationalPark.jpg'
import whaleWatching from '../assest/images/WhaleWatching.jpg'
import yalaNationalPark from '../assest/images/YalaNationalPark.jpg'
import wilpattuNationalPark from '../assest/images/WilpattuNationalPark.jpg'

interface DayTour {
  id: string
  titleKey: string
  locationKey: string
  descriptionKey: string
  slug: string
  image?: typeof defaultDayTourImage
}

export default function DayToursPage() {
  const { t } = useLanguage()

  // Day tours data - 17 cards
  const dayTours: DayTour[] = [
    {
      id: '1',
      titleKey: 'dayTours.anuradhapuraDayTour.title',
      locationKey: 'dayTours.anuradhapuraDayTour.location',
      descriptionKey: 'dayTours.anuradhapuraDayTour.description',
      slug: 'anuradhapura-day-tour',
      image: anuradhapuraDayTour,
    },
    {
      id: '2',
      titleKey: 'dayTours.belihuloyaDayTour.title',
      locationKey: 'dayTours.belihuloyaDayTour.location',
      descriptionKey: 'dayTours.belihuloyaDayTour.description',
      slug: 'belihuloya-day-tour',
      image: belihuloya,
    },
    {
      id: '3',
      titleKey: 'dayTours.colomboDayTour.title',
      locationKey: 'dayTours.colomboDayTour.location',
      descriptionKey: 'dayTours.colomboDayTour.description',
      slug: 'colombo-day-tour',
      image: colombo,
    },
    {
      id: '4',
      titleKey: 'dayTours.galleDayTour.title',
      locationKey: 'dayTours.galleDayTour.location',
      descriptionKey: 'dayTours.galleDayTour.description',
      slug: 'galle-day-tour',
      image: galleDayTour,
    },
    {
      id: '5',
      titleKey: 'dayTours.geoffreyBawaWorksSriLanka.title',
      locationKey: 'dayTours.geoffreyBawaWorksSriLanka.location',
      descriptionKey: 'dayTours.geoffreyBawaWorksSriLanka.description',
      slug: 'geoffrey-bawa-works',
      image: geoffreyBawaWorks,
    },
    {
      id: '6',
      titleKey: 'dayTours.hotAirBallooningDayTour.title',
      locationKey: 'dayTours.hotAirBallooningDayTour.location',
      descriptionKey: 'dayTours.hotAirBallooningDayTour.description',
      slug: 'hot-air-ballooning-day-tour',
      image: hotAirBallooning,
    },
    {
      id: '7',
      titleKey: 'dayTours.kandyDayTour.title',
      locationKey: 'dayTours.kandyDayTour.location',
      descriptionKey: 'dayTours.kandyDayTour.description',
      slug: 'kandy-day-tour',
      image: kandyDayTour,
    },
    {
      id: '8',
      titleKey: 'dayTours.kithulgalaWhiteWaterRafting.title',
      locationKey: 'dayTours.kithulgalaWhiteWaterRafting.location',
      descriptionKey: 'dayTours.kithulgalaWhiteWaterRafting.description',
      slug: 'kithulgala-white-water-rafting',
      image: kayakingTour,
    },
    {
      id: '9',
      titleKey: 'dayTours.littleEnglandDayTour.title',
      locationKey: 'dayTours.littleEnglandDayTour.location',
      descriptionKey: 'dayTours.littleEnglandDayTour.description',
      slug: 'little-england-day-tour',
      image: littleEngland,
    },
    {
      id: '10',
      titleKey: 'dayTours.negomboLagoonFishingDayTour.title',
      locationKey: 'dayTours.negomboLagoonFishingDayTour.location',
      descriptionKey: 'dayTours.negomboLagoonFishingDayTour.description',
      slug: 'negombo-lagoon-fishing-day-tour',
      image: negomboLagoonFishing,
    },
    {
      id: '11',
      titleKey: 'dayTours.polonnaruwaDayTour.title',
      locationKey: 'dayTours.polonnaruwaDayTour.location',
      descriptionKey: 'dayTours.polonnaruwaDayTour.description',
      slug: 'polonnaruwa-day-tour',
      image: culturalTour,
    },
    {
      id: '12',
      titleKey: 'dayTours.sigiriyaDambullaDayTour.title',
      locationKey: 'dayTours.sigiriyaDambullaDayTour.location',
      descriptionKey: 'dayTours.sigiriyaDambullaDayTour.description',
      slug: 'sigiriya-dambulla-day-tour',
      image: sigiriyaRock,
    },
    {
      id: '13',
      titleKey: 'dayTours.sinharajaDayTour.title',
      locationKey: 'dayTours.sinharajaDayTour.location',
      descriptionKey: 'dayTours.sinharajaDayTour.description',
      slug: 'sinharaja-day-tour',
      image: wildlifeTours,
    },
    {
      id: '14',
      titleKey: 'dayTours.udawalaweNationalParkDayTour.title',
      locationKey: 'dayTours.udawalaweNationalParkDayTour.location',
      descriptionKey: 'dayTours.udawalaweNationalParkDayTour.description',
      slug: 'udawalawe-national-park-day-tour',
      image: udawalaweNationalPark,
    },
    {
      id: '15',
      titleKey: 'dayTours.whaleWatchingDayTour.title',
      locationKey: 'dayTours.whaleWatchingDayTour.location',
      descriptionKey: 'dayTours.whaleWatchingDayTour.description',
      slug: 'whale-watching-day-tour',
      image: whaleWatching,
    },
    {
      id: '16',
      titleKey: 'dayTours.yalaNationalParkDayTour.title',
      locationKey: 'dayTours.yalaNationalParkDayTour.location',
      descriptionKey: 'dayTours.yalaNationalParkDayTour.description',
      slug: 'yala-national-park-day-tour',
      image: yalaNationalPark,
    },
    {
      id: '17',
      titleKey: 'dayTours.wilpattuNationalParkDayTour.title',
      locationKey: 'dayTours.wilpattuNationalParkDayTour.location',
      descriptionKey: 'dayTours.wilpattuNationalParkDayTour.description',
      slug: 'wilpattu-national-park-day-tour',
      image: wilpattuNationalPark,
    },
  ]

  return (
    <div className="day-tours-page">
      {/* Hero Section */}
      <section className="day-tours-hero">
        <div className="day-tours-hero-background">
          <Image
            src={defaultDayTourImage}
            alt="Day Tours"
            fill
            priority
            className="day-tours-hero-image"
            style={{ objectFit: 'cover' }}
          />
          <div className="day-tours-hero-overlay"></div>
        </div>
        <div className="day-tours-hero-content">
          <h1>{t('nav.dayTours') || 'Day Tours'}</h1>
          <p className="day-tours-hero-subtitle">
            {t('hero.dayToursSubtitle') ||
              'Discover our carefully curated selection of day tours and experiences'}
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="day-tours-intro">
        <div className="container">
          <div className="day-tours-intro-content">
            <h2>{t('hero.dayTours') || 'Day Tours'}</h2>
            <p>{t('cms.dayTours.introDescription1')}</p>
            <p>{t('cms.dayTours.introDescription2')}</p>
            <p>{t('cms.dayTours.introDescription3')}</p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="day-tours-tours">
        <div className="container">
          <h2 className="section-title">{t('hero.dayTours') || 'Day Tours'}</h2>
          <div className="tours-grid">
            {dayTours.map((tour) => (
              <div key={tour.id} className="tour-card">
                <div className="tour-card-image">
                  <Image
                    src={tour.image || defaultDayTourImage}
                    alt={t(tour.titleKey)}
                    width={400}
                    height={300}
                    className="tour-img"
                  />
                  <div className="tour-duration-badge">{t(tour.locationKey)}</div>
                </div>
                <div className="tour-card-content">
                  <h3>{t(tour.titleKey)}</h3>
                  <p>{t(tour.descriptionKey)}</p>
                  <div className="tour-card-footer">
                    <Link href={`/day-tours/${tour.slug}`} className="tour-enquire-btn">
                      {t('adventureNature.readMore') || 'Read More'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
