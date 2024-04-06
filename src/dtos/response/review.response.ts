import { AccountDataResponse } from './auth.response'

export interface ReviewDataResponse {
  id: number
  createAt: string
  updateAt: string
  deleteAt: string
  reviewMessage: string
  replyMessage: string
  rating: number
  account: AccountDataResponse
  accountReply: AccountDataResponse
  active: string
}

export interface ReviewArrayResponse {
  status: string
  message: string
  data: ReviewDataResponse[] | []
}

export interface ReviewObjectResponse {
  status: string
  message: string
  data: ReviewDataResponse
}
