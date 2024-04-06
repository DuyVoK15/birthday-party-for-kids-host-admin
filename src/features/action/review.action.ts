import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { reviewService } from 'src/services/review.service'

export const getAllReview = createAsyncThunk(
  'review/getAllReview',
  async (request: { fitler?: { rating?: number | null } }, { rejectWithValue }) => {
    try {
      const response = await reviewService.getAllReview(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateReview = createAsyncThunk(
  'review/updateReview',
  async (
    request: {
      id: number
      payload: {
        replyMessage: string
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await reviewService.updateReview(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
