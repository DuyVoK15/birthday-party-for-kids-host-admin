import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { SlotCreateRequest } from 'src/dtos/request/slot.request'
import { slotService } from 'src/services/slot.service'
import { serviceService } from 'src/services/service.service'

export const getAllService = createAsyncThunk('service/getAllService', async (_, { rejectWithValue }) => {
  try {
    const response = await serviceService.getAllService()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const getServiceById = createAsyncThunk('service/getServiceById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await serviceService.getServiceById(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const createService = createAsyncThunk(
  'service/createService',
  async (payload: SlotCreateRequest, { rejectWithValue }) => {
    try {
      const response = await serviceService.createService(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateService = createAsyncThunk(
  'service/updateService',
  async (request: { id: number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await serviceService.updateService(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const deleteService = createAsyncThunk('service/deleteService', async (id: number, { rejectWithValue }) => {
  try {
    const response = await serviceService.deleteService(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
