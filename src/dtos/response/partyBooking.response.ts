import { PackageInVenueDataResponse } from './package.response'
import { PartyDatedDataResponse } from './partyDated.response'
import { SlotInVenueDataResponse } from './slot.response'
import { ThemeInVenueDataResponse } from './theme.response'

export interface PartyBookingDataResponse {
  id: number
  kidName: string
  kidDOB: string
  email: string
  phone: string
  status: string
  upgradeServices: []
  partyDated: PartyDatedDataResponse
  packageInVenue: PackageInVenueDataResponse
  themeInVenue: ThemeInVenueDataResponse
  slotInVenueObject: SlotInVenueDataResponse
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
