import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import AppConstants from '../enums/app'
import { authService } from '../services/auth.service'
import { LoginDto } from 'src/utils/fakeDto'
import { LoginRequest } from 'src/dtos/request/auth.request'
import { LoginResponse, UserInfoResponse } from 'src/dtos/response/auth.response'

interface AuthState {
  isAuthenticated: boolean
  authInfo: LoginResponse | null
  userInfo: UserInfoResponse | null
  loading: boolean
  error: string | null
  // Thêm các trường khác liên quan đến người dùng nếu cần thiết
}

const initialState: AuthState = {
  isAuthenticated: false,
  authInfo: null,
  userInfo: null,
  loading: false,
  error: ''
}

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
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginHost.pending, (state, action) => {
        state.isAuthenticated = false
        state.loading = true
      })
      .addCase(loginHost.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.authInfo = action.payload
        state.loading = false
      })
      .addCase(loginHost.rejected, (state, action) => {
        state.isAuthenticated = false

        state.loading = false
      })
      .addCase(loginAdmin.pending, (state, action) => {
        state.isAuthenticated = false
        state.loading = true
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.authInfo = action.payload
        state.loading = false
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isAuthenticated = false
        state.loading = false
      })
      .addCase(getUserInfo.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload
        state.loading = false
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(logout.pending, (state, action) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isAuthenticated = false
        state.authInfo = null
        state.userInfo = null
        state.loading = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
      })
  }
})

export default authSlice.reducer
