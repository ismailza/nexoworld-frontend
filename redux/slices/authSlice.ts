import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginCredentials } from "@/types/login.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterCredentials } from "@/types/register.types";
import axiosInstance from "@/services/axios.service";
import { AppResponse } from "@/types/response.types";
import { User } from "@/types/user.types";
import { AuthResponse } from "@/types/auth-response.types";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AppResponse<AuthResponse>>(
        `/auth/login`,
        credentials
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Store tokens in AsyncStorage
      await AsyncStorage.multiSet([
        ["user", JSON.stringify(response.data.result.user)],
        ["accessToken", response.data.result.accessToken],
        ["refreshToken", response.data.result.refreshToken],
      ]);

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AppResponse<any>>(
        `/auth/register`,
        credentials
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear tokens from AsyncStorage
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      return true;
    } catch (error: any) {
      return rejectWithValue("Logout failed");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post<AppResponse<AuthResponse>>(
        "/auth/refresh",
        { refreshToken: await AsyncStorage.getItem('refreshToken') }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Store tokens in AsyncStorage
      await AsyncStorage.multiSet([
        ["accessToken", response.data.result.accessToken],
        ["refreshToken", response.data.result.refreshToken],
      ]);

      return response.data.result;
    } catch (error: any) {
      // If refresh token fails, logout user
      await dispatch(logout());
      return rejectWithValue("Failed to refresh token");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<AppResponse<User>>('/auth/me');

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { rejectWithValue }) => {
    try {
      const tokens = await AsyncStorage.multiGet([
        "user",
        "accessToken",
        "refreshToken",
      ]);
      const user = tokens[0][1];
      const accessToken = tokens[1][1];
      const refreshToken = tokens[2][1];

      if (!accessToken || !refreshToken || !user) {
        throw new Error("No tokens found");
      }

      return {
        accessToken,
        refreshToken,
        user: JSON.parse(user),
      };
    } catch (error) {
      return rejectWithValue("No valid session found");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      // Check Auth State
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(checkAuthState.rejected, (state) => {
        return initialState;
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
