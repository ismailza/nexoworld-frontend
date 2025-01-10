import ParallaxScrollView from '@/components/ParallaxScrollView';
import { View, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { profileStyles as styles } from '@/styles/profile.styles';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() || 'light';
  const { logout } = useAuth();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles(colorScheme).headerLogo}
        />
      }
    >
      <View style={styles(colorScheme).unauthenticatedContainer}>
      <ThemedText style={styles(colorScheme).welcomeText}>
        Welcome to Our App!
      </ThemedText>
      <ThemedText style={styles(colorScheme).subText}>
        Sign in to access your profile and personalized features
      </ThemedText>
      
      <TouchableOpacity 
        style={styles(colorScheme).loginButton}
        onPress={() => router.push('/auth/login')}
      >
        <ThemedText style={styles(colorScheme).loginButtonText}>Log In</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles(colorScheme).signupButton}
        onPress={() => router.push('/auth/register')}
      >
        <ThemedText style={styles(colorScheme).signupButtonText}>
          Create Account
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles(colorScheme).signupButton}
        onPress={() => logout()}
      >
        <ThemedText style={styles(colorScheme).signupButtonText}>
          Log Out
        </ThemedText>
      </TouchableOpacity>
    </View>
    </ParallaxScrollView>
  );
}