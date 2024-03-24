import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'

export const partyBookingService = {
  updateThemeInVenueInBooking: (payload: {
    partyBookingId: number
    themeInVenueId: number
  }): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/update-theme-in-venue/${payload.partyBookingId}/${payload.themeInVenueId}`
    return axiosClient.patch(url)
  },
  updatePackageInVenueInBooking: (payload: {
    partyBookingId: number
    packageInVenueId: number
  }): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/update-package-in-venue/${payload.partyBookingId}/${payload.packageInVenueId}`
    return axiosClient.patch(url)
  },
  completeBooking: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/complete-booking-for-host/${id}`
    return axiosClient.put(url)
  },
  cancelBooking: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/party-booking-cancel-for-host/${id}`
    return axiosClient.put(url)
  }
}
