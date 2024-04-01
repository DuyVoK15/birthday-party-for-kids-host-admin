export interface ServiceCreateRequest {
  fileImage: any
  serviceName: string
  serviceDescription: string
  pricing: string
  serviceType: string
}
export interface FilterServiceRequest {
  active: boolean | null
  serviceType: string | null
}
