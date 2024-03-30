import { SlotInRoomDataResponse } from './slot.response'

export interface RoomDataResponse {
  id: number
  createAt: string
  updateAt: string
  deleteAt: string
  roomName: string
  roomImgUrl: string
  capacity: number
  pricing: number
  slotInRoomList: SlotInRoomDataResponse[] | []
  active: boolean
}

export interface RoomArrayResponse {
  data: RoomDataResponse[] | []
}

export interface RoomObjectResponse {
  data: RoomDataResponse
}
