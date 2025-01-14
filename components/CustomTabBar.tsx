import React from "react";
import { StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AnimatedTab } from "./AnimatedTab";
import { tabsStyles as styles } from "@/styles/tabs.styles";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";

type TabRoute = "/" | "/explore" | "/profile";

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const colors = Colors[colorScheme ?? "light"];

  const getRouteName = (name: string): TabRoute => {
    switch (name) {
      case "index":
        return "/";
      case "explore":
        return "/explore";
      case "profile":
        return "/profile";
      default:
        return "/";
    }
  };

  return (
    <Animated.View style={styles(colorScheme).tabBar}>
      <BlurView
        intensity={80}
        tint={colorScheme === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            const routeName = getRouteName(route.name);
            router.push(routeName);
          }
        };

        return (
          <AnimatedTab
            key={route.key}
            onPress={onPress}
            accessibilityState={{ selected: isFocused }}
          >
            {options.tabBarIcon?.({
              focused: isFocused,
              color: isFocused ? colors.tabIconSelected : colors.tabIconDefault,
              size: 24,
            })}
          </AnimatedTab>
        );
      })}
    </Animated.View>
  );
};
