'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import aboutPageImage from '../assest/images/AboutPage.jpg'
import shieldIcon from '../assest/images/icons8-microsoft-defender-2025-96.png'
import peopleIcon from '../assest/images/icons8-connected-people-96.png'
import mapIcon from '../assest/images/icons8-map-96.png'
import './styles.css'

interface GalleryImage {
  id: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  alt: string
}

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface Testimonial {
  id: string
  title: string
  titleTranslations?: Translations
  feedback: string
  feedbackTranslations?: Translations
  customerName: string
  customerNameTranslations?: Translations
  order?: number
}

export default function AboutPage() {
  const { t, language } = useLanguage()
  const [showMore, setShowMore] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  // Fetch gallery images from CMS
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setGalleryLoading(true)
        const response = await fetch('/api/gallery?sort=order&depth=2')
        if (!response.ok) {
          console.warn('Failed to fetch gallery images')
          setGalleryImages([])
          return
        }
        const data = await response.json()
        setGalleryImages(data.docs || [])
      } catch (err) {
        console.error('Error fetching gallery images:', err)
        setGalleryImages([])
      } finally {
        setGalleryLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  // Fetch testimonials from CMS
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true)
        const response = await fetch('/api/testimonials?sort=order&limit=100')
        if (!response.ok) {
          console.warn('Failed to fetch testimonials')
          setTestimonials([])
          return
        }
        const data = await response.json()
        setTestimonials(data.docs || [])
      } catch (err) {
        console.error('Error fetching testimonials:', err)
        setTestimonials([])
      } finally {
        setTestimonialsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const getImageUrl = (image: GalleryImage) => {
    if (image.image?.url) {
      return image.image.url
    }
    if (image.image?.filename) {
      return `/api/media/file/${image.image.filename}`
    }
    return '/api/placeholder/800/600'
  }

  // Helper function to get translated value for testimonials
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

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    if (testimonials.length === 0) return
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }, [])

  const nextImage = useCallback(() => {
    if (galleryImages.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }, [galleryImages.length])

  const prevImage = useCallback(() => {
    if (galleryImages.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }, [galleryImages.length])

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, nextImage, prevImage, closeLightbox])

  return (
    <div className="about-page">
      <section className="about-content-section">
        <div className="container">
          <h1 className="about-title">{t('ourStory.title')}</h1>
          <p className="about-intro">{t('ourStory.intro')}</p>

          <div className="about-description-wrapper">
            <div className={`about-description ${showMore ? 'expanded' : 'collapsed'}`}>
              <p className="about-description-text">{t('ourStory.description')}</p>
            </div>

            <button
              className="show-more-button"
              onClick={() => setShowMore(!showMore)}
              aria-expanded={showMore}
            >
              {showMore ? (
                <>
                  {t('ourStory.showLess')}
                  <span className="chevron-up">^</span>
                  <span className="chevron-down">v</span>
                </>
              ) : (
                <>
                  {t('ourStory.showMore')}
                  <span className="chevron-down">v</span>
                </>
              )}
            </button>
          </div>

          <div className="about-image-section">
            <Image
              src={aboutPageImage}
              alt="About Ceyara Tours"
              width={1200}
              height={600}
              className="about-page-image"
              priority
            />
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <h2 className="why-title">{t('ourStory.whyTitle')}</h2>
          <div className="why-features-grid">
            <div className="why-feature-card">
              <div className="why-feature-icon">
                <Image
                  src={shieldIcon}
                  alt="Trust and Reputation"
                  width={96}
                  height={96}
                  className="why-icon-image"
                />
              </div>
              <p className="why-feature-text">{t('ourStory.whyFeature1')}</p>
            </div>

            <div className="why-feature-card">
              <div className="why-feature-icon">
                <Image
                  src={peopleIcon}
                  alt="Expert Consultants"
                  width={96}
                  height={96}
                  className="why-icon-image"
                />
              </div>
              <p className="why-feature-text">{t('ourStory.whyFeature2')}</p>
            </div>

            <div className="why-feature-card">
              <div className="why-feature-icon">
                <Image
                  src={mapIcon}
                  alt="Customized Solutions"
                  width={96}
                  height={96}
                  className="why-icon-image"
                />
              </div>
              <p className="why-feature-text">{t('ourStory.whyFeature3')}</p>
            </div>
          </div>

          <div className="why-cta-wrapper">
            <Link href="/enquiry" className="why-cta-button">
              {t('ourStory.startPlanning')}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3" y="4" width="14" height="12" rx="1" stroke="white" strokeWidth="1.5" />
                <path d="M3 7H17" stroke="white" strokeWidth="1.5" />
                <path d="M7 11H13" stroke="white" strokeWidth="1.5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2 className="team-title">{t('ourStory.meetTeamTitle')}</h2>
          <div className="team-description">
            <p>{t('ourStory.meetTeamDesc1')}</p>
            <p>{t('ourStory.meetTeamDesc2')}</p>
          </div>

          <div className="team-scroll-wrapper">
            <div className="team-grid team-grid-animated">
              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Nimesha Madushani"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Nimesha Madushani</h3>
                  <p className="team-role">Sales Manager</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Reshani"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Reshani</h3>
                  <p className="team-role">Sales Manager</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Nilusha"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Nilusha</h3>
                  <p className="team-role">Accountant</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Amesha"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Amesha</h3>
                  <p className="team-role">Senior Executive Operations and Marketing</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Kavindi"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Kavindi</h3>
                  <p className="team-role">Accounts Executive</p>
                </div>
              </div>

              {/* Duplicate cards for seamless loop */}
              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Nimesha Madushani"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Nimesha Madushani</h3>
                  <p className="team-role">Sales Manager</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Reshani"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Reshani</h3>
                  <p className="team-role">Sales Manager</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Nilusha"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Nilusha</h3>
                  <p className="team-role">Accountant</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Amesha"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Amesha</h3>
                  <p className="team-role">Senior Executive Operations and Marketing</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-photo">
                  <Image
                    src="/api/placeholder/200/250"
                    alt="Kavindi"
                    width={200}
                    height={250}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">Kavindi</h3>
                  <p className="team-role">Accounts Executive</p>
                </div>
              </div>
            </div>
          </div>

          <div className="team-cta-wrapper">
            <Link href="/our-story/our-team" className="team-cta-button">
              {t('ourStory.viewOurTeam')}
            </Link>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <h2 className="gallery-title">{t('ourStory.galleryTitle')}</h2>
          {galleryLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>{t('ourStory.loadingGallery')}</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>{t('ourStory.noGallery')}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryImages.map((image, index) => (
                <div key={image.id} className="gallery-item" onClick={() => openLightbox(index)}>
                  <Image
                    src={getImageUrl(image)}
                    alt={image.alt || image.image?.alt || 'Gallery image'}
                    width={300}
                    height={200}
                    className="gallery-image"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="testimonials-title">{t('ourStory.testimonialsTitle')}</h2>
          {testimonialsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>{t('ourStory.loadingTestimonials')}</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>{t('ourStory.noTestimonials')}</p>
            </div>
          ) : (
            <div className="testimonial-carousel">
              <button
                className="testimonial-nav testimonial-prev"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
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
              <div className="testimonial-content">
                <h3 className="testimonial-title">
                  {getTranslatedValue(
                    testimonials[currentTestimonialIndex].title,
                    testimonials[currentTestimonialIndex].titleTranslations,
                  )}
                </h3>
                <p className="testimonial-text">
                  {getTranslatedValue(
                    testimonials[currentTestimonialIndex].feedback,
                    testimonials[currentTestimonialIndex].feedbackTranslations,
                  )}
                </p>
                <p className="testimonial-author">
                  {getTranslatedValue(
                    testimonials[currentTestimonialIndex].customerName,
                    testimonials[currentTestimonialIndex].customerNameTranslations,
                  )}
                </p>
              </div>
              <button
                className="testimonial-nav testimonial-next"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
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
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="lightbox-nav lightbox-prev"
              onClick={prevImage}
              aria-label="Previous image"
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
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="lightbox-nav lightbox-next"
              onClick={nextImage}
              aria-label="Next image"
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
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="lightbox-image-wrapper">
              <Image
                src={getImageUrl(galleryImages[currentImageIndex])}
                alt={
                  galleryImages[currentImageIndex].alt ||
                  galleryImages[currentImageIndex].image?.alt ||
                  'Gallery image'
                }
                width={1200}
                height={800}
                className="lightbox-image"
                priority
              />
            </div>
            <div className="lightbox-counter">
              {currentImageIndex + 1} of {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
