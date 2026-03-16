declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement | null, opts?: MapOptions)
      setCenter(latlng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
      fitBounds(bounds: LatLngBounds): void
    }

    class Marker {
      constructor(opts?: MarkerOptions)
      setMap(map: Map | null): void
      addListener(eventName: string, handler: () => void): void
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions)
      open(map?: Map | null, anchor?: Marker): void
    }

    class DirectionsService {
      route(
        request: DirectionsRequest,
        callback: (result: DirectionsResult | null, status: DirectionsStatus) => void,
      ): void
    }

    class DirectionsRenderer {
      constructor(opts?: DirectionsRendererOptions)
      setMap(map: Map | null): void
      setDirections(directions: DirectionsResult): void
    }

    interface DirectionsRendererOptions {
      map?: Map | null
      polylineOptions?: PolylineOptions
    }

    interface PolylineOptions {
      strokeColor?: string
      strokeWeight?: number
      strokeOpacity?: number
    }

    class Geocoder {
      geocode(
        request: GeocoderRequest,
        callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void,
      ): void
    }

    enum GeocoderStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
    }

    interface GeocoderRequest {
      address?: string
      location?: LatLng | LatLngLiteral
      componentRestrictions?: { country?: string | string[] }
    }

    interface GeocoderResult {
      formatted_address?: string
      geometry?: {
        location?: LatLng
      }
      address_components?: AddressComponent[]
      name?: string
    }

    class LatLngBounds {
      extend(point: LatLng | LatLngLiteral): void
    }

    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions)
        getPlace(): PlaceResult
        addListener(eventName: string, handler: () => void): void
      }
    }

    namespace event {
      function clearInstanceListeners(instance: any): void
    }

    enum TravelMode {
      DRIVING = 'DRIVING',
      WALKING = 'WALKING',
      BICYCLING = 'BICYCLING',
      TRANSIT = 'TRANSIT',
    }

    enum DirectionsStatus {
      OK = 'OK',
      NOT_FOUND = 'NOT_FOUND',
      ZERO_RESULTS = 'ZERO_RESULTS',
      MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    }

    interface MapOptions {
      zoom?: number
      center?: LatLng | LatLngLiteral
      mapTypeControl?: boolean
      streetViewControl?: boolean
      fullscreenControl?: boolean
    }

    interface MarkerLabel {
      text: string
      color?: string
      fontSize?: string
      fontWeight?: string
    }

    class Size {
      constructor(width: number, height: number)
      width: number
      height: number
    }

    class Point {
      constructor(x: number, y: number)
      x: number
      y: number
    }

    interface Icon {
      url?: string
      scaledSize?: Size
      anchor?: Point
      labelOrigin?: Point
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral
      map?: Map | null
      label?: string | MarkerLabel
      icon?: string | Icon
      title?: string
    }

    interface InfoWindowOptions {
      content?: string
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }

    interface LatLng {
      lat(): number
      lng(): number
    }

    interface DirectionsRequest {
      origin: LatLng | LatLngLiteral | string
      destination: LatLng | LatLngLiteral | string
      waypoints?: DirectionsWaypoint[]
      travelMode?: TravelMode
    }

    interface DirectionsWaypoint {
      location: LatLng | LatLngLiteral
      stopover: boolean
    }

    interface DirectionsResult {
      routes: DirectionsRoute[]
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[]
    }

    interface DirectionsLeg {
      distance?: { text: string; value: number }
      duration?: { text: string; value: number }
      end_address: string
      start_address: string
      steps: DirectionsStep[]
    }

    interface DirectionsStep {
      distance: { text: string; value: number }
      duration: { text: string; value: number }
      end_location: LatLng
      start_location: LatLng
      instructions: string
    }

    interface AutocompleteOptions {
      componentRestrictions?: { country: string | string[] }
      fields?: string[]
    }

    interface AddressComponent {
      long_name: string
      short_name: string
      types: string[]
    }

    interface PlaceResult {
      name?: string
      formatted_address?: string
      address_components?: AddressComponent[]
      geometry?: {
        location?: LatLng
      }
    }
  }
}
