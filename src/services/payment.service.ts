import { AxiosResponse } from 'axios'
import axiosClient from './axiosClient/axiosClient'
import { PaymentArrayResponse } from 'src/dtos/response/payment.response'

export const paymentService = {
  getAllPayment: (): Promise<AxiosResponse<PaymentArrayResponse>> => {
    const url = `/api/payment/getAll-payment`
    return axiosClient.get(url)
  }
}
