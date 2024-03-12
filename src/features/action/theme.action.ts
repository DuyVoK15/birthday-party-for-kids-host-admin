import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { SlotCreateRequest } from 'src/dtos/request/slot.request'
import { slotService } from 'src/services/slot.service'
import { themeService } from 'src/services/theme.service'

export const getAllTheme = createAsyncThunk('theme/getAllTheme', async (_, { rejectWithValue }) => {
  try {
    const response = await themeService.getAllTheme()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const getThemeById = createAsyncThunk('theme/getThemeById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await themeService.getThemeById(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const createTheme = createAsyncThunk(
  'theme/createTheme',
  async (payload: SlotCreateRequest, { rejectWithValue }) => {
    try {
      const response = await themeService.createTheme(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateTheme = createAsyncThunk(
  'theme/updateTheme',
  async (request: { id: number; payload: SlotCreateRequest }, { rejectWithValue }) => {
    try {
      const response = await themeService.updateTheme(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const deleteTheme = createAsyncThunk('theme/deleteTheme', async (id: number, { rejectWithValue }) => {
  try {
    const response = await themeService.deleteTheme(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
