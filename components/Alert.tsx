import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  useColorScheme,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

type AlertProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
};

export function Alert({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
}: AlertProps) {
  const colorScheme = useColorScheme() || "light";
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <ThemedView style={styles(colorScheme).overlay}>
        <Animated.View
          style={[styles(colorScheme).alertContainer, animatedStyle]}
        >
          <ThemedText style={styles(colorScheme).title}>{title}</ThemedText>
          <ThemedText style={styles(colorScheme).message}>{message}</ThemedText>
          <ThemedView style={styles(colorScheme).buttonContainer}>
            {cancelText && (
              <TouchableOpacity
                onPress={handleCancel}
                style={styles(colorScheme).cancelButton}
              >
                <ThemedText style={styles(colorScheme).cancelButtonText}>
                  {cancelText}
                </ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles(colorScheme).confirmButton}
            >
              <ThemedText style={styles(colorScheme).confirmButtonText}>
                {confirmText}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Animated.View>
      </ThemedView>
    </Modal>
  );
}

const styles = (colorScheme: "light" | "dark") => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    alertContainer: {
      width: width * 0.85,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      backgroundColor: colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 12,
      color: colors.text,
      textAlign: "center",
    },
    message: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 24,
      color: colors.secondaryText,
      lineHeight: 24,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: 12,
    },
    confirmButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    confirmButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.surfaceHighlighted,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
};
