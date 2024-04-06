export interface VenueCreateRequest {
  fileImage: any
  venueName: string
  venueDescription: string
  street: string
  ward: string
  district: string
  city: string
}

export interface VenueUpdateRequest {
  fileImage?: any
  venueName: string
  venueDescription: string
  street: string
  ward: string
  district: string
  city: string
}

