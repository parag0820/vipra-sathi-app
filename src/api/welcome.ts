import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './axios';

export interface WelcomeScreenItem {
  _id?: string;
  id?: string;
  screenNumber: number;
  title: string;
  subtitle: string;
  description: string;
  image: string; // base64 data URI or image URL
}

export interface WelcomeResponse {
  success: boolean;
  message?: string;
  data: WelcomeScreenItem[];
}

export const welcomeApi = {
  getWelcomeScreens: async (): Promise<WelcomeScreenItem[]> => {
    const token = await AsyncStorage.getItem('auth_token');

    // 1. Try endpoint /welcome/admin/get-all first
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get<WelcomeResponse>(
        `${API_BASE_URL}/welcome/admin/get-all`,
        { headers, timeout: 8000 }
      );

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        return response.data.data.sort((a, b) => (a.screenNumber || 0) - (b.screenNumber || 0));
      }
    } catch (adminError: any) {
      // If admin endpoint returns 401 (e.g. fresh install with no auth token), fallback gracefully
    }

    // 2. Fallback to /welcome/get-all (public endpoint serving the same dynamic welcome data)
    try {
      const response = await axios.get<WelcomeResponse>(
        `${API_BASE_URL}/welcome/get-all`,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000,
        }
      );

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        return response.data.data.sort((a, b) => (a.screenNumber || 0) - (b.screenNumber || 0));
      }
    } catch (publicError) {
      console.warn('Failed to fetch welcome screens:', publicError);
    }

    return [];
  },
};
