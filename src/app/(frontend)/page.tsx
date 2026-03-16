'use client'

import { getTranslation, isLanguageSupported, LanguageCode } from '@/utils/i18n'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import mountainTourImage from '@/app/(frontend)/assest/images/adventure.jpg'
import coverImage from '@/app/(frontend)/assest/images/mainPageCover.jpg'
import aboutImage from '@/app/(frontend)/assest/images/Sigiriya Rock.jpg'

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface Tour {
  id: string
  category: string
  title: string
  titleTranslations?: Translations
  description: string
  descriptionTranslations?: Translations
  duration: string
  durationTranslations?: Translations
  slug: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  createdAt?: string
  updatedAt?: string
}

export default function HomePage() {
  const [language, setLanguage] = useState<LanguageCode>('EN')
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const homepageCardsRef = useRef<HTMLDivElement>(null)

  // Load language from localStorage on mount and listen for changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateLanguage = () => {
      const savedLanguage = localStorage.getItem('selectedLanguage')
      if (savedLanguage && isLanguageSupported(savedLanguage)) {
        setLanguage(savedLanguage as LanguageCode)
      }
    }

    // Load initial language
    updateLanguage()

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', updateLanguage)

    // Listen for custom language change event (same-tab)
    window.addEventListener('languageChanged', updateLanguage)

    // Also check periodically for changes (fallback)
    const interval = setInterval(updateLanguage, 200)

    return () => {
      window.removeEventListener('storage', updateLanguage)
      window.removeEventListener('languageChanged', updateLanguage)
      clearInterval(interval)
    }
  }, [])

  // Translation function using JSON files directly - memoized to prevent unnecessary re-renders
  const t = useCallback(
    (key: string): string => {
      return getTranslation(language, key)
    },
    [language],
  )

  // Helper function to get translated value for itinerary data
  const getTranslatedValue = useCallback(
    (defaultValue: string, translations?: Translations): string => {
      if (!translations || language === 'EN') return defaultValue

      const langMap: Record<string, keyof Translations> = {
        DE: 'de',
        FR: 'fr',
        NL: 'nl',
        IT: 'it',
        ES: 'es',
        RU: 'ru',
      }

      const langKey = langMap[language]
      return (langKey && translations[langKey]) || defaultValue
    },
    [language],
  )

  // Fetch 10 most recent itineraries
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        // Fetch 10 most recent tours sorted by createdAt descending
        const response = await fetch(`/api/itinerary-pages?limit=10&sort=-createdAt&depth=2`)
        if (!response.ok) {
          console.warn('Failed to fetch tours')
          setTours([])
          return
        }
        const data = await response.json()
        setTours(data.docs || [])
      } catch (err) {
        console.error('Error fetching tours:', err)
        setTours([])
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  const getImageUrl = (tour: Tour) => {
    if (tour.image?.url) {
      return tour.image.url
    }
    if (tour.image?.filename) {
      return `/api/media/file/${tour.image.filename}`
    }
    return mountainTourImage
  }

  // Clone cards once on mount for infinite scroll animation
  useEffect(() => {
    if (loading || tours.length === 0) return

    const grid = homepageCardsRef.current
    if (!grid) return

    // Only clone if we haven't already (check if we have 10 cards, should become 20)
    if (grid.children.length === tours.length) {
      const originalContent = grid.innerHTML
      grid.innerHTML = originalContent + originalContent
    }
  }, [loading, tours.length])

  // Update card content when language changes without breaking animation
  useEffect(() => {
    if (loading || tours.length === 0) return

    const grid = homepageCardsRef.current
    if (!grid) return

    let frameId2: number | null = null

    // Wait for React to finish rendering with new translations
    const frameId1 = requestAnimationFrame(() => {
      frameId2 = requestAnimationFrame(() => {
        // Update text content of all cards (both original and cloned) without re-cloning
        const cards = grid.children

        // Update all cards (original + cloned)
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as HTMLElement
          const cardIndex = i % tours.length // Use modulo to cycle through tour data
          const tour = tours[cardIndex]

          if (!tour) continue

          // Update title
          const titleEl = card.querySelector('.feature-content h3')
          if (titleEl) titleEl.textContent = getTranslatedValue(tour.title, tour.titleTranslations)

          // Update description
          const descEl = card.querySelector('.feature-content p')
          if (descEl)
            descEl.textContent = getTranslatedValue(tour.description, tour.descriptionTranslations)

          // Update alt text
          const imgEl = card.querySelector('.feature-image img') as HTMLImageElement
          if (imgEl) {
            imgEl.alt = tour.image?.alt || getTranslatedValue(tour.title, tour.titleTranslations)
          }

          // Update read more link (keep the SVG and href)
          const linkEl = card.querySelector('.read-more-btn') as HTMLAnchorElement
          if (linkEl) {
            const svg = linkEl.querySelector('svg')
            // Update href
            linkEl.href = `/itineraries/${tour.category}/${tour.slug}`
            // Clear text nodes but keep the SVG
            const textNodes: Node[] = []
            linkEl.childNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node)
              }
            })
            textNodes.forEach((node) => linkEl.removeChild(node))
            linkEl.appendChild(document.createTextNode(t('features.readMore') + ' '))
            if (svg) linkEl.appendChild(svg)
          }
        }
      })
    })

    return () => {
      cancelAnimationFrame(frameId1)
      if (frameId2 !== null) {
        cancelAnimationFrame(frameId2)
      }
    }
  }, [language, t, tours, loading, getTranslatedValue])

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-background">
          <Image
            src={coverImage}
            alt="Sri Lanka Tourism"
            fill
            priority
            className="hero-image"
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <p className="hero-tagline">{t('hero.tagline')}</p>
          <div className="hero-actions">
            <Link href="/itineraries" className="cta-button primary">
              <svg className="cta-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {t('hero.curatedItineraries')}
            </Link>
            <Link href="/tailor-made-tours" className="cta-button secondary">
              <svg className="cta-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {t('hero.tailormadeExperiences')}
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <Image
                src={aboutImage}
                alt="Sigiriya Rock Formation"
                width={600}
                height={800}
                className="about-img"
              />
            </div>
            <div className="about-text">
              <h2 className="about-heading">
                {t('about.magicalMemories')}
                <br />
                {t('about.bespokeExperiences')}
              </h2>
              <p>{t('about.description1')}</p>
              <p>{t('about.description2')}</p>
              <Link href="/enquiry" className="plan-trip-button">
                {t('about.planTrip')}
                <svg className="arrow-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">65,610</span>
              <span className="stat-label">{t('stats.area')}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">09</span>
              <span className="stat-label">{t('stats.provinces')}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">{t('stats.places')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>{t('features.title')}</h2>
          <div className="homepage-features-wrapper">
            <div className="homepage-features-grid" ref={homepageCardsRef}>
              {loading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                  <p>{t('common.loadingTours')}</p>
                </div>
              ) : tours.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                  <p>No tours available at the moment.</p>
                </div>
              ) : (
                tours.map((tour) => (
                  <div key={tour.id} className="feature-card">
                    <div className="feature-image">
                      <Image
                        src={getImageUrl(tour)}
                        alt={
                          tour.image?.alt || getTranslatedValue(tour.title, tour.titleTranslations)
                        }
                        width={300}
                        height={200}
                        className="feature-img"
                      />
                    </div>
                    <div className="feature-content">
                      <h3>{getTranslatedValue(tour.title, tour.titleTranslations)}</h3>
                      <p>{getTranslatedValue(tour.description, tour.descriptionTranslations)}</p>
                      <Link
                        href={`/itineraries/${tour.category}/${tour.slug}`}
                        className="read-more-btn"
                      >
                        {t('features.readMore')}
                        <svg className="arrow-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="destinations">
        <div className="container">
          <h2>{t('destinations.title')}</h2>
          <div className="destinations-grid">
            <div className="destination-card">
              <h3>{t('destinations.hillCountry.title')}</h3>
              <p>{t('destinations.hillCountry.description')}</p>
            </div>
            <div className="destination-card">
              <h3>{t('destinations.coastalParadise.title')}</h3>
              <p>{t('destinations.coastalParadise.description')}</p>
            </div>
            <div className="destination-card">
              <h3>{t('destinations.wildlifeSafari.title')}</h3>
              <p>{t('destinations.wildlifeSafari.description')}</p>
            </div>
            <div className="destination-card">
              <h3>{t('destinations.culturalTriangle.title')}</h3>
              <p>{t('destinations.culturalTriangle.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.description')}</p>
          <Link href="/itineraries" className="cta-button primary large">
            {t('cta.viewAllTours')}
          </Link>
        </div>
      </section>
    </div>
  )
}
