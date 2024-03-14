import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { headerFormData } from './axiosClient/headerConstant'
import { ServiceCreateRequest } from 'src/dtos/request/service.request'

export const serviceService = {
  getAllService: (): Promise<AxiosResponse<any>> => {
    const url = `/api/services/getAll-service`
    return axiosClient.get(url)
  },
  getServiceById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/getId-service/${id}`
    return axiosClient.get(url)
  },
  createService: (payload: ServiceCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/services/create-service`
    const formData = new FormData()
    formData.append('fileImg', payload.fileImage)
    formData.append('serviceName', payload.serviceName)
    formData.append('description', payload.serviceDescription)
    formData.append('pricing', payload.pricing)

    return axiosClient.post(url, formData, { headers: headerFormData })
  },
  updateService: (request: { id: number; payload: ServiceCreateRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/services/update-service/${request.id}`
    const formData = new FormData()
    formData.append('fileImg', request.payload.fileImage)
    formData.append('serviceName', request.payload.serviceName)
    formData.append('description', request.payload.serviceDescription)
    formData.append('pricing', request.payload.pricing)

    return axiosClient.put(url, formData, { headers: headerFormData })
  },
  deleteService: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/delete-service/${id}`
    return axiosClient.delete(url)
  }
}
