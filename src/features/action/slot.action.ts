import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { SlotCreateRequest } from 'src/dtos/request/slot.request'
import { slotService } from 'src/services/slot.service'

export const getAllSlot = createAsyncThunk('slot/getAllSlot', async (_, { rejectWithValue }) => {
  try {
    const response = await slotService.getAllSlot()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const getSlotById = createAsyncThunk('slot/getSlotById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await slotService.getById(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const createSlot = createAsyncThunk(
  'slot/createSlot',
  async (payload: SlotCreateRequest, { rejectWithValue }) => {
    try {
      const response = await slotService.createSlot(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateSlot = createAsyncThunk(
  'slot/updateSlot',
  async (request: { id: number; payload: SlotCreateRequest }, { rejectWithValue }) => {
    try {
      const response = await slotService.updateSlot(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const enableSlot = createAsyncThunk('slot/enableSlot', async (id: number, { rejectWithValue }) => {
  try {
    const response = await slotService.enableSlot(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const disableSlot = createAsyncThunk('slot/disableSlot', async (id: number, { rejectWithValue }) => {
  try {
    const response = await slotService.disableSlot(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const enableSlotInRoom = createAsyncThunk('slot/enableSlotInRoom', async (id: number, { rejectWithValue }) => {
  try {
    const response = await slotService.enableSlotInRoom(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const disableSlotInRoom = createAsyncThunk('slot/disableSlotInRoom', async (id: number, { rejectWithValue }) => {
  try {
    const response = await slotService.disableSlotInRoom(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
