import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "@/config/app.config";
import { AppResponse } from "@/types/response.types";
import { AuthResponse } from "@/types/auth-response.types";

const axiosInstance = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("Axios error:", error);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh the token
        const accessToken = await refreshAccessToken();

        processQueue();

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await axiosInstance.post<AppResponse<AuthResponse>>(
      `/auth/refresh`,
      {refreshToken}
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    // Store new tokens
    await AsyncStorage.multiSet([
      ['accessToken', response.data.result.accessToken],
      ['refreshToken', response.data.result.refreshToken],
    ]);

    return response.data.result.accessToken;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;
