import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { partyBookingService } from 'src/services/partyBooking.service'

export const updateThemeInVenueInBooking = createAsyncThunk(
  'service/updateThemeInVenueInBooking',
  async (
    payload: {
      partyBookingId: number
      themeInVenueId: number
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await partyBookingService.updateThemeInVenueInBooking(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updatePackageInVenueInBooking = createAsyncThunk(
  'service/updatePackageInVenueInBooking',
  async (
    payload: {
      partyBookingId: number
      packageInVenueId: number
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await partyBookingService.updatePackageInVenueInBooking(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
