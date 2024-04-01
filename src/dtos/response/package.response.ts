import { ServiceDataResponse } from './service.response'
import { VenueDataResponse } from './venue.response'

export interface PackageDataResponse {
  id: number
  packageName: string
  packageDescription: string
  packageImgUrl: string
  packageType: string
  percent: number
  pricing: number
  packageServiceList: PackageServiceDataResponse[] | []
  active: boolean
  venue: VenueDataResponse
}

export interface PackageServiceDataResponse {
  id: number
  count: number
  pricing: number
  active: boolean
  services: ServiceDataResponse
}

export interface PackageArrayResponse {
  status: string
  message: string
  data: PackageDataResponse[] | []
}

export interface PackageObjectResponse {
  status: string
  message: string
  data: PackageDataResponse
}
