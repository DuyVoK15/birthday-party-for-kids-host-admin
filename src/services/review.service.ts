import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { ReviewArrayResponse } from 'src/dtos/response/review.response'

export const reviewService = {
  getAllReview: (request: { fitler?: { rating?: number | null } }): Promise<AxiosResponse<ReviewArrayResponse>> => {
    const url = `/api/review/get-all-reviews-for-host?rating=0`
    return axiosClient.get(url, { params: request.fitler })
  },
  updateReview: (request: {
    id: number
    payload: {
      replyMessage: string
    }
  }): Promise<AxiosResponse<any>> => {
    const url = `/api/review/reply/${request.id}`
    return axiosClient.put(url, { ...request.payload })
  }
}
