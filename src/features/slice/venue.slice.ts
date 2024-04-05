import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { getAllVenue, getAllVenueCheckSlotByDate } from '../action/venue.action';
import { VenueArrayResponse, VenueDataResponse } from 'src/dtos/response/venue.response'
import { PartyBookingDataResponse } from 'src/dtos/response/partyBooking.response'
import { ThemeDataResponse, ThemeInVenueDataResponse } from 'src/dtos/response/theme.response'
import { PackageDataResponse } from 'src/dtos/response/package.response'
import { SlotDataResponse } from 'src/dtos/response/slot.response'
import {
  createRoom,
  disableRoom,
  enableRoom,
  getAllRoom,
  getSlotNotAddByRoomId,
  updateRoom
} from '../action/room.action'
import { RoomDataResponse } from 'src/dtos/response/room.response'

interface VenueState {
  venueCheckSlotByDateResponse: VenueArrayResponse
  venueCheckSlotByDateList: VenueDataResponse[] | []
  venueCheckSlotByDate: VenueDataResponse
  venueList: VenueDataResponse[] | []
  themeNotAddList: ThemeDataResponse[] | []
  packageNotAddList: PackageDataResponse[] | []
  slotNotAddList: SlotDataResponse[] | []
  roomList: RoomDataResponse[] | []
  partyBooking: PartyBookingDataResponse | null
  themeInVenueList: ThemeInVenueDataResponse[] | []
  packageInVenueList: any[] | []
  slotInVenueList: any[] | []
  loading: boolean
  loadingCreate: boolean

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
  venueCheckSlotByDate: {
    id: null,
    createAt: null,
    updateAt: null,
    deleteAt: null,
    venueName: null,
    venueDescription: null,
    venueImgUrl: null,
    street: null,
    ward: null,
    district: null,
    city: null,
    active: null,
    roomList: [],
    account: []
  },
  venueCheckSlotByDateList: [],
  venueList: [],
  themeNotAddList: [],
  packageNotAddList: [],
  slotNotAddList: [],
  roomList: [],
  partyBooking: null,
  themeInVenueList: [],
  packageInVenueList: [],
  slotInVenueList: [],
  loading: false,
  loadingCreate: false,
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
        state.venueCheckSlotByDate = action.payload?.data
        state.loading = false
      })
      .addCase(getAllVenueCheckSlotByDate.rejected, (state, action) => {
        state.loading = false
      })

      .addCase(getSlotNotAddByRoomId.pending, state => {
        state.loadingGetSlotNotAdd = true
      })
      .addCase(getSlotNotAddByRoomId.fulfilled, (state, action) => {
        state.slotNotAddList = action.payload?.data || []
        state.loadingGetSlotNotAdd = false
      })
      .addCase(getSlotNotAddByRoomId.rejected, (state, action) => {
        state.loadingGetSlotNotAdd = false
      })
      //
      .addCase(getAllRoom.pending, state => {
        state.loading = true
      })
      .addCase(getAllRoom.fulfilled, (state, action) => {
        state.loading = false
        state.roomList = action.payload?.data || []
      })
      .addCase(getAllRoom.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addMatcher(isAnyOf(createRoom.pending, updateRoom.pending, enableRoom.pending, disableRoom.pending), state => {
        state.loadingCreate = true
      })
      .addMatcher(
        isAnyOf(createRoom.fulfilled, updateRoom.fulfilled, enableRoom.fulfilled, disableRoom.fulfilled),
        state => {
          state.loadingCreate = false
        }
      )
      .addMatcher(
        isAnyOf(createRoom.rejected, updateRoom.rejected, enableRoom.rejected, disableRoom.rejected),
        state => {
          state.loadingCreate = false
        }
      ) //
  }
})

// export const selectUser = (state: RootState) => state.auth.user;
export default venueSlice.reducer
