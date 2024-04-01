import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { headerFormData } from './axiosClient/headerConstant'
import { FilterServiceRequest, ServiceCreateRequest } from 'src/dtos/request/service.request'

export const serviceService = {
  getAllService: (payload: { filter?: FilterServiceRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/services/getAll-service-for-host`
    return axiosClient.get(url, { params: payload.filter })
  },
  getServiceById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/get-services-id-for-host/${id}`
    return axiosClient.get(url)
  },
  createService: (payload: ServiceCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/services/create-service`
    const formData = new FormData()
    formData.append('fileImg', payload.fileImage)
    formData.append('serviceName', payload.serviceName)
    formData.append('serviceDescription', payload.serviceDescription)
    formData.append('pricing', payload.pricing)
    formData.append('serviceType', payload.serviceType)

    return axiosClient.post(url, formData, { headers: headerFormData })
  },
  updateService: (request: { id: number; payload: ServiceCreateRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/services/update-service/${request.id}`
    const formData = new FormData()
    formData.append('fileImg', request.payload.fileImage)
    formData.append('serviceName', request.payload.serviceName)
    formData.append('serviceDescription', request.payload.serviceDescription)
    formData.append('pricing', request.payload.pricing)
    formData.append('serviceType', request.payload.serviceType)

    return axiosClient.put(url, formData, { headers: headerFormData })
  },
  deleteService: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/delete-service/${id}`
    return axiosClient.delete(url)
  },
  enableService: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/delete-service/${id}`
    return axiosClient.put(url)
  },
  disableService: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/delete-service/${id}`
    return axiosClient.delete(url)
  }
}
