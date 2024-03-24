import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { dashboardService } from 'src/services/dashboard.service'

export const getDashboard = createAsyncThunk(
  'dashboard/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboard();
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
