import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAllVenue, getAllVenueCheckSlotByDate } from '../action/venue.action'
import { VenueCheckSlotByDateResponse, VenueResponse } from 'src/dtos/response/venue.response'

interface VenueState {
  venueCheckSlotByDateResponse: VenueCheckSlotByDateResponse
  venueCheckSlotByDateList: VenueResponse[] | []
  venueList: VenueResponse[] | []
  loading: boolean
}
const initialState: VenueState = {
  venueCheckSlotByDateResponse: {
    status: '',
    message: '',
    data: []
  },
  venueCheckSlotByDateList: [],
  venueList: [],
  loading: false
}

export const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllVenue.pending, state => {
        state.loading = true
      })
      .addCase(getAllVenue.fulfilled, (state, action) => {
        state.venueList = action.payload?.data || []
        state.loading = false
      })
      .addCase(getAllVenue.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(getAllVenueCheckSlotByDate.pending, state => {
        state.loading = true
      })
      .addCase(getAllVenueCheckSlotByDate.fulfilled, (state, action) => {
        state.venueCheckSlotByDateList = action.payload?.data || []
        state.loading = false
      })
      .addCase(getAllVenueCheckSlotByDate.rejected, (state, action) => {
        state.loading = false
      })
  }
})

// export const selectUser = (state: RootState) => state.auth.user;
export default venueSlice.reducer
