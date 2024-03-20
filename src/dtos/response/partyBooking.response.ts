import { PackageInVenueDataResponse } from './package.response'
import { PartyDateObjectResponse } from './partyDated.response'
import { SlotInVenueResponse } from './slot.response'
import { ThemeInVenueDataResponse } from './theme.response'

export interface PartyBookingDataResponse {
  id: number
  kidName: string
  kidDOB: string
  email: string
  phone: string
  status: string
  upgradeServices: []
  partyDated: PartyDateObjectResponse
  packageInVenue: PackageInVenueDataResponse
  themeInVenue: ThemeInVenueDataResponse
  slotInVenueObject: SlotInVenueResponse
  paymentList: []
  reviewList: []
  active: boolean
  createAt: string
  updateAt: string
  deleteAt: string
}

export interface PartyBookingObjectResponse {
  status: string
  message: string
  data: PartyBookingDataResponse
}

export interface PartyBookingResponse {
  status: string
  message: string
  data: PartyBookingDataResponse[] | []
}
