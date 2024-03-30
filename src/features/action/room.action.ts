import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import {
  RoomDataCreateRequest,
  RoomDataUpdateRequest,
  RoomGetSlotNotAddRequest,
  SlotInRoomListCreateRequest
} from 'src/dtos/request/room.request'
import { roomService } from 'src/services/room.service'
import { slotService } from 'src/services/slot.service'

export const getAllRoom = createAsyncThunk('room/getAllRoom', async (date: string, { rejectWithValue }) => {
  try {
    const response = await roomService.getAllRoom(date)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError
    console.log(axiosError)
    return rejectWithValue(axiosError.response?.data)
  }
})
export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (payload: RoomDataCreateRequest, { rejectWithValue }) => {
    try {
      const response = await roomService.createRoom(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateRoom = createAsyncThunk(
  'room/updateRoom',
  async (payload: RoomDataUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await roomService.updateRoom(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const enableRoom = createAsyncThunk(
  'room/enableRoom',
  async (payload: RoomGetSlotNotAddRequest, { rejectWithValue }) => {
    try {
      const response = await roomService.enableRoom(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const disableRoom = createAsyncThunk(
  'room/disableRoom',
  async (payload: RoomGetSlotNotAddRequest, { rejectWithValue }) => {
    try {
      const response = await roomService.disableRoom(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createSlotInRoomListByRoomId = createAsyncThunk(
  'room/createSlotInRoomListByRoomId',
  async (request: SlotInRoomListCreateRequest, { rejectWithValue }) => {
    try {
      const response = await slotService.createSlotInRoomListByRoomId(request)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getSlotNotAddByRoomId = createAsyncThunk(
  'room/getSlotNotAddByRoomId',
  async (payload: RoomGetSlotNotAddRequest, { rejectWithValue }) => {
    try {
      const response = await roomService.getSlotNotAddByRoomId(payload)
      return response.data
    } catch (error: any) {
      const axiosError = error as AxiosError
      console.log(axiosError)
      return rejectWithValue(axiosError.response?.data)
    }
  }
)
