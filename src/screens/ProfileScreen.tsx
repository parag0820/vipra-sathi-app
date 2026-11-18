import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export interface UserProfileData {
  avatarUri: string;
  avatarText: string;
  prefix: string;
  fullName: string;
  dob: string;
  gender: string;
  gotra: string;
  specialization: string;
  loginMobile: string;
  email: string;
  city: string;
  state: string;
  address: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  avatarUri: '',
  avatarText: 'रश',
  prefix: 'पं.',
  fullName: 'राजेश शर्मा',
  dob: '12 मई 1985',
  gender: 'पुरुष',
  gotra: 'भारद्वाज',
  specialization: 'वैदिक कर्मकांड, ज्योतिष',
  loginMobile: '+91 ••••••• 4821',
  email: 'rajesh.sharma108@gmail.com',
  city: 'वाराणसी',
  state: 'उत्तर प्रदेश',
  address: 'दशाश्वमेध, वाराणसी',
};

const PROFILE_STORAGE_KEY = '@user_profile_data';

const GENDER_OPTIONS = ['पुरुष', 'महिला', 'अन्य'];

const SPECIALIZATION_OPTIONS = [
  'वैदिक कर्मकांड, ज्योतिष',
  'कर्मकांड एवं अनुष्ठान',
  'ज्योतिष एवं कुंडली',
  'वास्तु शास्त्र',
  'कथा एवं प्रवचन',
  'विवाह एवं संस्कार',
  'अन्य',
];

const STATE_OPTIONS = [
  'उत्तर प्रदेश',
  'बिहार',
  'मध्य प्रदेश',
  'राजस्थान',
  'उत्तराखंड',
  'दिल्ली',
  'महाराष्ट्र',
  'गुजरात',
  'हरियाणा',
  'झारखंड',
  'छत्तीसगढ़',
  'पश्चिम बंगाल',
  'अन्य',
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();

  // Responsive device checks
  const isTablet = width >= 600;
  const isLargeTablet = width >= 840;

  // Profile Form state
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);

  // Dropdown selector modal states
  const [dropdownType, setDropdownType] = useState<'gender' | 'specialization' | 'state' | 'dob' | null>(null);

  // Change Mobile Modal state
  const [isChangeMobileModalOpen, setIsChangeMobileModalOpen] = useState(false);
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Load saved profile data
  useEffect(() => {
    AsyncStorage.getItem(PROFILE_STORAGE_KEY).then(saved => {
      if (saved) {
        try {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) });
        } catch (e) {
          console.error('Failed to parse user profile', e);
        }
      }
    });
  }, []);

  // Update profile field helper
  const updateField = <K extends keyof UserProfileData>(field: K, value: UserProfileData[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Pick profile photo from gallery
  const handlePickPhoto = async () => {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (res.assets && res.assets.length > 0 && res.assets[0].uri) {
        updateField('avatarUri', res.assets[0].uri);
        Toast.show({ type: 'success', text1: 'फ़ोटो चुनी गई' });
      }
    } catch (e) {
      console.error('Failed to pick profile photo', e);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!profile.fullName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'पूरा नाम आवश्यक है',
        text2: 'कृपया अपना नाम दर्ज करें।',
      });
      return;
    }

    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      Toast.show({
        type: 'success',
        text1: 'बदलाव सहेजे गए',
        text2: 'आपकी प्रोफाइल जानकारी सफलतापूर्वक सहेज ली गई है।',
      });
    } catch (e) {
      console.error('Failed to save profile', e);
      Toast.show({ type: 'error', text1: 'त्रुटि', text2: 'सहेजने में असमर्थ।' });
    }
  };

  // Handle Mobile Number Change
  const handleRequestOtp = () => {
    if (!newMobileNumber.trim() || newMobileNumber.length < 10) {
      Toast.show({ type: 'error', text1: 'कृपया सही मोबाइल नंबर दर्ज करें' });
      return;
    }
    setOtpStep(true);
    Toast.show({ type: 'info', text1: 'OTP भेजा गया', text2: 'आपके नए नंबर पर 6 अंकों का OTP भेजा गया है।' });
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.length < 4) {
      Toast.show({ type: 'error', text1: 'कृपया सही OTP दर्ज करें' });
      return;
    }
    const masked = `+91 ••••••• ${newMobileNumber.slice(-4)}`;
    updateField('loginMobile', masked);
    setIsChangeMobileModalOpen(false);
    setOtpStep(false);
    setNewMobileNumber('');
    setEnteredOtp('');
    Toast.show({ type: 'success', text1: 'मोबाइल नंबर अपडेट हुआ', text2: 'नया मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया।' });
  };

  // Display Name combining prefix and full name
  const headerDisplayName = `${profile.prefix ? profile.prefix + ' ' : ''}${profile.fullName}`;
  const maroonColor = isDark ? '#FCA5A5' : '#991B1B';

  return (
    <View
      style={[
        styles.screenContainer,
        { backgroundColor: isDark ? colors.background : '#F8F6F2' },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? colors.surface : '#FFFFFF'}
      />

      {/* Header Bar */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: Math.max(insets.top, 12),
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderBottomColor: isDark ? '#2D2D2D' : '#EFECE6',
          },
        ]}
      >
        <View style={styles.headerInnerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="arrow-left" size={24} color={maroonColor} />
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text style={[styles.headerTitle, { color: maroonColor }]}>
              मेरी प्रोफाइल
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: isDark ? '#9CA3AF' : '#6B7280' },
              ]}
            >
              अपनी व्यक्तिगत जानकारी देखें और बदलें
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.contentScrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(insets.bottom + 40, 70),
              alignItems: 'center',
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Responsive Container for Tablets & Phones */}
          <View
            style={[
              styles.responsiveContainer,
              { maxWidth: isLargeTablet ? 820 : isTablet ? 680 : '100%' },
            ]}
          >
            {/* 1. Profile Avatar & User Header Card */}
            <View
              style={[
                styles.card,
                styles.profileHeaderCardRow,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
            >
              {/* Avatar with Camera badge */}
              <TouchableOpacity
                style={styles.avatarWrapper}
                onPress={handlePickPhoto}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.avatarCircle,
                    {
                      backgroundColor: isDark ? '#5C0000' : '#800000',
                    },
                  ]}
                >
                  {profile.avatarUri ? (
                    <Image
                      source={{ uri: profile.avatarUri }}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {profile.avatarText || 'रश'}
                    </Text>
                  )}
                </View>

                {/* Camera badge icon */}
                <View
                  style={[
                    styles.cameraBadge,
                    { backgroundColor: isDark ? '#333' : '#FFFFFF' },
                  ]}
                >
                  <Icon
                    name="camera"
                    size={11}
                    color={isDark ? '#FFF' : '#374151'}
                  />
                </View>
              </TouchableOpacity>

              {/* Name & Role */}
              <View style={styles.profileHeaderInfo}>
                <Text
                  style={[
                    styles.profileHeaderName,
                    { color: isDark ? '#FFF' : '#1F2937' },
                  ]}
                  numberOfLines={1}
                >
                  {headerDisplayName}
                </Text>
                <Text
                  style={[
                    styles.profileHeaderRole,
                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                  ]}
                >
                  पंडित खाता
                </Text>
              </View>

              {/* Photo Change Outline Button */}
              <TouchableOpacity
                style={[
                  styles.changePhotoBtn,
                  { borderColor: maroonColor },
                ]}
                onPress={handlePickPhoto}
                activeOpacity={0.7}
              >
                <Icon name="camera" size={13} color={maroonColor} />
                <Text
                  style={[styles.changePhotoBtnText, { color: maroonColor }]}
                >
                  फ़ोटो बदलें
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2. Section: व्यक्तिगत विवरण */}
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#FCA5A5' : '#1F2937' },
              ]}
            >
              व्यक्तिगत विवरण
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
            >
              {/* Field: पूरा नाम * */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  पूरा नाम <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                      color: isDark ? '#FFF' : '#1F2937',
                    },
                  ]}
                  value={profile.fullName}
                  onChangeText={val => updateField('fullName', val)}
                  placeholder="अपना नाम लिखें"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              {/* Two columns: जन्मतिथि * & लिंग * */}
              <View style={styles.twoColumnRow}>
                {/* जन्मतिथि * */}
                <View style={styles.columnItem}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    जन्मतिथि <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownSelectorBtn,
                      {
                        backgroundColor: isDark ? colors.background : '#FFFFFF',
                        borderColor: isDark ? '#404040' : '#D1D5DB',
                      },
                    ]}
                    onPress={() => setDropdownType('dob')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownSelectedText,
                        { color: isDark ? '#FFF' : '#1F2937' },
                      ]}
                    >
                      {profile.dob}
                    </Text>
                    <Icon
                      name="calendar"
                      size={15}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </TouchableOpacity>
                </View>

                {/* लिंग * */}
                <View style={styles.columnItem}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    लिंग <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownSelectorBtn,
                      {
                        backgroundColor: isDark ? colors.background : '#FFFFFF',
                        borderColor: isDark ? '#404040' : '#D1D5DB',
                      },
                    ]}
                    onPress={() => setDropdownType('gender')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownSelectedText,
                        { color: isDark ? '#FFF' : '#1F2937' },
                      ]}
                    >
                      {profile.gender}
                    </Text>
                    <Icon
                      name="chevron-down"
                      size={16}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Field: गोत्र (वैकल्पिक) */}
              <View style={[styles.inputGroup, { marginTop: 12 }]}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  गोत्र (वैकल्पिक)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                      color: isDark ? '#FFF' : '#1F2937',
                    },
                  ]}
                  value={profile.gotra}
                  onChangeText={val => updateField('gotra', val)}
                  placeholder="अपना गोत्र लिखें"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              {/* Field: विशेषज्ञता * */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  विशेषज्ञता <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownSelectorBtn,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                    },
                  ]}
                  onPress={() => setDropdownType('specialization')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownSelectedText,
                      { color: isDark ? '#FFF' : '#1F2937' },
                    ]}
                  >
                    {profile.specialization}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={16}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Section: संपर्क एवं स्थान */}
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#FCA5A5' : '#1F2937', marginTop: 8 },
              ]}
            >
              संपर्क एवं स्थान
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
            >
              {/* Login Mobile Row */}
              <View style={styles.mobileLoginRow}>
                <View style={styles.mobileLoginTextGroup}>
                  <Text
                    style={[
                      styles.mobileLoginLabel,
                      { color: isDark ? '#9CA3AF' : '#6B7280' },
                    ]}
                  >
                    लॉगिन मोबाइल नंबर
                  </Text>
                  <Text
                    style={[
                      styles.mobileLoginNumber,
                      { color: isDark ? '#FFF' : '#1F2937' },
                    ]}
                  >
                    {profile.loginMobile}
                  </Text>
                  <Text
                    style={[
                      styles.mobileLoginHelp,
                      { color: isDark ? '#9CA3AF' : '#6B7280' },
                    ]}
                  >
                    नंबर बदलने पर OTP सत्यापन होगा।
                  </Text>
                </View>

                {/* Change button */}
                <TouchableOpacity
                  onPress={() => setIsChangeMobileModalOpen(true)}
                  style={styles.changeMobileBtn}
                >
                  <Text style={[styles.changeMobileBtnText, { color: maroonColor }]}>
                    बदलें
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Field: ईमेल (वैकल्पिक) */}
              <View style={[styles.inputGroup, { marginTop: 12 }]}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  ईमेल (वैकल्पिक)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                      color: isDark ? '#FFF' : '#1F2937',
                    },
                  ]}
                  value={profile.email}
                  onChangeText={val => updateField('email', val)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="अपना ईमेल लिखें"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              {/* Two columns: शहर * & राज्य * */}
              <View style={styles.twoColumnRow}>
                {/* शहर * */}
                <View style={styles.columnItem}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    शहर <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: isDark ? colors.background : '#FFFFFF',
                        borderColor: isDark ? '#404040' : '#D1D5DB',
                        color: isDark ? '#FFF' : '#1F2937',
                      },
                    ]}
                    value={profile.city}
                    onChangeText={val => updateField('city', val)}
                    placeholder="शहर का नाम"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>

                {/* राज्य * */}
                <View style={styles.columnItem}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    राज्य <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownSelectorBtn,
                      {
                        backgroundColor: isDark ? colors.background : '#FFFFFF',
                        borderColor: isDark ? '#404040' : '#D1D5DB',
                      },
                    ]}
                    onPress={() => setDropdownType('state')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownSelectedText,
                        { color: isDark ? '#FFF' : '#1F2937' },
                      ]}
                      numberOfLines={1}
                    >
                      {profile.state}
                    </Text>
                    <Icon
                      name="chevron-down"
                      size={16}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Field: पता (वैकल्पिक) */}
              <View style={[styles.inputGroup, { marginTop: 12 }]}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  पता (वैकल्पिक)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                      color: isDark ? '#FFF' : '#1F2937',
                    },
                  ]}
                  value={profile.address}
                  onChangeText={val => updateField('address', val)}
                  placeholder="दशाश्वमेध, वाराणसी"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.helperUnderInput,
                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                  ]}
                >
                  मकान, गली या क्षेत्र • वैकल्पिक
                </Text>
              </View>
            </View>

            {/* 4. Link Card to Personal Branding */}
            <TouchableOpacity
              style={[
                styles.card,
                styles.brandingBannerCard,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
              onPress={() => navigation.navigate('PersonalBranding')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.brandingIconSquare,
                  {
                    backgroundColor: isDark ? '#3F1717' : '#FEE2E2',
                    borderColor: isDark ? '#7F1D1D' : '#FECACA',
                  },
                ]}
              >
                <Icon name="file-text" size={20} color={maroonColor} />
              </View>

              <View style={styles.brandingBannerTextGroup}>
                <Text
                  style={[
                    styles.brandingBannerTitle,
                    { color: isDark ? '#FFF' : '#1F2937' },
                  ]}
                >
                  निर्यात में दिखने वाला विवरण
                </Text>
                <Text
                  style={[
                    styles.brandingBannerSubtitle,
                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                  ]}
                >
                  नाम, लोगो और संपर्क मेरी ब्रांडिंग में बदलें
                </Text>
              </View>

              <Icon
                name="chevron-right"
                size={20}
                color={isDark ? '#9CA3AF' : '#9CA3AF'}
              />
            </TouchableOpacity>

            {/* 5. Bottom Action Area */}
            <View style={styles.bottomFooterRow}>
              <Text
                style={[
                  styles.requiredHelpText,
                  { color: isDark ? '#9CA3AF' : '#6B7280' },
                ]}
              >
                * आवश्यक जानकारी
              </Text>

              <View style={styles.footerButtonsGroup}>
                {/* Cancel Button */}
                <TouchableOpacity
                  style={[
                    styles.cancelFooterBtn,
                    { borderColor: isDark ? '#4B5563' : '#D1D5DB' },
                  ]}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cancelFooterBtnText,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    रद्द करें
                  </Text>
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity
                  style={[
                    styles.saveFooterBtn,
                    { backgroundColor: maroonColor },
                  ]}
                  onPress={handleSaveProfile}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveFooterBtnText}>बदलाव सहेजें</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Dropdown Options Modal */}
      <Modal
        visible={dropdownType !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownType(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownType(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.dropdownModalCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#2D2D2D' : '#EFECE8',
                maxWidth: isTablet ? 480 : '92%',
              },
            ]}
          >
            <View style={[styles.changeMobileHeaderRow, { borderBottomWidth: 1, borderBottomColor: isDark ? '#2A2A2A' : '#F3EFEA', paddingBottom: 12 }]}>
              <Text
                style={[
                  styles.dropdownModalTitle,
                  { color: isDark ? '#FCA5A5' : maroonColor, marginBottom: 0 },
                ]}
              >
                {dropdownType === 'gender'
                  ? 'लिंग चुनें'
                  : dropdownType === 'specialization'
                  ? 'अपनी विशेषज्ञता चुनें'
                  : dropdownType === 'state'
                  ? 'अपना राज्य चुनें'
                  : 'जन्मतिथि'}
              </Text>
              <TouchableOpacity
                onPress={() => setDropdownType(null)}
                style={[styles.modalCloseIconBtn, { backgroundColor: isDark ? '#252525' : '#FAF7F3', borderColor: isDark ? '#333333' : '#EFECE8' }]}
              >
                <Icon name="x" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            {dropdownType === 'dob' ? (
              <View style={styles.dobModalContent}>
                <Text
                  style={[
                    styles.dobPromptText,
                    { color: isDark ? '#D1D5DB' : '#4B5563' },
                  ]}
                >
                  जन्मतिथि दर्ज करें (दिन माह वर्ष):
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                      color: isDark ? '#FFF' : '#1F2937',
                      marginTop: 8,
                      marginBottom: 16,
                    },
                  ]}
                  value={profile.dob}
                  onChangeText={val => updateField('dob', val)}
                  placeholder="जैसे: 12 मई 1985"
                />
                <TouchableOpacity
                  style={[styles.saveFooterBtn, { backgroundColor: maroonColor }]}
                  onPress={() => setDropdownType(null)}
                >
                  <Text style={styles.saveFooterBtnText}>पुष्टि करें</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={styles.dropdownModalScroll}>
                {(dropdownType === 'gender'
                  ? GENDER_OPTIONS
                  : dropdownType === 'specialization'
                  ? SPECIALIZATION_OPTIONS
                  : STATE_OPTIONS
                ).map((opt, idx) => {
                  const isSelected =
                    (dropdownType === 'gender' && profile.gender === opt) ||
                    (dropdownType === 'specialization' && profile.specialization === opt) ||
                    (dropdownType === 'state' && profile.state === opt);

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.dropdownItemRow,
                        {
                          borderBottomColor: isDark ? '#333' : '#F1EAE4',
                          backgroundColor: isSelected
                            ? isDark
                              ? '#3A1515'
                              : '#FFF5F5'
                            : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        if (dropdownType === 'gender') updateField('gender', opt);
                        if (dropdownType === 'specialization') updateField('specialization', opt);
                        if (dropdownType === 'state') updateField('state', opt);
                        setDropdownType(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: isSelected
                              ? maroonColor
                              : isDark
                              ? '#E5E7EB'
                              : '#1F2937',
                            fontWeight: isSelected ? 'bold' : 'normal',
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                      {isSelected && (
                        <Icon name="check" size={16} color={maroonColor} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Change Mobile Number Modal */}
      <Modal
        visible={isChangeMobileModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsChangeMobileModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.changeMobileCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#2D2D2D' : '#EFECE8',
                maxWidth: isTablet ? 460 : '92%',
              },
            ]}
          >
            <View style={[styles.changeMobileHeaderRow, { borderBottomWidth: 1, borderBottomColor: isDark ? '#2A2A2A' : '#F3EFEA', paddingBottom: 12 }]}>
              <Text
                style={[
                  styles.changeMobileTitle,
                  { color: isDark ? '#FCA5A5' : maroonColor },
                ]}
              >
                लॉगिन मोबाइल नंबर बदलें
              </Text>
              <TouchableOpacity
                style={[styles.modalCloseIconBtn, { backgroundColor: isDark ? '#252525' : '#FAF7F3', borderColor: isDark ? '#333333' : '#EFECE8' }]}
                onPress={() => {
                  setIsChangeMobileModalOpen(false);
                  setOtpStep(false);
                }}
              >
                <Icon name="x" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            {!otpStep ? (
              <View style={styles.changeMobileBody}>
                <Text
                  style={[
                    styles.changeMobilePrompt,
                    { color: isDark ? '#D1D5DB' : '#4B5563' },
                  ]}
                >
                  कृपया अपना नया 10 अंकों का मोबाइल नंबर दर्ज करें:
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                      color: isDark ? '#FFF' : '#1F2937',
                      marginTop: 8,
                      marginBottom: 16,
                    },
                  ]}
                  value={newMobileNumber}
                  onChangeText={setNewMobileNumber}
                  keyboardType="phone-pad"
                  placeholder="9876543210"
                />
                <TouchableOpacity
                  style={[styles.saveFooterBtn, { backgroundColor: maroonColor }]}
                  onPress={handleRequestOtp}
                >
                  <Text style={styles.saveFooterBtnText}>OTP प्राप्त करें</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.changeMobileBody}>
                <Text
                  style={[
                    styles.changeMobilePrompt,
                    { color: isDark ? '#D1D5DB' : '#4B5563' },
                  ]}
                >
                  {newMobileNumber} पर भेजा गया 6 अंकों का OTP दर्ज करें:
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: isDark ? colors.background : '#FFFFFF',
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                      color: isDark ? '#FFF' : '#1F2937',
                      marginTop: 8,
                      marginBottom: 16,
                      textAlign: 'center',
                      letterSpacing: 6,
                      fontSize: 18,
                    },
                  ]}
                  value={enteredOtp}
                  onChangeText={setEnteredOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="••••••"
                />
                <TouchableOpacity
                  style={[styles.saveFooterBtn, { backgroundColor: maroonColor }]}
                  onPress={handleVerifyOtp}
                >
                  <Text style={styles.saveFooterBtnText}>सत्यापित करें</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 10,
  },
  headerInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 2,
    marginRight: 10,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 10.5,
    marginTop: 2,
  },
  contentScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  responsiveContainer: {
    width: '100%',
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  profileHeaderCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    elevation: 2,
  },
  profileHeaderInfo: {
    flex: 1,
  },
  profileHeaderName: {
    fontSize: 13.5,
    fontWeight: 'bold',
  },
  profileHeaderRole: {
    fontSize: 12.5,
    marginTop: 3,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  changePhotoBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#DC2626',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  columnItem: {
    flex: 1,
  },
  dropdownSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  dropdownSelectedText: {
    fontSize: 11.5,
  },
  mobileLoginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 6,
  },
  mobileLoginTextGroup: {
    flex: 1,
    paddingRight: 10,
  },
  mobileLoginLabel: {
    fontSize: 12,
  },
  mobileLoginNumber: {
    fontSize: 12.5,
    fontWeight: 'bold',
    marginTop: 3,
  },
  mobileLoginHelp: {
    fontSize: 11,
    marginTop: 3,
  },
  changeMobileBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeMobileBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  helperUnderInput: {
    fontSize: 11,
    marginTop: 4,
  },
  brandingBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  brandingIconSquare: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandingBannerTextGroup: {
    flex: 1,
  },
  brandingBannerTitle: {
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  brandingBannerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  bottomFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 10,
  },
  requiredHelpText: {
    fontSize: 11.5,
  },
  footerButtonsGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelFooterBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelFooterBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  saveFooterBtn: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveFooterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Dropdown Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  dropdownModalCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  dropdownModalTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  modalCloseIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModalScroll: {
    maxHeight: 320,
  },
  dropdownItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 12,
  },
  dobModalContent: {
    paddingVertical: 6,
  },
  dobPromptText: {
    fontSize: 11.5,
  },
  changeMobileCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  changeMobileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  changeMobileTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  changeMobileBody: {
    paddingTop: 4,
  },
  changeMobilePrompt: {
    fontSize: 11.5,
  },
});

export default ProfileScreen;
