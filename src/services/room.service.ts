import { AxiosResponse } from 'axios'
import { RoomDataCreateRequest, RoomDataUpdateRequest, RoomGetSlotNotAddRequest } from 'src/dtos/request/room.request'
import axiosClient from './axiosClient/axiosClient'
import { headerFormData } from './axiosClient/headerConstant'
import { SlotDataResponse, SlotInRoomArrayResponse, SlotNotAddArrayResponse } from 'src/dtos/response/slot.response'
import { RoomArrayResponse } from 'src/dtos/response/room.response'

export const roomService = {
  getAllRoom: (date: string): Promise<AxiosResponse<RoomArrayResponse>> => {
    const url = `/api/room/check-slot-in-room-for-host?date=${date}`
    return axiosClient.get(url)
  },
  createRoom: (payload: RoomDataCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/room/create-room`
    const formData = new FormData()

    formData.append('roomName', payload.roomName)
    formData.append('fileImg', payload.roomImgUrl)
    formData.append('pricing', payload.pricing.toString())
    formData.append('capacity', payload.capacity.toString())

    return axiosClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updateRoom: (payload: RoomDataUpdateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/room/update/${payload.roomId}`
    const formData = new FormData()

    formData.append('roomName', payload.roomName)
    formData.append('fileImg', payload.roomImgUrl)
    formData.append('pricing', payload.pricing.toString())
    formData.append('capacity', payload.capacity.toString())

    return axiosClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  enableRoom: (payload: RoomGetSlotNotAddRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/room/enable/${payload.roomId}`

    return axiosClient.put(url)
  },
  disableRoom: (payload: RoomGetSlotNotAddRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/room/disable/${payload.roomId}`

    return axiosClient.delete(url)
  },
  getSlotNotAddByRoomId: (payload: RoomGetSlotNotAddRequest): Promise<AxiosResponse<SlotNotAddArrayResponse>> => {
    const url = `/api/room/get-slot-not-add-in-room-in-venue-for-host/${payload.roomId}`
    return axiosClient.get(url)
  }
}
