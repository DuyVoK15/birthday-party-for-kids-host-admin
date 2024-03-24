import { createSlice } from '@reduxjs/toolkit'
import {
  createPackage,
  deletePackage,
  getAllPackage,
  getAllPackageInVenueNotChoose,
  getPackageById,
  updatePackage
} from '../action/package.action'
import { PackageInVenueDataResponse } from 'src/dtos/response/package.response'

interface AuthState {
  packageReponse: any
  packageList: any
  packageById: any
  packageInVenueNotChooseList: PackageInVenueDataResponse[] | []
  createPackage: any
  updatePackage: any
  loading: boolean
}

const initialState: AuthState = {
  packageReponse: null,
  packageList: [],
  packageById: null,
  packageInVenueNotChooseList: [],
  createPackage: null,
  updatePackage: null,
  loading: false
}

export const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllPackage.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getAllPackage.fulfilled, (state, action) => {
        state.packageReponse = action.payload
        state.packageList = action.payload.data
        state.loading = false
      })
      .addCase(getAllPackage.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(getPackageById.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getPackageById.fulfilled, (state, action) => {
        state.packageById = action.payload
        state.loading = false
      })
      .addCase(getPackageById.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(createPackage.pending, (state, action) => {
        state.loading = true
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.createPackage = action.payload.data
        state.loading = false
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(updatePackage.pending, (state, action) => {
        state.loading = true
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.updatePackage = action.payload.data
        state.loading = false
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(deletePackage.pending, (state, action) => {
        state.loading = true
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false
      })
      //
      .addCase(getAllPackageInVenueNotChoose.pending, (state, action) => {
        state.loading = true
        state.packageInVenueNotChooseList = []
      })
      .addCase(getAllPackageInVenueNotChoose.fulfilled, (state, action) => {
        state.packageInVenueNotChooseList = action.payload.data
        state.loading = false
      })
      .addCase(getAllPackageInVenueNotChoose.rejected, (state, action) => {
        state.loading = false
      })
    //
  }
})

export default packageSlice.reducer
