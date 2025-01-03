import axios from "axios";
import { LoginCredentials } from "@/types/login.types";
import { AppResponse } from "@/types/response.types";
import { RegisterCredentials } from "@/types/register.types";
import { APP_CONFIG } from "@/config/app.config";
import { AuthResponse } from "@/types/auth-response.types";

export class AuthService {
  private baseUrl: string = APP_CONFIG.API_URL;

  async login(credentials: LoginCredentials): Promise<any> {
    try {      
      const response = await axios.post<AppResponse<AuthResponse>>(
        `${this.baseUrl}/auth/login`,
        credentials
      );
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message);      
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<any> {
    try {      
      const response = await axios.post<AppResponse<AuthResponse>>(
        `${this.baseUrl}/auth/register`,
        credentials
      );
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message);      
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}