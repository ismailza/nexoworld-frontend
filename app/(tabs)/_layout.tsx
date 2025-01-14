import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { CustomTabBar } from "@/components/CustomTabBar";
import { MapLoader } from "@/components/MapLoader";

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export default function TabLayout() {
  const { isLoading, isAuthenticated } = useProtectedRoute();

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <MapLoader status="Loading your experience..." />
      </ThemedView>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getTabIcon = (iconName: keyof typeof Ionicons.glyphMap) => {
    return ({ focused, color, size }: TabBarIconProps) => (
      <Ionicons
        name={
          focused
            ? iconName
            : (`${iconName}-outline` as keyof typeof Ionicons.glyphMap)
        }
        size={size}
        color={color}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: getTabIcon("home"),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "CatchMap",
          tabBarIcon: getTabIcon("compass"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: getTabIcon("person"),
        }}
      />
    </Tabs>
  );
}
