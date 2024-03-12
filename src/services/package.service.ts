import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'

export const packageService = {
  getAllPackage: (): Promise<AxiosResponse<any>> => {
    const url = `/api/package/get-all`
    return axiosClient.get(url)
  },
  getPackageById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/package/get-id/${id}`
    return axiosClient.get(url)
  },
  createPackage: (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/api/package/create`
    return axiosClient.post(url, { ...payload })
  },
  updatePackage: (request: {
    id: number
    payload: {
      packageName: string
      packageImgUrl: string
      pricing: number
    }
  }): Promise<AxiosResponse<any>> => {
    const url = `/api/package/update/${request.id}`
    return axiosClient.put(url, { ...request.payload })
  },
  deletePackage: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/package/delete/${id}`
    return axiosClient.delete(url)
  }
}
