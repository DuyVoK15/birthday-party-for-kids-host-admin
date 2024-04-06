import { createSlice } from '@reduxjs/toolkit'
import { getAllReview, updateReview } from '../action/review.action'

interface AuthState {
  reviewReponse: any
  reviewList: any
  updateReview: any
  loading: boolean
}

const initialState: AuthState = {
  reviewReponse: null,
  reviewList: [],
  updateReview: null,
  loading: false
}

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllReview.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getAllReview.fulfilled, (state, action) => {
        state.reviewReponse = action.payload
        state.reviewList = action.payload.data
        state.loading = false
      })
      .addCase(getAllReview.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(updateReview.pending, (state, action) => {
        state.loading = true
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.updateReview = action.payload.data
        state.loading = false
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false
      })
    //

    //
  }
})

export default reviewSlice.reducer
