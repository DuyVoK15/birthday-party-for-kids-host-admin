import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { paymentService } from 'src/services/payment.service'

export const getAllPayment = createAsyncThunk('payment/getAllPayment', async (_, { rejectWithValue }) => {
  try {
    const response = await paymentService.getAllPayment()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
