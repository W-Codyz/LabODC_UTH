// Auth Slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/auth.service';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from '@/types/auth.types';
import { STORAGE_KEYS } from '@/utils/constants';

interface IUser {
  userId: number;
  email: string;
  fullName?: string;
  role: string;
  status: string;
  emailVerified?: boolean;
}

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO) || 'null'),
  accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ILoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Transform backend response to frontend format
      return {
        user: {
          userId: response.userId,
          email: response.email,
          role: response.role,
          status: response.status,
          emailVerified: response.emailVerified,
        },
        accessToken: response.token,
        refreshToken: response.refreshToken || '',
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: IRegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      // Transform backend response to frontend format
      return {
        user: {
          userId: response.userId,
          email: response.email,
          role: response.role,
          status: response.status,
          emailVerified: response.emailVerified,
        },
        accessToken: response.token,
        refreshToken: response.refreshToken || '',
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error: any) {
    // Even if backend fails, we still want to clear local state
    console.warn('Logout API failed, clearing local state anyway', error);
  }
  // Always clear localStorage
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUser; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(action.payload.user));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, action.payload.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(action.payload.user));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, action.payload.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(action.payload.user));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, action.payload.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state) => {
      // Clear state even on error
      state.loading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
