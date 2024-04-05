import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { getAllBooking, getBookingById } from '../action/partyBooking.action'
import { PartyBookingArrayResponse, PartyBookingDataResponse } from 'src/dtos/response/partyBooking.response'

interface AuthState {
  bookingResponse: PartyBookingArrayResponse | null
  bookingList: PartyBookingDataResponse[] | []
  bookingById: PartyBookingDataResponse | null
  createBooking: any
  updateBooking: any
  loading: boolean
}

const initialState: AuthState = {
  bookingResponse: null,
  bookingList: [],
  bookingById: null,
  createBooking: null,
  updateBooking: null,
  loading: false
}

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllBooking.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getAllBooking.fulfilled, (state, action) => {
        state.bookingResponse = action.payload
        state.bookingList = action.payload.data
        state.loading = false
      })
      .addCase(getAllBooking.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(getBookingById.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.bookingById = action.payload?.data
        state.loading = false
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false
      })
    //
    //
  }
})

export default bookingSlice.reducer
