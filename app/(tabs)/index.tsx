import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import MapView, { Marker, Region } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";
import { ThemedText } from "@/components/ThemedText";

const DEFAULT_REGION: Region = {
  latitude: 33.697904,
  longitude: -7.4019606,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const { location, error, loading } = useLocation();

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
        zoomEnabled={true}
        showsMyLocationButton={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        )}
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