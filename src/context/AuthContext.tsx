import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidMongoId, generateMongoObjectId } from '../utils/objectId';

export interface UserProfile {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  mobileNumber: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  user: UserProfile | null;
  login: (userData: any, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  completeOnboardingFlow: () => Promise<void>;
  exitGuestToLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  hasSeenOnboarding: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  continueAsGuest: async () => {},
  completeOnboardingFlow: async () => {},
  exitGuestToLogin: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    checkInitialState();
  }, []);

  const checkInitialState = async () => {
    try {
      const guestStatus = await AsyncStorage.getItem('is_guest');
      if (guestStatus === 'true') {
        let guestId = await AsyncStorage.getItem('user_id');
        if (!isValidMongoId(guestId)) {
          guestId = generateMongoObjectId();
          await AsyncStorage.setItem('user_id', guestId);
        }
        setUser({
          id: guestId,
          mobileNumber: '',
          fullName: 'Guest User',
          displayName: 'Guest',
          email: '',
          role: 'guest',
        });
        setIsGuest(true);
        setIsAuthenticated(false);
        return;
      }

      const id = await AsyncStorage.getItem('user_id');
      const mobileNumber = (await AsyncStorage.getItem('user_mobile')) || '';
      const fullName = (await AsyncStorage.getItem('user_fullName')) || '';
      const displayName = (await AsyncStorage.getItem('user_displayName')) || '';
      const email = (await AsyncStorage.getItem('user_email')) || '';
      const role = (await AsyncStorage.getItem('user_role')) || 'user';
      const token = await AsyncStorage.getItem('auth_token');

      // User is authenticated if they have a valid Mongo id AND (mobileNumber, fullName, or token)
      if (id && isValidMongoId(id) && (mobileNumber || fullName || token)) {
        setUser({ id, mobileNumber, fullName, displayName, email, role });
        setIsAuthenticated(true);
        setIsGuest(false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsGuest(false);
      }
    } catch (e) {
      console.warn('AsyncStorage check failed:', e);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: any, token?: string) => {
    // Robustly unwrap user data from various possible nesting levels
    let rawUser =
      userData?.user ||
      userData?.userData ||
      userData?.data?.user ||
      userData?.data ||
      userData;

    if (rawUser?.user && typeof rawUser.user === 'object') {
      rawUser = rawUser.user;
    }

    let resolvedId =
      rawUser?.id ||
      rawUser?._id ||
      rawUser?.userId ||
      rawUser?.uid ||
      userData?.id ||
      userData?._id ||
      userData?.userId ||
      userData?.uid;

    if (!resolvedId || !isValidMongoId(resolvedId)) {
      if (resolvedId && isValidMongoId(resolvedId)) {
        // valid id
      } else {
        resolvedId = isValidMongoId(resolvedId) ? resolvedId : generateMongoObjectId();
      }
    }

    const fullName =
      rawUser?.fullName ||
      rawUser?.name ||
      rawUser?.displayName ||
      rawUser?.userName ||
      userData?.fullName ||
      userData?.name ||
      '';

    const displayName =
      rawUser?.displayName ||
      rawUser?.fullName ||
      rawUser?.name ||
      userData?.displayName ||
      '';

    const mobileNumber =
      rawUser?.mobileNumber ||
      rawUser?.mobile ||
      rawUser?.phone ||
      userData?.mobileNumber ||
      '';

    const email = rawUser?.email || userData?.email || '';
    const role = rawUser?.role || userData?.role || 'user';

    const authToken =
      token ||
      userData?.token ||
      rawUser?.token ||
      userData?.accessToken;

    const userProfile: UserProfile = {
      id: resolvedId,
      mobileNumber,
      fullName,
      displayName,
      email,
      role,
    };

    try {
      await AsyncStorage.setItem('user_id', resolvedId);
      if (mobileNumber) {
        await AsyncStorage.setItem('user_mobile', mobileNumber);
      }
      if (fullName) {
        await AsyncStorage.setItem('user_fullName', fullName);
      }
      if (displayName) {
        await AsyncStorage.setItem('user_displayName', displayName);
      }
      if (email) {
        await AsyncStorage.setItem('user_email', email);
      }
      if (role) {
        await AsyncStorage.setItem('user_role', role);
      }
      if (authToken) {
        await AsyncStorage.setItem('auth_token', authToken);
      }
      await AsyncStorage.removeItem('is_guest');
    } catch (e) {
      console.warn('Failed to save auth state to AsyncStorage', e);
    }

    setUser(userProfile);
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('user_mobile');
      await AsyncStorage.removeItem('user_fullName');
      await AsyncStorage.removeItem('user_displayName');
      await AsyncStorage.removeItem('user_email');
      await AsyncStorage.removeItem('user_role');
      await AsyncStorage.removeItem('is_guest');
      await AsyncStorage.removeItem('has_seen_onboarding');
    } catch (e) {
      // Continue without persistence
    }
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    setHasSeenOnboarding(false);
  };

  const continueAsGuest = async () => {
    let guestId = '';
    try {
      guestId = (await AsyncStorage.getItem('user_id')) || '';
      if (!isValidMongoId(guestId)) {
        guestId = generateMongoObjectId();
        await AsyncStorage.setItem('user_id', guestId);
      }
      await AsyncStorage.setItem('is_guest', 'true');
    } catch (e) {
      guestId = generateMongoObjectId();
    }
    setUser({
      id: guestId,
      mobileNumber: '',
      fullName: 'Guest User',
      displayName: 'Guest',
      email: '',
      role: 'guest',
    });
    setHasSeenOnboarding(true);
    setIsGuest(true);
  };

  const completeOnboardingFlow = async () => {
    setHasSeenOnboarding(true);
  };

  const exitGuestToLogin = async () => {
    try {
      await AsyncStorage.removeItem('is_guest');
    } catch (e) {
      // Continue without persistence
    }
    setIsGuest(false);
    setHasSeenOnboarding(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isGuest, isLoading, hasSeenOnboarding, user, login, logout, continueAsGuest, completeOnboardingFlow, exitGuestToLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

