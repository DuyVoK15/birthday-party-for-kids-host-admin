// store.ts

import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import authReducer from '../features/auth.slice'
import slotReducer from '../features/slice/slot.slice'

export const store = configureStore({
  reducer: {
    authReducer,
    slotReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
