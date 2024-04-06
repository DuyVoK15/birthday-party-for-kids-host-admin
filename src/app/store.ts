// store.ts

import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import authReducer from '../features/slice/auth.slice'
import slotReducer from '../features/slice/slot.slice'
import themeReducer from '../features/slice/theme.slice'
import packageReducer from '../features/slice/package.slice'
import serviceReducer from '../features/slice/service.slice'
import inquiryReducer from '../features/slice/inquiry.slice'
import venueReducer from '../features/slice/venue.slice'
import dashboardReducer from '../features/slice/dashboard.slice'
import paymentReducer from '../features/slice/payment.slice'
import partyBookingReducer from '../features/slice/partyBooking.slice'
import reviewReducer from '../features/slice/reivew.slice'

export const store = configureStore({
  reducer: {
    authReducer,
    slotReducer,
    themeReducer,
    packageReducer,
    serviceReducer,
    inquiryReducer,
    venueReducer,
    dashboardReducer,
    paymentReducer,
    partyBookingReducer,
    reviewReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
