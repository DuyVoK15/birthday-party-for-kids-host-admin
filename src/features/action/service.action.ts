import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { serviceService } from 'src/services/service.service'
import { FilterServiceRequest, ServiceCreateRequest } from 'src/dtos/request/service.request'

export const getAllService = createAsyncThunk(
  'service/getAllService',
  async (payload: { filter?: FilterServiceRequest }, { rejectWithValue }) => {
    try {
      const response = await serviceService.getAllService(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

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
  async (payload: ServiceCreateRequest, { rejectWithValue }) => {
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
  async (request: { id: number; payload: ServiceCreateRequest }, { rejectWithValue }) => {
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
export const enableService = createAsyncThunk('service/enableService', async (id: number, { rejectWithValue }) => {
  try {
    const response = await serviceService.enableService(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
export const disableService = createAsyncThunk('service/disableService', async (id: number, { rejectWithValue }) => {
  try {
    const response = await serviceService.disableService(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
