import { SlotInVenueDataResponse } from './slot.response'

export interface VenueResponse {
  id: number
  venueName: string
  venueDescription: string
  venueImgUrl: string
  location: string
  capacity: number
  slotInVenueList: SlotInVenueDataResponse[] | []
  active: boolean
}
export interface VenueCheckSlotByDateResponse {
  status: string
  message: string
  data: VenueResponse[] | []
}
