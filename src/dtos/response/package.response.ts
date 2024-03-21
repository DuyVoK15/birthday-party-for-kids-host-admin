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

export interface PackageInVenueDataResponse {
  id: number
  active: boolean
  apackage: PackageDataResponse
}

export interface PackageInVenueArrayResponse {
  data: PackageInVenueDataResponse[] | []
}

export interface PackageInVenueObjectResponse {
  data: PackageInVenueDataResponse
}

export interface PackageNotAddArrayResponse {
  data: PackageDataResponse[] | []
}
