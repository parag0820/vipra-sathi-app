import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LibraryHubScreen from '../screens/LibraryHubScreen';
import PoojaLibraryScreen from '../screens/PoojaLibraryScreen';
import PoojaDetailScreen from '../screens/PoojaDetailScreen';
import MenuScreen from '../screens/MenuScreen';
import KundaliScreen from '../screens/KundaliScreen';
import KundaliMatchingResultScreen from '../screens/KundaliMatchingResultScreen';
import KundaliGeneratedScreen from '../screens/KundaliGeneratedScreen';
import PanchangScreen from '../screens/PanchangScreen';
import MuhurtScreen from '../screens/MuhurtScreen';
import SamagriScreen from '../screens/SamagriScreen';
import StotramLibraryScreen from '../screens/StotramLibraryScreen';
import StotramDetailScreen from '../screens/StotramDetailScreen';
import AartiLibraryScreen from '../screens/AartiLibraryScreen';
import AartiDetailScreen from '../screens/AartiDetailScreen';
import CommunityScreen from '../screens/CommunityScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import DakshinaCalculatorScreen from '../screens/DakshinaCalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SubscriptionReminderModal from '../components/SubscriptionReminderModal';
import YajmanListScreen from '../screens/YajmanListScreen';
import YajmanFormScreen from '../screens/YajmanFormScreen';
import YajmanDetailScreen from '../screens/YajmanDetailScreen';
import { Yajman } from '../types/yajman';
import AccountManagerDashboardScreen from '../screens/AccountManagerDashboardScreen';
import AccountHistoryScreen from '../screens/AccountHistoryScreen';
import EarningEntryScreen from '../screens/EarningEntryScreen';
import ExpenseEntryScreen from '../screens/ExpenseEntryScreen';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  Onboarding: undefined;
  PoojaLibrary: undefined;
  PoojaDetail: { poojaId: string };
  Kundali: undefined;
  KundaliMatchingResult: undefined;
  KundaliGenerated: {
    name: string;
    dob: string;
    tob: string;
    place: string;
  };
  Panchang: undefined;
  Muhurt: undefined;
  Samagri: undefined;
  StotramLibrary: undefined;
  StotramDetail: { stotramId: string };
  AartiLibrary: undefined;
  AartiDetail: { aartiId: string };
  PostDetail: { postId: string };
  HelpCenter: undefined;
  CreateTicket: undefined;
  Subscription: undefined;
  Community: undefined;
  History: undefined;
  Notifications: undefined;
  Profile: undefined;
  Settings: undefined;
  YajmanList: undefined;
  YajmanForm: { yajman?: Yajman }; // Optional for edit mode
  YajmanDetail: { yajman: Yajman };
  AccountManagerDashboard: undefined;
  AccountHistory: undefined;
  EarningEntry: { defaultCategory?: string };
  ExpenseEntry: { defaultCategory?: string };
};

export type AuthStackParamList = {
  Login: undefined;
  VerifyOtp: { mobile: string };
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Calendar: undefined;
  DakshinaCalculator: undefined;
  Menu: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
  </AuthStack.Navigator>
);

const MainTabNavigator = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Library') iconName = focused ? 'flower' : 'flower-outline';
            else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'DakshinaCalculator') iconName = focused ? 'calculator' : 'calculator-outline';
            else if (route.name === 'Menu') iconName = focused ? 'menu' : 'menu-outline';

            return <Icon name={iconName as any} size={20} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: 'transparent',
            borderTopWidth: 0,
            paddingBottom: 8,
            height: 52,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home', 'Home') }} />
        <Tab.Screen name="Library" component={LibraryHubScreen} options={{ tabBarLabel: t('tabs.pooja', 'Pooja') }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: t('tabs.calendar', 'Calendar') }} />
        <Tab.Screen name="DakshinaCalculator" component={DakshinaCalculatorScreen} options={{ tabBarLabel: t('tabs.dakshina', 'Dakshina') }} />
        <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarLabel: t('tabs.menu', 'Menu') }} />
      </Tab.Navigator>
      <SubscriptionReminderModal />
    </>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isGuest, isLoading, hasSeenOnboarding } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {isAuthenticated || isGuest ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="PoojaLibrary" component={PoojaLibraryScreen} />
          <Stack.Screen name="PoojaDetail" component={PoojaDetailScreen} options={{ presentation: 'card' }} />
          <Stack.Screen name="Kundali" component={KundaliScreen} />
          <Stack.Screen name="KundaliMatchingResult" component={KundaliMatchingResultScreen} />
          <Stack.Screen name="KundaliGenerated" component={KundaliGeneratedScreen} />
          <Stack.Screen name="Panchang" component={PanchangScreen} />
          <Stack.Screen name="Muhurt" component={MuhurtScreen} />
          <Stack.Screen name="Samagri" component={SamagriScreen} />
          <Stack.Screen name="StotramLibrary" component={StotramLibraryScreen} />
          <Stack.Screen name="StotramDetail" component={StotramDetailScreen} options={{ presentation: 'card' }} />
          <Stack.Screen name="AartiLibrary" component={AartiLibraryScreen} />
          <Stack.Screen name="AartiDetail" component={AartiDetailScreen} options={{ presentation: 'card' }} />
          <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
          <Stack.Screen name="CreateTicket" component={CreateTicketScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="YajmanList" component={YajmanListScreen} />
          <Stack.Screen name="YajmanForm" component={YajmanFormScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="YajmanDetail" component={YajmanDetailScreen} />
          <Stack.Screen name="AccountManagerDashboard" component={AccountManagerDashboardScreen} />
          <Stack.Screen name="AccountHistory" component={AccountHistoryScreen} />
          <Stack.Screen name="EarningEntry" component={EarningEntryScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="ExpenseEntry" component={ExpenseEntryScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </>
      ) : !hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
