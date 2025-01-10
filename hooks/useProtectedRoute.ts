import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from './useAuth';

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !isNavigating) {
      setIsNavigating(true);
      requestAnimationFrame(() => {
        router.replace('/auth/login');
      });
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};