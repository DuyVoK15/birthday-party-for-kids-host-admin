import { PackageInVenueDataResponse } from './package.response'
import { PartyDateObjectResponse } from './partyDated.response'
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
  packageInVenueObject: PackageInVenueDataResponse
  themeInVenueObject: ThemeInVenueDataResponse
  paymentList: []
  reviewList: []
  active: boolean
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
