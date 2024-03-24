import { createSlice } from '@reduxjs/toolkit'
import { DashBoardDataResponse } from 'src/dtos/response/dashboard.response'
import { getDashboard } from '../action/dashboard.action'

interface State {
  dashboard: DashBoardDataResponse | null
  loading: boolean
}

const initialState: State = {
  dashboard: null,
  loading: false
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDashboard.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload.data
        state.loading = false
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false
      })
  }
})

export default dashboardSlice.reducer
