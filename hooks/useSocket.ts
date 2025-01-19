import { useEffect, useCallback } from "react";
import { socketService } from "@/services/socket.service";
import { useAuth } from "./useAuth";
import { CoinLocation } from "@/types/coin.types";
import { Region } from "react-native-maps";
import { User } from "@/types/user.types";

export const useSocket = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const onCoinsUpdate = useCallback(
    (callback: (coins: CoinLocation[]) => void) => {
      socketService.addListener("nearbyCoins", callback);
      return () => socketService.removeListener("nearbyCoins", callback);
    },
    []
  );

  const onCaughtCoinsUpdate = useCallback(
    (callback: (coins: CoinLocation[]) => void) => {
      socketService.addListener("caughtCoins", callback);
      return () => socketService.removeListener("caughtCoins", callback);
    },
    []
  );

  const updateLocation = useCallback((location: Region) => {
    socketService.emit("nearbyCoins", {
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }, []);

  const catchCoin = useCallback((coinLocationId: string) => {
    socketService.emit("catchCoin", coinLocationId);
  }, []);

  const onCoinCaught = useCallback(
    (callback: (coinLocation: CoinLocation) => void) => {
      socketService.addListener("coinCaught", callback);
      return () => socketService.removeListener("coinCaught", callback);
    },
    []
  );

  const onRemoveNearbyCoin = useCallback(
    (callback: (coinLocationId: string) => void) => {
      socketService.addListener("removeNearbyCoin", callback);
      return () => socketService.removeListener("removeNearbyCoin", callback);
    },
    []
  );

  const onMessageRecieve = useCallback(
    (callback: (message: string) => void) => {
      socketService.addListener("message", callback);
      return () => socketService.removeListener("message", callback);
    },
    []
  );

  const onUpdateScore = useCallback((callback: (user: User) => void) => {
    socketService.addListener("scoreUpdated", callback);
    return () => socketService.removeListener("scoreUpdated", callback);
  }, []);

  const sendMessage = useCallback((message: string) => {
    socketService.emit("message", message);
  }, []);

  return {
    onCoinsUpdate,
    onCaughtCoinsUpdate,
    updateLocation,
    catchCoin,
    onCoinCaught,
    onRemoveNearbyCoin,
    onUpdateScore,
    onMessageRecieve,
    sendMessage,
  };
};
