import { message } from 'antd'
export interface PaymentMethodDataResponse {
  id: number
  createAt: string
  updateAt: string
  deleteAt: string
  methodName: string
  methodDescription: string
  active: boolean
}

export interface PaymentDataResponse {
  id: number
  createAt: string
  updateAt: string
  deleteAt: null
  amount: string
  status: string
  paymentMethod: PaymentMethodDataResponse
}

export interface PaymentArrayResponse {
  message: string
  status: string
  data: PaymentDataResponse[] | []
}
