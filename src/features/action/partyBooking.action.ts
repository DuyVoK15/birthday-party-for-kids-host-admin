import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { FilterBoookingRequest, PagingBoookingRequest } from 'src/dtos/request/partyBooking.request'
import { partyBookingService } from 'src/services/partyBooking.service'

export const getAllBooking = createAsyncThunk(
  'partyBooking/getAllBooking',
  async (
    request: {
      filter?: FilterBoookingRequest
      paging: PagingBoookingRequest
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await partyBookingService.getAllBooking(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
export const getBookingById = createAsyncThunk(
  'partyBooking/getBookingById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await partyBookingService.getBookingById(id)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
export const getAllBookingCompleted = createAsyncThunk(
  'partyBooking/getAllBookingCompleted',
  async (_, { rejectWithValue }) => {
    try {
      const response = await partyBookingService.getAllBookingCompleted()
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const completeBooking = createAsyncThunk(
  'partyBooking/completeBooking',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await partyBookingService.completeBooking(id)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const cancelBooking = createAsyncThunk('partyBooking/cancelBooking', async (id: number, { rejectWithValue }) => {
  try {
    const response = await partyBookingService.cancelBooking(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
