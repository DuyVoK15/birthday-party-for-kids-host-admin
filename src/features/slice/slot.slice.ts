import { createSlice } from '@reduxjs/toolkit'
import { createSlot, getAllSlot, getSlotById, updateSlot } from '../action/slot.action'

interface AuthState {
  slotReponse: any
  slotList: any
  slotById: any
  createSlot: any
  updateSlot: any
  loading: boolean
}

const initialState: AuthState = {
  slotReponse: null,
  slotList: [],
  slotById: null,
  createSlot: null,
  updateSlot: null,
  loading: false
}

export const slotSlice = createSlice({
  name: 'slot',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllSlot.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getAllSlot.fulfilled, (state, action) => {
        state.slotReponse = action.payload
        state.slotList = action.payload.data
        state.loading = false
      })
      .addCase(getAllSlot.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(getSlotById.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getSlotById.fulfilled, (state, action) => {
        state.slotById = action.payload
        state.loading = false
      })
      .addCase(getSlotById.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(createSlot.pending, (state, action) => {
        state.loading = true
      })
      .addCase(createSlot.fulfilled, (state, action) => {
        state.createSlot = action.payload.data
        state.loading = false
      })
      .addCase(createSlot.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(updateSlot.pending, (state, action) => {
        state.loading = true
      })
      .addCase(updateSlot.fulfilled, (state, action) => {
        state.updateSlot = action.payload.data
        state.loading = false
      })
      .addCase(updateSlot.rejected, (state, action) => {
        state.loading = false
      })
      //
  
    //
  }
})

export default slotSlice.reducer
