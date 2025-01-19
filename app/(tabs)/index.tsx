import { StyleSheet, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";
import { ThemedText } from "@/components/ThemedText";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { CoinLocation } from "@/types/coin.types";
import { NexoMarker } from "@/components/NexoMarker";
import { MapLoader } from "@/components/MapLoader";
import { useAuth } from "@/hooks/useAuth";

const DEFAULT_REGION: Region = {
  latitude: 33.697904,
  longitude: -7.4019606,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { location, error, loading } = useLocation();
  const { updateLocation, onCoinsUpdate, onRemoveNearbyCoin } = useSocket();
  const [nearbyCoins, setNearbyCoins] = useState<CoinLocation[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (location && mapReady) {
      updateLocation(location);
    }
  }, [location, mapReady]);

  useEffect(() => {
    const unsubscribe = onCoinsUpdate((coins) => {
      console.log("Received coins:", coins);
      const validCoins = coins.map((coin) => ({
        ...coin,
        latitude: parseFloat(coin.latitude.toString()),
        longitude: parseFloat(coin.longitude.toString()),
      }));
      setNearbyCoins(validCoins);
    });

    const removeCoin = onRemoveNearbyCoin((coinLocationId) => {
      setNearbyCoins((coins) => coins.filter((coin) => coin.id !== coinLocationId));
    });

    return () => {
      unsubscribe();
      removeCoin();
    };
  }, []);

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
                user.avatar
                  ? { uri: user.avatar }
                  : require("@/assets/images/male_profile.png")
              }
              style={styles.avatar}
            />
          </Marker>
        )}

        {mapReady &&
          nearbyCoins.map((coinLocation) => (
            <Marker
              key={coinLocation.id}
              coordinate={{
                latitude: coinLocation.latitude,
                longitude: coinLocation.longitude,
              }}
              title={`${coinLocation.coin.name} : ${coinLocation.coin.type}`}
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
