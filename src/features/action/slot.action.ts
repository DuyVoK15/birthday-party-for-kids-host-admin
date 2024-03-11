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

export const deleteSlot = createAsyncThunk('slot/deleteSlot', async (id: number, { rejectWithValue }) => {
  try {
    const response = await slotService.deleteSlot(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
