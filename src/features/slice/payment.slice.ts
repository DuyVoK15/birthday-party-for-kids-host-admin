import { createSlice } from '@reduxjs/toolkit'
import { getAllPayment } from '../action/payment.action'
import { PaymentArrayResponse, PaymentDataResponse } from 'src/dtos/response/payment.response'

interface AuthState {
  paymentReponse: PaymentArrayResponse
  paymentList: PaymentDataResponse[] | []
  loading: boolean
}

const initialState: AuthState = {
  paymentReponse: {
    message: '',
    status: '',
    data: []
  },
  paymentList: [],
  loading: false
}

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllPayment.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getAllPayment.fulfilled, (state, action) => {
        state.paymentReponse = action.payload
        state.paymentList = action.payload.data
        state.loading = false
      })
      .addCase(getAllPayment.rejected, (state, action) => {
        state.loading = false
      })

    //
  }
})

export default paymentSlice.reducer
