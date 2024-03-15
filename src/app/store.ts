// store.ts

import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import authReducer from '../features/auth.slice'
import slotReducer from '../features/slice/slot.slice'
import themeReducer from '../features/slice/theme.slice'
import packageReducer from '../features/slice/package.slice'
import serviceReducer from '../features/slice/service.slice'
import inquiryReducer from '../features/slice/inquiry.slice'
import venueReducer from '../features/slice/venue.slice'

export const store = configureStore({
  reducer: {
    authReducer,
    slotReducer,
    themeReducer,
    packageReducer,
    serviceReducer,
    inquiryReducer,
    venueReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
