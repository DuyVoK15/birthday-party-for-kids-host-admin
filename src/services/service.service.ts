import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'

export const serviceService = {
  getAllService: (): Promise<AxiosResponse<any>> => {
    const url = `/api/services/getAll-service`
    return axiosClient.get(url)
  },
  getServiceById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/getId-service/${id}`
    return axiosClient.get(url)
  },
  createService: (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/api/services/create-service`
    return axiosClient.post(url, { ...payload })
  },
  updateService: (request: { id: number; payload: any }): Promise<AxiosResponse<any>> => {
    const url = `/api/services/update-service/${request.id}`
    return axiosClient.put(url, { ...request.payload })
  },
  deleteService: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/services/delete-service/${id}`
    return axiosClient.delete(url)
  }
}
