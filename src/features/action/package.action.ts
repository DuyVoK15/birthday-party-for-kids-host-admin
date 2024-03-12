import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { SlotCreateRequest } from 'src/dtos/request/slot.request'
import { slotService } from 'src/services/slot.service'
import { packageService } from 'src/services/package.service'

export const getAllPackage = createAsyncThunk('package/getAllPackage', async (_, { rejectWithValue }) => {
  try {
    const response = await packageService.getAllPackage()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const getPackageById = createAsyncThunk('package/getPackageById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await packageService.getPackageById(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

export const createPackage = createAsyncThunk(
  'package/createPackage',
  async (payload: SlotCreateRequest, { rejectWithValue }) => {
    try {
      const response = await packageService.createPackage(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updatePackage = createAsyncThunk(
  'package/updatePackage',
  async (request: { id: number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await packageService.updatePackage(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const deletePackage = createAsyncThunk('package/deletePackage', async (id: number, { rejectWithValue }) => {
  try {
    const response = await packageService.deletePackage(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
