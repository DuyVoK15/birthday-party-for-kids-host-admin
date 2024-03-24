import { createSlice } from '@reduxjs/toolkit'
import { LoginResponse, UserInfoResponse } from 'src/dtos/response/auth.response'
import { getUserInfo, loginAdmin, loginHost, logout, registerAccountForHost } from '../action/auth.action'

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
      .addCase(registerAccountForHost.pending, (state, action) => {
        state.loading = true
      })
      .addCase(registerAccountForHost.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(registerAccountForHost.rejected, (state, action) => {
        state.loading = false
      })
  }
})

export default authSlice.reducer
