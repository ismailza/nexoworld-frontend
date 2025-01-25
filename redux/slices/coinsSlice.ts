import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/services/axios.service";
import { CoinLocation } from "@/types/coin.types";

interface CoinsState {
  ownedCoins: CoinLocation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CoinsState = {
  ownedCoins: [],
  isLoading: false,
  error: null,
};

export const getOwnedCoins = createAsyncThunk(
  "coins/owned",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<CoinLocation[]>(
        `/coins/owned`,
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Owned Coins
      .addCase(getOwnedCoins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOwnedCoins.fulfilled, (state, action) => {
        state.ownedCoins = action.payload;
        state.isLoading = false;
      })
      .addCase(getOwnedCoins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
});

export const { resetError } = coinsSlice.actions;
export default coinsSlice.reducer;
