import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { axiosInstance } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

const BG_COLOR = '#FDF0E6';

const LoginScreen = ({ navigation }: any) => {
  const { login, continueAsGuest } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Number',
        text2: 'Please enter a valid 10-digit mobile number',
      });
      return;
    }
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Password',
        text2: 'Please enter your password',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', {
        mobileNumber,
        password,
      });

      const userData = response.data.data || response.data.user || response.data;

      await login({
        id: userData.id || userData._id || 'unknown_id',
        fullName: userData.fullName || '',
        displayName: userData.displayName || '',
        email: userData.email || '',
        mobileNumber: userData.mobileNumber || mobileNumber,
        role: userData.role || 'user',
      });

      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'You have successfully logged in.',
      });
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Background temple watermark */}
        <Image
          source={require('../assets/images/onboarding_1.jpg')}
          style={styles.bgTemple}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', BG_COLOR + 'DD', BG_COLOR]}
          style={styles.bgOverlay}
        />

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.brandText}>Vipra Saarthi</Text>

          {/* Lotus Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.lotusContainer}>
              <Icon name="sun" size={16} color="#800000" />
            </View>
            <View style={styles.dividerLine} />
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Enter your mobile number{'\n'}to get started
          </Text>

          {/* Mobile Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <View style={styles.phoneIconContainer}>
                <Icon name="phone" size={18} color="#800000" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                autoCapitalize="none"
                value={mobileNumber}
                onChangeText={(text) =>
                  setMobileNumber(text.replace(/[^0-9]/g, ''))
                }
                maxLength={10}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <View style={styles.phoneIconContainer}>
                <Icon name="lock" size={18} color="#800000" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon name={isPasswordVisible ? "eye" : "eye-off"} size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.otpButton}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#800000', '#A00000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.otpButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.otpButtonText}>Login</Text>
                  <Icon name="arrow-right" size={20} color="#FFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Secure Badge */}
          <View style={styles.secureContainer}>
            <View style={styles.secureLine} />
            <View style={styles.secureContent}>
              <Icon name="shield" size={14} color="#16A34A" />
              <Text style={styles.secureText}>Your data is secure with us</Text>
            </View>
            <View style={styles.secureLine} />
          </View>

          {/* Guest option */}
          <TouchableOpacity style={styles.guestBtn} onPress={continueAsGuest}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>

          {/* Bottom Temple Illustration */}
          <View style={styles.bottomSection}>
            <Image
              source={require('../assets/images/onboarding_1.jpg')}
              style={styles.templeBottom}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bgTemple: {
    position: 'absolute',
    top: 20,
    right: -30,
    width: width * 0.7,
    height: height * 0.42,
    opacity: 0.1,
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#800000',
    marginBottom: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '50%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5A872',
  },
  lotusContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputSection: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8DDD4',
    overflow: 'hidden',
  },
  phoneIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFF5EE',
    borderRightWidth: 1,
    borderRightColor: '#E8DDD4',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  eyeIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpButton: {
    width: '100%',
    marginTop: 6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  otpButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  secureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  secureLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5A872',
  },
  secureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  secureText: {
    fontSize: 11,
    color: '#6B7280',
  },
  guestBtn: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
  },
  guestText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 10,
  },
  templeBottom: {
    width: width,
    height: 160,
    opacity: 0.2,
  },
});

export default LoginScreen;
