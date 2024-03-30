export interface ServiceDataResponse {
  id: number
  serviceName: string
  serviceImgUrl: string
  serviceDescription: string
  serviceType: string
  pricing: number
  active: boolean
  createAt: string
  updateAt: string
  deleteAt: string
}
export interface ServiceArrayResponse {
  status: string
  message: string
  data: ServiceDataResponse[] | []
}
export interface ServiceObjectResponse {
  status: string
  message: string
  data: ServiceDataResponse
}
