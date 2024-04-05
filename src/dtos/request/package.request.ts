export interface PackageServiceRequest {
  serviceId: number
  count: number
}
export interface PackageCreateRequest {
  fileImage: any
  packageName: string
  packageDescription: string
  percent: number
  packageServiceRequests: PackageServiceRequest[] | []
  packageType: string
}

export interface PackageUpdateRequest {
  fileImage?: any
  packageName?: any
  packageDescription?: any
  // percent?: any
  // packageServiceRequests?: PackageServiceRequest[] | []
  // packageType?: any
}

export interface FilterPackageRequest {
  active?: boolean | null
  packageType?: string | null
}
