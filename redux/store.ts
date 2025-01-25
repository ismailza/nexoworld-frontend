import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import coinsReducer from "./slices/coinsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    coins: coinsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
