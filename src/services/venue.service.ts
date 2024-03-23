import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { VenueCheckSlotByDateResponse } from 'src/dtos/response/venue.response'
import { VenueCreateRequest } from 'src/dtos/request/venue.request'
import {
  ThemeInVenueArrayResponse,
  ThemeInVenueDataResponse,
  ThemeNotAddArrayResponse
} from 'src/dtos/response/theme.response'
import {
  PackageInVenueArrayResponse,
  PackageInVenueDataResponse,
  PackageNotAddArrayResponse
} from 'src/dtos/response/package.response'
import { SlotInVenueArrayResponse, SlotNotAddArrayResponse } from 'src/dtos/response/slot.response'

export const venueService = {
  getAllVenue: (): Promise<AxiosResponse<VenueCheckSlotByDateResponse>> => {
    const url = `/api/venue/get-all`
    return axiosClient.get(url)
  },
  getAllVenueCheckSlotByDate: (date: string | null): Promise<AxiosResponse<VenueCheckSlotByDateResponse>> => {
    const url = `/api/venue/check-slot-in-venue-for-host?date=${date}`
    return axiosClient.get(url)
  },
  getAllThemeNotAdd: (id: number): Promise<AxiosResponse<ThemeNotAddArrayResponse>> => {
    const url = `/api/venue/get-theme-not-add-in-venue/${id}`
    return axiosClient.get(url)
  },
  getAllPackageNotAdd: (id: number): Promise<AxiosResponse<PackageNotAddArrayResponse>> => {
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
    formData.append('location', payload.location)
    formData.append('capacity', payload.capacity.toString())

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  createSlotInVenue: (payload: { venue_id: number; slot_id: number }): Promise<AxiosResponse<any>> => {
    const url = `/slot-in-venue/create`
    return axiosClient.post(url, { ...payload })
  },
  getAllThemeInVenueByVenueId: (id: number): Promise<AxiosResponse<ThemeInVenueArrayResponse>> => {
    const url = `/api/venue/get-theme-by-venue/${id}`
    return axiosClient.get(url)
  },
  getAllPackageInVenueByVenueId: (id: number): Promise<AxiosResponse<PackageInVenueArrayResponse>> => {
    const url = `/api/venue/get-package-by-venue/${id}`
    return axiosClient.get(url)
  },
  getAllSlotInVenueByVenueId: (id: number): Promise<AxiosResponse<SlotInVenueArrayResponse>> => {
    const url = `/api/venue/get-slot-in-venue-by-venue/${id}`
    return axiosClient.get(url)
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
