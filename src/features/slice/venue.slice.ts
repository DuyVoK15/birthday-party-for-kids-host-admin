import { createSlice } from '@reduxjs/toolkit';
import {
  createSlotInVenue,
  getAllSlotNotAdd,
  getAllVenue,
  getAllVenueCheckSlotByDate,
  getPartyBookingByPartyDateId
} from '../action/venue.action'
import { VenueCheckSlotByDateResponse, VenueResponse } from 'src/dtos/response/venue.response'
import { PartyBookingDataResponse } from 'src/dtos/response/partyBooking.response'
import { SlotOnjectResponse } from 'src/dtos/response/slot.response'

interface VenueState {
  venueCheckSlotByDateResponse: VenueCheckSlotByDateResponse
  venueCheckSlotByDateList: VenueResponse[] | []
  venueList: VenueResponse[] | []
  slotNotAddList: SlotOnjectResponse[] | []
  partyBooking: PartyBookingDataResponse | null
  loading: boolean
  loadingGetSlotNotAdd: boolean
  loadingCreateSlotInVenue: boolean
  loadingPartyBooking: boolean
}
const initialState: VenueState = {
  venueCheckSlotByDateResponse: {
    status: '',
    message: '',
    data: []
  },
  venueCheckSlotByDateList: [],
  venueList: [],
  slotNotAddList: [],
  partyBooking: null,
  loading: false,
  loadingGetSlotNotAdd: false,
  loadingCreateSlotInVenue: false,
  loadingPartyBooking: false
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
      .addCase(getAllSlotNotAdd.pending, state => {
        state.loadingGetSlotNotAdd = true
      })
      .addCase(getAllSlotNotAdd.fulfilled, (state, action) => {
        state.slotNotAddList = action.payload?.data || []
        state.loadingGetSlotNotAdd = false
      })
      .addCase(getAllSlotNotAdd.rejected, (state, action) => {
        state.loadingGetSlotNotAdd = false
      })
      .addCase(createSlotInVenue.pending, state => {
        state.loadingCreateSlotInVenue = true
      })
      .addCase(createSlotInVenue.fulfilled, (state, action) => {
        state.loadingCreateSlotInVenue = false
      })
      .addCase(createSlotInVenue.rejected, (state, action) => {
        state.loadingCreateSlotInVenue = false
      })
      .addCase(getPartyBookingByPartyDateId.pending, state => {
        state.loadingPartyBooking = true
      })
      .addCase(getPartyBookingByPartyDateId.fulfilled, (state, action) => {
        state.partyBooking = action.payload?.data || null
        state.loadingPartyBooking = false
      })
      .addCase(getPartyBookingByPartyDateId.rejected, (state, action) => {
        state.loadingPartyBooking = false
      })
  }
})

// export const selectUser = (state: RootState) => state.auth.user;
export default venueSlice.reducer
