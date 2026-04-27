'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import '../registration/styles.css'
import './styles.css'

type DriverLookupResult = {
  id: string
  fullName: string
  contactNumber: string
  district: string
}

export default function VehicleRegistrationPage() {
  const { t } = useLanguage()

  const [nicNumber, setNicNumber] = useState('')
  const [findingDriver, setFindingDriver] = useState(false)
  const [driver, setDriver] = useState<DriverLookupResult | null>(null)
  const [driverLookupMessage, setDriverLookupMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    vehiclePhotoFront: null as File | null,
    vehiclePhotoBack: null as File | null,
    vehiclePhotoLeft: null as File | null,
    vehiclePhotoRight: null as File | null,
  })

  const [imagePreviews, setImagePreviews] = useState({
    vehiclePhotoFront: null as string | null,
    vehiclePhotoBack: null as string | null,
    vehiclePhotoLeft: null as string | null,
    vehiclePhotoRight: null as string | null,
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const canSubmit = useMemo(() => {
    return (
      !!driver?.id &&
      !!formData.plateNumber.trim() &&
      !!formData.model.trim() &&
      !!formData.vehiclePhotoFront &&
      !!formData.vehiclePhotoBack &&
      !!formData.vehiclePhotoLeft &&
      !!formData.vehiclePhotoRight
    )
  }, [driver?.id, formData])

  const handleVehicleFileChange = (
    field: 'vehiclePhotoFront' | 'vehiclePhotoBack' | 'vehiclePhotoLeft' | 'vehiclePhotoRight',
    file: File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }))

    if (!file) {
      setImagePreviews((prev) => ({ ...prev, [field]: null }))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreviews((prev) => ({ ...prev, [field]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const uploadFileToMedia = async (file: File, altText: string): Promise<string | null> => {
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('alt', altText)

      const res = await fetch('/api/media', { method: 'POST', body: form })
      if (!res.ok) return null
      const data = await res.json().catch(() => ({}))
      return data.doc?.id || data.id || null
    } catch {
      return null
    }
  }

  const handleFindDriver = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitMessage(null)
    setDriverLookupMessage(null)
    setDriver(null)

    const nic = nicNumber.trim()
    if (!nic) {
      setDriverLookupMessage({
        type: 'error',
        text: t('vehicleRegistration.nicRequired') || 'Please enter NIC number.',
      })
      return
    }

    setFindingDriver(true)
    try {
      const res = await fetch(
        `/api/drivers?limit=1&depth=0&where[nicPassportNumber][equals]=${encodeURIComponent(nic)}`,
      )
      if (!res.ok) {
        setDriverLookupMessage({
          type: 'error',
          text: t('vehicleRegistration.driverLookupFailed') || 'Failed to search driver. Try again.',
        })
        return
      }

      const data = await res.json().catch(() => ({}))
      const doc = data?.docs?.[0]
      if (!doc?.id) {
        setDriverLookupMessage({
          type: 'error',
          text: t('vehicleRegistration.driverNotFound') || 'No driver found for this NIC.',
        })
        return
      }

      setDriver({
        id: doc.id,
        fullName: doc.fullName,
        contactNumber: doc.contactNumber,
        district: doc.district,
      })
      setDriverLookupMessage({
        type: 'success',
        text: t('vehicleRegistration.driverFound') || 'Driver found. You can register the vehicle now.',
      })
    } catch {
      setDriverLookupMessage({
        type: 'error',
        text: t('vehicleRegistration.driverLookupFailed') || 'Failed to search driver. Try again.',
      })
    } finally {
      setFindingDriver(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitMessage(null)

    if (!driver?.id) {
      setSubmitMessage({
        type: 'error',
        text: t('vehicleRegistration.findDriverFirst') || 'Please find the driver first.',
      })
      return
    }

    if (!canSubmit) {
      setSubmitMessage({
        type: 'error',
        text:
          t('vehicleRegistration.requiredFields') ||
          'Vehicle model, plate number and all 4 vehicle images are required.',
      })
      return
    }

    setSubmitting(true)
    try {
      const frontId = await uploadFileToMedia(
        formData.vehiclePhotoFront!,
        `Vehicle Front - ${driver.fullName} - ${formData.plateNumber}`,
      )
      const backId = await uploadFileToMedia(
        formData.vehiclePhotoBack!,
        `Vehicle Back - ${driver.fullName} - ${formData.plateNumber}`,
      )
      const leftId = await uploadFileToMedia(
        formData.vehiclePhotoLeft!,
        `Vehicle Left - ${driver.fullName} - ${formData.plateNumber}`,
      )
      const rightId = await uploadFileToMedia(
        formData.vehiclePhotoRight!,
        `Vehicle Right - ${driver.fullName} - ${formData.plateNumber}`,
      )

      if (!frontId || !backId || !leftId || !rightId) {
        setSubmitMessage({
          type: 'error',
          text:
            t('vehicleRegistration.uploadFailed') ||
            'One or more image uploads failed. Please try again.',
        })
        return
      }

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver: driver.id,
          plateNumber: formData.plateNumber.trim(),
          model: formData.model.trim(),
          vehiclePhotoFront: frontId,
          vehiclePhotoBack: backId,
          vehiclePhotoLeft: leftId,
          vehiclePhotoRight: rightId,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSubmitMessage({
          type: 'error',
          text: err?.message || t('vehicleRegistration.submitFailed') || 'Vehicle registration failed.',
        })
        return
      }

      setSubmitMessage({
        type: 'success',
        text:
          t('vehicleRegistration.submitSuccess') ||
          'Vehicle registered successfully. It is now linked to the driver.',
      })

      setFormData({
        plateNumber: '',
        model: '',
        vehiclePhotoFront: null,
        vehiclePhotoBack: null,
        vehiclePhotoLeft: null,
        vehiclePhotoRight: null,
      })
      setImagePreviews({
        vehiclePhotoFront: null,
        vehiclePhotoBack: null,
        vehiclePhotoLeft: null,
        vehiclePhotoRight: null,
      })
    } catch {
      setSubmitMessage({
        type: 'error',
        text: t('vehicleRegistration.submitFailed') || 'Vehicle registration failed.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="vehicle-registration-page">
      <section className="vehicle-registration-hero">
        <div className="container">
          <h1>{t('vehicleRegistration.title') || 'Vehicle Registration'}</h1>
          <p className="vehicle-registration-hero-subtitle">
            {t('vehicleRegistration.subtitle') ||
              'Enter the driver NIC number, then register a vehicle with plate number and images.'}
          </p>
        </div>
      </section>

      <section className="vehicle-registration-content">
        <div className="container">
          <div className="vehicle-registration-card">
            <form onSubmit={handleFindDriver} className="registration-form">
              <div className="form-section-header">
                <h3>{t('vehicleRegistration.driverLookup') || 'Driver Lookup'}</h3>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nicNumber">
                    {t('vehicleRegistration.nicNumber') || 'Driver NIC Number'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    id="nicNumber"
                    type="text"
                    value={nicNumber}
                    onChange={(e) => setNicNumber(e.target.value)}
                    className="form-input"
                    placeholder="e.g., 200012345678 or 901234567V"
                    required
                  />
                </div>
                <div className="form-group vehicle-btn-group">
                  <label className="sr-only">Search</label>
                  <button type="submit" className="submit-btn" disabled={findingDriver}>
                    {findingDriver
                      ? t('vehicleRegistration.searching') || 'Searching...'
                      : t('vehicleRegistration.searchDriver') || 'Search Driver'}
                  </button>
                </div>
              </div>

              {driverLookupMessage && (
                <div
                  className={`submit-message ${driverLookupMessage.type === 'success' ? 'success' : 'error'}`}
                >
                  {driverLookupMessage.text}
                </div>
              )}

              {driver && (
                <div className="driver-summary">
                  <div className="driver-summary-title">
                    {t('vehicleRegistration.driverDetails') || 'Driver Details'}
                  </div>
                  <div className="driver-summary-grid">
                    <div>
                      <div className="driver-summary-label">{t('registration.fullName') || 'Full Name'}</div>
                      <div className="driver-summary-value">{driver.fullName}</div>
                    </div>
                    <div>
                      <div className="driver-summary-label">{t('registration.contact') || 'Contact'}</div>
                      <div className="driver-summary-value">{driver.contactNumber}</div>
                    </div>
                    <div>
                      <div className="driver-summary-label">{t('registration.district') || 'District'}</div>
                      <div className="driver-summary-value">{driver.district}</div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-section-header">
                <h3>{t('vehicleRegistration.vehicleDetails') || 'Vehicle Details'}</h3>
              </div>

              <div className="form-group">
                <label htmlFor="plateNumber">
                  {t('vehicleRegistration.plateNumber') || 'Plate Number'}{' '}
                  <span className="required">*</span>
                </label>
                <input
                  id="plateNumber"
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, plateNumber: e.target.value }))}
                  className="form-input"
                  placeholder="e.g., WP CAB-1234"
                  required
                  disabled={!driver?.id}
                />
                {!driver?.id && (
                  <div className="form-note">
                    <p>
                      {t('vehicleRegistration.noteFindDriver') ||
                        'Find the driver first. Then you can enter the plate number and upload vehicle images.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="vehicleModel">
                  {t('vehicleRegistration.model') || 'Vehicle Model'} <span className="required">*</span>
                </label>
                <input
                  id="vehicleModel"
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
                  className="form-input"
                  placeholder="e.g., Toyota Hiace 2016"
                  required
                  disabled={!driver?.id}
                />
              </div>

              <div className="form-section-subheader">
                <h4>{t('vehicleRegistration.vehiclePhotos') || 'Vehicle Photos (Required)'}</h4>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vehiclePhotoFront">
                    {t('vehicleRegistration.front') || 'Front'} <span className="required">*</span>
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="vehiclePhotoFront"
                      accept="image/*"
                      onChange={(e) =>
                        handleVehicleFileChange('vehiclePhotoFront', e.target.files?.[0] || null)
                      }
                      className="file-input"
                      disabled={!driver?.id}
                      required
                    />
                    <label htmlFor="vehiclePhotoFront" className="file-upload-label">
                      {t('registration.chooseFile') || 'Choose File'}
                    </label>
                    {formData.vehiclePhotoFront && (
                      <span className="file-name">{formData.vehiclePhotoFront.name}</span>
                    )}
                  </div>
                  {imagePreviews.vehiclePhotoFront && (
                    <div className="image-preview">
                      <Image
                        src={imagePreviews.vehiclePhotoFront}
                        alt="Vehicle Front preview"
                        width={220}
                        height={160}
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="vehiclePhotoBack">
                    {t('vehicleRegistration.back') || 'Back'} <span className="required">*</span>
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="vehiclePhotoBack"
                      accept="image/*"
                      onChange={(e) =>
                        handleVehicleFileChange('vehiclePhotoBack', e.target.files?.[0] || null)
                      }
                      className="file-input"
                      disabled={!driver?.id}
                      required
                    />
                    <label htmlFor="vehiclePhotoBack" className="file-upload-label">
                      {t('registration.chooseFile') || 'Choose File'}
                    </label>
                    {formData.vehiclePhotoBack && (
                      <span className="file-name">{formData.vehiclePhotoBack.name}</span>
                    )}
                  </div>
                  {imagePreviews.vehiclePhotoBack && (
                    <div className="image-preview">
                      <Image
                        src={imagePreviews.vehiclePhotoBack}
                        alt="Vehicle Back preview"
                        width={220}
                        height={160}
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vehiclePhotoLeft">
                    {t('vehicleRegistration.left') || 'Left Side'} <span className="required">*</span>
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="vehiclePhotoLeft"
                      accept="image/*"
                      onChange={(e) =>
                        handleVehicleFileChange('vehiclePhotoLeft', e.target.files?.[0] || null)
                      }
                      className="file-input"
                      disabled={!driver?.id}
                      required
                    />
                    <label htmlFor="vehiclePhotoLeft" className="file-upload-label">
                      {t('registration.chooseFile') || 'Choose File'}
                    </label>
                    {formData.vehiclePhotoLeft && (
                      <span className="file-name">{formData.vehiclePhotoLeft.name}</span>
                    )}
                  </div>
                  {imagePreviews.vehiclePhotoLeft && (
                    <div className="image-preview">
                      <Image
                        src={imagePreviews.vehiclePhotoLeft}
                        alt="Vehicle Left preview"
                        width={220}
                        height={160}
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="vehiclePhotoRight">
                    {t('vehicleRegistration.right') || 'Right Side'} <span className="required">*</span>
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="vehiclePhotoRight"
                      accept="image/*"
                      onChange={(e) =>
                        handleVehicleFileChange('vehiclePhotoRight', e.target.files?.[0] || null)
                      }
                      className="file-input"
                      disabled={!driver?.id}
                      required
                    />
                    <label htmlFor="vehiclePhotoRight" className="file-upload-label">
                      {t('registration.chooseFile') || 'Choose File'}
                    </label>
                    {formData.vehiclePhotoRight && (
                      <span className="file-name">{formData.vehiclePhotoRight.name}</span>
                    )}
                  </div>
                  {imagePreviews.vehiclePhotoRight && (
                    <div className="image-preview">
                      <Image
                        src={imagePreviews.vehiclePhotoRight}
                        alt="Vehicle Right preview"
                        width={220}
                        height={160}
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              </div>

              {submitMessage && (
                <div className={`submit-message ${submitMessage.type === 'success' ? 'success' : 'error'}`}>
                  {submitMessage.text}
                </div>
              )}

              <div className="modal-actions">
                <button type="submit" disabled={submitting || !canSubmit} className="submit-btn">
                  {submitting
                    ? t('vehicleRegistration.submitting') || 'Submitting...'
                    : t('vehicleRegistration.registerVehicle') || 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

