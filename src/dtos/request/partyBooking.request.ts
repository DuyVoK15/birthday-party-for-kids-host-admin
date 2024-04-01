import { PARTY_BOOKING_STATUS } from 'src/enums/partyBooking'

export interface FilterBoookingRequest {
  date?: string | null
  status?: PARTY_BOOKING_STATUS | null
}
