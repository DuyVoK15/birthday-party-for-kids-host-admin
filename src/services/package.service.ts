import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { PackageCreateRequest } from 'src/dtos/request/package.request'

export const packageService = {
  getAllPackage: (): Promise<AxiosResponse<any>> => {
    const url = `/api/package/get-all`
    return axiosClient.get(url)
  },
  getPackageById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/package/get-id/${id}`
    return axiosClient.get(url)
  },
  createPackage: (payload: PackageCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/package/create-package`
    const formData = new FormData()
    formData.append('fileImg', payload.fileImage)
    formData.append('packageName', payload.packageName)
    formData.append('packageDescription', payload.packageDescription)
    formData.append('pricing', payload.pricing)

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updatePackage: (request: { id: number; payload: PackageCreateRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/package/update-package/${request.id}`
    const formData = new FormData()
    formData.append('fileImg', request.payload.fileImage || null)
    formData.append('packageName', request.payload.packageName)
    formData.append('packageDescription', request.payload.packageDescription)
    formData.append('pricing', request.payload.pricing)

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  deletePackage: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/package/delete/${id}`
    return axiosClient.delete(url)
  }
}
