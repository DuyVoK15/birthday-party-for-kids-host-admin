import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { ItemInVenueListCreateRequest } from 'src/dtos/request/theme.request'
import { VenueCreateRequest } from 'src/dtos/request/venue.request'
import { packageService } from 'src/services/package.service'
import { partyDatedService } from 'src/services/partydated.service'
import { slotService } from 'src/services/slot.service'
import { themeService } from 'src/services/theme.service'
import { venueService } from 'src/services/venue.service'

export const getAllVenue = createAsyncThunk('venue/getAllVenue', async (_, { rejectWithValue }) => {
  try {
    const response = await venueService.getAllVenue()
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const getAllVenueCheckSlotByDate = createAsyncThunk(
  'venue/getAllVenueCheckSlotByDate',
  async (date: string | null, { rejectWithValue }) => {
    try {
      const response = await venueService.getAllVenueCheckSlotByDate(date)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getAllThemeNotAdd = createAsyncThunk(
  'venue/getAllThemeNotAdd',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await venueService.getAllThemeNotAdd(id)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
export const getAllPackageNotAdd = createAsyncThunk(
  'venue/getAllPackageNotAdd',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await venueService.getAllPackageNotAdd(id)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
export const getAllSlotNotAdd = createAsyncThunk('venue/getAllSlotNotAdd', async (id: number, { rejectWithValue }) => {
  try {
    const response = await venueService.getAllSlotNotAdd(id)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const createVenue = createAsyncThunk(
  'venue/createVenue',
  async (payload: VenueCreateRequest, { rejectWithValue }) => {
    try {
      const response = await venueService.createVenue(payload)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createSlotInVenue = createAsyncThunk(
  'venue/createSlotInVenue',
  async (payload: { venue_id: number; slot_id: number }, { rejectWithValue }) => {
    try {
      const response = await venueService.createSlotInVenue(payload)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
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
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getAllThemeInVenueByVenueId = createAsyncThunk(
  'venue/getAllThemeInVenueByVenueId',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await venueService.getAllThemeInVenueByVenueId(id)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getAllPackageInVenueByVenueId = createAsyncThunk(
  'venue/getAllPackageInVenueByVenueId',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await venueService.getAllPackageInVenueByVenueId(id)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createThemeInVenueListByVenueId = createAsyncThunk(
  'venue/createThemeInVenueListByVenueId',
  async (request: ItemInVenueListCreateRequest, { rejectWithValue }) => {
    try {
      const response = await themeService.createThemeInVenueListByVenueId(request)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getAllSlotInVenueByVenueId = createAsyncThunk(
  'venue/getAllSlotInVenueByVenueId',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await venueService.getAllSlotInVenueByVenueId(id)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createPackageInVenueListByVenueId = createAsyncThunk(
  'venue/createPackageInVenueListByVenueId',
  async (request: ItemInVenueListCreateRequest, { rejectWithValue }) => {
    try {
      const response = await packageService.createPackageInVenueListByVenueId(request)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createSlotInVenueListByVenueId = createAsyncThunk(
  'venue/createSlotInVenueListByVenueId',
  async (request: ItemInVenueListCreateRequest, { rejectWithValue }) => {
    try {
      const response = await slotService.createSlotInVenueListByVenueId(request)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
