'use client'

import React, { useState, useMemo } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './styles.css'

const PHONE_REGEX = /^\+?[0-9()\-\s]{7,20}$/
const MIN_FULL_NAME_LENGTH = 3
const MAX_SPECIAL_NOTES_LENGTH = 1000
const MAX_NIGHTS = 60
const MAX_ADULTS = 50

export default function TailorMadeToursPage() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [errorKeys, setErrorKeys] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    // Step 1
    title: '',
    fullName: '',
    nationality: '',
    email: '',
    phone: '',
    // Step 2
    date: '',
    nights: '',
    adults: '',
    accommodation: '',
    // Step 3
    specialNotes: '',
    hearAboutUs: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errorKeys[name]) {
      setErrorKeys((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Translate error keys to current language
  const errors = useMemo(() => {
    const translatedErrors: Record<string, string> = {}
    Object.keys(errorKeys).forEach((key) => {
      translatedErrors[key] = t(errorKeys[key])
    })
    return translatedErrors
  }, [errorKeys, t])

  const validateStep1 = (): boolean => {
    const newErrorKeys: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrorKeys.title = 'tailorMadeTours.form.validation.titleRequired'
    }
    if (!formData.fullName.trim()) {
      newErrorKeys.fullName = 'tailorMadeTours.form.validation.fullNameRequired'
    } else if (formData.fullName.trim().length < MIN_FULL_NAME_LENGTH) {
      newErrorKeys.fullName = 'tailorMadeTours.form.validation.fullNameMinLength'
    }
    if (!formData.nationality.trim()) {
      newErrorKeys.nationality = 'tailorMadeTours.form.validation.nationalityRequired'
    }
    if (!formData.email.trim()) {
      newErrorKeys.email = 'tailorMadeTours.form.validation.emailRequired'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrorKeys.email = 'tailorMadeTours.form.validation.emailInvalid'
    }
    if (!formData.phone.trim()) {
      newErrorKeys.phone = 'tailorMadeTours.form.validation.phoneRequired'
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      newErrorKeys.phone = 'tailorMadeTours.form.validation.phoneInvalid'
    }

    setErrorKeys(newErrorKeys)
    return Object.keys(newErrorKeys).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrorKeys: Record<string, string> = {}

    if (!formData.date.trim()) {
      newErrorKeys.date = 'tailorMadeTours.form.validation.dateRequired'
    } else {
      const travelDate = new Date(formData.date)
      if (Number.isNaN(travelDate.getTime())) {
        newErrorKeys.date = 'tailorMadeTours.form.validation.dateInvalid'
      } else {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (travelDate < today) {
          newErrorKeys.date = 'tailorMadeTours.form.validation.dateInPast'
        }
      }
    }
    if (!formData.nights.trim()) {
      newErrorKeys.nights = 'tailorMadeTours.form.validation.nightsRequired'
    } else {
      const nights = parseInt(formData.nights, 10)
      if (!Number.isFinite(nights) || Number.isNaN(nights)) {
        newErrorKeys.nights = 'tailorMadeTours.form.validation.nightsInvalidNumber'
      } else if (nights < 1) {
        newErrorKeys.nights = 'tailorMadeTours.form.validation.nightsInvalid'
      } else if (nights > MAX_NIGHTS) {
        newErrorKeys.nights = 'tailorMadeTours.form.validation.nightsTooHigh'
      }
    }
    if (!formData.adults.trim()) {
      newErrorKeys.adults = 'tailorMadeTours.form.validation.adultsRequired'
    } else {
      const adults = parseInt(formData.adults, 10)
      if (!Number.isFinite(adults) || Number.isNaN(adults)) {
        newErrorKeys.adults = 'tailorMadeTours.form.validation.adultsInvalidNumber'
      } else if (adults < 1) {
        newErrorKeys.adults = 'tailorMadeTours.form.validation.adultsInvalid'
      } else if (adults > MAX_ADULTS) {
        newErrorKeys.adults = 'tailorMadeTours.form.validation.adultsTooHigh'
      }
    }
    if (!formData.accommodation.trim()) {
      newErrorKeys.accommodation = 'tailorMadeTours.form.validation.accommodationRequired'
    }

    setErrorKeys(newErrorKeys)
    return Object.keys(newErrorKeys).length === 0
  }

  const validateStep3 = (): boolean => {
    const newErrorKeys: Record<string, string> = {}

    if (formData.specialNotes.trim().length > MAX_SPECIAL_NOTES_LENGTH) {
      newErrorKeys.specialNotes = 'tailorMadeTours.form.validation.specialNotesTooLong'
    }

    if (!formData.hearAboutUs.trim()) {
      newErrorKeys.hearAboutUs = 'tailorMadeTours.form.validation.hearAboutUsRequired'
    }

    setErrorKeys(newErrorKeys)
    return Object.keys(newErrorKeys).length === 0
  }

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    let isValid = false
    if (currentStep === 1) {
      isValid = validateStep1()
    } else if (currentStep === 2) {
      isValid = validateStep2()
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
      setErrorKeys({})
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrorKeys({})
    }
  }

  const generateEmailMessage = () => {
    const parts: string[] = []

    parts.push('🌴 Ceyara Tours - Tailor-Made Tours Enquiry 🌴')
    parts.push('')
    parts.push('Personal Information:')
    parts.push(`👤 Title: ${formData.title}`)
    parts.push(`👤 Full Name: ${formData.fullName}`)
    parts.push(`🌍 Nationality: ${formData.nationality}`)
    parts.push(`📧 Email: ${formData.email}`)
    parts.push(`📱 Phone: ${formData.phone}`)
    parts.push('')
    parts.push('Travel Expectations:')
    parts.push(`📅 Date: ${formData.date}`)
    parts.push(`🌙 Number of Nights: ${formData.nights}`)
    parts.push(`👥 Number of Adults: ${formData.adults}`)
    parts.push(`🏨 Type of Accommodation: ${formData.accommodation}`)
    parts.push('')
    parts.push('Additional Details:')
    if (formData.specialNotes && formData.specialNotes.trim()) {
      parts.push(`📝 Special Notes: ${formData.specialNotes.trim()}`)
    }
    parts.push(`📢 How did you hear about us: ${formData.hearAboutUs}`)
    parts.push('')
    parts.push('---')
    parts.push('Sent from Ceyara Tours Tailor-Made Tours Form')

    return parts.join('\n')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all steps
    const step1Valid = validateStep1()
    const step2Valid = validateStep2()
    const step3Valid = validateStep3()

    if (!step1Valid || !step2Valid || !step3Valid) {
      // Go to the first step with errors
      if (!step1Valid) {
        setCurrentStep(1)
      } else if (!step2Valid) {
        setCurrentStep(2)
      } else {
        setCurrentStep(3)
      }
      alert(t('tailorMadeTours.form.validation.pleaseFillAllFields'))
      return
    }

    // Send email via API
    try {
      const email = 'gihanvidu123@gmail.com'
      const subject = 'Tailor-Made Tours Enquiry - Ceyara Tours'
      const message = generateEmailMessage()

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: subject,
          message: message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(t('tailorMadeTours.form.submitSuccess'))
        // Reset form
        setFormData({
          title: '',
          fullName: '',
          nationality: '',
          email: '',
          phone: '',
          date: '',
          nights: '',
          adults: '',
          accommodation: '',
          specialNotes: '',
          hearAboutUs: '',
        })
        setCurrentStep(1)
        setErrorKeys({})
      } else {
        // Display the error message from the API
        const errorMsg = data.message || data.error || t('tailorMadeTours.form.submitError')
        console.error('Email send error:', data)
        alert(errorMsg)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      const errorMsg =
        error instanceof Error
          ? error.message
          : t('tailorMadeTours.form.submitError') || 'Failed to send email. Please try again.'
      alert(errorMsg)
    }
  }

  const phoneNumber = '+94 772465884'

  return (
    <div className="tailor-made-tours-page">
      {/* Hero Section */}
      <section className="tailor-made-hero">
        <div className="container">
          <h1>{t('tailorMadeTours.hero.title')}</h1>
          <p className="tailor-made-description">{t('tailorMadeTours.hero.description')}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="tailor-made-main">
        <div className="container">
          <div className="tailor-made-layout">
            {/* Left Side - Form */}
            <div className="tailor-made-form-section">
              <div className="form-header-button">
                <button className="plan-trip-header-btn">
                  {t('tailorMadeTours.form.planYourTrip')}
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="form-progress">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`progress-step ${currentStep === step ? 'active' : ''} ${
                      currentStep > step ? 'completed' : ''
                    }`}
                  >
                    {currentStep > step ? (
                      <span className="checkmark">✓</span>
                    ) : (
                      <span className="step-number">{step}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Form Steps */}
              <form onSubmit={handleSubmit} className="tailor-made-form">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="form-step">
                    <h2 className="step-title">{t('tailorMadeTours.form.step1.title')}</h2>
                    <div className="form-group">
                      <label htmlFor="title">{t('tailorMadeTours.form.step1.titleLabel')} *</label>
                      <select
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className={errors.title ? 'error' : ''}
                      >
                        <option value="">{t('tailorMadeTours.form.step1.selectTitle')}</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                      {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="fullName">{t('tailorMadeTours.form.step1.fullName')} *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder={t('tailorMadeTours.form.step1.fullNamePlaceholder')}
                        className={errors.fullName ? 'error' : ''}
                      />
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="nationality">
                        {t('tailorMadeTours.form.step1.nationality')} *
                      </label>
                      <input
                        type="text"
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        required
                        placeholder={t('tailorMadeTours.form.step1.nationalityPlaceholder')}
                        className={errors.nationality ? 'error' : ''}
                      />
                      {errors.nationality && (
                        <span className="error-message">{errors.nationality}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">{t('tailorMadeTours.form.step1.email')} *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder={t('tailorMadeTours.form.step1.emailPlaceholder')}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">{t('tailorMadeTours.form.step1.phone')} *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder={t('tailorMadeTours.form.step1.phonePlaceholder')}
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>
                )}

                {/* Step 2: Travel Expectations */}
                {currentStep === 2 && (
                  <div className="form-step">
                    <h2 className="step-title">{t('tailorMadeTours.form.step2.title')}</h2>
                    <div className="form-group">
                      <label htmlFor="date">{t('tailorMadeTours.form.step2.date')} *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className={errors.date ? 'error' : ''}
                      />
                      {errors.date && <span className="error-message">{errors.date}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="nights">{t('tailorMadeTours.form.step2.nights')} *</label>
                      <input
                        type="number"
                        id="nights"
                        name="nights"
                        value={formData.nights}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder={t('tailorMadeTours.form.step2.nightsPlaceholder')}
                        className={errors.nights ? 'error' : ''}
                      />
                      {errors.nights && <span className="error-message">{errors.nights}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="adults">{t('tailorMadeTours.form.step2.adults')} *</label>
                      <input
                        type="number"
                        id="adults"
                        name="adults"
                        value={formData.adults}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder={t('tailorMadeTours.form.step2.adultsPlaceholder')}
                        className={errors.adults ? 'error' : ''}
                      />
                      {errors.adults && <span className="error-message">{errors.adults}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="accommodation">
                        {t('tailorMadeTours.form.step2.accommodation')} *
                      </label>
                      <select
                        id="accommodation"
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleInputChange}
                        required
                        className={errors.accommodation ? 'error' : ''}
                      >
                        <option value="">
                          {t('tailorMadeTours.form.step2.selectAccommodation')}
                        </option>
                        <option value="3 Star Hotels">3 Star Hotels</option>
                        <option value="4 Star Hotels">4 Star Hotels</option>
                        <option value="5 Star Hotels">5 Star Hotels</option>
                        <option value="Luxury Resorts">Luxury Resorts</option>
                        <option value="Boutique Hotels">Boutique Hotels</option>
                      </select>
                      {errors.accommodation && (
                        <span className="error-message">{errors.accommodation}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Last Few Details */}
                {currentStep === 3 && (
                  <div className="form-step">
                    <h2 className="step-title">{t('tailorMadeTours.form.step3.title')}</h2>
                    <div className="form-group">
                      <label htmlFor="specialNotes">
                        {t('tailorMadeTours.form.step3.specialNotes')}
                      </label>
                      <textarea
                        id="specialNotes"
                        name="specialNotes"
                        value={formData.specialNotes}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder={t('tailorMadeTours.form.step3.specialNotesPlaceholder')}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="hearAboutUs">
                        {t('tailorMadeTours.form.step3.hearAboutUs')} *
                      </label>
                      <select
                        id="hearAboutUs"
                        name="hearAboutUs"
                        value={formData.hearAboutUs}
                        onChange={handleInputChange}
                        required
                        className={errors.hearAboutUs ? 'error' : ''}
                      >
                        <option value="">
                          {t('tailorMadeTours.form.step3.selectHearAboutUs')}
                        </option>
                        <option value="Google Search">Google Search</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friend/Referral">Friend/Referral</option>
                        <option value="Travel Blog">Travel Blog</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.hearAboutUs && (
                        <span className="error-message">{errors.hearAboutUs}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="form-navigation">
                  {currentStep > 1 && (
                    <button type="button" onClick={handlePrevious} className="btn-previous">
                      {t('tailorMadeTours.form.previous')}
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button type="button" onClick={(e) => handleNext(e)} className="btn-next">
                      {t('tailorMadeTours.form.next')}
                    </button>
                  ) : (
                    <button type="submit" className="btn-submit">
                      {t('tailorMadeTours.form.submit')}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Side - Contact & Info */}
            <div className="tailor-made-sidebar">
              {/* Contact Section */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">{t('tailorMadeTours.sidebar.contactTitle')}</h3>
                <div className="contact-numbers">
                  <a
                    href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link whatsapp"
                  >
                    <span className="contact-icon whatsapp-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="20"
                        height="20"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </span>
                    <span>{phoneNumber}</span>
                  </a>
                  <a href={`tel:${phoneNumber}`} className="contact-link phone">
                    <span className="contact-icon phone-icon">📞</span>
                    <span>{phoneNumber}</span>
                  </a>
                </div>
                <p className="support-text">{t('tailorMadeTours.sidebar.supportText')}</p>
              </div>

              {/* How Our Service Works */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">{t('tailorMadeTours.sidebar.serviceTitle')}</h3>
                <div className="service-steps">
                  <div className="service-step">
                    <div className="service-icon globe">🌐</div>
                    <p>{t('tailorMadeTours.sidebar.serviceStep1')}</p>
                  </div>
                  <div className="service-step">
                    <div className="service-icon phone">📱</div>
                    <p>
                      {t('tailorMadeTours.sidebar.serviceStep2')}{' '}
                      <a href={`tel:${phoneNumber}`} className="inline-link">
                        {phoneNumber}
                      </a>{' '}
                      {t('tailorMadeTours.sidebar.serviceStep2Cont')}
                    </p>
                  </div>
                  <div className="service-step">
                    <div className="service-icon passport">📘</div>
                    <p>{t('tailorMadeTours.sidebar.serviceStep3')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">{t('tailorMadeTours.whyChooseUs.title')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon price">💰</div>
              <h3>{t('tailorMadeTours.whyChooseUs.feature1.title')}</h3>
              <p>{t('tailorMadeTours.whyChooseUs.feature1.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon experience">🧭</div>
              <h3>{t('tailorMadeTours.whyChooseUs.feature2.title')}</h3>
              <p>{t('tailorMadeTours.whyChooseUs.feature2.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon consultant">💡</div>
              <h3>{t('tailorMadeTours.whyChooseUs.feature3.title')}</h3>
              <p>{t('tailorMadeTours.whyChooseUs.feature3.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon support">📱</div>
              <h3>{t('tailorMadeTours.whyChooseUs.feature4.title')}</h3>
              <p>{t('tailorMadeTours.whyChooseUs.feature4.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon booking">📘</div>
              <h3>{t('tailorMadeTours.whyChooseUs.feature5.title')}</h3>
              <p>{t('tailorMadeTours.whyChooseUs.feature5.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon secure">🛡️</div>
              <h3>{t('tailorMadeTours.whyChooseUs.feature6.title')}</h3>
              <p>{t('tailorMadeTours.whyChooseUs.feature6.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
