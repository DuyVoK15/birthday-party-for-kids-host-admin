import { createAsyncThunk } from '@reduxjs/toolkit'
import { venueService } from 'src/services/venue.service'

export const getAllVenue = createAsyncThunk('venue/getAllVenue', async (_, { rejectWithValue }) => {
  try {
    const response = await venueService.getAllVenue()
    return response.data
  } catch (error) {
    console.log(error)
  }
})

export const getAllVenueCheckSlotByDate = createAsyncThunk(
  'venue/getAllVenueCheckSlotByDate',
  async (date: string | null, { rejectWithValue }) => {
    try {
      const response = await venueService.getAllVenueCheckSlotByDate(date)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
)
