import { PARTY_BOOKING_STATUS } from 'src/enums/partyBooking'
import { AccountDataResponse } from './auth.response'
import { PackageDataResponse } from './package.response'
import { PartyDatedDataResponse } from './partyDated.response'
import { SlotInRoomDataResponse } from './slot.response'
import { ThemeInVenueDataResponse } from './theme.response'
import { UpgradeServiceDataResponse } from './upgradeService.response'
import { VenueDataResponse } from './venue.response'

export interface PackageInBookingDataResponse {
  id: number
  createAt: string
  updateAt: string
  deleteAt: string
  apackage: PackageDataResponse
}

export interface PartyBookingDataResponse {
  id: number
  createAt: string
  updateAt: string
  deleteAt: string
  kidName: string
  kidDOB: string
  reservationAgent: string
  email: string
  phone: string
  status: PARTY_BOOKING_STATUS
  participantAmount: number
  date: string
  account: AccountDataResponse
  upgradeServices: UpgradeServiceDataResponse[] | []
  packageInBookings: PackageInBookingDataResponse[] | []
  review: any
  slotInRoom: SlotInRoomDataResponse
  active: boolean
  venueObject: VenueDataResponse
  isPayment: boolean
  totalPrice: number
  remainingMoney: number
  deposit: number
}

export interface PartyBookingObjectResponse {
  status: string
  message: string
  data: PartyBookingDataResponse
}

export interface PartyBookingArrayResponse {
  status: string
  message: string
  data: PartyBookingDataResponse[] | []
  metadata: {
    totalItems: number,
    totalPages: number
  }
}
