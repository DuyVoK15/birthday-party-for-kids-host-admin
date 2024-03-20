import { SlotInVenueResponse, SlotOnjectResponse } from './slot.response'

export interface PartyDateObjectResponse {
  id: number
  date: string
  active: boolean
  slotInVenue: SlotInVenueResponse
}
