import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { SlotCreateRequest } from 'src/dtos/request/slot.request'

export const slotService = {
  getAllSlot: (): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/get-all`
    return axiosClient.get(url)
  },
  getById: (id: number): Promise<AxiosResponse<any>> => {
    const url = `/api/slot/get-id/${id}`
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
  }
}
