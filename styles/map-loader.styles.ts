import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const mapLoaderStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors[colorScheme].background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContent: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(12, 105, 128, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    color: "#b27409"
  },
  status: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "600",
  },
  progressContainer: {
    width: 200,
    height: 4,
    backgroundColor: "rgba(12, 105, 128, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    flex: 1,
    overflow: "hidden",
  },
  progressIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#b27409",
    width: 100,
  },
});