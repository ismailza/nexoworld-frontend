import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';

interface LocationState {
  location: Region | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = (): LocationState => {
  const [location, setLocation] = useState<Region | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        // Request permission to access location
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, error, loading };
};