import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { LoginRequest, Register } from 'src/dtos/request/auth.request'
import AppConstants from 'src/enums/app'
import { authService } from 'src/services/auth.service'

export const loginHost = createAsyncThunk('auth/loginHost', async (payload: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await authService.loginHost(payload)
    localStorage.setItem(AppConstants.ROLE, response.data?.data?.role?.name)

    localStorage.setItem(AppConstants.ACCESS_TOKEN, response.data?.data?.token)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    return rejectWithValue(axiosError.response?.data)
  }
})
export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (payload: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await authService.loginAdmin(payload)
    localStorage.setItem(AppConstants.ACCESS_TOKEN, response.data?.data?.token)
    localStorage.setItem(AppConstants.ROLE, response.data?.data?.role?.name)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    return rejectWithValue(axiosError.response?.data)
  }
})
export const getUserInfo = createAsyncThunk('auth/getUserInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getUserInfo()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    return rejectWithValue(axiosError.response?.data)
  }
})
export const logout = createAsyncThunk('auth/lgout', async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem(AppConstants.ACCESS_TOKEN)
    localStorage.removeItem(AppConstants.ROLE)
    return true
  } catch (error: any) {
    const axiosError = error as AxiosError
    return rejectWithValue(axiosError.response?.data)
  }
})

export const getAllUser = createAsyncThunk('auth/getAllUser', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getAllUser()
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    return rejectWithValue(axiosError.response?.data)
  }
})

export const registerAccountForHost = createAsyncThunk(
  'auth/registerAccountForHost',
  async (payload: Register, { rejectWithValue }) => {
    try {
      const response = await authService.registerAccountForHost(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
