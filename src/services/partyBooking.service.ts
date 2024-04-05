import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { PartyBookingArrayResponse, PartyBookingObjectResponse } from 'src/dtos/response/partyBooking.response'
import { FilterBoookingRequest, PagingBoookingRequest } from 'src/dtos/request/partyBooking.request'

export const partyBookingService = {
  getAllBooking: (request: {
    filter?: FilterBoookingRequest
    paging: PagingBoookingRequest
  }): Promise<AxiosResponse<PartyBookingArrayResponse>> => {
    const url = `/api/party-booking/get-all-party-booking-for-host?page=${request.paging.page}&size=${request.paging.size}`
    return axiosClient.get(url, { params: request.filter })
  },
  getBookingById: (id: number): Promise<AxiosResponse<PartyBookingObjectResponse>> => {
    const url = `/api/party-booking/get-by-id-for-host/${id}`
    return axiosClient.get(url)
  },
  getAllBookingCompleted: (): Promise<AxiosResponse<PartyBookingArrayResponse>> => {
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
