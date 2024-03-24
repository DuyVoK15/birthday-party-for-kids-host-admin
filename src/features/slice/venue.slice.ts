import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import {
  createPackageInVenueListByVenueId,
  createSlotInVenue,
  createSlotInVenueListByVenueId,
  createThemeInVenueListByVenueId,
  createVenue,
  disableVenueById,
  enableVenueById,
  getAllPackageInVenueByVenueId,
  getAllPackageNotAdd,
  getAllSlotInVenueByVenueId,
  getAllSlotNotAdd,
  getAllThemeInVenueByVenueId,
  getAllThemeNotAdd,
  getAllVenue,
  getAllVenueCheckSlotByDate,
  getPartyBookingByPartyDateId
} from '../action/venue.action'
import { VenueCheckSlotByDateResponse, VenueResponse } from 'src/dtos/response/venue.response'
import { PartyBookingDataResponse } from 'src/dtos/response/partyBooking.response'
import { ThemeDataResponse, ThemeInVenueDataResponse } from 'src/dtos/response/theme.response'
import { PackageDataResponse, PackageInVenueDataResponse } from 'src/dtos/response/package.response'
import { SlotDataResponse, SlotInVenueDataResponse } from 'src/dtos/response/slot.response'
import { disableSlotInVenueById, enableSlotInVenueById } from '../action/slot.action'
import { updatePackageInVenueInBooking, updateThemeInVenueInBooking } from '../action/partyBooking.action'

interface VenueState {
  venueCheckSlotByDateResponse: VenueCheckSlotByDateResponse
  venueCheckSlotByDateList: VenueResponse[] | []
  venueList: VenueResponse[] | []
  themeNotAddList: ThemeDataResponse[] | []
  packageNotAddList: PackageDataResponse[] | []
  slotNotAddList: SlotDataResponse[] | []
  partyBooking: PartyBookingDataResponse | null
  themeInVenueList: ThemeInVenueDataResponse[] | []
  packageInVenueList: PackageInVenueDataResponse[] | []
  slotInVenueList: SlotInVenueDataResponse[] | []
  loading: boolean
  loadingCreateVenue: boolean
  loadingGetSlotNotAdd: boolean
  loadingCreateSlotInVenue: boolean
  loadingPartyBooking: boolean
  loadingItemInVenueList: boolean
  loadingCreateItemInVenueList: boolean
}
const initialState: VenueState = {
  venueCheckSlotByDateResponse: {
    status: '',
    message: '',
    data: []
  },
  venueCheckSlotByDateList: [],
  venueList: [],
  themeNotAddList: [],
  packageNotAddList: [],
  slotNotAddList: [],
  partyBooking: null,
  themeInVenueList: [],
  packageInVenueList: [],
  slotInVenueList: [],
  loading: false,
  loadingCreateVenue: false,
  loadingGetSlotNotAdd: false,
  loadingCreateSlotInVenue: false,
  loadingPartyBooking: false,
  loadingItemInVenueList: false,
  loadingCreateItemInVenueList: false
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
      .addCase(getAllThemeNotAdd.pending, state => {
        state.loadingGetSlotNotAdd = true
      })
      .addCase(getAllThemeNotAdd.fulfilled, (state, action) => {
        state.themeNotAddList = action.payload?.data || []
        state.loadingGetSlotNotAdd = false
      })
      .addCase(getAllThemeNotAdd.rejected, (state, action) => {
        state.loadingGetSlotNotAdd = false
      })
      .addCase(getAllPackageNotAdd.pending, state => {
        state.loadingGetSlotNotAdd = true
      })
      .addCase(getAllPackageNotAdd.fulfilled, (state, action) => {
        state.packageNotAddList = action.payload?.data || []
        state.loadingGetSlotNotAdd = false
      })
      .addCase(getAllPackageNotAdd.rejected, (state, action) => {
        state.loadingGetSlotNotAdd = false
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
      .addCase(createVenue.pending, state => {
        state.loadingCreateVenue = true
      })
      .addCase(createVenue.fulfilled, (state, action) => {
        state.loadingCreateVenue = false
      })
      .addCase(createVenue.rejected, (state, action) => {
        state.loadingCreateVenue = false
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
      //
      .addCase(getAllThemeInVenueByVenueId.pending, state => {
        state.loadingItemInVenueList = true
      })
      .addCase(getAllThemeInVenueByVenueId.fulfilled, (state, action) => {
        state.loadingItemInVenueList = false
        state.themeInVenueList = action.payload?.data || []
      })
      .addCase(getAllThemeInVenueByVenueId.rejected, (state, action) => {
        state.loadingItemInVenueList = false
      })
      //
      .addCase(getAllPackageInVenueByVenueId.pending, state => {
        state.loadingItemInVenueList = true
      })
      .addCase(getAllPackageInVenueByVenueId.fulfilled, (state, action) => {
        state.loadingItemInVenueList = false
        state.packageInVenueList = action.payload?.data || []
      })
      .addCase(getAllPackageInVenueByVenueId.rejected, (state, action) => {
        state.loadingItemInVenueList = false
      })
      //
      .addCase(getAllSlotInVenueByVenueId.pending, state => {
        state.loadingItemInVenueList = true
      })
      .addCase(getAllSlotInVenueByVenueId.fulfilled, (state, action) => {
        state.loadingItemInVenueList = false
        state.slotInVenueList = action.payload?.data || []
      })
      .addCase(getAllSlotInVenueByVenueId.rejected, (state, action) => {
        state.loadingItemInVenueList = false
      })
      //
      .addCase(createThemeInVenueListByVenueId.pending, state => {
        state.loadingCreateItemInVenueList = false
      })
      .addCase(createThemeInVenueListByVenueId.fulfilled, (state, action) => {
        state.loadingCreateItemInVenueList = false
      })
      .addCase(createThemeInVenueListByVenueId.rejected, (state, action) => {
        state.loadingCreateItemInVenueList = false
      })
      //
      .addMatcher(
        isAnyOf(
          createPackageInVenueListByVenueId.pending,
          createSlotInVenueListByVenueId.pending,
          disableSlotInVenueById.pending,
          enableSlotInVenueById.pending,
          disableVenueById.pending,
          enableVenueById.pending,
          updateThemeInVenueInBooking.pending,
          updatePackageInVenueInBooking.pending
        ),
        state => {
          state.loadingCreateItemInVenueList = true
        }
      )
      .addMatcher(
        isAnyOf(
          createPackageInVenueListByVenueId.fulfilled,
          createSlotInVenueListByVenueId.fulfilled,
          disableSlotInVenueById.fulfilled,
          enableSlotInVenueById.fulfilled,
          disableVenueById.fulfilled,
          enableVenueById.fulfilled,
          updateThemeInVenueInBooking.fulfilled,
          updatePackageInVenueInBooking.fulfilled
        ),
        state => {
          state.loadingCreateItemInVenueList = false
        }
      )
      .addMatcher(
        isAnyOf(
          createPackageInVenueListByVenueId.rejected,
          createSlotInVenueListByVenueId.rejected,
          disableSlotInVenueById.rejected,
          enableSlotInVenueById.rejected,
          disableVenueById.rejected,
          enableVenueById.rejected,
          updateThemeInVenueInBooking.rejected,
          updatePackageInVenueInBooking.rejected
        ),
        state => {
          state.loadingCreateItemInVenueList = false
        }
      ) //
  }
})

// export const selectUser = (state: RootState) => state.auth.user;
export default venueSlice.reducer
