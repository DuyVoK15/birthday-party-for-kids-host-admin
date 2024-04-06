import { VenueArrayResponse, VenueObjectResponse } from './../dtos/response/venue.response'
import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import {} from 'src/dtos/response/venue.response'
import { VenueCreateRequest, VenueUpdateRequest } from 'src/dtos/request/venue.request'
import {
  ThemeInVenueArrayResponse,
  ThemeInVenueDataResponse,
  ThemeNotAddArrayResponse
} from 'src/dtos/response/theme.response'

import { SlotNotAddArrayResponse } from 'src/dtos/response/slot.response'

export const venueService = {
  getAllVenue: (): Promise<AxiosResponse<VenueArrayResponse>> => {
    const url = `/api/venue/get-all`
    return axiosClient.get(url)
  },
  getAllVenueCheckSlotByDate: (): Promise<AxiosResponse<VenueObjectResponse>> => {
    const url = `/api/venue/get-all-venue-for-host`
    return axiosClient.get(url)
  },
  getAllThemeNotAdd: (id: number): Promise<AxiosResponse<ThemeNotAddArrayResponse>> => {
    const url = `/api/venue/get-theme-not-add-in-venue/${id}`
    return axiosClient.get(url)
  },
  getAllPackageNotAdd: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/venue/get-package-not-add-in-venue/${id}`
    return axiosClient.get(url)
  },
  getAllSlotNotAdd: (id: number): Promise<AxiosResponse<SlotNotAddArrayResponse>> => {
    const url = `/api/venue/get-slot-not-add-in-venue/${id}`
    return axiosClient.get(url)
  },
  createVenue: (payload: VenueCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/venue/create-venue`
    const formData = new FormData()
    formData.append('fileImg', payload.fileImage)
    formData.append('venueName', payload.venueName)
    formData.append('venueDescription', payload.venueDescription)
    formData.append('street', payload.street)
    formData.append('ward', payload.ward)
    formData.append('district', payload.district)
    formData.append('city', payload.city)

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updateVenue: (payload: VenueUpdateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/venue/update-venue`
    const formData = new FormData()
    formData.append('fileImg', payload.fileImage)
    formData.append('venueName', payload.venueName)
    formData.append('venueDescription', payload.venueDescription)
    formData.append('street', payload.street)
    formData.append('ward', payload.ward)
    formData.append('district', payload.district)
    formData.append('city', payload.city)

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  enableVenueById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/venue/set-active-venue/${id}`
    return axiosClient.put(url)
  },
  disableVenueById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/venue/delete/${id}`
    return axiosClient.delete(url)
  }
}
