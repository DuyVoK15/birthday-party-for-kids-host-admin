import { createSlice } from '@reduxjs/toolkit'
import { createService, deleteService, getAllService, getServiceById, updateService } from '../action/service.action'

interface AuthState {
  serviceReponse: any
  serviceList: any
  serviceById: any
  createService: any
  updateService: any
  loading: boolean
}

const initialState: AuthState = {
  serviceReponse: null,
  serviceList: [],
  serviceById: null,
  createService: null,
  updateService: null,
  loading: false
}

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllService.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getAllService.fulfilled, (state, action) => {
        state.serviceReponse = action.payload
        state.serviceList = action.payload.data
        state.loading = false
      })
      .addCase(getAllService.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(getServiceById.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.serviceById = action.payload
        state.loading = false
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(createService.pending, (state, action) => {
        state.loading = true
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.createService = action.payload.data
        state.loading = false
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(updateService.pending, (state, action) => {
        state.loading = true
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.updateService = action.payload.data
        state.loading = false
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(deleteService.pending, (state, action) => {
        state.loading = true
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false
      })
    //
  }
})

export default serviceSlice.reducer
