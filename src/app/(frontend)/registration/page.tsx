'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './styles.css'

interface Driver {
  id: string
  fullName: string
  contactNumber: string
  whatsappNumber?: string
  emailAddress?: string
  district: string
  profilePhoto?: {
    id: string
    url?: string
    publicUrl?: string
    filename?: string
    alt?: string
  }
  createdAt?: string
}

interface Guide {
  id: string
  fullName: string
  contactNumber: string
  whatsappNumber?: string
  emailAddress?: string
  district: string
  profilePhoto?: {
    id: string
    url?: string
    publicUrl?: string
    filename?: string
    alt?: string
  }
  createdAt?: string
}

interface TourRequest {
  id: string
  type: 'driver' | 'guide'
  driverOrGuideId: string
  status: 'pending' | 'done' | 'cancel'
  startDate?: string
  endDate?: string
}

type PersonType = 'driver' | 'guide' | 'all'

export default function RegistrationPage() {
  const { t } = useLanguage()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<PersonType>('all')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [registrationType, setRegistrationType] = useState<'driver' | 'guide'>('driver')
  const [registrationFormData, setRegistrationFormData] = useState({
    fullName: '',
    nicPassportNumber: '',
    dateOfBirth: '',
    contactNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    residentialAddress: '',
    district: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    profilePhoto: null as File | null,
    nicPhotoFront: null as File | null,
    nicPhotoBack: null as File | null,
    // Driver-specific fields
    drivingLicenceFront: null as File | null,
    drivingLicenceBack: null as File | null,
    yearsOfExperience: '',
    languagesSpoken: '',
    areasFamiliar: [] as string[],
    vehicleType: '',
    vehicleRegistrationBook: null as File | null,
    revenueLicence: null as File | null,
    insuranceCard: null as File | null,
    vehiclePhotoFront: null as File | null,
    vehiclePhotoBack: null as File | null,
    vehiclePhotoSide: null as File | null,
    vehiclePhotoInterior: null as File | null,
    bankName: '',
    bankBranch: '',
    accountHolderName: '',
    accountNumber: '',
  })
  const [imagePreviews, setImagePreviews] = useState<{
    profilePhoto: string | null
    nicPhotoFront: string | null
    nicPhotoBack: string | null
    drivingLicenceFront: string | null
    drivingLicenceBack: string | null
    vehicleRegistrationBook: string | null
    revenueLicence: string | null
    insuranceCard: string | null
    vehiclePhotoFront: string | null
    vehiclePhotoBack: string | null
    vehiclePhotoSide: string | null
    vehiclePhotoInterior: string | null
  }>({
    profilePhoto: null,
    nicPhotoFront: null,
    nicPhotoBack: null,
    drivingLicenceFront: null,
    drivingLicenceBack: null,
    vehicleRegistrationBook: null,
    revenueLicence: null,
    insuranceCard: null,
    vehiclePhotoFront: null,
    vehiclePhotoBack: null,
    vehiclePhotoSide: null,
    vehiclePhotoInterior: null,
  })
  const [registering, setRegistering] = useState(false)
  const [registerMessage, setRegisterMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([])
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<{
    id: string
    name: string
    email?: string
    contact: string
    type: 'driver' | 'guide'
  } | null>(null)
  const [requestFormData, setRequestFormData] = useState({
    touristName: '',
    touristEmail: '',
    touristContact: '',
    startDate: '',
    endDate: '',
  })
  const [submittingRequest, setSubmittingRequest] = useState(false)
  const [requestMessage, setRequestMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Fetch drivers, guides, and tour requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch drivers
        const driversResponse = await fetch(
          '/api/drivers?limit=100&depth=2&sort=-createdAt&where[approved][equals]=true',
        )
        if (driversResponse.ok) {
          const driversData = await driversResponse.json()
          setDrivers(driversData.docs || [])
        }

        // Fetch guides
        const guidesResponse = await fetch(
          '/api/guides?limit=100&depth=2&sort=-createdAt&where[approved][equals]=true',
        )
        if (guidesResponse.ok) {
          const guidesData = await guidesResponse.json()
          setGuides(guidesData.docs || [])
        }

        // Fetch tour requests (pending and done status for filtering)
        try {
          // Fetch pending requests
          const pendingResponse = await fetch(
            '/api/tour-requests?where[status][equals]=pending&limit=1000',
          )
          const pendingData = pendingResponse.ok ? await pendingResponse.json() : { docs: [] }

          // Fetch done requests
          const doneResponse = await fetch(
            '/api/tour-requests?where[status][equals]=done&limit=1000',
          )
          const doneData = doneResponse.ok ? await doneResponse.json() : { docs: [] }

          // Combine both arrays
          const allRequests = [...(pendingData.docs || []), ...(doneData.docs || [])]
          setTourRequests(allRequests)
        } catch (err) {
          console.error('Error fetching tour requests:', err)
        }
      } catch (err) {
        console.error('Error fetching drivers and guides:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get image URL helper
  const getImageUrl = (person: Driver | Guide) => {
    // Use publicUrl if available (GCS URL)
    if (
      person.profilePhoto &&
      typeof person.profilePhoto === 'object' &&
      'publicUrl' in person.profilePhoto &&
      person.profilePhoto.publicUrl
    ) {
      return person.profilePhoto.publicUrl as string
    }
    // Use url if available
    if (person.profilePhoto?.url) {
      return person.profilePhoto.url
    }
    // Try to construct URL from filename (for GCS)
    if (person.profilePhoto?.filename) {
      // If it's already a full URL, return it
      if (person.profilePhoto.filename.startsWith('http')) {
        return person.profilePhoto.filename
      }
      // Otherwise try the API endpoint
      return `/api/media/file/${person.profilePhoto.filename}`
    }
    // Use a placeholder service as fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(person.fullName)}&background=random&size=200`
  }

  // Check if date ranges overlap
  const dateRangesOverlap = (
    range1Start: Date,
    range1End: Date,
    range2Start: Date,
    range2End: Date,
  ): boolean => {
    // Check if ranges overlap: range1Start <= range2End && range2Start <= range1End
    return range1Start <= range2End && range2Start <= range1End
  }

  // Check if person should be hidden (has "pending" or "done" status request with overlapping dates)
  const isPersonHidden = (personId: string): boolean => {
    // If date range filter is provided, check against that range
    if (filterStartDate && filterEndDate) {
      const filterStart = new Date(filterStartDate)
      filterStart.setHours(0, 0, 0, 0)
      const filterEnd = new Date(filterEndDate)
      filterEnd.setHours(0, 0, 0, 0)

      // Check if there's a "pending" or "done" status request for this person that overlaps with the selected date range
      const hasOverlappingRequest = tourRequests.some((request) => {
        // Only check pending or done status
        if (
          request.driverOrGuideId !== personId ||
          (request.status !== 'pending' && request.status !== 'done')
        ) {
          return false
        }

        if (!request.startDate || !request.endDate) {
          return false
        }

        const requestStart = new Date(request.startDate)
        requestStart.setHours(0, 0, 0, 0)
        const requestEnd = new Date(request.endDate)
        requestEnd.setHours(0, 0, 0, 0)

        // Check if the selected date range overlaps with the request date range
        return dateRangesOverlap(filterStart, filterEnd, requestStart, requestEnd)
      })

      return hasOverlappingRequest
    }

    // If no date filter, check against current date (only "done" status for current date filtering)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if there's a "done" status request for this person with active dates
    const hasActiveDoneRequest = tourRequests.some((request) => {
      if (request.driverOrGuideId !== personId || request.status !== 'done') {
        return false
      }

      if (!request.startDate || !request.endDate) {
        return false
      }

      const start = new Date(request.startDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(request.endDate)
      end.setHours(0, 0, 0, 0)

      // Check if current date is between request start and end dates
      return today >= start && today <= end
    })

    return hasActiveDoneRequest
  }

  // Filter data based on search, type, and active requests
  const filteredDrivers = drivers.filter((driver) => {
    // Hide if has active "done" status request
    if (isPersonHidden(driver.id)) {
      return false
    }

    const matchesSearch =
      driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.contactNumber.includes(searchQuery)
    const matchesType = selectedType === 'all' || selectedType === 'driver'
    return matchesSearch && matchesType
  })

  const filteredGuides = guides.filter((guide) => {
    // Hide if has active "done" status request
    if (isPersonHidden(guide.id)) {
      return false
    }

    const matchesSearch =
      guide.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.contactNumber.includes(searchQuery)
    const matchesType = selectedType === 'all' || selectedType === 'guide'
    return matchesSearch && matchesType
  })

  // Handle request modal open
  const openRequestModal = (person: Driver | Guide, type: 'driver' | 'guide') => {
    setSelectedPerson({
      id: person.id,
      name: person.fullName,
      email: person.emailAddress,
      contact: person.contactNumber,
      type,
    })
    setRequestFormData({
      touristName: '',
      touristEmail: '',
      touristContact: '',
      startDate: '',
      endDate: '',
    })
    setRequestMessage(null)
    setShowRequestModal(true)
  }

  // Handle request form submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPerson) return

    setSubmittingRequest(true)
    setRequestMessage(null)

    try {
      const response = await fetch('/api/tour-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedPerson.type,
          driverOrGuideId: selectedPerson.id,
          driverOrGuideName: selectedPerson.name,
          driverOrGuideEmail: selectedPerson.email || '',
          driverOrGuideContact: selectedPerson.contact,
          touristName: requestFormData.touristName,
          touristEmail: requestFormData.touristEmail,
          touristContact: requestFormData.touristContact,
          startDate: requestFormData.startDate,
          endDate: requestFormData.endDate,
          status: 'pending',
        }),
      })

      if (response.ok) {
        setRequestMessage({
          type: 'success',
          text: 'Tour request submitted successfully! We will contact you soon.',
        })

        // Refresh data after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setRequestMessage({
          type: 'error',
          text: errorData.message || 'Failed to submit request. Please try again.',
        })
      }
    } catch (_error) {
      setRequestMessage({
        type: 'error',
        text: 'Failed to submit request. Please try again.',
      })
    } finally {
      setSubmittingRequest(false)
    }
  }

  // Handle registration modal open
  const openRegistrationModal = (type: 'driver' | 'guide') => {
    setRegistrationType(type)
    setShowRegistrationModal(true)
    setRegisterMessage(null)
    // Reset form
    setRegistrationFormData({
      fullName: '',
      nicPassportNumber: '',
      dateOfBirth: '',
      contactNumber: '',
      whatsappNumber: '',
      emailAddress: '',
      residentialAddress: '',
      district: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      profilePhoto: null,
      nicPhotoFront: null,
      nicPhotoBack: null,
      drivingLicenceFront: null,
      drivingLicenceBack: null,
      yearsOfExperience: '',
      languagesSpoken: '',
      areasFamiliar: [],
      vehicleType: '',
      vehicleRegistrationBook: null,
      revenueLicence: null,
      insuranceCard: null,
      vehiclePhotoFront: null,
      vehiclePhotoBack: null,
      vehiclePhotoSide: null,
      vehiclePhotoInterior: null,
      bankName: '',
      bankBranch: '',
      accountHolderName: '',
      accountNumber: '',
    })
    setImagePreviews({
      profilePhoto: null,
      nicPhotoFront: null,
      nicPhotoBack: null,
      drivingLicenceFront: null,
      drivingLicenceBack: null,
      vehicleRegistrationBook: null,
      revenueLicence: null,
      insuranceCard: null,
      vehiclePhotoFront: null,
      vehiclePhotoBack: null,
      vehiclePhotoSide: null,
      vehiclePhotoInterior: null,
    })
  }

  // Handle file input changes with preview
  const handleFileChange = (
    field:
      | 'profilePhoto'
      | 'nicPhotoFront'
      | 'nicPhotoBack'
      | 'drivingLicenceFront'
      | 'drivingLicenceBack'
      | 'vehicleRegistrationBook'
      | 'revenueLicence'
      | 'insuranceCard'
      | 'vehiclePhotoFront'
      | 'vehiclePhotoBack'
      | 'vehiclePhotoSide'
      | 'vehiclePhotoInterior',
    file: File | null,
  ) => {
    setRegistrationFormData({ ...registrationFormData, [field]: file })

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews({ ...imagePreviews, [field]: reader.result as string })
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreviews({ ...imagePreviews, [field]: null })
    }
  }

  // Upload file to media collection
  const uploadFileToMedia = async (file: File, altText: string): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', altText)

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.doc?.id || data.id || null
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('File upload failed:', errorData)
        return null
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    }
  }

  // Handle registration form submission
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)
    setRegisterMessage(null)

    try {
      // Upload files first (continue even if some uploads fail)
      let profilePhotoId: string | null = null
      let nicPhotoFrontId: string | null = null
      let nicPhotoBackId: string | null = null
      // Driver-specific file IDs
      let drivingLicenceFrontId: string | null = null
      let drivingLicenceBackId: string | null = null
      let vehicleRegistrationBookId: string | null = null
      let revenueLicenceId: string | null = null
      let insuranceCardId: string | null = null
      let vehiclePhotoFrontId: string | null = null
      let vehiclePhotoBackId: string | null = null
      let vehiclePhotoSideId: string | null = null
      let vehiclePhotoInteriorId: string | null = null
      const uploadErrors: string[] = []

      if (registrationFormData.profilePhoto) {
        profilePhotoId = await uploadFileToMedia(
          registrationFormData.profilePhoto,
          `Profile photo - ${registrationFormData.fullName}`,
        )
        if (!profilePhotoId) {
          uploadErrors.push(
            t('registration.profilePhotoUploadFailed') || 'Profile photo upload failed',
          )
        }
      }

      if (registrationType === 'guide') {
        if (registrationFormData.nicPhotoFront) {
          nicPhotoFrontId = await uploadFileToMedia(
            registrationFormData.nicPhotoFront,
            `NIC Front - ${registrationFormData.fullName}`,
          )
          if (!nicPhotoFrontId) {
            uploadErrors.push(
              t('registration.nicFrontUploadFailed') || 'NIC front photo upload failed',
            )
          }
        }
        if (registrationFormData.nicPhotoBack) {
          nicPhotoBackId = await uploadFileToMedia(
            registrationFormData.nicPhotoBack,
            `NIC Back - ${registrationFormData.fullName}`,
          )
          if (!nicPhotoBackId) {
            uploadErrors.push(
              t('registration.nicBackUploadFailed') || 'NIC back photo upload failed',
            )
          }
        }
      }

      // Driver-specific file uploads
      if (registrationType === 'driver') {
        if (registrationFormData.drivingLicenceFront) {
          drivingLicenceFrontId = await uploadFileToMedia(
            registrationFormData.drivingLicenceFront,
            `Driving Licence Front - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.drivingLicenceBack) {
          drivingLicenceBackId = await uploadFileToMedia(
            registrationFormData.drivingLicenceBack,
            `Driving Licence Back - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.vehicleRegistrationBook) {
          vehicleRegistrationBookId = await uploadFileToMedia(
            registrationFormData.vehicleRegistrationBook,
            `Vehicle Registration Book - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.revenueLicence) {
          revenueLicenceId = await uploadFileToMedia(
            registrationFormData.revenueLicence,
            `Revenue Licence - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.insuranceCard) {
          insuranceCardId = await uploadFileToMedia(
            registrationFormData.insuranceCard,
            `Insurance Card - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.vehiclePhotoFront) {
          vehiclePhotoFrontId = await uploadFileToMedia(
            registrationFormData.vehiclePhotoFront,
            `Vehicle Photo Front - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.vehiclePhotoBack) {
          vehiclePhotoBackId = await uploadFileToMedia(
            registrationFormData.vehiclePhotoBack,
            `Vehicle Photo Back - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.vehiclePhotoSide) {
          vehiclePhotoSideId = await uploadFileToMedia(
            registrationFormData.vehiclePhotoSide,
            `Vehicle Photo Side - ${registrationFormData.fullName}`,
          )
        }
        if (registrationFormData.vehiclePhotoInterior) {
          vehiclePhotoInteriorId = await uploadFileToMedia(
            registrationFormData.vehiclePhotoInterior,
            `Vehicle Photo Interior - ${registrationFormData.fullName}`,
          )
        }
      }

      // Prepare the data object
      const dataToSubmit: Record<string, unknown> = {
        fullName: registrationFormData.fullName,
        nicPassportNumber: registrationFormData.nicPassportNumber,
        dateOfBirth: registrationFormData.dateOfBirth,
        contactNumber: registrationFormData.contactNumber,
        residentialAddress: registrationFormData.residentialAddress,
        district: registrationFormData.district,
        emergencyContactName: registrationFormData.emergencyContactName,
        emergencyContactNumber: registrationFormData.emergencyContactNumber,
      }

      // Add optional fields
      if (registrationFormData.whatsappNumber) {
        dataToSubmit.whatsappNumber = registrationFormData.whatsappNumber
      }
      if (registrationFormData.emailAddress) {
        dataToSubmit.emailAddress = registrationFormData.emailAddress
      }

      // Add file IDs if uploaded
      if (profilePhotoId) {
        dataToSubmit.profilePhoto = profilePhotoId
      }
      if (nicPhotoFrontId) {
        dataToSubmit.nicPhotoFront = nicPhotoFrontId
      }
      if (nicPhotoBackId) {
        dataToSubmit.nicPhotoBack = nicPhotoBackId
      }

      // Add driver-specific fields
      if (registrationType === 'driver') {
        if (registrationFormData.yearsOfExperience) {
          dataToSubmit.yearsOfExperience = parseInt(registrationFormData.yearsOfExperience)
        }
        if (registrationFormData.languagesSpoken) {
          dataToSubmit.languagesSpoken = registrationFormData.languagesSpoken
        }
        if (registrationFormData.areasFamiliar.length > 0) {
          dataToSubmit.areasFamiliar = registrationFormData.areasFamiliar
        }
        if (registrationFormData.vehicleType) {
          dataToSubmit.vehicleType = registrationFormData.vehicleType
        }
        if (registrationFormData.bankName) {
          dataToSubmit.bankName = registrationFormData.bankName
        }
        if (registrationFormData.bankBranch) {
          dataToSubmit.bankBranch = registrationFormData.bankBranch
        }
        if (registrationFormData.accountHolderName) {
          dataToSubmit.accountHolderName = registrationFormData.accountHolderName
        }
        if (registrationFormData.accountNumber) {
          dataToSubmit.accountNumber = registrationFormData.accountNumber
        }
        // Add driver-specific file IDs
        if (drivingLicenceFrontId) {
          dataToSubmit.drivingLicenceFront = drivingLicenceFrontId
        }
        if (drivingLicenceBackId) {
          dataToSubmit.drivingLicenceBack = drivingLicenceBackId
        }
        if (vehicleRegistrationBookId) {
          dataToSubmit.vehicleRegistrationBook = vehicleRegistrationBookId
        }
        if (revenueLicenceId) {
          dataToSubmit.revenueLicence = revenueLicenceId
        }
        if (insuranceCardId) {
          dataToSubmit.insuranceCard = insuranceCardId
        }
        if (vehiclePhotoFrontId) {
          dataToSubmit.vehiclePhotoFront = vehiclePhotoFrontId
        }
        if (vehiclePhotoBackId) {
          dataToSubmit.vehiclePhotoBack = vehiclePhotoBackId
        }
        if (vehiclePhotoSideId) {
          dataToSubmit.vehiclePhotoSide = vehiclePhotoSideId
        }
        if (vehiclePhotoInteriorId) {
          dataToSubmit.vehiclePhotoInterior = vehiclePhotoInteriorId
        }
      }

      const endpoint = registrationType === 'driver' ? '/api/drivers' : '/api/guides'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (response.ok) {
        let successMessage =
          t('registration.registrationSuccess') ||
          'Registration submitted successfully! We will review your application.'

        if (uploadErrors.length > 0) {
          successMessage += ` ${t('registration.someUploadsFailed') || 'Note: Some file uploads failed, but registration was successful.'}`
        }

        setRegisterMessage({
          type: 'success',
          text: successMessage,
        })

        // Refresh the list
        const fetchData = async () => {
          if (registrationType === 'driver') {
            const driversResponse = await fetch(
              '/api/drivers?limit=100&depth=2&sort=-createdAt&where[approved][equals]=true',
            )
            if (driversResponse.ok) {
              const driversData = await driversResponse.json()
              setDrivers(driversData.docs || [])
            }
          } else {
            const guidesResponse = await fetch(
              '/api/guides?limit=100&depth=2&sort=-createdAt&where[approved][equals]=true',
            )
            if (guidesResponse.ok) {
              const guidesData = await guidesResponse.json()
              setGuides(guidesData.docs || [])
            }
          }
        }
        fetchData()

        // Close modal after 3 seconds
        setTimeout(() => {
          setShowRegistrationModal(false)
          setRegisterMessage(null)
        }, 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setRegisterMessage({
          type: 'error',
          text:
            errorData.message ||
            t('registration.registrationError') ||
            'Failed to submit registration. Please try again.',
        })
      }
    } catch (_error) {
      setRegisterMessage({
        type: 'error',
        text:
          t('registration.registrationError') || 'Failed to submit registration. Please try again.',
      })
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="registration-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="registration-page">
      {/* Hero Section */}
      <section className="registration-hero">
        <div className="container">
          <h1>{t('registration.title') || 'Find Drivers & Tour Guides'}</h1>
          <p className="registration-hero-subtitle">
            {t('registration.subtitle') ||
              'Search and connect with professional drivers and tour guides'}
          </p>
          <div className="registration-buttons">
            <button
              onClick={() => openRegistrationModal('driver')}
              className="register-btn register-driver-btn"
            >
              {t('registration.registerAsDriver') || 'Register as Driver'}
            </button>
            <button
              onClick={() => openRegistrationModal('guide')}
              className="register-btn register-guide-btn"
            >
              {t('registration.registerAsGuide') || 'Register as Guide'}
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="registration-search">
        <div className="container">
          <div className="search-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder={
                  t('registration.searchPlaceholder') || 'Search by name, district, or contact...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="type-filter">
              <label>{t('registration.selectType') || 'Select Type:'}</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PersonType)}
                className="type-select"
              >
                <option value="all">{t('registration.all') || 'All'}</option>
                <option value="driver">{t('registration.tourDriver') || 'Tour Driver'}</option>
                <option value="guide">{t('registration.tourGuide') || 'Tour Guide'}</option>
              </select>
            </div>
          </div>
          <div className="date-filters">
            <div className="date-filter-group">
              <label htmlFor="filterStartDate">
                {t('registration.filterStartDate') || 'Tour Start Date:'}
              </label>
              <input
                type="date"
                id="filterStartDate"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="date-filter-group">
              <label htmlFor="filterEndDate">
                {t('registration.filterEndDate') || 'Tour End Date:'}
              </label>
              <input
                type="date"
                id="filterEndDate"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="date-input"
                min={filterStartDate || undefined}
              />
            </div>
            {(filterStartDate || filterEndDate) && (
              <button
                onClick={() => {
                  setFilterStartDate('')
                  setFilterEndDate('')
                }}
                className="clear-date-btn"
              >
                {t('registration.clearDates') || 'Clear Dates'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="registration-results">
        <div className="container">
          {/* Drivers Section */}
          {filteredDrivers.length > 0 && (selectedType === 'all' || selectedType === 'driver') && (
            <div className="results-section">
              <h2>{t('registration.drivers') || 'Tour Drivers'}</h2>
              <div className="people-grid">
                {filteredDrivers.map((driver) => (
                  <div key={driver.id} className="person-card">
                    <div className="person-photo">
                      <Image
                        src={getImageUrl(driver)}
                        alt={driver.fullName}
                        width={200}
                        height={200}
                        className="person-img"
                      />
                    </div>
                    <div className="person-info">
                      <h3>{driver.fullName}</h3>
                      <p className="person-district">{driver.district}</p>
                      <div className="person-contact">
                        <p>
                          <strong>{t('registration.contact') || 'Contact'}:</strong>{' '}
                          {driver.contactNumber}
                        </p>
                        {driver.whatsappNumber &&
                          driver.whatsappNumber !== driver.contactNumber && (
                            <p>
                              <strong>{t('registration.whatsapp') || 'WhatsApp'}:</strong>{' '}
                              {driver.whatsappNumber}
                            </p>
                          )}
                        {driver.emailAddress && (
                          <p>
                            <strong>{t('registration.email') || 'Email'}:</strong>{' '}
                            {driver.emailAddress}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => openRequestModal(driver, 'driver')}
                        className="request-btn"
                      >
                        {t('registration.request') || 'Request'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guides Section */}
          {filteredGuides.length > 0 && (selectedType === 'all' || selectedType === 'guide') && (
            <div className="results-section">
              <h2>{t('registration.guides') || 'Tour Guides'}</h2>
              <div className="people-grid">
                {filteredGuides.map((guide) => (
                  <div key={guide.id} className="person-card">
                    <div className="person-photo">
                      <Image
                        src={getImageUrl(guide)}
                        alt={guide.fullName}
                        width={200}
                        height={200}
                        className="person-img"
                      />
                    </div>
                    <div className="person-info">
                      <h3>{guide.fullName}</h3>
                      <p className="person-district">{guide.district}</p>
                      <div className="person-contact">
                        <p>
                          <strong>{t('registration.contact') || 'Contact'}:</strong>{' '}
                          {guide.contactNumber}
                        </p>
                        {guide.whatsappNumber && guide.whatsappNumber !== guide.contactNumber && (
                          <p>
                            <strong>{t('registration.whatsapp') || 'WhatsApp'}:</strong>{' '}
                            {guide.whatsappNumber}
                          </p>
                        )}
                        {guide.emailAddress && (
                          <p>
                            <strong>{t('registration.email') || 'Email'}:</strong>{' '}
                            {guide.emailAddress}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => openRequestModal(guide, 'guide')}
                        className="request-btn"
                      >
                        {t('registration.request') || 'Request'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredDrivers.length === 0 && filteredGuides.length === 0 && (
            <div className="no-results">
              <p>
                {t('registration.noResults') || 'No drivers or guides found matching your search.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {registrationType === 'driver'
                  ? t('registration.registerAsDriver') || 'Register as Driver'
                  : t('registration.registerAsGuide') || 'Register as Guide'}
              </h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowRegistrationModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRegistrationSubmit} className="registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">
                    {t('registration.fullName') || 'Full Name (As per NIC)'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={registrationFormData.fullName}
                    onChange={(e) =>
                      setRegistrationFormData({ ...registrationFormData, fullName: e.target.value })
                    }
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nicPassportNumber">
                    {t('registration.nicPassportNumber') || 'NIC/Passport Number'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nicPassportNumber"
                    value={registrationFormData.nicPassportNumber}
                    onChange={(e) =>
                      setRegistrationFormData({
                        ...registrationFormData,
                        nicPassportNumber: e.target.value,
                      })
                    }
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">
                    {t('registration.dateOfBirth') || 'Date of Birth'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={registrationFormData.dateOfBirth}
                    onChange={(e) =>
                      setRegistrationFormData({
                        ...registrationFormData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactNumber">
                    {t('registration.contactNumber') || 'Contact Number'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    value={registrationFormData.contactNumber}
                    onChange={(e) =>
                      setRegistrationFormData({
                        ...registrationFormData,
                        contactNumber: e.target.value,
                      })
                    }
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="whatsappNumber">
                    {t('registration.whatsappNumber') || 'WhatsApp Number'}
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    value={registrationFormData.whatsappNumber}
                    onChange={(e) =>
                      setRegistrationFormData({
                        ...registrationFormData,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emailAddress">
                    {t('registration.emailAddress') || 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    value={registrationFormData.emailAddress}
                    onChange={(e) =>
                      setRegistrationFormData({
                        ...registrationFormData,
                        emailAddress: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="residentialAddress">
                  {t('registration.residentialAddress') || 'Residential Address'}{' '}
                  <span className="required">*</span>
                </label>
                <textarea
                  id="residentialAddress"
                  value={registrationFormData.residentialAddress}
                  onChange={(e) =>
                    setRegistrationFormData({
                      ...registrationFormData,
                      residentialAddress: e.target.value,
                    })
                  }
                  required
                  rows={3}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="district">
                  {t('registration.district') || 'District/Province'}{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="district"
                  value={registrationFormData.district}
                  onChange={(e) =>
                    setRegistrationFormData({ ...registrationFormData, district: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergencyContactName">
                    {t('registration.emergencyContactName') || 'Emergency Contact Name'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    value={registrationFormData.emergencyContactName}
                    onChange={(e) =>
                      setRegistrationFormData({
                        ...registrationFormData,
                        emergencyContactName: e.target.value,
                      })
                    }
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyContactNumber">
                    {t('registration.emergencyContactNumber') || 'Emergency Contact Number'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactNumber"
                    value={registrationFormData.emergencyContactNumber}
                    onChange={(e) =>
                      setRegistrationFormData({
                        ...registrationFormData,
                        emergencyContactNumber: e.target.value,
                      })
                    }
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="form-group">
                <label htmlFor="profilePhoto">
                  {t('registration.profilePhoto') || 'Profile Photo'}
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="profilePhoto"
                    accept="image/*"
                    onChange={(e) => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
                    className="file-input"
                  />
                  <label htmlFor="profilePhoto" className="file-upload-label">
                    {t('registration.chooseFile') || 'Choose File'}
                  </label>
                  {registrationFormData.profilePhoto && (
                    <span className="file-name">{registrationFormData.profilePhoto.name}</span>
                  )}
                </div>
                {imagePreviews.profilePhoto && (
                  <div className="image-preview">
                    <Image
                      src={imagePreviews.profilePhoto}
                      alt="Profile preview"
                      width={200}
                      height={200}
                      className="preview-image"
                    />
                  </div>
                )}
              </div>

              {/* NIC Photos (Guides only) */}
              {registrationType === 'guide' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nicPhotoFront">
                        {t('registration.nicPhotoFront') || 'NIC Photo (Front)'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="nicPhotoFront"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('nicPhotoFront', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="nicPhotoFront" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.nicPhotoFront && (
                          <span className="file-name">
                            {registrationFormData.nicPhotoFront.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.nicPhotoFront && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.nicPhotoFront}
                            alt="NIC Front preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="nicPhotoBack">
                        {t('registration.nicPhotoBack') || 'NIC Photo (Back)'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="nicPhotoBack"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('nicPhotoBack', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="nicPhotoBack" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.nicPhotoBack && (
                          <span className="file-name">
                            {registrationFormData.nicPhotoBack.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.nicPhotoBack && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.nicPhotoBack}
                            alt="NIC Back preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Driver-specific fields */}
              {registrationType === 'driver' && (
                <>
                  {/* Driving Licence Details */}
                  <div className="form-section-header">
                    <h3>{t('registration.drivingLicenceDetails') || 'Driving Licence Details'}</h3>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="drivingLicenceFront">
                        {t('registration.drivingLicenceFront') || 'Driving Licence (Front)'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="drivingLicenceFront"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('drivingLicenceFront', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="drivingLicenceFront" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.drivingLicenceFront && (
                          <span className="file-name">
                            {registrationFormData.drivingLicenceFront.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.drivingLicenceFront && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.drivingLicenceFront}
                            alt="Driving Licence Front preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="drivingLicenceBack">
                        {t('registration.drivingLicenceBack') || 'Driving Licence (Back)'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="drivingLicenceBack"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('drivingLicenceBack', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="drivingLicenceBack" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.drivingLicenceBack && (
                          <span className="file-name">
                            {registrationFormData.drivingLicenceBack.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.drivingLicenceBack && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.drivingLicenceBack}
                            alt="Driving Licence Back preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tour Driving Experience */}
                  <div className="form-section-header">
                    <h3>{t('registration.tourDrivingExperience') || 'Tour Driving Experience'}</h3>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="yearsOfExperience">
                        {t('registration.yearsOfExperience') || 'Years of Tour Driving Experience'}
                      </label>
                      <input
                        type="number"
                        id="yearsOfExperience"
                        min="0"
                        max="50"
                        value={registrationFormData.yearsOfExperience}
                        onChange={(e) =>
                          setRegistrationFormData({
                            ...registrationFormData,
                            yearsOfExperience: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="languagesSpoken">
                        {t('registration.languagesSpoken') || 'Languages Spoken'}
                      </label>
                      <input
                        type="text"
                        id="languagesSpoken"
                        placeholder="e.g., English, Sinhala, Tamil"
                        value={registrationFormData.languagesSpoken}
                        onChange={(e) =>
                          setRegistrationFormData({
                            ...registrationFormData,
                            languagesSpoken: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('registration.areasFamiliar') || 'Areas Familiar With'}</label>
                    <div className="checkbox-group">
                      {[
                        { value: 'western_province', label: 'Western Province' },
                        { value: 'hill_country', label: 'Hill Country' },
                        { value: 'cultural_triangle', label: 'Cultural Triangle' },
                        { value: 'south_coast', label: 'South Coast' },
                        { value: 'east_coast', label: 'East Coast' },
                        { value: 'entire_country', label: 'Entire Country' },
                      ].map((area) => (
                        <label key={area.value} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={registrationFormData.areasFamiliar.includes(area.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRegistrationFormData({
                                  ...registrationFormData,
                                  areasFamiliar: [...registrationFormData.areasFamiliar, area.value],
                                })
                              } else {
                                setRegistrationFormData({
                                  ...registrationFormData,
                                  areasFamiliar: registrationFormData.areasFamiliar.filter(
                                    (a) => a !== area.value,
                                  ),
                                })
                              }
                            }}
                          />
                          {t(`registration.areas.${area.value}`) || area.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="form-section-header">
                    <h3>{t('registration.vehicleDetails') || 'Vehicle Details'}</h3>
                  </div>
                  <div className="form-group">
                    <label htmlFor="vehicleType">
                      {t('registration.vehicleType') || 'Vehicle Type'}
                    </label>
                    <select
                      id="vehicleType"
                      value={registrationFormData.vehicleType}
                      onChange={(e) =>
                        setRegistrationFormData({
                          ...registrationFormData,
                          vehicleType: e.target.value,
                        })
                      }
                      className="form-input"
                    >
                      <option value="">{t('registration.selectVehicleType') || '-- Select Vehicle Type --'}</option>
                      <option value="car">{t('registration.car') || 'Car'}</option>
                      <option value="van">{t('registration.van') || 'Van'}</option>
                      <option value="bus">{t('registration.bus') || 'Bus'}</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="vehicleRegistrationBook">
                        {t('registration.vehicleRegistrationBook') || 'Vehicle Registration Book (Copy)'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="vehicleRegistrationBook"
                          accept="image/*,.pdf"
                          onChange={(e) =>
                            handleFileChange('vehicleRegistrationBook', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="vehicleRegistrationBook" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.vehicleRegistrationBook && (
                          <span className="file-name">
                            {registrationFormData.vehicleRegistrationBook.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="revenueLicence">
                        {t('registration.revenueLicence') || 'Revenue Licence (Copy)'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="revenueLicence"
                          accept="image/*,.pdf"
                          onChange={(e) =>
                            handleFileChange('revenueLicence', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="revenueLicence" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.revenueLicence && (
                          <span className="file-name">
                            {registrationFormData.revenueLicence.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="insuranceCard">
                      {t('registration.insuranceCard') || 'Insurance Card (Copy)'}
                    </label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="insuranceCard"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange('insuranceCard', e.target.files?.[0] || null)
                        }
                        className="file-input"
                      />
                      <label htmlFor="insuranceCard" className="file-upload-label">
                        {t('registration.chooseFile') || 'Choose File'}
                      </label>
                      {registrationFormData.insuranceCard && (
                        <span className="file-name">
                          {registrationFormData.insuranceCard.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Photos */}
                  <div className="form-section-subheader">
                    <h4>{t('registration.vehiclePhotos') || 'Vehicle Photos'}</h4>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="vehiclePhotoFront">
                        {t('registration.vehiclePhotoFront') || 'Front View'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="vehiclePhotoFront"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('vehiclePhotoFront', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="vehiclePhotoFront" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.vehiclePhotoFront && (
                          <span className="file-name">
                            {registrationFormData.vehiclePhotoFront.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.vehiclePhotoFront && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.vehiclePhotoFront}
                            alt="Vehicle Front preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="vehiclePhotoBack">
                        {t('registration.vehiclePhotoBack') || 'Back View'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="vehiclePhotoBack"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('vehiclePhotoBack', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="vehiclePhotoBack" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.vehiclePhotoBack && (
                          <span className="file-name">
                            {registrationFormData.vehiclePhotoBack.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.vehiclePhotoBack && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.vehiclePhotoBack}
                            alt="Vehicle Back preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="vehiclePhotoSide">
                        {t('registration.vehiclePhotoSide') || 'Side View'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="vehiclePhotoSide"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('vehiclePhotoSide', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="vehiclePhotoSide" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.vehiclePhotoSide && (
                          <span className="file-name">
                            {registrationFormData.vehiclePhotoSide.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.vehiclePhotoSide && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.vehiclePhotoSide}
                            alt="Vehicle Side preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="vehiclePhotoInterior">
                        {t('registration.vehiclePhotoInterior') || 'Interior View'}
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="vehiclePhotoInterior"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange('vehiclePhotoInterior', e.target.files?.[0] || null)
                          }
                          className="file-input"
                        />
                        <label htmlFor="vehiclePhotoInterior" className="file-upload-label">
                          {t('registration.chooseFile') || 'Choose File'}
                        </label>
                        {registrationFormData.vehiclePhotoInterior && (
                          <span className="file-name">
                            {registrationFormData.vehiclePhotoInterior.name}
                          </span>
                        )}
                      </div>
                      {imagePreviews.vehiclePhotoInterior && (
                        <div className="image-preview">
                          <Image
                            src={imagePreviews.vehiclePhotoInterior}
                            alt="Vehicle Interior preview"
                            width={200}
                            height={200}
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bank & Payment Information */}
                  <div className="form-section-header">
                    <h3>{t('registration.bankPaymentInfo') || 'Bank & Payment Information'}</h3>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bankName">
                        {t('registration.bankName') || 'Bank Name'}
                      </label>
                      <input
                        type="text"
                        id="bankName"
                        value={registrationFormData.bankName}
                        onChange={(e) =>
                          setRegistrationFormData({
                            ...registrationFormData,
                            bankName: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bankBranch">
                        {t('registration.bankBranch') || 'Branch'}
                      </label>
                      <input
                        type="text"
                        id="bankBranch"
                        value={registrationFormData.bankBranch}
                        onChange={(e) =>
                          setRegistrationFormData({
                            ...registrationFormData,
                            bankBranch: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="accountHolderName">
                        {t('registration.accountHolderName') || 'Account Holder Name'}
                      </label>
                      <input
                        type="text"
                        id="accountHolderName"
                        value={registrationFormData.accountHolderName}
                        onChange={(e) =>
                          setRegistrationFormData({
                            ...registrationFormData,
                            accountHolderName: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="accountNumber">
                        {t('registration.accountNumber') || 'Account Number'}
                      </label>
                      <input
                        type="text"
                        id="accountNumber"
                        value={registrationFormData.accountNumber}
                        onChange={(e) =>
                          setRegistrationFormData({
                            ...registrationFormData,
                            accountNumber: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {registerMessage && (
                <div
                  className={`submit-message ${registerMessage.type === 'success' ? 'success' : 'error'}`}
                >
                  {registerMessage.text}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="cancel-btn"
                >
                  {t('registration.cancel') || 'Cancel'}
                </button>
                <button type="submit" disabled={registering} className="submit-btn">
                  {registering
                    ? t('registration.registering') || 'Registering...'
                    : t('registration.register') || 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedPerson && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('registration.requestTour') || 'Request Tour'}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowRequestModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRequestSubmit} className="registration-form">
              {/* Driver/Guide Information (Read-only) */}
              <div className="form-section">
                <h3 className="section-title">
                  {selectedPerson.type === 'driver' ? 'Driver' : 'Guide'} Information
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={selectedPerson.name}
                      readOnly
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact</label>
                    <input
                      type="text"
                      value={selectedPerson.contact}
                      readOnly
                      className="form-input"
                    />
                  </div>
                </div>
                {selectedPerson.email && (
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={selectedPerson.email}
                      readOnly
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              {/* Tourist Information */}
              <div className="form-section">
                <h3 className="section-title">Tourist Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="touristName">
                      {t('registration.touristName') || 'Tourist Name'}{' '}
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="touristName"
                      value={requestFormData.touristName}
                      onChange={(e) =>
                        setRequestFormData({ ...requestFormData, touristName: e.target.value })
                      }
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="touristEmail">
                      {t('registration.touristEmail') || 'Tourist Email'}{' '}
                      <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="touristEmail"
                      value={requestFormData.touristEmail}
                      onChange={(e) =>
                        setRequestFormData({ ...requestFormData, touristEmail: e.target.value })
                      }
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="touristContact">
                    {t('registration.touristContact') || 'Tourist Contact'}{' '}
                    <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="touristContact"
                    value={requestFormData.touristContact}
                    onChange={(e) =>
                      setRequestFormData({ ...requestFormData, touristContact: e.target.value })
                    }
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Tour Dates */}
              <div className="form-section">
                <h3 className="section-title">Tour Dates</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">
                      {t('registration.startDate') || 'Start Date'}{' '}
                      <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={requestFormData.startDate}
                      onChange={(e) =>
                        setRequestFormData({ ...requestFormData, startDate: e.target.value })
                      }
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">
                      {t('registration.endDate') || 'End Date'} <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={requestFormData.endDate}
                      onChange={(e) =>
                        setRequestFormData({ ...requestFormData, endDate: e.target.value })
                      }
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {requestMessage && (
                <div
                  className={`submit-message ${requestMessage.type === 'success' ? 'success' : 'error'}`}
                >
                  {requestMessage.text}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="cancel-btn"
                >
                  {t('registration.cancel') || 'Cancel'}
                </button>
                <button type="submit" disabled={submittingRequest} className="submit-btn">
                  {submittingRequest
                    ? t('registration.submitting') || 'Submitting...'
                    : t('registration.submitRequest') || 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
