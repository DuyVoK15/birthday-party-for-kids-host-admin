import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { FilterPackageRequest, PackageCreateRequest, PackageUpdateRequest } from 'src/dtos/request/package.request'

export const packageService = {
  getAllPackage: (payload: { filter?: FilterPackageRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/package/get-all-package-for-host`
    return axiosClient.get(url, { params: payload.filter })
  },
  getPackageById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/package/get-package-for-host/${id}`
    return axiosClient.get(url)
  },
  createPackage: (payload: PackageCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/package/create-package`
    const formData = new FormData()
    formData.append('fileImg', payload.fileImage)
    formData.append('packageName', payload.packageName)
    formData.append('packageDescription', payload.packageDescription)
    formData.append('percent', payload.percent.toString())
    formData.append('packageServiceRequests', JSON.stringify(payload.packageServiceRequests))
    formData.append('packageType', payload.packageType)

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updatePackage: (request: { id: number; payload: PackageUpdateRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/package/update-package/${request.id}`
    const formData = new FormData()
    formData.append('fileImg', request.payload.fileImage)
    formData.append('packageName', request.payload.packageName)
    formData.append('packageDescription', request.payload.packageDescription)
    // formData.append('packageServiceRequests', JSON.stringify(request.payload.packageServiceRequests))
    // formData.append('packageType', request.payload.packageType)

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updatePercentOfPackage: (request: { id: number; payload: { percent: number } }): Promise<AxiosResponse<any>> => {
    const url = `/api/package/update-percent-package/${request.id}`
    const formData = new FormData()
    formData.append('percent', request.payload.percent.toString())

    return axiosClient.patch(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  enablePackage: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/package/enable/${id}`
    return axiosClient.put(url)
  },
  deletePackage: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/package/delete/${id}`
    return axiosClient.delete(url)
  }
}
