import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "@/config/app.config";
import { store } from "@/redux/store";
import { refreshToken } from "@/redux/slices/authSlice";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private isRefreshing: boolean = false;

  async connect() {
    if (this.socket?.connected) return;

    const token = await AsyncStorage.getItem("accessToken");
    if (!token) return;

    this.socket = io(APP_CONFIG.WS_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: token
        ? {
            token: `Bearer ${token}`,
          }
        : undefined,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.socket.on('auth_error', async (error: any) => {
      console.error('Authentication error:', error);
      if (error.code === 401) {
        await this.refreshTokenAndReconnect();
      }
    });

    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, (data) => callback(data));
      });
    });
  }

  private async refreshTokenAndReconnect() {
    try {
      if (this.isRefreshing) return;

      this.isRefreshing = true;
      const { dispatch } = store;
      await dispatch(refreshToken()).unwrap();

      // Reconnect with new token
      await this.connect();
    } catch (error) {
      console.error("Token refresh failed:", error);
    } finally {
      this.isRefreshing = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (!this.socket?.connected) return;
    this.socket.emit(event, data);
  }

  addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  removeListener(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private notifyListeners(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }
}

export const socketService = new SocketService();
