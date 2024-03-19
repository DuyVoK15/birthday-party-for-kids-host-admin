import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { PartyBookingObjectResponse } from 'src/dtos/response/partyBooking.response'

export const partyDatedService = {
  getPartyBookingByPartyDateId: (id: number): Promise<AxiosResponse<PartyBookingObjectResponse>> => {
    const url = `/api/partyDated/get-party-booking/${id}`
    return axiosClient.get(url)
  }
}
