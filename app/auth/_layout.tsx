import { usePublicRoute } from "@/hooks/usePublicRoute";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated } = usePublicRoute();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
    }} />
  );
}