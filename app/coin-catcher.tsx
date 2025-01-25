import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { NEXO_ICONS } from "@/components/NexoMarker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSocket } from "@/hooks/useSocket";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");

const CoinCatcherScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, type } = params;

  const { catchCoin } = useSocket();

  if (!id || !type) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error: No coin data provided.</ThemedText>
      </ThemedView>
    );
  }

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [coinPosition, setCoinPosition] = useState({
    x: width / 2 - 25,
    y: 100,
  });
  const [ballPosition, setBallPosition] = useState({
    x: width / 2 - 25,
    y: height - 150,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const ballVelocity = useRef({ x: 0, y: 0 });
  const gravity = 0.5;
  const throwSpeed = 20;
  const coinScale = useSharedValue(1);
  const coinOpacity = useSharedValue(1);
  const successEffect = useSharedValue(0);
  const failureEffect = useSharedValue(0);

  const successSound = useRef<Audio.Sound | null>(null);
  const failureSound = useRef<Audio.Sound | null>(null);

  // Load sound effects
  useEffect(() => {
    const loadSounds = async () => {
      const { sound: success } = await Audio.Sound.createAsync(
        require("@/assets/sounds/mixkit-software-interface-back-2575.wav")
      );
      const { sound: failure } = await Audio.Sound.createAsync(
        require("@/assets/sounds/mixkit-wrong-answer-fail-notification-946.wav")
      );
      successSound.current = success;
      failureSound.current = failure;
    };

    loadSounds();

    return () => {
      if (successSound.current) {
        successSound.current.unloadAsync();
      }
      if (failureSound.current) {
        failureSound.current.unloadAsync();
      }
    };
  }, []);

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Randomize coin position
  useEffect(() => {
    const randomX = Math.random() * (width - 120);
    const randomY = Math.random() * (height / 2);
    setCoinPosition({ x: randomX, y: randomY });
  }, []);

  // Handle ball throw animation
  const throwBall = (velocityX: number, velocityY: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    ballVelocity.current = { x: velocityX, y: velocityY };

    const animation = setInterval(() => {
      setBallPosition((prev) => {
        const newX = prev.x + ballVelocity.current.x;
        const newY = prev.y + ballVelocity.current.y;

        // Apply gravity
        ballVelocity.current.y += gravity;

        // Check for collision with coin
        if (
          newX + 50 > coinPosition.x &&
          newX < coinPosition.x + 50 &&
          newY + 50 > coinPosition.y &&
          newY < coinPosition.y + 50
        ) {
          clearInterval(animation);
          setIsCaptured(true);
          runOnJS(handleCatchCoin)();
          return prev;
        }

        // Check if ball is off screen
        if (newY > height || newX < 0 || newX > width) {
          clearInterval(animation);
          setIsAnimating(false);
          runOnJS(handleMiss)();
          return { x: width / 2 - 25, y: height - 150 };
        }

        return { x: newX, y: newY };
      });
    }, 16); // ~60 FPS
  };

  // Handle pan gesture to throw the ball
  const onPanGestureEvent = (event: {
    nativeEvent: { velocityX: number; velocityY: number };
  }) => {
    if (isAnimating) return;

    const { velocityX, velocityY } = event.nativeEvent;

    // Calculate the angle of the swipe gesture
    const angle = Math.atan2(velocityY, velocityX);

    // Calculate the velocity components based on the angle
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const speedFactor = 0.05;
    const velocityXFinal = Math.cos(angle) * velocity * speedFactor;
    const velocityYFinal = Math.sin(angle) * velocity * speedFactor;

    // Throw the ball in the calculated direction
    throwBall(velocityXFinal, velocityYFinal);
  };

  const handleCatchCoin = async () => {
    try {
      coinScale.value = withSpring(0, { damping: 10, stiffness: 100 });
      coinOpacity.value = withTiming(0, { duration: 500 });
      successEffect.value = withTiming(1, { duration: 500 });
  
      // Play success sound
      if (successSound.current) {
        await successSound.current.replayAsync();
      }
  
      // Send a catch coin event to the server
      await catchCoin(id as string);
    } catch (error) {
      console.error("Failed to catch coin:", error);
    } finally {
      // Close the screen after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  };

  // Handle miss animation
  const handleMiss = async () => {
    failureEffect.value = withTiming(1, { duration: 500 }); // Trigger failure effect

    // Play failure sound
    if (failureSound.current) {
      await failureSound.current.replayAsync();
    }

    // Reset failure effect after 2 seconds
    setTimeout(() => {
      failureEffect.value = withTiming(0, { duration: 500 });
    }, 2000);
  };

  // Animated styles for success and failure effects
  const successEffectStyle = useAnimatedStyle(() => ({
    opacity: successEffect.value,
    transform: [{ scale: successEffect.value * 2 }], // Scale up effect
    backgroundColor: "rgba(0, 255, 0, 0.3)", // Green glow
    borderRadius: 100,
    width: 200,
    height: 200,
    position: "absolute",
    top: coinPosition.y - 50,
    left: coinPosition.x - 50,
  }));

  const failureEffectStyle = useAnimatedStyle(() => ({
    opacity: failureEffect.value,
    transform: [{ scale: failureEffect.value * 2 }], // Scale up effect
    backgroundColor: "rgba(255, 0, 0, 0.3)", // Red glow
    borderRadius: 100,
    width: 200,
    height: 200,
    position: "absolute",
    top: coinPosition.y - 50,
    left: coinPosition.x - 50,
  }));

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onCameraReady={() => setCameraReady(true)}
      >
        {/* Coin */}
        <Animated.View
          style={[
            styles.coin,
            {
              left: coinPosition.x,
              top: coinPosition.y,
              transform: [{ scale: coinScale }],
              opacity: coinOpacity,
            },
          ]}
        >
          <Image
            source={
              NEXO_ICONS[type as keyof typeof NEXO_ICONS] || NEXO_ICONS.COMMON
            }
            style={styles.coinImage}
          />
        </Animated.View>

        {/* Ball */}
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <View
            style={[styles.ball, { left: ballPosition.x, top: ballPosition.y }]}
          >
            <Image
              source={require("@/assets/images/nexoball.png")}
              style={styles.ballImage}
            />
          </View>
        </PanGestureHandler>

        {/* Success Effect */}
        <Animated.View style={[styles.effectContainer, successEffectStyle]} />

        {/* Failure Effect */}
        <Animated.View style={[styles.effectContainer, failureEffectStyle]} />
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  coin: {
    position: "absolute",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  coinImage: {
    width: 120,
    height: 120,
  },
  ball: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  ballImage: {
    width: 60,
    height: 60,
  },
  effectContainer: {
    position: "absolute",
  },
});

export default CoinCatcherScreen;
