import { useCallback } from "react";
import { login, logout, register, resetError } from "@/redux/slices/authSlice";
import type { LoginCredentials } from "@/types/login.types";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { RegisterCredentials } from "@/types/register.types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(login(credentials)).unwrap();
    },
    [dispatch]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      return dispatch(register(credentials)).unwrap();
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleResetError = useCallback(() => {
    dispatch(resetError());
  }, [dispatch]);

  return {
    ...auth,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    resetError: handleResetError,
  };
};
