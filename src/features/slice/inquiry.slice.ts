import { createSlice } from '@reduxjs/toolkit'
import { getAllInquiry, replyInquiryById } from '../action/inquiry.action'

interface AuthState {
  inquiryReponse: any
  inquiryList: any
  inquiryById: any
  createInquiry: any
  updateInquiry: any
  loading: boolean
}

const initialState: AuthState = {
  inquiryReponse: null,
  inquiryList: [],
  inquiryById: null,
  createInquiry: null,
  updateInquiry: null,
  loading: false
}

export const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllInquiry.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getAllInquiry.fulfilled, (state, action) => {
        state.inquiryReponse = action.payload
        state.inquiryList = action.payload.data
        state.loading = false
      })
      .addCase(getAllInquiry.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(replyInquiryById.pending, (state, action) => {
        state.loading = true
      })
      .addCase(replyInquiryById.fulfilled, (state, action) => {
        state.inquiryById = action.payload
        state.loading = false
      })
      .addCase(replyInquiryById.rejected, (state, action) => {
        state.loading = false
      })
  }
})

export default inquirySlice.reducer
