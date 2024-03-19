import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginRequest } from 'src/dtos/request/auth.request'
import AppConstants from 'src/enums/app'
import { authService } from 'src/services/auth.service'

export const loginHost = createAsyncThunk('auth/loginHost', async (payload: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await authService.loginHost(payload)
    localStorage.setItem(AppConstants.ROLE, response.data?.data?.role?.name)

    localStorage.setItem(AppConstants.ACCESS_TOKEN, response.data?.data?.token)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})
export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (payload: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await authService.loginAdmin(payload)
    localStorage.setItem(AppConstants.ACCESS_TOKEN, response.data?.data?.token)
    localStorage.setItem(AppConstants.ROLE, response.data?.data?.role?.name)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})
export const getUserInfo = createAsyncThunk('auth/getUserInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getUserInfo()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})
export const logout = createAsyncThunk('auth/lgout', async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem(AppConstants.ACCESS_TOKEN)
    localStorage.removeItem(AppConstants.ROLE)
    return true
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})
