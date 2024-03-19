export interface PackageInVenueDataResponse {
  id: number
  active: boolean
  packageObject: PackageDataResponse
}

export interface PackageDataResponse {
  id: number
  packageName: string
  packageDescription: string
  packageImgUrl: string
  pricing: number
  packageServiceList: PackageServiceDataResponse[] | []
  active: boolean
}

export interface PackageServiceDataResponse {
  id: number
  count: number
  pricing: number
  active: boolean
}
