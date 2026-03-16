'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import gmailIcon from '../assest/images/icons8-gmail-96.png'
import messengerIcon from '../assest/images/icons8-messenger-48.png'
import { useLanguage } from '../contexts/LanguageContext'

export default function EnquiryPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    travelDates: '',
    duration: '',
    travelers: '',
    interests: '',
    budget: '',
    message: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateWhatsAppMessage = () => {
    const message = `${t('enquiry.messageTemplate.header')}

${t('enquiry.messageTemplate.personalInfo')}
${t('enquiry.messageTemplate.name')} ${formData.name}
${t('enquiry.messageTemplate.email')} ${formData.email}
${t('enquiry.messageTemplate.phone')} ${formData.phone}
${t('enquiry.messageTemplate.country')} ${formData.country}

${t('enquiry.messageTemplate.travelDetails')}
${t('enquiry.messageTemplate.travelDates')} ${formData.travelDates}
${t('enquiry.messageTemplate.duration')} ${formData.duration}
${t('enquiry.messageTemplate.travelers')} ${formData.travelers}
${t('enquiry.messageTemplate.budget')} ${formData.budget}

${t('enquiry.messageTemplate.interests')}
${formData.interests}

${t('enquiry.messageTemplate.additionalMessage')}
${formData.message}

${t('enquiry.messageTemplate.separator')}
${t('enquiry.messageTemplate.footer')}`

    return encodeURIComponent(message)
  }

  const generateMessengerMessage = () => {
    const message = `${t('enquiry.messengerTemplate.header')}

${t('enquiry.messengerTemplate.personalInfo')}
${t('enquiry.messengerTemplate.name')} ${formData.name}
${t('enquiry.messengerTemplate.email')} ${formData.email}
${t('enquiry.messengerTemplate.phone')} ${formData.phone}
${t('enquiry.messengerTemplate.country')} ${formData.country}

${t('enquiry.messengerTemplate.travelDetails')}
📅 ${t('enquiry.travelDates')}: ${formData.travelDates}
⏰ ${t('enquiry.duration')}: ${formData.duration}
👥 ${t('enquiry.travelers')}: ${formData.travelers}
💰 ${t('enquiry.budget')}: ${formData.budget}

${t('enquiry.messengerTemplate.interests')}
${formData.interests}

${t('enquiry.messengerTemplate.additionalMessage')}
${formData.message}

${t('enquiry.messengerTemplate.separator')}
${t('enquiry.messengerTemplate.footer')}`

    return encodeURIComponent(message)
  }

  const handleWhatsAppSubmit = () => {
    const phoneNumber = '+94766760016' // Replace with your WhatsApp number
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const generateEmailMessage = () => {
    // Build message parts with proper formatting
    const parts: string[] = []

    parts.push(t('enquiry.emailTemplate.header'))
    parts.push('')
    parts.push(t('enquiry.emailTemplate.personalInfo'))
    if (formData.name) parts.push(`${t('enquiry.emailTemplate.name')} ${formData.name}`)
    if (formData.email) parts.push(`${t('enquiry.emailTemplate.email')} ${formData.email}`)
    if (formData.phone) parts.push(`${t('enquiry.emailTemplate.phone')} ${formData.phone}`)
    if (formData.country) parts.push(`${t('enquiry.emailTemplate.country')} ${formData.country}`)
    parts.push('')
    parts.push(t('enquiry.emailTemplate.travelDetails'))
    if (formData.travelDates)
      parts.push(`${t('enquiry.emailTemplate.travelDates')} ${formData.travelDates}`)
    if (formData.duration) parts.push(`${t('enquiry.emailTemplate.duration')} ${formData.duration}`)
    if (formData.travelers)
      parts.push(`${t('enquiry.emailTemplate.travelers')} ${formData.travelers}`)
    if (formData.budget) parts.push(`${t('enquiry.emailTemplate.budget')} ${formData.budget}`)
    parts.push('')
    if (formData.interests && formData.interests.trim()) {
      parts.push(t('enquiry.emailTemplate.interests'))
      parts.push(formData.interests.trim())
      parts.push('')
    }
    if (formData.message && formData.message.trim()) {
      parts.push(t('enquiry.emailTemplate.additionalMessage'))
      parts.push(formData.message.trim())
      parts.push('')
    }
    parts.push(t('enquiry.emailTemplate.separator'))
    parts.push(t('enquiry.emailTemplate.footer'))

    // Join with line breaks and encode properly
    const message = parts.join('\n')
    return message
  }

  const handleMessengerSubmit = () => {
    const message = generateMessengerMessage()
    const messengerUrl = `https://www.facebook.com/share/1CXsBLJxxZ/?ref=${message}`
    window.open(messengerUrl, '_blank')
  }

  const handleEmailSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone) before sending.')
      return
    }

    const email = 'hello@ceyaratours.com'
    const subject = encodeURIComponent('Travel Enquiry - Ceyara Tours')
    const bodyText = generateEmailMessage()
    // Properly encode the body with line breaks as %0A
    const body = encodeURIComponent(bodyText)

    // Create mailto link with proper encoding
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`

    // Open email client
    window.location.href = mailtoUrl

    // Show notification after a short delay
    setTimeout(() => {
      alert(
        '✓ Email client opened successfully!\n\nPlease check your email application and click "Send" to complete sending your enquiry.\n\nYour message is ready to send to: hello@ceyaratours.com',
      )
    }, 300)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Don't auto-submit, let user choose their preferred method
  }

  return (
    <div className="enquiry-page">
      <main className="enquiry-main">
        <div className="container">
          {/* Hero Section */}
          <section className="enquiry-hero">
            <div className="enquiry-hero-content">
              <h1>{t('enquiry.title')}</h1>
              <p className="enquiry-subtitle">{t('enquiry.subtitle')}</p>
              <div className="enquiry-features">
                <div className="feature-item">
                  <span className="feature-icon">✈️</span>
                  <span>{t('enquiry.feature1')}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏨</span>
                  <span>{t('enquiry.feature2')}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>{t('enquiry.feature3')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Enquiry Form */}
          <section className="enquiry-form-section">
            <div className="enquiry-form-container">
              <div className="form-header">
                <h2>{t('enquiry.formTitle')}</h2>
                <p>{t('enquiry.formSubtitle')}</p>
              </div>

              <form onSubmit={handleFormSubmit} className="enquiry-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t('enquiry.name')} *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enquiry.namePlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t('enquiry.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enquiry.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">{t('enquiry.phone')} *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enquiry.phonePlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">{t('enquiry.country')}</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder={t('enquiry.countryPlaceholder')}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="travelDates">{t('enquiry.travelDates')}</label>
                    <input
                      type="text"
                      id="travelDates"
                      name="travelDates"
                      value={formData.travelDates}
                      onChange={handleInputChange}
                      placeholder={t('enquiry.travelDatesPlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duration">{t('enquiry.duration')}</label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                    >
                      <option value="">{t('enquiry.selectDuration')}</option>
                      <option value="3-5 days">3-5 {t('enquiry.days')}</option>
                      <option value="6-10 days">6-10 {t('enquiry.days')}</option>
                      <option value="11-15 days">11-15 {t('enquiry.days')}</option>
                      <option value="16+ days">16+ {t('enquiry.days')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="travelers">{t('enquiry.travelers')}</label>
                    <select
                      id="travelers"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                    >
                      <option value="">{t('enquiry.selectTravelers')}</option>
                      <option value="1">1 {t('enquiry.person')}</option>
                      <option value="2">2 {t('enquiry.people')}</option>
                      <option value="3-4">3-4 {t('enquiry.people')}</option>
                      <option value="5-8">5-8 {t('enquiry.people')}</option>
                      <option value="9+">9+ {t('enquiry.people')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="budget">{t('enquiry.budget')}</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                    >
                      <option value="">{t('enquiry.selectBudget')}</option>
                      <option value="Under $1000">Under $1000</option>
                      <option value="$1000 - $2000">$1000 - $2000</option>
                      <option value="$2000 - $5000">$2000 - $5000</option>
                      <option value="$5000 - $10000">$5000 - $10000</option>
                      <option value="Over $10000">Over $10000</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="interests">{t('enquiry.interests')}</label>
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={t('enquiry.interestsPlaceholder')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('enquiry.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder={t('enquiry.messagePlaceholder')}
                  />
                </div>

                <div className="form-actions">
                  <div className="submit-buttons">
                    <button
                      type="button"
                      onClick={handleWhatsAppSubmit}
                      className="whatsapp-submit-btn"
                    >
                      <span className="whatsapp-icon">
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
                      {t('enquiry.sendViaWhatsApp')}
                    </button>
                    <button
                      type="button"
                      onClick={handleMessengerSubmit}
                      className="messenger-submit-btn"
                    >
                      <span className="messenger-icon">
                        <Image src={messengerIcon} alt="Messenger" width={40} height={40} />
                      </span>
                      {t('enquiry.sendViaMessenger')}
                    </button>
                    <button type="button" onClick={handleEmailSubmit} className="email-submit-btn">
                      <span className="email-icon">
                        <Image src={gmailIcon} alt="Gmail" width={40} height={40} />
                      </span>
                      Send via Email
                    </button>
                  </div>
                  <p className="form-note">{t('enquiry.formNote')}</p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
