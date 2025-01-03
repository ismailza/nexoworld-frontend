import { User } from "./user.types";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
};