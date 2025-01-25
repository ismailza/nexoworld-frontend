// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useState } from "react";
// import "react-native-reanimated";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { useColorScheme } from "@/hooks/useColorScheme";
// import { Provider } from "react-redux";
// import { store } from "@/redux/store";
// import "@/services/axios.service";
// import { useAuth } from "@/hooks/useAuth";
// import { socketService } from "@/services/socket.service";

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// function AuthenticatedLayout() {
//   const colorScheme = useColorScheme();
//   const { checkAuth } = useAuth();
//   const [authChecked, setAuthChecked] = useState(false);
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     async function initializeApp() {
//       try {
//         // Check authentication state when app starts
//         await checkAuth();
//         socketService.connect();
//       } catch (error) {
//         console.log("Auth check failed:", error);
//       } finally {
//         setAuthChecked(true);
//       }
//     }

//     if (loaded) {
//       initializeApp();
//     }

//     return () => {
//       if (loaded) {
//         socketService.disconnect();
//       }
//     };
//   }, [loaded, checkAuth]);

//   useEffect(() => {
//     if (loaded && authChecked) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, authChecked]);

//   if (!loaded || !authChecked) {
//     return null;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         >
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="coin-catcher" options={{ headerShown: false }} />
//           <Stack.Screen name="+not-found" />
//         </Stack>
//         <StatusBar style="auto" />
//       </ThemeProvider>
//     </GestureHandlerRootView>
//   );
// }

// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <AuthenticatedLayout />
//     </Provider>
//   );
// }
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "@/services/axios.service";
import { useAuth } from "@/hooks/useAuth";
import { socketService } from "@/services/socket.service";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthenticatedLayout() {
  const colorScheme = useColorScheme();
  const { checkAuth, isAuthenticated } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function initializeApp() {
      try {
        // Check authentication state when app starts
        await checkAuth();

        // Initialize socket connection if authenticated
        if (isAuthenticated) {
          socketService.connect();
        }
      } catch (error) {
        console.log("Auth check failed:", error);
      } finally {
        setAuthChecked(true);
      }
    }

    if (loaded) {
      initializeApp();
    }

    // Cleanup socket connection only when the app is fully unmounted
    return () => {
      if (isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [loaded, checkAuth, isAuthenticated]);

  useEffect(() => {
    if (loaded && authChecked) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authChecked]);

  if (!loaded || !authChecked) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="coin-catcher" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthenticatedLayout />
    </Provider>
  );
}
