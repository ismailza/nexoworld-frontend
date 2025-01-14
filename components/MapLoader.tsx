import React from "react";
import { View, Animated, useColorScheme } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { mapLoaderStyles as styles } from "@/styles/map-loader.styles";

interface MapLoaderProps {
  status?: string;
}

export const MapLoader = ({ status = "Loading map..." }: MapLoaderProps) => {
  const colorScheme = useColorScheme() || "light";
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles(colorScheme).container}>
      <View style={styles(colorScheme).loaderContent}>
        <Animated.View
          style={[
            styles(colorScheme).iconContainer,
            {
              transform: [{ scale: pulseAnim }, { rotate }],
            },
          ]}
        >
          <Ionicons name="map-outline" size={48} style={styles(colorScheme).icon} />
        </Animated.View>
        <ThemedText style={styles(colorScheme).status}>{status}</ThemedText>
        <View style={styles(colorScheme).progressContainer}>
          <View style={styles(colorScheme).progressBar}>
            <Animated.View
              style={[
                styles(colorScheme).progressIndicator,
                {
                  transform: [
                    {
                      translateX: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 100],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
