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
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

const BG_COLOR = '#FDF0E6';

const LoginScreen = ({ navigation }: any) => {
  const { login, continueAsGuest } = useAuth();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

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
          source={require('../assets/images/login_bg.jpg')}
          style={styles.bgTemple}
          resizeMode="cover"
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

          {/* Brand Name */}
          <Text style={styles.brandText}>{isHi ? 'विप्र सारथी' : 'Vipra Saarthi'}</Text>

          {/* Lotus Divider */}
          {/* <View style={styles.lotusDivider}>
            <Icon name="sun" size={14} color="#D4AF37" />
          </View> */}

          {/* Welcome Text */}
          <Text style={styles.welcomeText}>{isHi ? 'आपका स्वागत है' : 'Welcome'}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {isHi ? 'अपना मोबाइल नंबर और पासवर्ड दर्ज कर आगे बढ़ें' : 'Enter your mobile number and password to proceed'}
          </Text>

          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.countryCode}>+91</Text>
            </View>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.textInput}
              placeholder={isHi ? 'मोबाइल नंबर' : 'Mobile Number'}
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

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.iconOnlyContainer}>
              <Icon name="lock" size={20} color="#800000" />
            </View>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.textInput}
              placeholder={isHi ? 'पासवर्ड' : 'Password'}
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

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>{isHi ? 'लॉगिन करें' : 'Login'}</Text>
                <Icon name="arrow-right" size={20} color="#FFF" style={styles.loginButtonIcon} />
              </>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orDividerContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{isHi ? 'या' : 'or'}</Text>
            <View style={styles.orLine} />
          </View>

          {/* Guest Login Button */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={continueAsGuest}
            activeOpacity={0.85}
          >
            <Text style={styles.guestButtonText}>{isHi ? 'अतिथि के रूप में जारी रखें' : 'Continue as Guest'}</Text>
            <Icon name="user" size={18} color="#800000" style={styles.guestButtonIcon} />
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          {/* Footer Terms */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {isHi ? 'जारी रखकर आप ' : 'By continuing, you agree to our '}
              <Text style={styles.footerLink} onPress={() => { /* Navigate to Terms */ }}>{isHi ? 'नियम' : 'Terms'}</Text>
              {isHi ? ' और ' : ' and '}
              <Text style={styles.footerLink} onPress={() => { /* Navigate to Privacy Policy */ }}>{isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}</Text>
              {isHi ? ' से सहमत हैं।' : '.'}
            </Text>

            <View style={styles.omDivider}>
              <Text style={styles.omText}>- ॐ -</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8E6CE',
  },
  scrollContent: {
    flexGrow: 1,
  },
  bgTemple: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 10,
    shadowColor: '#800000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 60,
    backgroundColor: '#fff',
    padding: 4,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800000',
    marginBottom: 6,
  },
  lotusDivider: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DDD4',
    marginBottom: 16,
    width: '100%',
    height: 45,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconOnlyContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  verticalDivider: {
    width: 1,
    height: '50%',
    backgroundColor: '#E8DDD4',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  eyeIconContainer: {
    paddingHorizontal: 16,
  },
  loginButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#6A0000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#6A0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButtonIcon: {
    position: 'absolute',
    right: 20,
  },
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  orText: {
    paddingHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#FFF5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D4B4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 5,
  },
  guestButtonText: {
    color: '#800000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  guestButtonIcon: {
    position: 'absolute',
    right: 20,
  },
  googleIconCircle: {
    position: 'absolute',
    left: 20,
  },
  googleG: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButtonText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  footerLink: {
    color: '#800000',
    textDecorationLine: 'underline',
  },
  omDivider: {
    marginTop: 20,
  },
  omText: {
    color: '#D4AF37',
    fontSize: 20,
  },
});

export default LoginScreen;
