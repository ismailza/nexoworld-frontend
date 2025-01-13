import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import MapView, { Marker, Region } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";
import { ThemedText } from "@/components/ThemedText";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { CoinLocation } from "@/types/coin.types";
import { Ionicons } from "@expo/vector-icons";
import { NexoMarker } from "@/components/NexoMarker";

const DEFAULT_REGION: Region = {
  latitude: 33.697904,
  longitude: -7.4019606,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const { location, error, loading } = useLocation();
  const { updateLocation, onCoinsUpdate } = useSocket();
  const [nearbyCoins, setNearbyCoins] = useState<CoinLocation[]>([]);

  useEffect(() => {
    if (location) {
      updateLocation(location);
    }
  }, [location]);

  // Listen for nearby coins updates
  useEffect(() => {
    const unsubscribe = onCoinsUpdate((coins) => {
      console.log('Received coins:', coins);
      const validCoins = coins.map(coin => ({
        ...coin,
        latitude: parseFloat(coin.latitude.toString()),
        longitude: parseFloat(coin.longitude.toString()),
      }));
      setNearbyCoins(validCoins);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      <MapView
        style={styles.map}
        initialRegion={location || DEFAULT_REGION}
        region={location || undefined}
        zoomEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Player location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You"
          >
            <Ionicons name="person" size={24} color="blue" />
          </Marker>
        )}

        {/* Coin markers */}
        {nearbyCoins.map((coinLocation) => (
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  map: {
    flex: 1,
  },
});