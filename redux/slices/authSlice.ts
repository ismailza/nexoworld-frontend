import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "@/services/auth.service";
import { LoginCredentials } from "@/types/login.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterCredentials } from "@/types/register.types";

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
      const authService = new AuthService();
      const response = await authService.login(credentials);

      // Store tokens in AsyncStorage
      await AsyncStorage.multiSet([
        ["accessToken", response.result.accessToken],
        ["refreshToken", response.result.refreshToken],
      ]);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const authService = new AuthService();
      const response = await authService.register(credentials);
      
      return response;
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

export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { rejectWithValue }) => {
    try {
      const tokens = await AsyncStorage.multiGet([
        "accessToken",
        "refreshToken",
      ]);
      const accessToken = tokens[0][1];
      const refreshToken = tokens[1][1];

      if (!accessToken || !refreshToken) {
        throw new Error("No tokens found");
      }

      return {
        accessToken,
        refreshToken,
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
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(checkAuthState.rejected, (state) => {
        return initialState;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
