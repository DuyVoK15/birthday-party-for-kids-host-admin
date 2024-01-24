import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import AppConstants from '../enums/app';
import { authService } from '../services/auth.service';
import { LoginDto } from 'src/utils/fakeDto';

interface AuthState {
  isAuthenticated: boolean;
  user: LoginDto | null;
  loading: boolean,
  error: string | null,
  // Thêm các trường khác liên quan đến người dùng nếu cần thiết
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: '',
}

export const login = createAsyncThunk('auth/login',
  async (payload: {username: string, password: string}, { rejectWithValue }) => {
    try {
      const result = await authService.login(payload);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  })
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state, action) => {
        state.isAuthenticated = true;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
      })

  },
});

export default authSlice.reducer;
