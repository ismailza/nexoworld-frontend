import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from './useAuth';

export const usePublicRoute = () => {
  const { isAuthenticated } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isNavigating) {
      setIsNavigating(true);
      requestAnimationFrame(() => {
        router.replace('/(tabs)');
      });
    }
  }, [isAuthenticated]);

  return { isAuthenticated };
};