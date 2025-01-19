import { Platform, StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_WIDTH = Math.min(SCREEN_WIDTH - 32, 420);

export const tabsStyles = (colorScheme: "light" | "dark") => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    tabBar: {
      flexDirection: "row",
      position: "absolute",
      bottom: Platform.OS === "ios" ? 34 : 24,
      left: (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2,
      width: TAB_BAR_WIDTH,
      height: 72,
      borderRadius: 36,
      backgroundColor:
        colorScheme === "dark" ? colors.surfaceDefault : colors.background,
      overflow: "hidden",
      borderWidth: 1,
      borderColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      elevation: 0,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: colorScheme === "dark" ? 0.4 : 0.3,
      shadowRadius: 16,
    },
    tabButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      position: "relative",
    },
    tabBackground: {
      position: "absolute",
      backgroundColor:
        colorScheme === "dark"
          ? "rgba(178, 116, 9, 0.15)"
          : "rgba(178, 116, 9, 0.1)",
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 1,
      borderColor:
        colorScheme === "dark"
          ? "rgba(178, 116, 9, 0.2)"
          : "rgba(178, 116, 9, 0.15)",
    },
    tabContent: {
      justifyContent: "center",
      alignItems: "center",
      width: 56,
      height: 56,
      borderRadius: 28,
    },
  });
};
