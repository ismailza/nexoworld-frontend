import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  tabBarHeight: 80,
  bottomSpacing: Platform.OS === "ios" ? 34 : 24,
} as const;
