import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { SlotCreateRequest } from 'src/dtos/request/slot.request'
import { ItemInVenueListCreateRequest } from 'src/dtos/request/theme.request'
import { SlotInRoomListCreateRequest } from 'src/dtos/request/room.request'

export const slotService = {
  getAllSlot: (): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/get-all-slot-for-host`
    return axiosClient.get(url)
  },
  getById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/get-id-for-host/${id}`
    return axiosClient.get(url)
  },
  createSlot: (payload: SlotCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/create`
    return axiosClient.post(url, { ...payload })
  },
  updateSlot: (request: { id: number; payload: SlotCreateRequest }): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/update/${request.id}`
    return axiosClient.put(url, { ...request.payload })
  },
  deleteSlot: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/delete/${id}`
    return axiosClient.delete(url)
  },
  enableSlot: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/enable/${id}`
    return axiosClient.put(url)
  },
  disableSlot: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/delete/${id}`
    return axiosClient.delete(url)
  },
  enableSlotInRoom: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/slot-in-venue/active/${id}`
    return axiosClient.put(url)
  },
  disableSlotInRoom: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/slot-in-venue/disable/${id}`
    return axiosClient.delete(url)
  },
  createSlotInVenueListByVenueId: (request: ItemInVenueListCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/add-slot-in-venue-by-venue-id?venueId=${request.venueId}`
    return axiosClient.post(url, request.payload)
  },
  createSlotInRoomListByRoomId: (request: SlotInRoomListCreateRequest): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/add-slot-in-room-by-slot-id?roomId=${request.roomId}`
    return axiosClient.post(url, request.payload)
  }
}
