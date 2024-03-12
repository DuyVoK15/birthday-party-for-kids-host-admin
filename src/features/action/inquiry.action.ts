import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { inquiryService } from 'src/services/inquiry.service'

export const getAllInquiry = createAsyncThunk('inquiry/getAllInquiry', async (_, { rejectWithValue }) => {
  try {
    const response = await inquiryService.getAllInquiry()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const replyInquiryById = createAsyncThunk(
  'inquiry/replyInquiryById',
  async (request: { id: number; payload: { inquiryReply: string; inquiryStatus: string } }, { rejectWithValue }) => {
    try {
      const response = await inquiryService.replyInquiryById({ id: request.id, payload: request.payload })
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
