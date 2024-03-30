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
