'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './styles.css'

interface Point {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: 'start' | 'waypoint' | 'end'
  durationToNext?: string // Duration to next point (e.g., "2 hours 30 mins")
  distanceToNext?: string // Distance to next point (e.g., "150 km")
  visitingPlaceId?: string // ID of visiting place if selected from database
  stayDuration?: number // Stay duration in minutes (from visiting place or default)
  stayCost?: number // Stay cost in LKR (from visiting place or default)
  distanceInKm?: number // Distance in km to this point (from previous point)
  totalCost?: number // Total cost for this point (stayCost + vehicle lkrPerKilometer * distance)
}

declare global {
  interface Window {
    google: {
      maps: typeof google.maps
    }
    initMap: () => void
  }
}

export default function PlanYourTripPage() {
  const { t, language } = useLanguage()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const directionsServiceRef = useRef<any>(null)
  const directionsRendererRef = useRef<any>(null)
  const [autocompleteInput, setAutocompleteInput] = useState<HTMLInputElement | null>(null)
  const autocompleteInstanceRef = useRef<any>(null)
  const idCounterRef = useRef<number>(0)
  const isSelectingEndpointRef = useRef<boolean>(false)
  
  // Generate unique ID using a counter (prevents hydration mismatch from Date.now())
  // IDs are only generated on user interaction (client-side), so no SSR issues
  const generateId = () => {
    idCounterRef.current += 1
    return `point-${idCounterRef.current}`
  }

  const [points, setPoints] = useState<Point[]>([])
  const [currentStep, setCurrentStep] = useState<'start' | 'waypoints' | 'end' | 'complete'>(
    'start',
  )
  const [searchValue, setSearchValue] = useState('')
  const [isSearchIdle, setIsSearchIdle] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [totalDuration, setTotalDuration] = useState<string>('')
  const [totalDistance, setTotalDistance] = useState<string>('')
  const [visitingPlaces, setVisitingPlaces] = useState<
    Array<{
      id: string
      name: string
      latitude: number
      longitude: number
      stayDuration?: number
      stayCost?: number
    }>
  >([])
  const [nearbyPlaces, setNearbyPlaces] = useState<
    Array<{
      id: string
      name: string
      latitude: number
      longitude: number
      distance: number
      stayDuration?: number
      stayCost?: number
    }>
  >([])
  const [tripConfig, setTripConfig] = useState<{
    lkrPerKilometer?: number
    stayTimeInMinutes?: number
    defaultStayCost?: number
    travelingHoursPerDay?: number
  } | null>(null)
  const [vehicles, setVehicles] = useState<
    Array<{
      id: string
      vehicleType: string
      passengerCount: number
      lkrPerKilometer: number
    }>
  >([])
  const [selectedVehicle, setSelectedVehicle] = useState<{
    id: string
    vehicleType: string
    passengerCount: number
    lkrPerKilometer: number
  } | null>(null)
  const [expectedStartDate, setExpectedStartDate] = useState<string>('')
  const [startingTime, setStartingTime] = useState<string>('')
  const [guestCount, setGuestCount] = useState<string>('1')
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(0)
  const [typedLocation, setTypedLocation] = useState<{
    lat: number
    lng: number
    address: string
    name: string
  } | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const geocoderRef = useRef<any>(null)
  const [referenceLocationForNearby, setReferenceLocationForNearby] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [showPlacesPopup, setShowPlacesPopup] = useState(false)
  const [placesPopupCooldownUntil, setPlacesPopupCooldownUntil] = useState<number>(0)
  const placesPopupAutoCloseRef = useRef<number | null>(null)
  const [hotels, setHotels] = useState<
    Array<{
      id: string
      hotelName: string
      latitude: number
      longitude: number
      starRating: string
      description?: string
      descriptionTranslations?: {
        de?: string
        fr?: string
        nl?: string
        it?: string
        es?: string
        ru?: string
      }
      images?: Array<{
        image?: {
          id?: string
          url?: string
          filename?: string
          publicUrl?: string
        }
      }>
      packages?: Array<{
        id?: string
        packageName: string
        roomPricePerNight: number
        packageDescription?: string
      }>
    }>
  >([])
  const [nearbyHotels, setNearbyHotels] = useState<
    Array<{
      id: string
      hotelName: string
      latitude: number
      longitude: number
      distance: number
      starRating: string
      description?: string
      descriptionTranslations?: {
        de?: string
        fr?: string
        nl?: string
        it?: string
        es?: string
        ru?: string
      }
      images?: Array<{
        image?: {
          id?: string
          url?: string
          filename?: string
          publicUrl?: string
        }
      }>
    }>
  >([])
  const [selectedHotel, setSelectedHotel] = useState<{
    id: string
    hotelName: string
    latitude: number
    longitude: number
    starRating: string
    description?: string
    descriptionTranslations?: {
      de?: string
      fr?: string
      nl?: string
      it?: string
      es?: string
      ru?: string
    }
    images?: Array<{
      image?: {
        id?: string
        url?: string
        filename?: string
        publicUrl?: string
      }
    }>
    packages?: Array<{
      id?: string
      packageName: string
      roomPricePerNight: number
      packageDescription?: string
    }>
  } | null>(null)
  const [showHotelDetails, setShowHotelDetails] = useState(false)
  const [showWaypointHotels, setShowWaypointHotels] = useState(false)
  const [waypointHotels, setWaypointHotels] = useState<typeof nearbyHotels>([])
  const [waypointHotelsFor, setWaypointHotelsFor] = useState<{
    pointId: string
    label: string
    lat: number
    lng: number
  } | null>(null)
  const routeLegsRef = useRef<any[]>([])
  const previousPointIdsRef = useRef<string>('')
  const isUpdatingRouteRef = useRef(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const userLocationMarkerRef = useRef<any>(null)
  const [showVehicleSearchPopup, setShowVehicleSearchPopup] = useState(false)
  const [registeredVehicles, setRegisteredVehicles] = useState<any[]>([])
  const [selectedRegisteredVehicle, setSelectedRegisteredVehicle] = useState<any | null>(null)
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false)
  const [viewingVehicle, setViewingVehicle] = useState<any | null>(null)
  const [showSummaryRequested, setShowSummaryRequested] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerContact, setCustomerContact] = useState('')

  // Initialize Google Maps
  useEffect(() => {
    if (mapLoaded) return

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error(
        'Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.',
      )
      return
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      // Maps already loaded, just initialize
      if (mapRef.current && !mapInstanceRef.current) {
        const center = { lat: 7.8731, lng: 80.7718 } // Sri Lanka center
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 8,
          center: center,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })

        mapInstanceRef.current = map
        directionsServiceRef.current = new window.google.maps.DirectionsService()
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: '#0652DD', // Google Maps default blue color
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        } as any)
        directionsRendererRef.current.setMap(map)

        setMapLoaded(true)
      }
      return
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)

    if (existingScript) {
      // Script exists but might not be loaded yet, wait for it
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkLoaded)
          // Initialize map now that it's loaded
          if (mapRef.current && !mapInstanceRef.current) {
            const center = { lat: 7.8731, lng: 80.7718 }
            const map = new window.google.maps.Map(mapRef.current, {
              zoom: 8,
              center: center,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
            })

            mapInstanceRef.current = map
            directionsServiceRef.current = new window.google.maps.DirectionsService()
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
              polylineOptions: {
                strokeColor: '#003366', // Dark blue color
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            })
            directionsRendererRef.current.setMap(map)

            setMapLoaded(true)
          }
        }
      }, 100)

      // Cleanup interval after 10 seconds
      const timeoutId = setTimeout(() => {
        clearInterval(checkLoaded)
      }, 10000)

      return () => {
        clearInterval(checkLoaded)
        clearTimeout(timeoutId)
      }
    }

    // Script doesn't exist, create and add it
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`
    script.async = true
    script.defer = true

    window.initMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        const center = { lat: 7.8731, lng: 80.7718 } // Sri Lanka center
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 8,
          center: center,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })

        mapInstanceRef.current = map
        directionsServiceRef.current = new window.google.maps.DirectionsService()
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: '#4285F4', // Google Maps default blue color
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        } as any)
        directionsRendererRef.current.setMap(map)

        setMapLoaded(true)
      }
    }

    document.head.appendChild(script)

    return () => {
      // Clean up initMap if it exists and Google Maps isn't loaded
      if ('initMap' in window && !window.google?.maps) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).initMap
      }
    }
  }, [mapLoaded])

  // Initialize Autocomplete when input is available
  useEffect(() => {
    if (!mapLoaded || !autocompleteInput) return

    // Clean up previous instance
    if (autocompleteInstanceRef.current) {
      window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current)
      autocompleteInstanceRef.current = null
    }

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput, {
      componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
    })

    const handlePlaceChanged = () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) return

      // Verify the place is in Sri Lanka
      const addressComponents = place.address_components || []
      const countryComponent = addressComponents.find((component) =>
        component.types.includes('country'),
      )

      // Check if country is Sri Lanka (LK)
      if (!countryComponent || countryComponent.short_name !== 'LK') {
        alert(t('planYourTrip.errors.locationOutsideSriLanka'))
        if (autocompleteInput) {
          autocompleteInput.value = ''
          setSearchValue('')
        }
        return
      }

      // Verify coordinates are within Sri Lanka bounds (approximate)
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const sriLankaLatMin = 5.9
      const sriLankaLatMax = 9.8
      const sriLankaLngMin = 79.7
      const sriLankaLngMax = 81.9

      if (
        lat < sriLankaLatMin ||
        lat > sriLankaLatMax ||
        lng < sriLankaLngMin ||
        lng > sriLankaLngMax
      ) {
        alert(t('planYourTrip.errors.locationOutsideSriLanka'))
        if (autocompleteInput) {
          autocompleteInput.value = ''
          setSearchValue('')
        }
        return
      }

      // Clear any location errors
      setLocationError(null)

      // Update typed location for nearby places calculation (for waypoints and endpoints)
      if (currentStep === 'waypoints' || currentStep === 'end') {
        setTypedLocation({
          lat,
          lng,
          address: place.formatted_address || '',
          name: place.name || '',
        })
        // If selecting endpoint, set the ref to track endpoint selection and preserve the field value
        if (currentStep === 'end') {
          isSelectingEndpointRef.current = true
          // Update searchValue to show the selected location in the field
          setSearchValue(place.formatted_address || place.name || '')
          if (autocompleteInput) {
            autocompleteInput.value = place.formatted_address || place.name || ''
          }
        }
      }

      // For manually typed locations (autocomplete), use defaults from trip config
      // But don't add stay duration/cost for start point
      const newPoint: Point = {
        id: generateId(),
        name: place.name || '',
        address: place.formatted_address || '',
        lat: lat,
        lng: lng,
        type: currentStep === 'start' ? 'start' : currentStep === 'end' ? 'end' : 'waypoint',
        // Use default values from trip configuration for unsaved places (except start point)
        ...(currentStep !== 'start' && {
          stayDuration: tripConfig?.stayTimeInMinutes,
          stayCost: tripConfig?.defaultStayCost,
        }),
      }

      if (currentStep === 'start') {
        setPoints([newPoint])
        setCurrentStep('complete')
      } else if (currentStep === 'end') {
        // For endpoint, add the selected Google Maps location as the endpoint
        // Calculate distance from previous point
        const previousPoint = points
          .filter((p) => p.type !== 'end')
          .sort((a, b) => {
            const aIndex = points.indexOf(a)
            const bIndex = points.indexOf(b)
            return aIndex - bIndex
          })
          .slice(-1)[0]
        
        const distanceInKm = previousPoint
          ? calculateDistance(previousPoint.lat, previousPoint.lng, lat, lng)
          : 0
        
        // Update newPoint with distance
        const endpointWithDistance: Point = {
          ...newPoint,
          distanceInKm,
        }
        
        // Add the endpoint
        setPoints((prev) => {
          const endPoint = prev.find((p) => p.type === 'end')
          if (endPoint) {
            return prev.filter((p) => p.type !== 'end').concat(endpointWithDistance)
          }
          return [...prev, endpointWithDistance]
        })
        // Keep typedLocation so popup can show nearby places/hotels
        // The popup will show based on typedLocation (handled in useEffect)
        // Keep isSelectingEndpointRef.current = true so user can still select from popup to replace endpoint
        // Don't reset the ref yet - let user select from popup if they want
        // DON'T clear typedLocation or searchValue here - keep them for the popup
        // setCurrentStep('complete') - Don't set to complete yet, keep as 'end' so popup selections work
      } else {
        // Add waypoint
        setPoints((prev) => {
          const endPoint = prev.find((p) => p.type === 'end')
          const otherPoints = prev.filter((p) => p.type !== 'end')
          return [...otherPoints, newPoint, ...(endPoint ? [endPoint] : [])]
        })
        // Store reference location for nearby places
        setReferenceLocationForNearby({
          lat: lat,
          lng: lng,
        })
        // Keep step as 'waypoints' so popup can show with nearby places
        setCurrentStep('waypoints')
        // Clear search for waypoints only
        setSearchValue('')
        setTypedLocation(null)
        if (autocompleteInput) {
          autocompleteInput.value = ''
        }
      }
    }

    autocomplete.addListener('place_changed', handlePlaceChanged)
    autocompleteInstanceRef.current = autocomplete

    // Initialize geocoder
    if (!geocoderRef.current && window.google?.maps) {
      geocoderRef.current = new window.google.maps.Geocoder()
    }

    return () => {
      if (autocompleteInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current)
        autocompleteInstanceRef.current = null
      }
    }
  }, [mapLoaded, autocompleteInput, currentStep])

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('planYourTrip.errors.geolocationNotSupported'))
      return
    }

    setIsGettingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        // Verify coordinates are within Sri Lanka bounds (approximate)
        const sriLankaLatMin = 5.9
        const sriLankaLatMax = 9.8
        const sriLankaLngMin = 79.7
        const sriLankaLngMax = 81.9

        if (
          lat < sriLankaLatMin ||
          lat > sriLankaLatMax ||
          lng < sriLankaLngMin ||
          lng > sriLankaLngMax
        ) {
          setLocationError(t('planYourTrip.errors.locationOutsideSriLankaDetailed'))
          setIsGettingLocation(false)
          return
        }

        // Initialize geocoder if not already initialized
        if (!geocoderRef.current && window.google?.maps) {
          geocoderRef.current = new window.google.maps.Geocoder()
        }

        // Reverse geocode to get address
        if (geocoderRef.current && window.google?.maps) {
          geocoderRef.current.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            setIsGettingLocation(false)
            if (status === 'OK' && results && results.length > 0) {
              const address = results[0].formatted_address || t('planYourTrip.yourLocation')
              const name = t('planYourTrip.yourLocation')

              // Create start point
              const newPoint: Point = {
                id: generateId(),
                name: name,
                address: address,
                lat: lat,
                lng: lng,
                type: 'start',
              }

              setPoints([newPoint])
              setCurrentStep('complete')

              // Add marker for user location on map
              if (mapInstanceRef.current) {
                // Remove existing user location marker if any
                if (userLocationMarkerRef.current) {
                  userLocationMarkerRef.current.setMap(null)
                }

                // Add blue marker for user location
                const marker = new window.google.maps.Marker({
                  position: { lat, lng },
                  map: mapInstanceRef.current,
                  icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new window.google.maps.Size(40, 40),
                  },
                  title: t('planYourTrip.yourLocation'),
                })

                userLocationMarkerRef.current = marker

                // Center map on user location
                mapInstanceRef.current.setCenter({ lat, lng })
                mapInstanceRef.current.setZoom(15)
              }
            } else {
              // If geocoding fails, still set the location with coordinates
              const newPoint: Point = {
                id: generateId(),
                name: t('planYourTrip.yourLocation'),
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                lat: lat,
                lng: lng,
                type: 'start',
              }

              setPoints([newPoint])
              setCurrentStep('complete')

              // Add marker for user location on map
              if (mapInstanceRef.current) {
                if (userLocationMarkerRef.current) {
                  userLocationMarkerRef.current.setMap(null)
                }

                const marker = new window.google.maps.Marker({
                  position: { lat, lng },
                  map: mapInstanceRef.current,
                  icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new window.google.maps.Size(40, 40),
                  },
                  title: t('planYourTrip.yourLocation'),
                })

                userLocationMarkerRef.current = marker

                mapInstanceRef.current.setCenter({ lat, lng })
                mapInstanceRef.current.setZoom(15)
              }
            }
          })
        } else {
          setIsGettingLocation(false)
          setLocationError(t('planYourTrip.errors.mapNotLoaded'))
        }
      },
      (error) => {
        setIsGettingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(t('planYourTrip.errors.locationAccessDenied'))
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError(t('planYourTrip.errors.locationUnavailable'))
            break
          case error.TIMEOUT:
            setLocationError(t('planYourTrip.errors.locationTimeout'))
            break
          default:
            setLocationError(t('planYourTrip.errors.locationError'))
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  // Geocode typed location when user types (only for waypoints, not for endpoints)
  // For endpoints, we only use autocomplete selection to avoid showing popup while typing
  useEffect(() => {
    if (!mapLoaded || !geocoderRef.current || currentStep !== 'waypoints') {
      if (currentStep !== 'end') {
        setTypedLocation(null)
      }
      return
    }

    const searchTerm = searchValue.trim()
    if (!searchTerm || searchTerm.length < 3) {
      setTypedLocation(null)
      return
    }

    // Debounce geocoding
    const timeoutId = setTimeout(() => {
      setIsGeocoding(true)
      geocoderRef.current.geocode(
        {
          address: searchTerm,
          componentRestrictions: { country: 'lk' },
        },
        (results: any, status: any) => {
          setIsGeocoding(false)
          if (
            status === 'OK' &&
            results &&
            results.length > 0 &&
            results[0].geometry &&
            results[0].geometry.location
          ) {
            const location = results[0].geometry.location
            const lat = location.lat()
            const lng = location.lng()

            // Verify coordinates are within Sri Lanka bounds
            const sriLankaLatMin = 5.9
            const sriLankaLatMax = 9.8
            const sriLankaLngMin = 79.7
            const sriLankaLngMax = 81.9

            if (
              lat >= sriLankaLatMin &&
              lat <= sriLankaLatMax &&
              lng >= sriLankaLngMin &&
              lng <= sriLankaLngMax
            ) {
              setTypedLocation({
                lat,
                lng,
                address: results[0].formatted_address || searchTerm,
                name: results[0].address_components?.[0]?.long_name || searchTerm,
              })
            } else {
              setTypedLocation(null)
            }
          } else {
            setTypedLocation(null)
          }
        },
      )
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchValue, mapLoaded, currentStep])

  // Mark typing as "idle" after 1s with no changes (improves UX for popup)
  useEffect(() => {
    const term = searchValue.trim()
    if (!term || term.length < 3) {
      setIsSearchIdle(false)
      return
    }

    setIsSearchIdle(false)
    const timeoutId = setTimeout(() => setIsSearchIdle(true), 1000)
    return () => clearTimeout(timeoutId)
  }, [searchValue])

  const closePlacesPopup = () => {
    setShowPlacesPopup(false)
    // Prevent immediate re-open caused by downstream state updates (e.g. adding a point updates reference coords)
    setPlacesPopupCooldownUntil(Date.now() + 1600)
    if (placesPopupAutoCloseRef.current) {
      window.clearTimeout(placesPopupAutoCloseRef.current)
      placesPopupAutoCloseRef.current = null
    }
  }

  const updateMap = () => {
    if (!mapInstanceRef.current || !directionsServiceRef.current || !directionsRendererRef.current)
      return

    // Create a signature of current points (IDs and locations only, not duration/distance)
    const currentPointSignature = points
      .map((p) => `${p.id}:${p.lat.toFixed(6)}:${p.lng.toFixed(6)}`)
      .join('|')

    // Only update markers if point locations have changed (not just metadata like duration/distance)
    const pointsChanged = previousPointIdsRef.current !== currentPointSignature

    if (pointsChanged) {
      previousPointIdsRef.current = currentPointSignature

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      // Remove user location marker if start point is manually changed
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setMap(null)
        userLocationMarkerRef.current = null
      }

      // Sort points to get correct numbering (start, waypoints, end)
      const sortedPointsForMarkers = [...points].sort((a, b) => {
        if (a.type === 'start') return -1
        if (b.type === 'start') return 1
        if (a.type === 'end') return 1
        if (b.type === 'end') return -1
        return 0
      })

      // Add markers for all points with numbered labels using custom icons
      sortedPointsForMarkers.forEach((point, index) => {
        const markerNumber = String(index + 1)
        // Use Google Charts API to create custom numbered marker icons
        const iconUrl = `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${markerNumber}|FF0000|FFFFFF`

        const marker = new window.google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map: mapInstanceRef.current,
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(10, 34),
          },
          title: point.name,
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${point.name}</strong><br/>${point.address}</div>`,
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })

        markersRef.current.push(marker)
      })

      // Fit bounds only when points actually change
      if (points.length > 0 && mapInstanceRef.current) {
        if (points.length === 1) {
          // If only one point, center on it with default zoom
          mapInstanceRef.current.setCenter({ lat: points[0].lat, lng: points[0].lng })
          mapInstanceRef.current.setZoom(12)
        } else {
          // Multiple points, fit bounds
          const bounds = new window.google.maps.LatLngBounds()
          points.forEach((point) => {
            bounds.extend({ lat: point.lat, lng: point.lng })
          })
          mapInstanceRef.current.fitBounds(bounds)
        }
      } else if (points.length === 0 && mapInstanceRef.current) {
        // No points, reset to Sri Lanka center
        mapInstanceRef.current.setCenter({ lat: 7.8731, lng: 80.7718 })
        mapInstanceRef.current.setZoom(8)
      }
    }

    // Clear route if we have less than 2 points
    if (points.length < 2 && pointsChanged && directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] })
      setTotalDuration('')
      setTotalDistance('')
      routeLegsRef.current = []
    }

    // Draw route if we have at least 2 points and points have changed
    if (points.length >= 2 && pointsChanged) {
      const sortedPoints = [...points].sort((a, b) => {
        if (a.type === 'start') return -1
        if (b.type === 'start') return 1
        if (a.type === 'end') return 1
        if (b.type === 'end') return -1
        return 0
      })

      const waypoints = sortedPoints
        .slice(1, -1)
        .map((point) => ({ location: { lat: point.lat, lng: point.lng }, stopover: true }))

      directionsServiceRef.current.route(
        {
          origin: { lat: sortedPoints[0].lat, lng: sortedPoints[0].lng },
          destination: {
            lat: sortedPoints[sortedPoints.length - 1].lat,
            lng: sortedPoints[sortedPoints.length - 1].lng,
          },
          waypoints: waypoints.length > 0 ? waypoints : undefined,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result: any, status: string) => {
          if (status === 'OK' && directionsRendererRef.current && result) {
            isUpdatingRouteRef.current = true

            directionsRendererRef.current.setDirections(result)

            // Extract route legs data
            const legs = result.routes[0]?.legs || []
            routeLegsRef.current = legs

            // Calculate total duration and distance
            let totalDurationSeconds = 0
            let totalDistanceMeters = 0

            legs.forEach((leg: any) => {
              if (leg.duration) {
                totalDurationSeconds += leg.duration.value
              }
              if (leg.distance) {
                totalDistanceMeters += leg.distance.value
              }
            })

            // Format total duration
            const hours = Math.floor(totalDurationSeconds / 3600)
            const minutes = Math.floor((totalDurationSeconds % 3600) / 60)
            let durationText = ''
            if (hours > 0) {
              durationText = `${hours} ${hours === 1 ? 'hour' : 'hours'}`
            }
            if (minutes > 0) {
              if (durationText) durationText += ' '
              durationText += `${minutes} ${minutes === 1 ? 'min' : 'mins'}`
            }
            setTotalDuration(durationText || '0 mins')
            setTotalDurationSeconds(totalDurationSeconds) // Store in seconds for validation

            // Format total distance
            const totalDistanceKm = (totalDistanceMeters / 1000).toFixed(1)
            setTotalDistance(`${totalDistanceKm} km`)

            // Update points with duration and distance to next point (without triggering re-render of markers)
            setPoints((currentPoints) => {
              // Check if we actually need to update
              const needsUpdate = currentPoints.some((point) => {
                const sortedIndex = sortedPoints.findIndex((p) => p.id === point.id)
                if (
                  sortedIndex >= 0 &&
                  sortedIndex < legs.length &&
                  sortedIndex < sortedPoints.length - 1
                ) {
                  const leg = legs[sortedIndex]
                  if (leg) {
                    const hasDuration = leg.duration && leg.duration.value > 0
                    const hasDistance = leg.distance && leg.distance.value > 0
                    if (hasDuration || hasDistance) {
                      // Check if values are different
                      return true // Always update to ensure fresh data
                    }
                  }
                }
                return point.durationToNext !== undefined || point.distanceToNext !== undefined
              })

              if (!needsUpdate) return currentPoints

              return currentPoints.map((point) => {
                const sortedIndex = sortedPoints.findIndex((p) => p.id === point.id)
                // Only show duration/distance if this is not the last point
                if (
                  sortedIndex >= 0 &&
                  sortedIndex < legs.length &&
                  sortedIndex < sortedPoints.length - 1
                ) {
                  const leg = legs[sortedIndex]
                  if (leg) {
                    let durationText = ''
                    let distanceText = ''

                    if (leg.duration) {
                      const hours = Math.floor(leg.duration.value / 3600)
                      const minutes = Math.floor((leg.duration.value % 3600) / 60)
                      if (hours > 0) {
                        durationText = `${hours} ${hours === 1 ? 'hour' : 'hours'}`
                      }
                      if (minutes > 0) {
                        if (durationText) durationText += ' '
                        durationText += `${minutes} ${minutes === 1 ? 'min' : 'mins'}`
                      }
                      if (!durationText) durationText = `${Math.ceil(leg.duration.value / 60)} mins`
                    }

                    if (leg.distance) {
                      const distanceKm = (leg.distance.value / 1000).toFixed(1)
                      distanceText = `${distanceKm} km`
                    }

                    // Calculate distance in km TO this point (from previous point)
                    // Use the previous leg's distance, or 0 for the first point
                    const previousLeg = sortedIndex > 0 ? legs[sortedIndex - 1] : null
                    const distanceInKm = previousLeg?.distance
                      ? previousLeg.distance.value / 1000
                      : 0

                    // Calculate total cost: use point values if available (visiting place), otherwise use defaults
                    // Don't calculate cost for start point
                    // For end point: never include stay cost (only distance * costPerKm)
                    let totalCost: number | undefined = undefined
                    if (point.type !== 'start') {
                      const stayCost =
                        point.type === 'end'
                          ? 0
                          : (point.stayCost ?? tripConfig?.defaultStayCost ?? 0)
                      const costPerKm =
                        selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
                      totalCost = stayCost + costPerKm * distanceInKm
                    }

                    return {
                      ...point,
                      durationToNext: durationText || undefined,
                      distanceToNext: distanceText || undefined,
                      distanceInKm:
                        distanceInKm > 0 ? distanceInKm : (point.distanceInKm ?? undefined),
                      totalCost: totalCost,
                    }
                  }
                }
                // Clear duration/distance for last point or if not found
                return { ...point, durationToNext: undefined, distanceToNext: undefined }
              })
            })

            // Reset the flag after a short delay to allow state updates to complete
            setTimeout(() => {
              isUpdatingRouteRef.current = false
            }, 100)
          }
        },
      )
    }
  }

  // Update map when points change (but skip if we're just updating route metadata)
  useEffect(() => {
    if (mapLoaded && !isUpdatingRouteRef.current) {
      updateMap()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, mapLoaded])

  // Recalculate costs when selected vehicle changes (for points without visiting place cost)
  useEffect(() => {
    if (points.length > 0 && mapLoaded) {
      // Update points that don't have a visiting place (manually added points)
      setPoints((currentPoints) => {
        const startPoint = currentPoints.find((p) => p.type === 'start')
        return currentPoints.map((point) => {
          // Only update points that don't have a visiting place (manually added points)
          if (
            point.type !== 'start' &&
            !point.visitingPlaceId &&
            point.distanceInKm !== undefined
          ) {
            // End point: never include stay cost in total (only distance * costPerKm)
            const stayCost =
              point.type === 'end' ? 0 : (point.stayCost ?? tripConfig?.defaultStayCost ?? 0)
            const costPerKm = selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
            const totalCost = stayCost + costPerKm * point.distanceInKm
            return {
              ...point,
              totalCost,
            }
          }
          return point
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle, mapLoaded])

  const removePoint = (id: string) => {
    const removedPoint = points.find((p) => p.id === id)
    const newPoints = points.filter((p) => p.id !== id)
    setPoints(newPoints)

    // Remove user location marker if start point is removed
    if (removedPoint?.type === 'start' && userLocationMarkerRef.current) {
      userLocationMarkerRef.current.setMap(null)
      userLocationMarkerRef.current = null
    }

    // If removed waypoint was the reference, update to new last waypoint
    if (
      removedPoint &&
      referenceLocationForNearby &&
      removedPoint.lat === referenceLocationForNearby.lat &&
      removedPoint.lng === referenceLocationForNearby.lng
    ) {
      // Update to last remaining waypoint or start point
      const remainingWaypoints = newPoints.filter((p) => p.type === 'waypoint')
      const newReference =
        remainingWaypoints.length > 0
          ? remainingWaypoints[remainingWaypoints.length - 1]
          : newPoints.find((p) => p.type === 'start')
      if (newReference) {
        setReferenceLocationForNearby({
          lat: newReference.lat,
          lng: newReference.lng,
        })
      } else {
        setReferenceLocationForNearby(null)
      }
    }

    if (newPoints.length === 0) {
      setCurrentStep('start')
      setReferenceLocationForNearby(null)
    } else if (!newPoints.find((p) => p.type === 'start')) {
      setCurrentStep('start')
      setReferenceLocationForNearby(null)
    } else {
      // Keep current step or set to waypoints if we have points
      if (!newPoints.find((p) => p.type === 'end')) {
        // If no end point, allow adding more waypoints
        setCurrentStep('waypoints')
      }
    }
  }

  const addEndPoint = () => {
    setCurrentStep('end')
    isSelectingEndpointRef.current = true
  }

  const addNewWaypoint = () => {
    setCurrentStep('waypoints')
    setSearchValue('')
    setTypedLocation(null)
    // Reset autocomplete input
    setTimeout(() => {
      if (autocompleteInput) {
        autocompleteInput.value = ''
      }
    }, 100)
  }

  // Calculate distance between two coordinates using Haversine formula (returns distance in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Fetch visiting places from database
  useEffect(() => {
    const fetchVisitingPlaces = async () => {
      try {
        const response = await fetch('/api/visiting-places?limit=1000')
        if (response.ok) {
          const data = await response.json()
          const places = (data.docs || []).map((place: any) => ({
            id: place.id,
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            stayDuration: place.stayDuration || undefined,
            stayCost: place.stayCost || undefined,
          }))
          setVisitingPlaces(places)
        } else {
          console.error('Failed to fetch visiting places:', response.status, response.statusText)
        }
      } catch (err) {
        console.error('Error fetching visiting places:', err)
      }
    }
    fetchVisitingPlaces()
  }, [])

  // Fetch hotels from database
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/hotels?limit=1000&depth=2')
        if (response.ok) {
          const data = await response.json()
          const hotelsList = (data.docs || []).map((hotel: any) => ({
            id: hotel.id,
            hotelName: hotel.hotelName,
            latitude: hotel.latitude,
            longitude: hotel.longitude,
            starRating: hotel.starRating,
            description: hotel.description || undefined,
            descriptionTranslations: hotel.descriptionTranslations || undefined,
            images: hotel.images || undefined,
            packages: hotel.packages || undefined,
          }))
          setHotels(hotelsList)
        } else {
          console.error('Failed to fetch hotels:', response.status, response.statusText)
        }
      } catch (err) {
        console.error('Error fetching hotels:', err)
      }
    }
    fetchHotels()
  }, [])

  // Fetch trip configuration from database
  useEffect(() => {
    const fetchTripConfig = async () => {
      try {
        const response = await fetch('/api/trip-configuration?limit=1')
        if (response.ok) {
          const data = await response.json()
          if (data.docs && data.docs.length > 0) {
            const config = data.docs[0]
            setTripConfig({
              lkrPerKilometer: config.lkrPerKilometer,
              stayTimeInMinutes: config.stayTimeInMinutes,
              defaultStayCost: config.defaultStayCost,
              travelingHoursPerDay: config.travelingHoursPerDay,
            })
          }
        } else {
          console.error('Failed to fetch trip configuration:', response.status, response.statusText)
        }
      } catch (err) {
        console.error('Error fetching trip configuration:', err)
      }
    }
    fetchTripConfig()
  }, [])

  // Fetch vehicle configurations from database
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicle-configuration?limit=1000')
        if (response.ok) {
          const data = await response.json()
          const vehiclesList = (data.docs || []).map((vehicle: any) => ({
            id: vehicle.id,
            vehicleType: vehicle.vehicleType,
            passengerCount: vehicle.passengerCount,
            lkrPerKilometer: vehicle.lkrPerKilometer,
          }))
          setVehicles(vehiclesList)
          // Auto-select first vehicle if available and none selected
          setSelectedVehicle((prev) => {
            if (!prev && vehiclesList.length > 0) {
              return vehiclesList[0]
            }
            return prev
          })
        } else {
          console.error(
            'Failed to fetch vehicle configurations:',
            response.status,
            response.statusText,
          )
        }
      } catch (err) {
        console.error('Error fetching vehicle configurations:', err)
      }
    }
    fetchVehicles()
  }, [])

  // Fetch registered vehicles from database
  useEffect(() => {
    const fetchRegisteredVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles?limit=1000&depth=1')
        if (response.ok) {
          const data = await response.json()
          setRegisteredVehicles(data.docs || [])
        } else {
          console.error('Failed to fetch registered vehicles:', response.status, response.statusText)
        }
      } catch (err) {
        console.error('Error fetching registered vehicles:', err)
      }
    }
    fetchRegisteredVehicles()
  }, [])

  // Calculate nearby places and hotels based on typed location or reference location
  useEffect(() => {
    const endPoint = points.find((p) => p.type === 'end')

    // Determine reference location: 
    // 1. If typedLocation exists (from autocomplete selection), use it as reference (even if endpoint exists)
    // 2. If endpoint is already selected, use it as reference
    // 3. Otherwise, use referenceLocationForNearby (for waypoints)
    let referenceLat: number | null = null
    let referenceLng: number | null = null

    if (typedLocation) {
      // If typedLocation exists (from autocomplete), use it as reference
      // This allows popup to show even after endpoint is added from autocomplete
      referenceLat = typedLocation.lat
      referenceLng = typedLocation.lng
    } else if (endPoint) {
      // If endpoint is selected, use it as reference
      referenceLat = endPoint.lat
      referenceLng = endPoint.lng
    } else if (referenceLocationForNearby) {
      // Otherwise, use stored reference location (for waypoints)
      referenceLat = referenceLocationForNearby.lat
      referenceLng = referenceLocationForNearby.lng
    } else {
      // No reference location available
      setNearbyPlaces([])
      setNearbyHotels([])
      setShowPlacesPopup(false)
      return
    }

    // Calculate nearby visiting places
    let calculatedPlaces: typeof nearbyPlaces = []
    if (visitingPlaces.length > 0 && referenceLat && referenceLng) {
      const allPlacesWithDistance = visitingPlaces
        .filter((place) => {
          return (
            typeof place.latitude === 'number' &&
            typeof place.longitude === 'number' &&
            !isNaN(place.latitude) &&
            !isNaN(place.longitude)
          )
        })
        .map((place) => {
          const distance = calculateDistance(
            referenceLat!,
            referenceLng!,
            place.latitude,
            place.longitude,
          )
          return {
            ...place,
            distance,
            stayDuration: place.stayDuration,
            stayCost: place.stayCost,
          }
        })

      calculatedPlaces = allPlacesWithDistance
        .filter((place) => place.distance <= 20 && place.distance > 0)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20)
    }
    setNearbyPlaces(calculatedPlaces)

    // Calculate nearby hotels
    let calculatedHotels: typeof nearbyHotels = []
    if (hotels.length > 0 && referenceLat && referenceLng) {
      const allHotelsWithDistance = hotels
        .filter((hotel) => {
          return (
            typeof hotel.latitude === 'number' &&
            typeof hotel.longitude === 'number' &&
            !isNaN(hotel.latitude) &&
            !isNaN(hotel.longitude)
          )
        })
        .map((hotel) => {
          const distance = calculateDistance(
            referenceLat!,
            referenceLng!,
            hotel.latitude,
            hotel.longitude,
          )
          return {
            ...hotel,
            distance,
          }
        })

      calculatedHotels = allHotelsWithDistance
        .filter((hotel) => hotel.distance <= 20 && hotel.distance > 0)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20)
    }
    setNearbyHotels(calculatedHotels)

    // Popup behavior (UX):
    // - show only after user stops typing (~1s)
    // - keep visible ~5s then auto-close
    // - do NOT show immediately after selecting an item (cooldown)
    const shouldShowPopup =
      Date.now() > placesPopupCooldownUntil &&
      !!referenceLat &&
      !!referenceLng &&
      typedLocation !== null &&
      isSearchIdle
    
    if (shouldShowPopup) {
      // Only treat popup selections as endpoint selection when user is actually in endpoint mode.
      // Otherwise (waypoints typing), selecting from popup must add a waypoint.
      isSelectingEndpointRef.current = currentStep === 'end' && typedLocation !== null
      setShowPlacesPopup(true)
      if (placesPopupAutoCloseRef.current) {
        window.clearTimeout(placesPopupAutoCloseRef.current)
      }
      placesPopupAutoCloseRef.current = window.setTimeout(() => {
        closePlacesPopup()
      }, 5000)
      // Debug logging (can be removed in production)
      console.log('Nearby items calculation:', {
        referenceLocation: { lat: referenceLat, lng: referenceLng },
        visitingPlacesCount: visitingPlaces.length,
        hotelsCount: hotels.length,
        nearbyPlacesCount: calculatedPlaces.length,
        nearbyHotelsCount: calculatedHotels.length,
        currentStep,
        isTypingEndpoint: currentStep === 'end' && typedLocation !== null,
        hasEndpoint: endPoint !== undefined,
      })
    } else if (!referenceLat || !referenceLng) {
      // Don't show popup if no reference location
      setShowPlacesPopup(false)
    }
  }, [
    referenceLocationForNearby,
    visitingPlaces,
    hotels,
    points,
    currentStep,
    typedLocation,
    isSearchIdle,
    placesPopupCooldownUntil,
  ])

  const openHotelsForWaypoint = (point: Point, index: number) => {
    const label = getPointLabel(point, index + 1)
    setWaypointHotelsFor({ pointId: point.id, label, lat: point.lat, lng: point.lng })

    if (!hotels || hotels.length === 0) {
      setWaypointHotels([])
      setShowWaypointHotels(true)
      return
    }

    const calculated = hotels
      .filter((hotel) => {
        return (
          typeof hotel.latitude === 'number' &&
          typeof hotel.longitude === 'number' &&
          !isNaN(hotel.latitude) &&
          !isNaN(hotel.longitude)
        )
      })
      .map((hotel) => {
        const distance = calculateDistance(point.lat, point.lng, hotel.latitude, hotel.longitude)
        return { ...hotel, distance }
      })
      .filter((hotel) => hotel.distance <= 20 && hotel.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20)

    setWaypointHotels(calculated as typeof nearbyHotels)
    setShowWaypointHotels(true)
  }

  const handleSelectNearbyPlace = (place: {
    id: string
    name: string
    latitude: number
    longitude: number
    stayDuration?: number
    stayCost?: number
  }) => {
    // Determine if we're adding an endpoint or waypoint
    // Check if we're actively selecting endpoint (using ref to track endpoint selection state)
    // Priority: isSelectingEndpointRef > currentStep === 'end' > no endpoint exists
    const hasEndpoint = points.find((p) => p.type === 'end')
    // If ref is set, we're definitely selecting endpoint (even if currentStep changed to 'complete')
    // Also check if currentStep is 'end' OR if we have endpoint but ref is still set (user selecting replacement)
    const isAddingEndpoint =
      currentStep === 'end' ||
      (isSelectingEndpointRef.current && currentStep !== 'waypoints') ||
      (!hasEndpoint && currentStep !== 'waypoints' && currentStep !== 'start')
    
    // Get previous point to calculate distance
    const previousPoint = points
      .filter((p) => p.type !== 'end')
      .sort((a, b) => {
        const aIndex = points.indexOf(a)
        const bIndex = points.indexOf(b)
        return aIndex - bIndex
      })
      .slice(-1)[0] // Get the last point

    const distanceInKm = previousPoint
      ? calculateDistance(previousPoint.lat, previousPoint.lng, place.latitude, place.longitude)
      : 0

    // Calculate total cost: stayCost + (vehicle lkrPerKilometer * distance)
    const stayDuration = place.stayDuration || tripConfig?.stayTimeInMinutes || 0
    const stayCost = place.stayCost || tripConfig?.defaultStayCost || 0
    const costPerKm = selectedVehicle?.lkrPerKilometer || tripConfig?.lkrPerKilometer || 0
    const totalCost = stayCost + costPerKm * distanceInKm

    // Create a point from the selected nearby place
    const newPoint: Point = {
      id: generateId(),
      name: place.name,
      address: place.name, // Use name as address since we don't have address field
      lat: place.latitude,
      lng: place.longitude,
      type: isAddingEndpoint ? 'end' : 'waypoint',
      visitingPlaceId: place.id,
      stayDuration,
      stayCost,
      distanceInKm,
      totalCost,
    }

    // Add the point
    if (isAddingEndpoint) {
      // If adding endpoint, replace existing endpoint or add new one
      setPoints((prev) => {
        const endPoint = prev.find((p) => p.type === 'end')
        if (endPoint) {
          return prev.filter((p) => p.type !== 'end').concat(newPoint)
        }
        return [...prev, newPoint]
      })
      // Fill the endpoint field with the selected location
      setSearchValue(place.name)
      if (autocompleteInput) {
        autocompleteInput.value = place.name
      }
      // Clear reference location when endpoint is added
      setReferenceLocationForNearby(null)
      isSelectingEndpointRef.current = false
      setCurrentStep('complete')
      // Clear typedLocation to prevent popup from showing again after closing
      setTypedLocation(null)
    } else {
      // Add as waypoint
      setPoints((prev) => {
        const endPoint = prev.find((p) => p.type === 'end')
        const otherPoints = prev.filter((p) => p.type !== 'end')
        return [...otherPoints, newPoint, ...(endPoint ? [endPoint] : [])]
      })
      // Store reference location for nearby places (based on added waypoint)
      setReferenceLocationForNearby({
        lat: place.latitude,
        lng: place.longitude,
      })
      setCurrentStep('waypoints')
      // Reset search for waypoints
      setSearchValue('')
      setTypedLocation(null)
      if (autocompleteInput) {
        autocompleteInput.value = ''
      }
    }
    // Close popup after adding point
    closePlacesPopup()
  }

  const handleSelectNearbyHotel = (hotel: {
    id: string
    hotelName: string
    latitude: number
    longitude: number
    starRating: string
  }) => {
    // Determine if we're adding an endpoint or waypoint
    // Check if we're actively selecting endpoint (using ref to track endpoint selection state)
    // Priority: isSelectingEndpointRef > currentStep === 'end' > no endpoint exists
    const hasEndpoint = points.find((p) => p.type === 'end')
    // If ref is set, we're definitely selecting endpoint (even if currentStep changed to 'complete')
    // Also check if currentStep is 'end' OR if we have endpoint but ref is still set (user selecting replacement)
    const isAddingEndpoint =
      currentStep === 'end' ||
      (isSelectingEndpointRef.current && currentStep !== 'waypoints') ||
      (!hasEndpoint && currentStep !== 'waypoints' && currentStep !== 'start')
    
    // Get previous point to calculate distance
    const previousPoint = points
      .filter((p) => p.type !== 'end')
      .sort((a, b) => {
        const aIndex = points.indexOf(a)
        const bIndex = points.indexOf(b)
        return aIndex - bIndex
      })
      .slice(-1)[0] // Get the last point

    const distanceInKm = previousPoint
      ? calculateDistance(previousPoint.lat, previousPoint.lng, hotel.latitude, hotel.longitude)
      : 0

    // For hotels, use default stay duration and cost from trip config
    const stayDuration = tripConfig?.stayTimeInMinutes || 0
    const stayCost = tripConfig?.defaultStayCost || 0
    const costPerKm = selectedVehicle?.lkrPerKilometer || tripConfig?.lkrPerKilometer || 0
    const totalCost = stayCost + costPerKm * distanceInKm

    // Create a point from the selected hotel
    const newPoint: Point = {
      id: generateId(),
      name: hotel.hotelName,
      address: `${hotel.hotelName} (${hotel.starRating} Star Hotel)`,
      lat: hotel.latitude,
      lng: hotel.longitude,
      type: isAddingEndpoint ? 'end' : 'waypoint',
      stayDuration,
      stayCost,
      distanceInKm,
      totalCost,
    }

    // Add the point
    if (isAddingEndpoint) {
      // If adding endpoint, replace existing endpoint or add new one
      setPoints((prev) => {
        const endPoint = prev.find((p) => p.type === 'end')
        if (endPoint) {
          return prev.filter((p) => p.type !== 'end').concat(newPoint)
        }
        return [...prev, newPoint]
      })
      // Fill the endpoint field with the selected hotel
      const hotelDisplayName = `${hotel.hotelName} (${hotel.starRating} Star Hotel)`
      setSearchValue(hotelDisplayName)
      if (autocompleteInput) {
        autocompleteInput.value = hotelDisplayName
      }
      // Clear reference location when endpoint is added
      setReferenceLocationForNearby(null)
      isSelectingEndpointRef.current = false
      setCurrentStep('complete')
      // Clear typedLocation to prevent popup from showing again after closing
      setTypedLocation(null)
    } else {
      // Add as waypoint
      setPoints((prev) => {
        const endPoint = prev.find((p) => p.type === 'end')
        const otherPoints = prev.filter((p) => p.type !== 'end')
        return [...otherPoints, newPoint, ...(endPoint ? [endPoint] : [])]
      })
      // Store reference location for nearby places (based on added hotel)
      setReferenceLocationForNearby({
        lat: hotel.latitude,
        lng: hotel.longitude,
      })
      setCurrentStep('waypoints')
      // Reset search for waypoints
      setSearchValue('')
      setTypedLocation(null)
      if (autocompleteInput) {
        autocompleteInput.value = ''
      }
    }
    // Close popup after adding point
    closePlacesPopup()
  }

  const handleAddTypedLocation = () => {
    if (!typedLocation) {
      alert(t('planYourTrip.errors.invalidLocation'))
      return
    }

    // Get previous point to calculate distance
    const previousPoint = points
      .filter((p) => p.type !== 'end')
      .sort((a, b) => {
        const aIndex = points.indexOf(a)
        const bIndex = points.indexOf(b)
        return aIndex - bIndex
      })
      .slice(-1)[0]

    const distanceInKm = previousPoint
      ? calculateDistance(
          previousPoint.lat,
          previousPoint.lng,
          typedLocation.lat,
          typedLocation.lng,
        )
      : 0

    // For manually typed locations, use defaults from trip config
    const newPoint: Point = {
      id: generateId(),
      name: typedLocation.name,
      address: typedLocation.address,
      lat: typedLocation.lat,
      lng: typedLocation.lng,
      type: 'waypoint',
      // Use default values from trip configuration for unsaved places
      stayDuration: tripConfig?.stayTimeInMinutes,
      stayCost: tripConfig?.defaultStayCost,
      distanceInKm,
    }

    // Add waypoint
    setPoints((prev) => {
      const endPoint = prev.find((p) => p.type === 'end')
      const otherPoints = prev.filter((p) => p.type !== 'end')
      return [...otherPoints, newPoint, ...(endPoint ? [endPoint] : [])]
    })

    // Store reference location for nearby places (based on added waypoint)
    setReferenceLocationForNearby({
      lat: typedLocation.lat,
      lng: typedLocation.lng,
    })

    // Reset search but keep reference location for nearby places
    setSearchValue('')
    setTypedLocation(null)
    if (autocompleteInput) {
      autocompleteInput.value = ''
    }
    // Keep step as 'waypoints' so popup can show again with new nearby places
    setCurrentStep('waypoints')
    // Don't close popup - it will refresh with new nearby places automatically
  }

  const handleAddTypedLocationAsEndpoint = () => {
    if (!typedLocation) {
      alert(t('planYourTrip.errors.invalidLocation'))
      return
    }

    // Get previous point to calculate distance
    const previousPoint = points
      .filter((p) => p.type !== 'end')
      .sort((a, b) => {
        const aIndex = points.indexOf(a)
        const bIndex = points.indexOf(b)
        return aIndex - bIndex
      })
      .slice(-1)[0]

    const distanceInKm = previousPoint
      ? calculateDistance(
          previousPoint.lat,
          previousPoint.lng,
          typedLocation.lat,
          typedLocation.lng,
        )
      : 0

    // For manually typed locations, use defaults from trip config
    const newPoint: Point = {
      id: generateId(),
      name: typedLocation.name,
      address: typedLocation.address,
      lat: typedLocation.lat,
      lng: typedLocation.lng,
      type: 'end',
      // Use default values from trip configuration for unsaved places
      stayDuration: tripConfig?.stayTimeInMinutes,
      stayCost: tripConfig?.defaultStayCost,
      distanceInKm,
    }

    // Add endpoint
    setPoints((prev) => {
      const endPoint = prev.find((p) => p.type === 'end')
      if (endPoint) {
        return prev.filter((p) => p.type !== 'end').concat(newPoint)
      }
      return [...prev, newPoint]
    })

    // Clear reference location when end point is added (can't add more waypoints)
    setReferenceLocationForNearby(null)
    // Clear typed location since endpoint is now set
    setTypedLocation(null)
    setSearchValue('')
    if (autocompleteInput) {
      autocompleteInput.value = ''
    }
    // Reset endpoint selection ref
    isSelectingEndpointRef.current = false
    setCurrentStep('complete')
  }

  const handleGetFullSummary = async () => {
    // Basic validation
    if (!expectedStartDate || !startingTime || !guestCount) {
      alert('Please fill in starting date, time, and guest count.')
      return
    }

    if (points.length < 2 || !points.find((p) => p.type === 'end')) {
      alert('Please complete your trip plan with at least a start and end point.')
      return
    }

    if (!selectedVehicle) {
      alert('Please select a vehicle.')
      return
    }

    setIsSendingEmail(true)
    
    // Prepare trip data for email with correct cost calculation
    const totalDistanceKm = totalDistance ? parseFloat(totalDistance.replace(' km', '')) : 0
    const totalStayCost = points
      .filter((point) => point.type !== 'start' && point.type !== 'end')
      .reduce((sum, point) => {
        const stayCost = point.stayCost ?? tripConfig?.defaultStayCost ?? 0
        return sum + stayCost
      }, 0)
    const costPerKm = selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
    const calculatedTotalCost = (totalDistanceKm * costPerKm) + totalStayCost

    const tripData = {
      customerEmail,
      customerContact,
      expectedStartDate,
      startingTime,
      guestCount,
      vehicle: selectedRegisteredVehicle || {
        vehicleType: selectedVehicle.vehicleType,
        model: 'Generic Configuration',
        plateNumber: 'N/A'
      },
      points: points.map(p => {
        // If it's the start point and name is generic "Your Location", use the address instead
        const displayName = (p.type === 'start' && (p.name === 'Your Location' || p.name === t('planYourTrip.yourLocation'))) 
          ? p.address 
          : p.name;
        
        return {
          type: p.type,
          name: displayName,
          address: p.address
        }
      }),
      totalDistance,
      totalDuration,
      totalCost: calculatedTotalCost
    }

    try {
      const response = await fetch('/api/send-trip-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      })

      if (response.ok) {
        setShowSummaryRequested(true)
        alert('Trip summary generated and email sent to admin!')
      } else {
        alert('Failed to send trip summary email. Please try again.')
      }
    } catch (error) {
      console.error('Error sending trip summary:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  const getPointLabel = (point: Point, index: number) => {
    if (point.type === 'start') return t('planYourTrip.start')
    if (point.type === 'end') return t('planYourTrip.end')
    return `${t('planYourTrip.point')} ${index}`
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60)
      return `${minutes} ${minutes !== 1 ? t('planYourTrip.mins') : t('planYourTrip.min')}`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (mins === 0)
      return `${hours} ${hours !== 1 ? t('planYourTrip.hours') : t('planYourTrip.hour')}`
    return `${hours} ${hours !== 1 ? t('planYourTrip.hours') : t('planYourTrip.hour')} ${mins} ${mins !== 1 ? t('planYourTrip.mins') : t('planYourTrip.min')}`
  }

  const formatCurrency = (amount: number): string => {
    return `${t('planYourTrip.currency')} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="plan-your-trip-page">
      <div className="plan-trip-container">
        {/* Left Side - Map */}
        <div className="plan-map-container">
          <div ref={mapRef} id="map" className="plan-map"></div>
          {!mapLoaded && (
            <div className="map-loading">
              <p>{t('planYourTrip.loadingMap')}</p>
            </div>
          )}
        </div>

        {/* Right Side - Stepper */}
        <div className="plan-stepper-container">
          <div className="plan-stepper-header">
            <h1>{t('nav.planYourTrip') || 'Plan Your Trip'}</h1>
            <p>{t('planYourTrip.subtitle') || 'Plan smarter, travel better'}</p>
          </div>

          {/* Customer Details - Email, Contact */}
          <div className="trip-details-container customer-contact-details">
            <div className="trip-details-row">
              <div className="trip-detail-field">
                <label htmlFor="customer-email" className="trip-detail-label">
                  {t('planYourTrip.customerEmail') || 'Email Address'}
                </label>
                <input
                  type="email"
                  id="customer-email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="trip-detail-input"
                  placeholder="example@mail.com"
                />
              </div>
              <div className="trip-detail-field">
                <label htmlFor="customer-contact" className="trip-detail-label">
                  {t('planYourTrip.customerContact') || 'Contact Number'}
                </label>
                <input
                  type="text"
                  id="customer-contact"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="trip-detail-input"
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Trip Details - Date, Time, Guest Count */}
          <div className="trip-details-container">
            <div className="trip-details-row">
              <div className="trip-detail-field">
                <label htmlFor="expected-start-date" className="trip-detail-label">
                  {t('planYourTrip.expectedStartDate') || 'Expected Starting Date'}
                </label>
                <input
                  type="date"
                  id="expected-start-date"
                  value={expectedStartDate}
                  onChange={(e) => setExpectedStartDate(e.target.value)}
                  className="trip-detail-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="trip-detail-field">
                <label htmlFor="starting-time" className="trip-detail-label">
                  {t('planYourTrip.startingTime') || 'Starting Time'}
                </label>
                <input
                  type="time"
                  id="starting-time"
                  value={startingTime}
                  onChange={(e) => setStartingTime(e.target.value)}
                  className="trip-detail-input"
                />
              </div>
              <div className="trip-detail-field">
                <label htmlFor="guest-count" className="trip-detail-label">
                  {t('planYourTrip.guestCount') || 'Guest Count'}
                </label>
                <input
                  type="number"
                  id="guest-count"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  onBlur={() => {
                    const num = parseInt(guestCount, 10)
                    if (guestCount === '' || Number.isNaN(num)) setGuestCount('1')
                    else if (num < 1) setGuestCount('1')
                    else if (num > 50) setGuestCount('50')
                  }}
                  className="trip-detail-input"
                  min={1}
                  max={50}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="vehicle-selection-container">
            <label htmlFor="vehicle-select" className="vehicle-select-label">
              {t('planYourTrip.selectVehicle')}
            </label>
            <select
              id="vehicle-select"
              value={selectedVehicle?.id || ''}
              onChange={(e) => {
                const vehicle = vehicles.find((v) => v.id === e.target.value)
                setSelectedVehicle(vehicle || null)
              }}
              className="vehicle-select"
            >
              <option value="">-- Select a vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicleType} - {vehicle.passengerCount} passenger
                  {vehicle.passengerCount !== 1 ? 's' : ''} - LKR{' '}
                  {vehicle.lkrPerKilometer.toFixed(2)}/km
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <div className="vehicle-selected-info">
                <div className="vehicle-selected-title">
                  Selected: {selectedVehicle.vehicleType}
                </div>
                <div className="vehicle-selected-detail">
                  👥 Passenger Count: <strong>{selectedVehicle.passengerCount}</strong>
                </div>
                <div className="vehicle-selected-detail-spaced">
                  💰 Cost per Kilometer:{' '}
                  <strong>LKR {selectedVehicle.lkrPerKilometer.toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="plan-stepper">
            {/* Start Point */}
            <div
              className={`stepper-step ${currentStep === 'start' ? 'active' : points.find((p) => p.type === 'start') ? 'completed' : ''}`}
            >
              <div className="step-number">
                {points.find((p) => p.type === 'start') ? '✓' : '1'}
              </div>
              <div className="step-content">
                <h3>{t('planYourTrip.steps.start') || 'Your Location'}</h3>
                {currentStep === 'start' && (
                  <>
                    <div className="step-input">
                      <input
                        ref={(el) => setAutocompleteInput(el)}
                        type="text"
                        placeholder={t('planYourTrip.steps.start') || 'Your Location'}
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value)
                          if (locationError) {
                            setLocationError(null)
                          }
                        }}
                        className="location-search-input"
                      />
                    </div>
                    <div className="location-buttons-container">
                      <button
                        onClick={getUserLocation}
                        disabled={isGettingLocation || !mapLoaded}
                        className="get-location-button"
                        type="button"
                      >
                        {isGettingLocation
                          ? t('planYourTrip.gettingLocation')
                          : t('planYourTrip.useCurrentLocation')}
                      </button>
                    </div>
                    {locationError && (
                      <div
                        className="location-error-message"
                        style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}
                      >
                        {locationError}
                      </div>
                    )}
                  </>
                )}
                {points.find((p) => p.type === 'start') && (
                  <div className="step-point">
                    <div className="point-info">
                      <strong>{points.find((p) => p.type === 'start')?.name}</strong>
                      <p>{points.find((p) => p.type === 'start')?.address}</p>
                      {points.find((p) => p.type === 'start')?.durationToNext && (
                        <p className="point-duration-distance">
                          ⏱️ {points.find((p) => p.type === 'start')?.durationToNext}
                          {points.find((p) => p.type === 'start')?.distanceToNext && (
                            <> • 📍 {points.find((p) => p.type === 'start')?.distanceToNext}</>
                          )}
                        </p>
                      )}
                      {(() => {
                        const startPoint = points.find((p) => p.type === 'start')
                        if (!startPoint) return null
                        // For "Your Location" (start point), only show details if it's from a visiting place
                        // Don't show default details for manually typed start points
                        if (!startPoint.visitingPlaceId) {
                          // Manually typed start point - don't show default details
                          return null
                        }

                        // Show details only for visiting places
                        const stayDuration = startPoint.stayDuration ?? 0
                        const stayCost = startPoint.stayCost ?? 0
                        const costPerKm =
                          selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
                        const distanceInKm = startPoint.distanceInKm ?? 0
                        const totalCost = startPoint.totalCost ?? 0

                        if (stayDuration === 0 && stayCost === 0 && totalCost === 0) return null

                        return (
                          <div className="point-details-container">
                            {stayDuration > 0 && (
                              <div>
                                ⏱️ {t('planYourTrip.stayDuration')}: {formatDuration(stayDuration)}
                              </div>
                            )}
                            {stayCost > 0 && (
                              <div>
                                💰 {t('planYourTrip.stayCost')}: {formatCurrency(stayCost)}
                              </div>
                            )}
                            {distanceInKm > 0 && (
                              <>
                                <div>
                                  📍 {t('planYourTrip.distance')}: {distanceInKm.toFixed(2)} km
                                </div>
                                <div>
                                  🚗 {t('planYourTrip.costPerKm')}: {formatCurrency(costPerKm)}
                                </div>
                              </>
                            )}
                            {totalCost > 0 && (
                              <div className="point-total-cost">
                                💵 Total: {formatCurrency(totalCost)}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                    <button
                      onClick={() => removePoint(points.find((p) => p.type === 'start')!.id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Add Waypoint Button - Always visible after start point */}
            {points.find((p) => p.type === 'start') &&
              !points.find((p) => p.type === 'end') &&
              currentStep !== 'waypoints' && (
                <div className="add-button-container">
                  <button onClick={addNewWaypoint} className="add-point-button">
                    <span className="add-icon">+</span>
                    {t('planYourTrip.addWaypoint') || 'Add Waypoint'}
                  </button>
                </div>
              )}

            {/* Waypoints */}
            {points.filter((p) => p.type === 'waypoint').length > 0 && (
              <div className="stepper-step">
                <div className="step-number">
                  {points.filter((p) => p.type === 'waypoint').length}
                </div>
                <div className="step-content">
                  <h3>{t('planYourTrip.steps.waypoints') || 'Waypoints'}</h3>
                  {points
                    .filter((p) => p.type === 'waypoint')
                    .map((point, index) => (
                      <div key={point.id} className="step-point">
                        <div className="point-info">
                          <strong>{getPointLabel(point, index + 1)}</strong>
                          <p>{point.address}</p>
                          {point.durationToNext && (
                            <p className="point-duration-distance">
                              ⏱️ {point.durationToNext}
                              {point.distanceToNext && <> • 📍 {point.distanceToNext}</>}
                            </p>
                          )}
                          {(() => {
                            // Show default details for unsaved places (use tripConfig defaults)
                            // const stayDuration =
                            //   point.stayDuration ?? tripConfig?.stayTimeInMinutes ?? 0
                            const stayDuration = 0 // Stay Duration hidden
                            // const stayCost = point.stayCost ?? tripConfig?.defaultStayCost ?? 0
                            const stayCost = 0 // Stay Cost hidden & excluded from total
                            const costPerKm =
                              selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
                            const distanceInKm = point.distanceInKm ?? 0
                            const totalCost =
                              point.totalCost ??
                              (stayCost > 0 || costPerKm > 0
                                ? stayCost + costPerKm * distanceInKm
                                : 0)

                            if (stayDuration === 0 && stayCost === 0 && totalCost === 0) return null

                            return (
                              <div className="point-details-container">
                                {/* Stay Duration hidden - uncomment to restore
                                {stayDuration > 0 && (
                                  <div>
                                    ⏱️ {t('planYourTrip.stayDuration')}:{' '}
                                    {formatDuration(stayDuration)}
                                  </div>
                                )}
                                */}
                                {/* Stay Cost hidden - uncomment to restore
                                {stayCost > 0 && (
                                  <div>💰 Stay Cost: {formatCurrency(stayCost)}</div>
                                )}
                                */}
                                {distanceInKm > 0 && (
                                  <>
                                    <div>
                                      📍 {t('planYourTrip.distance')}: {distanceInKm.toFixed(2)} km
                                    </div>
                                    <div>
                                      🚗 {t('planYourTrip.costPerKm')}: {formatCurrency(costPerKm)}
                                    </div>
                                  </>
                                )}
                                {totalCost > 0 && (
                                  <div className="point-total-cost">
                                    💵 {t('planYourTrip.total')}: {formatCurrency(totalCost)}
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                          <button
                            type="button"
                            className="waypoint-hotels-btn"
                            onClick={() => openHotelsForWaypoint(point, index)}
                          >
                            🏨 Hotels For Accommodations
                          </button>
                        </div>
                        <button onClick={() => removePoint(point.id)} className="remove-btn">
                          ×
                        </button>
                      </div>
                    ))}
                  {!points.find((p) => p.type === 'end') && currentStep !== 'waypoints' && (
                    <div className="add-button-container">
                      <button onClick={addNewWaypoint} className="add-point-button">
                        <span className="add-icon">+</span>
                        {t('planYourTrip.addWaypoint') || 'Add Waypoint'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add Waypoint Input - Show when actively adding */}
            {currentStep === 'waypoints' &&
              points.find((p) => p.type === 'start') &&
              !points.find((p) => p.type === 'end') && (
                <div className="stepper-step active">
                  <div className="step-number">+</div>
                  <div className="step-content">
                    <h3>{t('planYourTrip.steps.addWaypoint') || 'Add New Waypoint'}</h3>
                    <div className="step-input">
                      <input
                        ref={(el) => setAutocompleteInput(el)}
                        type="text"
                        placeholder={
                          t('planYourTrip.searchPlaceholder') || 'Search for a location...'
                        }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="location-search-input"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && typedLocation) {
                            handleAddTypedLocation()
                          }
                        }}
                      />
                    </div>
                    {typedLocation && (
                      <div className="add-point-button-wrapper">
                        <button
                          onClick={handleAddTypedLocation}
                          className="add-point-button add-point-button-full-width"
                        >
                          Add Point
                        </button>
                      </div>
                    )}
                    {isGeocoding && <p className="geocoding-message">Finding location...</p>}
                    <div className="button-flex-container">
                      <button
                        onClick={() => {
                          // Clear all waypoints from the map, keep only start and end points
                          setPoints((prev) => {
                            const startPoint = prev.find((p) => p.type === 'start')
                            const endPoint = prev.find((p) => p.type === 'end')
                            return [
                              ...(startPoint ? [startPoint] : []),
                              ...(endPoint ? [endPoint] : []),
                            ]
                          })
                          setCurrentStep('complete')
                          setSearchValue('')
                          setTypedLocation(null)
                          closePlacesPopup()
                          setReferenceLocationForNearby(null)
                          if (autocompleteInput) {
                            autocompleteInput.value = ''
                          }
                        }}
                        className="skip-button button-flex-item"
                      >
                        {t('planYourTrip.cancel') || 'Cancel'}
                      </button>
                      <button onClick={addEndPoint} className="skip-button button-flex-item">
                        {t('planYourTrip.skipToEnd') || 'Skip to End Point'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* End Point */}
            {points.find((p) => p.type === 'start') && (
              <div
                className={`stepper-step ${currentStep === 'end' ? 'active' : points.find((p) => p.type === 'end') ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {points.find((p) => p.type === 'end')
                    ? '✓'
                    : points.filter((p) => p.type === 'waypoint').length + 2}
                </div>
                <div className="step-content">
                  <h3>{t('planYourTrip.steps.end') || 'End Point'}</h3>
                  {!points.find((p) => p.type === 'end') ? (
                    <>
                      <div className="step-input">
                        <input
                          ref={(el) => {
                            if (currentStep === 'end' && el) {
                              setAutocompleteInput(el)
                            }
                          }}
                          type="text"
                          placeholder={
                            t('planYourTrip.searchPlaceholder') || 'Search for a location...'
                          }
                          value={currentStep === 'end' ? searchValue : ''}
                          onChange={(e) => {
                            if (currentStep === 'end') {
                              setSearchValue(e.target.value)
                            }
                          }}
                          onFocus={() => {
                            if (!points.find((p) => p.type === 'end')) {
                              setCurrentStep('end')
                              isSelectingEndpointRef.current = true
                            }
                          }}
                          className="location-search-input"
                        />
                      </div>
                      {currentStep === 'end' && typedLocation && (
                        <div className="add-point-button-wrapper">
                          <button
                            onClick={handleAddTypedLocationAsEndpoint}
                            className="add-point-button add-point-button-full-width"
                          >
                            Add Endpoint
                          </button>
                        </div>
                      )}
                      {currentStep === 'end' && (
                        <button
                          onClick={() => {
                            setCurrentStep('complete')
                            setSearchValue('')
                            setTypedLocation(null)
                            isSelectingEndpointRef.current = false
                          }}
                          className="skip-button"
                        >
                          {t('planYourTrip.cancel') || 'Cancel'}
                        </button>
                      )}
                    </>
                  ) : null}
                  {points.find((p) => p.type === 'end') && (
                    <div className="step-point">
                      <div className="point-info">
                        <strong>{points.find((p) => p.type === 'end')?.name}</strong>
                        <p>{points.find((p) => p.type === 'end')?.address}</p>
                        {(() => {
                          const endPoint = points.find((p) => p.type === 'end')
                          if (!endPoint) return null

                          // End point: do not show or use stay duration / stay cost (only distance and vehicle cost)
                          const costPerKm =
                            selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
                          const distanceInKm = endPoint.distanceInKm ?? 0
                          const totalCost =
                            endPoint.totalCost ?? (costPerKm > 0 ? costPerKm * distanceInKm : 0)

                          if (distanceInKm === 0 && totalCost === 0) return null

                          return (
                            <div className="point-details-container">
                              {distanceInKm > 0 && (
                                <>
                                  <div>
                                    📍 {t('planYourTrip.distance')}: {distanceInKm.toFixed(2)} km
                                  </div>
                                  <div>
                                    🚗 {t('planYourTrip.costPerKm')}: {formatCurrency(costPerKm)}
                                  </div>
                                </>
                              )}
                              {totalCost > 0 && (
                                <div className="point-total-cost">
                                  💵 {t('planYourTrip.total')}: {formatCurrency(totalCost)}
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                      <button
                        onClick={() => removePoint(points.find((p) => p.type === 'end')!.id)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Search Vehicles Button - shown when a vehicle type is selected */}
            {selectedVehicle && (
              <div className="vehicle-actions-container">
                <div className="search-vehicles-btn-container">
                  <button
                    type="button"
                    className="search-vehicles-btn"
                    onClick={() => setShowVehicleSearchPopup(true)}
                  >
                    🚗 {t('planYourTrip.searchVehicles') || 'Search Vehicles'}
                  </button>
                </div>
                
                <div className="get-summary-btn-container">
                  <button
                    type="button"
                    className="get-summary-btn"
                    onClick={handleGetFullSummary}
                    disabled={isSendingEmail}
                  >
                    📄 {isSendingEmail ? t('planYourTrip.sending') : t('planYourTrip.getFullSummary') || 'Get Full Trip Summary'}
                  </button>
                </div>
              </div>
            )}

            {/* Full Trip Summary - under End Point when route exists and requested */}
            {showSummaryRequested && points.length >= 1 &&
              points.find((p) => p.type === 'end') &&
              (totalDuration || totalDistance) &&
              (() => {
                const totalStayMinutes = points
                  .filter((point) => point.type !== 'start' && point.type !== 'end')
                  .reduce((sum, point) => {
                    const stayDuration =
                      point.stayDuration ?? tripConfig?.stayTimeInMinutes ?? 0
                    return sum + stayDuration
                  }, 0)
                const totalDistanceKm = totalDistance
                  ? parseFloat(totalDistance.replace(' km', ''))
                  : 0
                const totalStayCost = points
                  .filter((point) => point.type !== 'start' && point.type !== 'end')
                  .reduce((sum, point) => {
                    const stayCost = point.stayCost ?? tripConfig?.defaultStayCost ?? 0
                    return sum + stayCost
                  }, 0)
                const costPerKm =
                  selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
                const vehicleCost = totalDistanceKm * costPerKm
                const totalCost = vehicleCost + totalStayCost
                const totalTravelMinutes = Math.floor(totalDurationSeconds / 60)
                const maxTravelingMinutes = tripConfig?.travelingHoursPerDay
                  ? tripConfig.travelingHoursPerDay * 60
                  : 0
                const totalTimeMinutes = totalTravelMinutes + totalStayMinutes
                const exceedsLimit =
                  maxTravelingMinutes > 0 && totalTimeMinutes > maxTravelingMinutes
                return (
                  <div className="trip-summary-container trip-summary-under-endpoint">
                    <h4 className="trip-summary-title">
                      {t('planYourTrip.fullTripSummary') || 'Full Trip Summary'}
                    </h4>
                    {totalDuration && (
                      <p className="trip-summary-item">
                        <strong>Total Travel Duration:</strong> ⏱️ {totalDuration}
                      </p>
                    )}
                    {/* Total Stay Time hidden - uncomment to restore
                    {totalStayMinutes > 0 && (
                      <p className="trip-summary-item">
                        <strong>Total Stay Time:</strong> ⏱️ {formatDuration(totalStayMinutes)}
                      </p>
                    )}
                    */}
                    {totalDistance && (
                      <p className="trip-summary-item">
                        <strong>Total Distance:</strong> 📍 {totalDistance}
                      </p>
                    )}
                    {selectedRegisteredVehicle && (
                      <div className="trip-summary-vehicle-info">
                        <p className="trip-summary-item">
                          <strong>Vehicle:</strong> 🆔 {selectedRegisteredVehicle.plateNumber}
                        </p>
                        {(() => {
                          const url = selectedRegisteredVehicle.vehiclePhotoFront?.url || 
                                      selectedRegisteredVehicle.vehiclePhotoFront?.publicUrl || 
                                      (selectedRegisteredVehicle.vehiclePhotoFront?.filename ? `/api/media/file/${selectedRegisteredVehicle.vehiclePhotoFront.filename}` : null)
                          return url ? (
                            <img src={url} alt={selectedRegisteredVehicle.plateNumber} className="summary-vehicle-img" />
                          ) : null
                        })()}
                      </div>
                    )}
                    {totalCost > 0 && (
                      <p className="trip-summary-cost">
                        <strong>Total Cost:</strong> 💵 {formatCurrency(totalCost)}
                      </p>
                    )}
                    {totalTimeMinutes > 0 && (
                      <p className="trip-summary-item">
                        <strong>Total Time Used:</strong> ⏱️ {formatDuration(totalTimeMinutes)}
                      </p>
                    )}
                    {maxTravelingMinutes > 0 && (
                      <p
                        className={`trip-summary-time-limit ${
                          exceedsLimit ? 'exceeded' : ''
                        }`}
                      >
                        <strong>Maximum Time Allowed:</strong> ⏱️{' '}
                        {formatDuration(maxTravelingMinutes)}
                        {exceedsLimit && (
                          <span className="trip-summary-exceeded-text">
                            {' '}
                            (Exceeded by{' '}
                            {formatDuration(totalTimeMinutes - maxTravelingMinutes)})
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )
              })()}

            {/* Complete */}
            {currentStep === 'complete' && points.length >= 2 && (
              <div className="stepper-complete">
                <h3>{t('planYourTrip.complete.title') || 'Trip Planned!'}</h3>
                {(() => {
                  // Calculate total stay duration (waypoints only; exclude start and end point)
                  const startPoint = points.find((p) => p.type === 'start')
                  const totalStayMinutes = points
                    .filter((point) => point.type !== 'start' && point.type !== 'end')
                    .reduce((sum, point) => {
                      const stayDuration = point.stayDuration ?? tripConfig?.stayTimeInMinutes ?? 0
                      return sum + stayDuration
                    }, 0)

                  // Calculate total cost based on total distance
                  // Extract total distance in km from the totalDistance string (e.g., "150.5 km" -> 150.5)
                  const totalDistanceKm = totalDistance
                    ? parseFloat(totalDistance.replace(' km', ''))
                    : 0

                  // Calculate total stay cost (waypoints only; exclude start and end point)
                  const totalStayCost = points
                    .filter((point) => point.type !== 'start' && point.type !== 'end')
                    .reduce((sum, point) => {
                      const stayCost = point.stayCost ?? tripConfig?.defaultStayCost ?? 0
                      return sum + stayCost
                    }, 0)

                  // Calculate vehicle cost based on total distance
                  const costPerKm =
                    selectedVehicle?.lkrPerKilometer ?? tripConfig?.lkrPerKilometer ?? 0
                  const vehicleCost = totalDistanceKm * costPerKm

                  // Total cost = vehicle cost (based on total distance) + total stay cost
                  const totalCost = vehicleCost + totalStayCost

                  // Calculate total travel duration in minutes
                  const totalTravelMinutes = Math.floor(totalDurationSeconds / 60)

                  // Get maximum time allowed per day from trip config (this is a fixed value, not a calculation)
                  // This represents the maximum total time allowed per day (travel + stay combined)
                  const maxTravelingMinutes = tripConfig?.travelingHoursPerDay
                    ? tripConfig.travelingHoursPerDay * 60
                    : 0

                  // Calculate total time used (travel + stay) - this is the sum
                  const totalTimeMinutes = totalTravelMinutes + totalStayMinutes

                  // Check if total time used exceeds maximum allowed
                  const exceedsLimit =
                    maxTravelingMinutes > 0 && totalTimeMinutes > maxTravelingMinutes

                  return (
                    <>
                      {exceedsLimit && (
                        <div className="warning-container">
                          <p className="warning-title">⚠️ Trip Cannot Continue</p>
                          <p className="warning-message">
                            The total travel duration ({formatDuration(totalTravelMinutes)}) plus
                            total stay time ({formatDuration(totalStayMinutes)}) exceeds the maximum
                            time allowed per day ({formatDuration(maxTravelingMinutes)}). Please
                            reduce the number of waypoints or stay durations to continue.
                          </p>
                        </div>
                      )}
                      {(totalDuration ||
                        totalDistance ||
                        totalStayMinutes > 0 ||
                        totalCost > 0) && (
                        <div className="trip-summary-container">
                          <h4 className="trip-summary-title">Trip Summary</h4>
                          {totalDuration && (
                            <p className="trip-summary-item">
                              <strong>Total Travel Duration:</strong> ⏱️ {totalDuration}
                            </p>
                          )}
                          {/* Total Stay Time hidden - uncomment to restore
                          {totalStayMinutes > 0 && (
                            <p className="trip-summary-item">
                              <strong>Total Stay Time:</strong> ⏱️{' '}
                              {formatDuration(totalStayMinutes)}
                            </p>
                          )}
                          */}
                          {totalDistance && (
                            <p className="trip-summary-item">
                              <strong>Total Distance:</strong> 📍 {totalDistance}
                            </p>
                          )}
                          {selectedRegisteredVehicle && (
                            <div className="trip-summary-vehicle-info">
                              <p className="trip-summary-item">
                                <strong>Vehicle:</strong> 🆔 {selectedRegisteredVehicle.plateNumber}
                              </p>
                              {(() => {
                                const url = selectedRegisteredVehicle.vehiclePhotoFront?.url || 
                                            selectedRegisteredVehicle.vehiclePhotoFront?.publicUrl || 
                                            (selectedRegisteredVehicle.vehiclePhotoFront?.filename ? `/api/media/file/${selectedRegisteredVehicle.vehiclePhotoFront.filename}` : null)
                                return url ? (
                                  <img src={url} alt={selectedRegisteredVehicle.plateNumber} className="summary-vehicle-img" />
                                ) : null
                              })()}
                            </div>
                          )}
                          {totalCost > 0 && (
                            <p className="trip-summary-cost">
                              <strong>Total Cost:</strong> 💵 {formatCurrency(totalCost)}
                            </p>
                          )}
                          {totalTimeMinutes > 0 && (
                            <p className="trip-summary-item">
                              <strong>Total Time Used:</strong> ⏱️{' '}
                              {formatDuration(totalTimeMinutes)}
                            </p>
                          )}
                          {maxTravelingMinutes > 0 && (
                            <p
                              className={`trip-summary-time-limit ${
                                exceedsLimit ? 'exceeded' : ''
                              }`}
                            >
                              <strong>Maximum Time Allowed:</strong> ⏱️{' '}
                              {formatDuration(maxTravelingMinutes)}
                              {exceedsLimit && (
                                <span className="trip-summary-exceeded-text">
                                  {' '}
                                  (Exceeded by{' '}
                                  {formatDuration(totalTimeMinutes - maxTravelingMinutes)})
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}
                <p>
                  {t('planYourTrip.complete.description') ||
                    'Your route has been planned. You can continue adding more waypoints or submit your trip.'}
                </p>
                <button
                  onClick={() => {
                    setCurrentStep('waypoints')
                    setPoints([...points])
                  }}
                  className="add-more-button"
                >
                  {t('planYourTrip.complete.addMore') || 'Add More Points'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Places and Hotels Side-by-Side Panel */}
      {showPlacesPopup && (
        <div 
          className="places-popup-overlay" 
          onClick={() => {
            // Close popup without clearing the field - preserve Google Maps autocomplete value
            closePlacesPopup()
          }}
        >
          <div className="places-popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="places-popup-header">
              <h3 className="places-popup-title">
                📍 {t('planYourTrip.nearbyLocations') || 'Nearby Locations (within 20km)'}
              </h3>
              <button
                className="places-popup-close"
                onClick={() => {
                  // Close popup without clearing the field - preserve Google Maps autocomplete value
                  closePlacesPopup()
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="places-popup-content">
              <div className="locations-panel">
                <h4 className="panel-title">📍 {t('planYourTrip.locations') || 'Locations'}</h4>
                <div className="saved-places-list">
                  {nearbyPlaces.length > 0 ? (
                    nearbyPlaces.map((place) => (
                      <div 
                        key={place.id} 
                        className="saved-place-card clickable-card"
                        onClick={() => handleSelectNearbyPlace(place)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="saved-place-info">
                          <strong className="saved-place-name">{place.name}</strong>
                          <span className="saved-place-distance">
                            {place.distance.toFixed(1)} {t('planYourTrip.away') || 'km away'}
                          </span>
                          <span className="saved-place-coordinates">
                            📍 {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectNearbyPlace(place)
                          }}
                          className="add-point-btn"
                        >
                          Add Point
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-items-message">{t('planYourTrip.noLocationsFound') || 'No locations found in this area'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waypoint Hotels Modal */}
      {showWaypointHotels && waypointHotelsFor && (
        <div className="places-popup-overlay" onClick={() => setShowWaypointHotels(false)}>
          <div className="places-popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="places-popup-header">
              <h3 className="places-popup-title">
                🏨 {t('planYourTrip.hotels') || 'Hotels'} — {waypointHotelsFor.label}
              </h3>
              <button
                className="places-popup-close"
                onClick={() => setShowWaypointHotels(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="places-popup-content">
              <div className="hotels-panel">
                <h4 className="panel-title">🏨 {t('planYourTrip.hotels') || 'Hotels'}</h4>
                <div className="saved-places-list">
                  {waypointHotels.length > 0 ? (
                    waypointHotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="saved-place-card hotel-card clickable-card"
                        onClick={() => handleSelectNearbyHotel(hotel)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="saved-place-info">
                          <strong className="saved-place-name">{hotel.hotelName}</strong>
                          <span className="hotel-rating">
                            {'⭐'.repeat(parseInt(hotel.starRating))} {hotel.starRating} {t('planYourTrip.starHotel') || 'Star Hotel'}
                          </span>
                          <span className="saved-place-distance">{hotel.distance.toFixed(1)} {t('planYourTrip.away') || 'km away'}</span>
                          <span className="saved-place-coordinates">
                            📍 {hotel.latitude.toFixed(6)}, {hotel.longitude.toFixed(6)}
                          </span>
                        </div>
                        <div className="hotel-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectNearbyHotel(hotel)
                            }}
                            className="add-point-btn"
                          >
                            {t('planYourTrip.addPoint') || 'Add Point'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedHotel(hotel)
                              setShowHotelDetails(true)
                            }}
                            className="more-details-btn"
                          >
                            {t('planYourTrip.moreDetails') || 'More Details'}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-items-message">{t('planYourTrip.noHotelsFound') || 'No hotels found in this area'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Details Modal */}
      {showHotelDetails && selectedHotel && (
        <div className="places-popup-overlay" onClick={() => setShowHotelDetails(false)}>
          <div className="places-popup-modal hotel-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="places-popup-header">
              <h3 className="places-popup-title">{selectedHotel.hotelName}</h3>
              <button
                className="places-popup-close"
                onClick={() => setShowHotelDetails(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="hotel-details-content">
              <div className="hotel-details-section">
                <div className="hotel-rating-large">
                  {'⭐'.repeat(parseInt(selectedHotel.starRating))} {selectedHotel.starRating} {t('planYourTrip.starHotel') || 'Star Hotel'}
                </div>
                <div className="hotel-location">
                  <strong>📍 Location:</strong> {selectedHotel.latitude.toFixed(6)}, {selectedHotel.longitude.toFixed(6)}
                </div>
                {selectedHotel.description && (
                  <div className="hotel-description">
                    <strong>Description:</strong>
                    <p>
                      {(() => {
                        if (language === 'EN' || !selectedHotel.descriptionTranslations) {
                          return selectedHotel.description
                        }
                        const langMap: Record<string, keyof NonNullable<typeof selectedHotel.descriptionTranslations>> = {
                          DE: 'de',
                          FR: 'fr',
                          NL: 'nl',
                          IT: 'it',
                          ES: 'es',
                          RU: 'ru',
                        }
                        const langKey = langMap[language]
                        return (langKey && selectedHotel.descriptionTranslations?.[langKey]) || selectedHotel.description
                      })()}
                    </p>
                  </div>
                )}
                {selectedHotel.images && selectedHotel.images.length > 0 && (
                  <div className="hotel-images">
                    <strong>Images:</strong>
                    <div className="hotel-images-grid">
                      {selectedHotel.images.map((img, idx) => {
                        const imageUrl = img.image?.url || img.image?.publicUrl || (img.image?.filename ? `/api/media/file/${img.image.filename}` : null)
                        return imageUrl ? (
                          <img key={idx} src={imageUrl} alt={`${selectedHotel.hotelName} - Image ${idx + 1}`} className="hotel-image" />
                        ) : null
                      })}
                    </div>
                  </div>
                )}
                {selectedHotel.packages && selectedHotel.packages.length > 0 && (
                  <div className="hotel-packages">
                    <strong>📦 Packages & Room Prices:</strong>
                    <div className="hotel-packages-grid">
                      {selectedHotel.packages.map((pkg, idx) => (
                        <div key={idx} className="hotel-package-card">
                          <div className="hotel-package-header">
                            <h4 className="hotel-package-name">{pkg.packageName}</h4>
                            <div className="hotel-package-price">
                              LKR {pkg.roomPricePerNight.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / night
                            </div>
                          </div>
                          {pkg.packageDescription && (
                            <p className="hotel-package-description">{pkg.packageDescription}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Vehicle Search Popup Modal */}
      {showVehicleSearchPopup && selectedVehicle && (() => {
        // Filter vehicles by the same vehicleType as the selected vehicle
        const matchingVehicles = vehicles.filter(
          (v) => v.vehicleType.toLowerCase() === selectedVehicle.vehicleType.toLowerCase()
        )
        return (
          <div
            className="places-popup-overlay"
            onClick={() => setShowVehicleSearchPopup(false)}
          >
            <div
              className="places-popup-modal vehicle-search-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="places-popup-header">
                <h3 className="places-popup-title">
                  🚗 {t('planYourTrip.availableVehicles') || 'Available Vehicles'}
                </h3>
                <button
                  type="button"
                  className="places-popup-close"
                  onClick={() => setShowVehicleSearchPopup(false)}
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="vehicle-search-popup-body">
                <p className="vehicle-search-subtitle">
                  {t('planYourTrip.showingVehicles') || 'Showing all vehicles available for your trip'}
                </p>

                {registeredVehicles.length === 0 ? (
                  <div className="no-items-message">
                    {t('planYourTrip.noRegisteredVehicles') || 'No registered vehicles found.'}
                  </div>
                ) : (
                  <div className="vehicle-search-grid">
                    {registeredVehicles.map((vehicle) => {
                      const frontPhotoUrl = vehicle.vehiclePhotoFront?.url || vehicle.vehiclePhotoFront?.publicUrl || (vehicle.vehiclePhotoFront?.filename ? `/api/media/file/${vehicle.vehiclePhotoFront.filename}` : null)
                      
                      return (
                        <div
                          key={vehicle.id}
                          className={`vehicle-search-card ${selectedRegisteredVehicle?.id === vehicle.id ? 'vehicle-search-card--selected' : ''}`}
                        >
                          <div 
                            className="vehicle-search-card-image"
                            onClick={() => {
                              setViewingVehicle(vehicle)
                              setShowVehicleDetailsModal(true)
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {frontPhotoUrl ? (
                              <img src={frontPhotoUrl} alt={vehicle.plateNumber} />
                            ) : (
                              <div className="vehicle-search-card-icon">🚗</div>
                            )}
                            <div className="image-overlay-hint">{t('planYourTrip.clickToViewPhotos') || 'Click to view all photos'}</div>
                          </div>
                          <div className="vehicle-search-card-info">
                            <div className="vehicle-search-card-type">{vehicle.plateNumber}</div>
                            <div className="vehicle-search-card-detail">
                              <strong>{t('planYourTrip.model') || 'Model'}:</strong> <span>{vehicle.model}</span>
                            </div>
                            <div className="vehicle-search-card-detail">
                              <strong>{t('planYourTrip.type') || 'Type'}:</strong> <span>{vehicle.vehicleType}</span>
                            </div>
                          </div>
                          <div className="vehicle-search-card-actions">
                            {selectedRegisteredVehicle?.id === vehicle.id ? (
                              <span className="vehicle-search-selected-badge">✓ {t('planYourTrip.added') || 'Added'}</span>
                            ) : (
                              <button
                                type="button"
                                className="vehicle-search-select-btn"
                                onClick={() => {
                                  setSelectedRegisteredVehicle(vehicle)
                                  // Also try to find matching config for pricing
                                  const config = vehicles.find(v => v.vehicleType.toLowerCase() === vehicle.vehicleType.toLowerCase())
                                  if (config) setSelectedVehicle(config)
                                  setShowVehicleSearchPopup(false)
                                }}
                              >
                                {t('planYourTrip.addVehicle') || 'Add Vehicle'}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}
      {/* Vehicle Details Modal (4 Photos) */}
      {showVehicleDetailsModal && viewingVehicle && (
        <div className="places-popup-overlay" onClick={() => setShowVehicleDetailsModal(false)}>
          <div className="places-popup-modal vehicle-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="places-popup-header">
              <h3 className="places-popup-title">
                🚗 {viewingVehicle.plateNumber} - {viewingVehicle.model}
              </h3>
              <button
                type="button"
                className="places-popup-close"
                onClick={() => setShowVehicleDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="vehicle-details-popup-body">
              <div className="vehicle-photos-grid">
                {[
                  { label: 'Front', img: viewingVehicle.vehiclePhotoFront },
                  { label: 'Back', img: viewingVehicle.vehiclePhotoBack },
                  { label: 'Left Side', img: viewingVehicle.vehiclePhotoLeft },
                  { label: 'Right Side', img: viewingVehicle.vehiclePhotoRight },
                ].map((photo, idx) => {
                  const url = photo.img?.url || photo.img?.publicUrl || (photo.img?.filename ? `/api/media/file/${photo.img.filename}` : null)
                  return (
                    <div key={idx} className="vehicle-photo-item">
                      <div className="vehicle-photo-label">{photo.label}</div>
                      {url ? (
                        <img src={url} alt={`${viewingVehicle.plateNumber} ${photo.label}`} className="vehicle-photo-img" />
                      ) : (
                        <div className="no-photo-placeholder">No Photo</div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="vehicle-details-actions">
                <button
                  type="button"
                  className="add-vehicle-final-btn"
                  onClick={() => {
                    setSelectedRegisteredVehicle(viewingVehicle)
                    // Also try to find matching config for pricing
                    const config = vehicles.find(v => v.vehicleType.toLowerCase() === viewingVehicle.vehicleType.toLowerCase())
                    if (config) setSelectedVehicle(config)
                    setShowVehicleDetailsModal(false)
                    setShowVehicleSearchPopup(false)
                  }}
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
