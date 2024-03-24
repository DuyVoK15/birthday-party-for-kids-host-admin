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
  }
}
