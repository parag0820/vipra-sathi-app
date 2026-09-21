import axios from 'axios';
import Toast from 'react-native-toast-message';

export const API_BASE_URL = 'https://backend.viprasaarthi.com';
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });
    return Promise.reject(error);
  }
);
