import { RoomDataResponse } from './room.response'

export interface VenueDataResponse {
  id: number | null
  createAt: string | null
  updateAt: string | null
  deleteAt: string | null
  venueName: string | null
  venueDescription: string | null
  venueImgUrl: string | null
  street: string | null
  ward: string | null
  district: string | null
  city: string | null
  active: boolean | null
  roomList: RoomDataResponse[] | []
  account: []
}

export interface VenueArrayResponse {
  status: string | null
  message: string | null
  data: VenueDataResponse[] | []
}
export interface VenueObjectResponse {
  status: string | null
  message: string | null
  data: VenueDataResponse
}
export interface VenueArrayResponse {
  status: string | null
  message: string | null
  data: VenueDataResponse[] | []
}
