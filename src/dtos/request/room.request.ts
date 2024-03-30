export interface RoomDataCreateRequest {
  roomName: string
  venueId: number
  roomImgUrl: string
  capacity: number
  pricing: number
}

export interface RoomDataUpdateRequest {
  roomName: string
  roomId: number
  roomImgUrl: string
  capacity: number
  pricing: number
}

export interface SlotInRoomListCreateRequest {
  roomId: number
  payload: number[] | []
}

export interface RoomGetSlotNotAddRequest {
  roomId: number
}
