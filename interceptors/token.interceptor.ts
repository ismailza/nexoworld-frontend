import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.interceptors.request.use(
  async (config) => {
    console.log('Request interceptor...');
    
    // Get the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem('accessToken');
    
    // If token exists, add it to the headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);