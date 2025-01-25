import { StyleSheet, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";
import { ThemedText } from "@/components/ThemedText";
import { useSocket } from "@/hooks/useSocket";
import { useCallback, useEffect, useState } from "react";
import { CoinLocation } from "@/types/coin.types";
import { NexoMarker } from "@/components/NexoMarker";
import { MapLoader } from "@/components/MapLoader";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getOwnedCoins } from "@/redux/slices/coinsSlice";

const DEFAULT_REGION: Region = {
  latitude: 33.697904,
  longitude: -7.4019606,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function CatchMapScreen() {
  const { user } = useAuth();
  const { location, error, loading } = useLocation();
  const { onOwnedCoinsUpdate, onCoinCaught } = useSocket();
  const [ownedCoins, setOwnedCoins] = useState<CoinLocation[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const dispatch = useAppDispatch();
  const coins = useAppSelector((state) => state.coins);

  const handleGetOwnedCoins = useCallback(() => {
    return dispatch(getOwnedCoins()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    handleGetOwnedCoins().then((coins) => {
      const validCoins = coins
      .map((coin) => ({
        ...coin,
        latitude: parseFloat(coin.latitude.toString()),
        longitude: parseFloat(coin.longitude.toString()),
      }))
      .filter(
        (coin) =>
          !isNaN(coin.latitude) &&
          !isNaN(coin.longitude) &&
          coin.latitude >= -90 &&
          coin.latitude <= 90 &&
          coin.longitude >= -180 &&
          coin.longitude <= 180
      );
      setOwnedCoins(validCoins);
    });
  }, []);

  useEffect(() => {
    // const unsubscribe = onOwnedCoinsUpdate((coins) => {
    //   console.log("Received owned coins: ", coins.length);
    //   const validCoins = coins.map((coin) => ({
    //     ...coin,
    //     latitude: parseFloat(coin.latitude.toString()),
    //     longitude: parseFloat(coin.longitude.toString()),
    //   }));
    //   setOwnedCoins(validCoins);
    // });

    const unsubscribe = onCoinCaught((coin) => {
      console.log("Received caught coin: ", coin);
      const validCoin = {
        ...coin,
        latitude: parseFloat(coin.latitude.toString()),
        longitude: parseFloat(coin.longitude.toString()),
      };
      setOwnedCoins((coins) => [...coins, validCoin]);
    });

    return () => {
      unsubscribe();
    };
  }, [location, mapReady]);

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <MapLoader status="Getting your location..." />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {!mapReady && <MapLoader status="Initializing map..." />}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location || DEFAULT_REGION}
        region={location || undefined}
        zoomEnabled={true}
        showsMyLocationButton={true}
        onMapReady={() => setMapReady(true)}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
      >
        {location && mapReady && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You"
          >
            <Image
              source={
                user?.avatar
                  ? { uri: user.avatar }
                  : require("@/assets/images/male_profile.png")
              }
              style={styles.avatar}
            />
          </Marker>
        )}

        {mapReady &&
          ownedCoins.map((coinLocation) => (
            <Marker
              key={coinLocation.id}
              coordinate={{
                latitude: coinLocation.latitude,
                longitude: coinLocation.longitude,
              }}
              title={`${coinLocation.coin.name} : ${coinLocation.coin.type}`}
              description={`caught at ${coinLocation.caughtAt}`}
            >
              <NexoMarker coin={coinLocation.coin} />
            </Marker>
          ))}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  avatar: {
    width: 20,
    height: 20,
  },
  map: {
    flex: 1,
  },
});
