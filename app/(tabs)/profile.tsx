import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { profileStyles as styles } from '@/styles/profile.styles';
import { useAuth } from '@/hooks/useAuth';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() || 'light';
  const { logout, profile, user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !user) {
      profile().catch(error => {
        console.error('Profile error:', error);
      });
    }
  }, [isAuthenticated, user]);

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles(colorScheme).loadingContainer}>
        <ActivityIndicator color={Colors[colorScheme].primary} size="large" />
      </ThemedView>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ThemedView style={styles(colorScheme).container}>
      <LinearGradient
        colors={[
          Colors[colorScheme].primary + '0D',
          Colors[colorScheme].background
        ]}
        style={styles(colorScheme).gradientContainer}
      >
        <ScrollView contentContainerStyle={styles(colorScheme).scrollContent}>
          {/* Profile Header */}
          <ThemedView style={styles(colorScheme).profileHeader}>
            <ThemedView style={[styles(colorScheme).avatarContainer, { borderColor: Colors[colorScheme].primary }]}>
              <Image
                source={user.avatar ? { uri: user.avatar } : require('@/assets/images/male_profile.png')}
                style={styles(colorScheme).avatar}
              />
            </ThemedView>
            <ThemedView style={styles(colorScheme).usernameContainer}>
              <ThemedText style={styles(colorScheme).username}>{user.username}</ThemedText>
              {user.isVerified && (
                <View style={styles(colorScheme).verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                  <ThemedText style={styles(colorScheme).verifiedText}>Verified</ThemedText>
                </View>
              )}
            </ThemedView>
          </ThemedView>

          {/* Level Progress */}
          <ThemedView style={[styles(colorScheme).card]}>
            <ThemedView style={styles(colorScheme).levelHeader}>
              <ThemedText style={styles(colorScheme).levelTitle}>Level Progress</ThemedText>
              <ThemedText style={[styles(colorScheme).levelNumber, { color: Colors[colorScheme].primary }]}>
                Level {Math.floor(user.xp / 100) + 1}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[styles(colorScheme).progressBar, { backgroundColor: Colors[colorScheme].primary + '1A' }]}>
              <ThemedView
                style={[
                  styles(colorScheme).progressFill,
                  {
                    backgroundColor: Colors[colorScheme].primary,
                    width: `${(user.xp % 100)}%`
                  }
                ]}
              />
            </ThemedView>
            <ThemedText style={styles(colorScheme).xpText}>{user.xp % 100}/100 XP</ThemedText>
          </ThemedView>

          {/* Personal Info */}
          <ThemedView style={[styles(colorScheme).card]}>
            <ThemedText style={styles(colorScheme).sectionTitle}>Personal Info</ThemedText>
            <InfoRow icon="person" label="Name" value={user.name} />
            <InfoRow icon="mail" label="Email" value={user.email} />
            <InfoRow
              icon="calendar"
              label="Joined"
              value={formatDate(new Date(user.createdAt))}
            />
          </ThemedView>
        </ScrollView>

        {/* Bottom Buttons */}
        <ThemedView style={styles(colorScheme).buttonContainer}>
          <TouchableOpacity
            style={[styles(colorScheme).tradeButton, { backgroundColor: Colors[colorScheme].primary }]}
            onPress={() => {/* Handle trade */}}
          >
            <Ionicons name="swap-horizontal" size={20} color="white" />
            <ThemedText style={styles(colorScheme).buttonText}>Trade Nexo</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles(colorScheme).logoutButton, { borderColor: Colors[colorScheme].error }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color={Colors[colorScheme].error} />
            <ThemedText style={[styles(colorScheme).buttonText, { color: Colors[colorScheme].error }]}>
              Logout
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </LinearGradient>
    </ThemedView>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  const colorScheme = useColorScheme() || 'light';
  
  return (
    <ThemedView style={styles(colorScheme).infoRow}>
      <Ionicons
        name={icon}
        size={20}
        color={Colors[colorScheme].text + '99'}
      />
      <ThemedView style={styles(colorScheme).infoContent}>
        <ThemedText style={styles(colorScheme).infoLabel}>{label}</ThemedText>
        <ThemedText style={styles(colorScheme).infoValue}>{value}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
