import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { packageService } from 'src/services/package.service'
import { FilterPackageRequest, PackageCreateRequest, PackageUpdateRequest } from 'src/dtos/request/package.request'

export const getAllPackage = createAsyncThunk(
  'package/getAllPackage',
  async (payload: { filter?: FilterPackageRequest }, { rejectWithValue }) => {
    try {
      const response = await packageService.getAllPackage(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

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
  async (payload: PackageCreateRequest, { rejectWithValue }) => {
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
  async (request: { id: number; payload: PackageUpdateRequest }, { rejectWithValue }) => {
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
export const updatePercentOfPackage = createAsyncThunk(
  'package/updatePercentOfPackage',
  async (request: { id: number; payload: { percent: number } }, { rejectWithValue }) => {
    try {
      const response = await packageService.updatePercentOfPackage(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const enablePackage = createAsyncThunk('package/enablePackage', async (id: number, { rejectWithValue }) => {
  try {
    const response = await packageService.enablePackage(id)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})

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
