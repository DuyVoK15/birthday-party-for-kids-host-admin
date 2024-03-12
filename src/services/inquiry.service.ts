import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'

export const inquiryService = {
  getAllInquiry: (): Promise<AxiosResponse<any>> => {
    const url = `/api/inquiry/get-all`
    return axiosClient.get(url)
  },
  replyInquiryById: (request: {
    id: number
    payload: { inquiryReply: string; inquiryStatus: string }
  }): Promise<AxiosResponse<any>> => {
    const url = `/api/inquiry/reply/${request.id}`
    return axiosClient.put(url, { ...request.payload })
  }
}
