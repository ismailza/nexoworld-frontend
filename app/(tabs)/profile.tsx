import React, { useEffect } from "react";
import {
  Image,
  ActivityIndicator,
  Animated,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { profileStyles as styles } from "@/styles/profile.styles";
import { useAuth } from "@/hooks/useAuth";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/constants/Layout";
import { StatItem } from "@/components/StatItem";
import { InfoRow } from "@/components/InfoRow";
import { router } from "expo-router";

export default function ProfileScreen() {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const { profile, user, isLoading, logout } = useAuth();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user) {
      profile().catch((error) => {
        console.error("Profile error:", error);
      });
    }
  }, [user]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  if (isLoading) {
    return (
      <ThemedView style={styles(colorScheme).loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </ThemedView>
    );
  }

  if (!user) {
    return null;
  }

  const xpProgress = user.xp % 100;

  return (
    <ThemedView style={styles(colorScheme).container}>
      <LinearGradient
        colors={[colors.primary + "30", colors.primary + "20", colors.primary + "10"]}
        style={[
          styles(colorScheme).gradientContainer,
          {
            paddingTop: insets.top || 20,
          },
        ]}
      >
        <Animated.ScrollView
          contentContainerStyle={[
            styles(colorScheme).scrollContent,
            {
              paddingBottom:
                (insets.bottom || 0) +
                Layout.tabBarHeight +
                Layout.bottomSpacing,
            },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          {/* Profile Header */}
          <ThemedView style={styles(colorScheme).profileHeader}>
            <ThemedView style={styles(colorScheme).avatarOuterContainer}>
              <Animated.View
                style={[
                  styles(colorScheme).avatarContainer,
                  {
                    transform: [
                      {
                        scale: scrollY.interpolate({
                          inputRange: [-100, 0, 100],
                          outputRange: [1.2, 1, 0.8],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image
                  source={
                    user.avatar
                      ? { uri: user.avatar }
                      : require("@/assets/images/male_profile.png")
                  }
                  style={styles(colorScheme).avatar}
                />
              </Animated.View>
            </ThemedView>

            <ThemedView style={styles(colorScheme).usernameContainer}>
              <ThemedText style={styles(colorScheme).username}>
                {user.username}
              </ThemedText>
              {user.isVerified && (
                <ThemedView style={styles(colorScheme).verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                  <ThemedText style={styles(colorScheme).verifiedText}>
                    Verified
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>

          {/* Level Card */}
          <ThemedView style={styles(colorScheme).card}>
            <ThemedView style={styles(colorScheme).cardContent}>
              <ThemedView style={styles(colorScheme).levelHeader}>
                <ThemedText style={styles(colorScheme).levelTitle}>
                  Current Level
                </ThemedText>
                <ThemedText style={styles(colorScheme).levelNumber}>
                  Level {user.level}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles(colorScheme).progressContainer}>
                <ThemedView style={styles(colorScheme).progressBar}>
                  <Animated.View
                    style={[
                      styles(colorScheme).progressFill,
                      {
                        width: `${xpProgress}%`,
                      },
                    ]}
                  />
                </ThemedView>
                <ThemedText style={styles(colorScheme).xpText}>
                  {xpProgress}/100 XP to Level {user.level + 1}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles(colorScheme).statsContainer}>
                <StatItem value={user.ownedCoinsCount || 6} label="Owned" />
                <StatItem value={user.caughtCoinsCount || 6} label="Caught" />
                <StatItem value={"-"} label="Traded" />
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Personal Info */}
          <ThemedView style={styles(colorScheme).card}>
            <ThemedView style={styles(colorScheme).cardContent}>
              <ThemedText style={styles(colorScheme).sectionTitle}>
                Personal Info
              </ThemedText>
              <InfoRow icon="person" label="Full Name" value={user.name} />
              <InfoRow icon="mail" label="Email Address" value={user.email} />
              <InfoRow
                icon="calendar"
                label="Member Since"
                value={formatDate(new Date(user.createdAt))}
              />
            </ThemedView>
          </ThemedView>

          {/* Bottom Buttons */}
          <ThemedView
            style={[
              styles(colorScheme).buttonContainer,
              {
                bottom:
                  (insets.bottom || 0) + (Platform.OS === "ios" ? 10 : 20),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles(colorScheme).button,
                styles(colorScheme).tradeButton,
              ]}
              activeOpacity={0.7}
            >
              <ThemedView style={styles(colorScheme).buttonIcon}>
                <Ionicons name="swap-horizontal" size={24} color="white" />
              </ThemedView>
              <ThemedText
                style={[styles(colorScheme).buttonText, { color: "white" }]}
              >
                Trade Nexo
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles(colorScheme).button,
                styles(colorScheme).logoutButton,
              ]}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <ThemedView style={styles(colorScheme).buttonIcon}>
                <Ionicons name="log-out" size={24} color={colors.error} />
              </ThemedView>
              <ThemedText
                style={[
                  styles(colorScheme).buttonText,
                  { color: colors.error },
                ]}
              >
                Logout
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Animated.ScrollView>
      </LinearGradient>
    </ThemedView>
  );
}
