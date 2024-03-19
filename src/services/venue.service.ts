import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { SlotNotAddResponse, VenueCheckSlotByDateResponse } from 'src/dtos/response/venue.response'

export const venueService = {
  getAllVenue: (): Promise<AxiosResponse<VenueCheckSlotByDateResponse>> => {
    const url = `/api/venue/get-all`
    return axiosClient.get(url)
  },
  getAllVenueCheckSlotByDate: (date: string | null): Promise<AxiosResponse<VenueCheckSlotByDateResponse>> => {
    const url = `/api/venue/check-slot-in-venue-for-host?date=${date}`
    return axiosClient.get(url)
  },
  getAllSlotNotAdd: (id: number): Promise<AxiosResponse<SlotNotAddResponse>> => {
    const url = `/api/venue/get-slot-not-add-in-venue/${id}`
    return axiosClient.get(url)
  },
  createSlotInVenue: (payload: { venue_id: number; slot_id: number }): Promise<AxiosResponse<any>> => {
    const url = `/slot-in-venue/create`
    return axiosClient.post(url, { ...payload })
  }
}
