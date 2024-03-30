import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'

export const partyBookingService = {
  getAllBooking: (): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/get-all-party-booking-for-host`
    return axiosClient.get(url)
  },
  getBookingById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/get-by-id-for-host/${id}`
    return axiosClient.get(url)
  },
  getAllBookingCompleted: (): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/get-all-completed`
    return axiosClient.get(url)
  },
  completeBooking: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/complete-party-booking-for-host/${id}`
    return axiosClient.put(url)
  },
  cancelBooking: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/party-booking/cancel-party-booking-for-host/${id}`
    return axiosClient.put(url)
  }
}
