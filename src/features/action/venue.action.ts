import { createAsyncThunk } from '@reduxjs/toolkit'
import { partyDatedService } from 'src/services/partydated.service'
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

export const getAllSlotNotAdd = createAsyncThunk('venue/getAllSlotNotAdd', async (id: number, { rejectWithValue }) => {
  try {
    const response = await venueService.getAllSlotNotAdd(id)
    return response.data
  } catch (error) {
    console.log(error)
  }
})

export const createSlotInVenue = createAsyncThunk(
  'venue/createSlotInVenue',
  async (payload: { venue_id: number; slot_id: number }, { rejectWithValue }) => {
    try {
      const response = await venueService.createSlotInVenue(payload)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
)

export const getPartyBookingByPartyDateId = createAsyncThunk(
  'venue/getPartyBookingByPartyDateId',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await partyDatedService.getPartyBookingByPartyDateId(id)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
)
