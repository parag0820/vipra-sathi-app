import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
  Modal,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export interface BrandingData {
  isEnabled: boolean;
  logoUri: string;
  logoText: string;
  displayName: string;
  title: string;
  mobileNumber: string;
  whatsappNumber: string;
  isSameWhatsapp: boolean;
  addressCity: string;
  emailWebsite: string;
}

const DEFAULT_BRANDING: BrandingData = {
  isEnabled: true,
  logoUri: '',
  logoText: 'रश',
  displayName: 'पं. राजेश शर्मा',
  title: 'वैदिक कर्मकांड एवं ज्योतिष',
  mobileNumber: '+91 ••••••• 4821',
  whatsappNumber: '+91 ••••••• 4821',
  isSameWhatsapp: true,
  addressCity: 'वाराणसी, उत्तर प्रदेश',
  emailWebsite: '',
};

const STORAGE_KEY = '@user_branding_data';

const PersonalBrandingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();

  // Responsive breakpoints
  const isTablet = width >= 600;
  const isLargeTablet = width >= 840;

  // Form State
  const [branding, setBranding] = useState<BrandingData>(DEFAULT_BRANDING);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  // Load saved branding data
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved) {
        try {
          setBranding({ ...DEFAULT_BRANDING, ...JSON.parse(saved) });
        } catch (e) {
          console.error('Failed to parse branding data', e);
        }
      }
    });
  }, []);

  // Update helper
  const updateField = <K extends keyof BrandingData>(field: K, value: BrandingData[K]) => {
    setBranding(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'mobileNumber' && prev.isSameWhatsapp) {
        updated.whatsappNumber = value as string;
      }
      return updated;
    });
  };

  // Toggle same whatsapp
  const handleToggleSameWhatsapp = () => {
    setBranding(prev => ({
      ...prev,
      isSameWhatsapp: !prev.isSameWhatsapp,
      whatsappNumber: !prev.isSameWhatsapp ? prev.mobileNumber : prev.whatsappNumber,
    }));
  };

  // Pick Logo from gallery
  const handlePickLogo = async () => {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (res.assets && res.assets.length > 0 && res.assets[0].uri) {
        updateField('logoUri', res.assets[0].uri);
        Toast.show({ type: 'success', text1: 'लोगो चुना गया' });
      }
    } catch (e) {
      console.error('Failed to pick logo', e);
    }
  };

  // Remove Logo
  const handleRemoveLogo = () => {
    updateField('logoUri', '');
    Toast.show({ type: 'info', text1: 'लोगो हटा दिया गया' });
  };

  // Reset to default
  const handleResetConfirm = () => {
    Alert.alert(
      'ब्रांडिंग रीसेट करें',
      'क्या आप सभी ब्रांडिंग सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'रीसेट करें',
          style: 'destructive',
          onPress: async () => {
            setBranding(DEFAULT_BRANDING);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BRANDING));
            Toast.show({ type: 'info', text1: 'ब्रांडिंग रीसेट हो गई' });
          },
        },
      ]
    );
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(branding));
      Toast.show({
        type: 'success',
        text1: 'बदलाव सहेजे गए',
        text2: 'आपकी ब्रांडिंग जानकारी सफलतापूर्वक सहेज ली गई है।',
      });
    } catch (e) {
      console.error('Failed to save branding', e);
      Toast.show({ type: 'error', text1: 'त्रुटि', text2: 'सहेजने में असमर्थ।' });
    }
  };

  // Dynamic maroon accent
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
            <Icon name="chevron-left" size={26} color={maroonColor} />
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text style={[styles.headerTitle, { color: maroonColor }]}>
              मेरी ब्रांडिंग
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: isDark ? '#9CA3AF' : '#6B7280' },
              ]}
            >
              निर्यात में अपना नाम और पहचान जोड़ें
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleResetConfirm}
            style={styles.resetButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.resetButtonText, { color: maroonColor }]}>
              रीसेट
            </Text>
          </TouchableOpacity>
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
          {/* Centered responsive container for tablets & phones */}
          <View
            style={[
              styles.responsiveContainer,
              { maxWidth: isLargeTablet ? 820 : isTablet ? 680 : '100%' },
            ]}
          >
            {/* 1. Toggle Switch Card */}
            <View
              style={[
                styles.card,
                styles.switchCardRow,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
            >
              <View style={styles.switchTextContainer}>
                <Text
                  style={[
                    styles.cardMainTitle,
                    { color: isDark ? '#FFF' : '#1F2937' },
                  ]}
                >
                  निर्यात में मेरी ब्रांडिंग दिखाएँ
                </Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                  ]}
                >
                  PDF, सामग्री सूची, अनुमान और ज्योतिष रिपोर्ट में लागू।
                </Text>
              </View>

              <Switch
                value={branding.isEnabled}
                onValueChange={val => updateField('isEnabled', val)}
                trackColor={{ false: '#D1D5DB', true: '#991B1B' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 2. Logo Upload Section */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
            >
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? '#E5E7EB' : '#374151' },
                ]}
              >
                लोगो
              </Text>

              <View style={styles.logoSectionRow}>
                {/* Logo Box */}
                <View
                  style={[
                    styles.logoBox,
                    {
                      backgroundColor: isDark
                        ? '#3F1717'
                        : '#FEE2E2',
                      borderColor: isDark ? '#7F1D1D' : '#FECACA',
                    },
                  ]}
                >
                  {branding.logoUri ? (
                    <Image
                      source={{ uri: branding.logoUri }}
                      style={styles.logoImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.logoInitialsText,
                        { color: isDark ? '#FCA5A5' : '#991B1B' },
                      ]}
                    >
                      {branding.logoText || 'रश'}
                    </Text>
                  )}
                </View>

                {/* Upload Button & format note */}
                <View style={styles.logoActionsCol}>
                  <TouchableOpacity
                    style={[
                      styles.uploadLogoBtn,
                      { borderColor: maroonColor },
                    ]}
                    onPress={handlePickLogo}
                    activeOpacity={0.7}
                  >
                    <Icon name="upload" size={15} color={maroonColor} />
                    <Text
                      style={[styles.uploadLogoBtnText, { color: maroonColor }]}
                    >
                      लोगो अपलोड करें
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.uploadFormatText,
                      { color: isDark ? '#9CA3AF' : '#9CA3AF' },
                    ]}
                  >
                    PNG / JPG • अधिकतम 2 MB
                  </Text>
                </View>

                {/* Remove link */}
                {branding.logoUri ? (
                  <TouchableOpacity
                    onPress={handleRemoveLogo}
                    style={styles.removeLogoBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[styles.removeLogoText, { color: '#DC2626' }]}>
                      हटाएँ
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleRemoveLogo}
                    style={styles.removeLogoBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text
                      style={[
                        styles.removeLogoText,
                        { color: isDark ? '#9CA3AF' : '#9CA3AF' },
                      ]}
                    >
                      हटाएँ
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* 3. Form Inputs Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
            >
              {/* Field: प्रदर्शित नाम * */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  प्रदर्शित नाम <Text style={styles.requiredStar}>*</Text>
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
                  value={branding.displayName}
                  onChangeText={val => updateField('displayName', val)}
                  placeholder="अपना प्रदर्शित नाम लिखें"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              {/* Field: उपाधि / परिचय */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  उपाधि / परिचय
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
                  value={branding.title}
                  onChangeText={val => updateField('title', val)}
                  placeholder="जैसे: वैदिक कर्मकांड एवं ज्योतिष"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              {/* Two columns: मोबाइल नंबर & WhatsApp नंबर */}
              <View style={styles.twoColumnRow}>
                {/* Mobile number */}
                <View style={styles.columnItem}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    मोबाइल नंबर
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
                    value={branding.mobileNumber}
                    onChangeText={val => updateField('mobileNumber', val)}
                    keyboardType="phone-pad"
                    placeholder="+91 •••••••"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>

                {/* WhatsApp number */}
                <View style={styles.columnItem}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    WhatsApp नंबर
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: isDark ? colors.background : '#FFFFFF',
                        borderColor: isDark ? '#404040' : '#D1D5DB',
                        color: isDark ? '#FFF' : '#1F2937',
                        opacity: branding.isSameWhatsapp ? 0.75 : 1,
                      },
                    ]}
                    value={branding.whatsappNumber}
                    onChangeText={val => updateField('whatsappNumber', val)}
                    editable={!branding.isSameWhatsapp}
                    keyboardType="phone-pad"
                    placeholder="+91 •••••••"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
              </View>

              {/* Checkbox: मोबाइल नंबर समान है */}
              <TouchableOpacity
                style={styles.sameWhatsappRow}
                onPress={handleToggleSameWhatsapp}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={
                    branding.isSameWhatsapp
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={19}
                  color={branding.isSameWhatsapp ? maroonColor : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.sameWhatsappText,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  मोबाइल नंबर समान है
                </Text>
              </TouchableOpacity>

              {/* Field: पता / शहर */}
              <View style={[styles.inputGroup, { marginTop: 12 }]}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  पता / शहर
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
                  value={branding.addressCity}
                  onChangeText={val => updateField('addressCity', val)}
                  placeholder="शहर, राज्य"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              {/* Field: ईमेल / वेबसाइट */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  ईमेल / वेबसाइट
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
                  value={branding.emailWebsite}
                  onChangeText={val => updateField('emailWebsite', val)}
                  placeholder="वैकल्पिक"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>
            </View>

            {/* 4. Export Preview Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#EAE6DF',
                },
              ]}
            >
              {/* Header row with PDF link */}
              <View style={styles.previewHeaderRow}>
                <Text
                  style={[
                    styles.cardMainTitle,
                    { color: isDark ? '#FFF' : '#1F2937' },
                  ]}
                >
                  निर्यात का पूर्वावलोकन
                </Text>
                <TouchableOpacity
                  onPress={() => setIsPreviewModalVisible(true)}
                  style={styles.pdfLinkBtn}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pdfLinkText, { color: maroonColor }]}>
                    PDF देखें ↗
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Visual mini-document invoice box */}
              <View
                style={[
                  styles.previewDocBox,
                  {
                    backgroundColor: isDark ? '#1C1917' : '#FFFFFF',
                    borderColor: isDark ? '#333333' : '#E5E7EB',
                  },
                ]}
              >
                {/* Header section of invoice */}
                <View style={styles.previewDocHeader}>
                  <View style={styles.previewDocBrandLeft}>
                    {/* Mini Logo */}
                    <View
                      style={[
                        styles.previewDocLogo,
                        {
                          backgroundColor: isDark ? '#3F1717' : '#FEE2E2',
                          borderColor: isDark ? '#7F1D1D' : '#FECACA',
                        },
                      ]}
                    >
                      {branding.logoUri ? (
                        <Image
                          source={{ uri: branding.logoUri }}
                          style={styles.previewDocLogoImg}
                        />
                      ) : (
                        <Text
                          style={[
                            styles.previewDocLogoText,
                            { color: maroonColor },
                          ]}
                        >
                          {branding.logoText || 'रश'}
                        </Text>
                      )}
                    </View>

                    {/* Brand Titles */}
                    <View style={styles.previewDocTitles}>
                      <Text
                        style={[
                          styles.previewDocName,
                          { color: isDark ? '#FFF' : '#1F2937' },
                        ]}
                      >
                        {branding.displayName || 'पं. राजेश शर्मा'}
                      </Text>
                      <Text
                        style={[
                          styles.previewDocSub,
                          { color: isDark ? '#9CA3AF' : '#6B7280' },
                        ]}
                      >
                        {branding.title || 'वैदिक कर्मकांड एवं ज्योतिष'}
                      </Text>
                    </View>
                  </View>

                  {/* Contact on top right */}
                  <View style={styles.previewDocContactRight}>
                    <Text
                      style={[
                        styles.previewDocContactItem,
                        { color: isDark ? '#9CA3AF' : '#4B5563' },
                      ]}
                    >
                      {branding.mobileNumber}
                    </Text>
                    <Text
                      style={[
                        styles.previewDocContactItem,
                        { color: isDark ? '#9CA3AF' : '#6B7280' },
                      ]}
                    >
                      {branding.addressCity}
                    </Text>
                  </View>
                </View>

                {/* Thin divider */}
                <View
                  style={[
                    styles.previewDocDivider,
                    { backgroundColor: isDark ? '#333' : '#E5E7EB' },
                  ]}
                />

                {/* Sample document content */}
                <View style={styles.previewDocBody}>
                  <Text style={[styles.previewDocSectionTitle, { color: maroonColor }]}>
                    गृह प्रवेश पूजा • सामग्री सूची
                  </Text>
                  <Text
                    style={[
                      styles.previewDocItem,
                      { color: isDark ? '#D1D5DB' : '#4B5563' },
                    ]}
                  >
                    1. रोली — 50 ग्राम
                  </Text>
                  <Text
                    style={[
                      styles.previewDocItem,
                      { color: isDark ? '#D1D5DB' : '#4B5563' },
                    ]}
                  >
                    2. अक्षत — 250 ग्राम
                  </Text>
                </View>

                {/* Footer credit */}
                <Text
                  style={[
                    styles.previewDocFooter,
                    { color: isDark ? '#6B7280' : '#9CA3AF' },
                  ]}
                >
                  {branding.displayName} • {branding.addressCity?.split(',')[0]}
                </Text>
              </View>

              {/* Helper text below preview */}
              <Text
                style={[
                  styles.previewHelpText,
                  { color: isDark ? '#9CA3AF' : '#6B7280' },
                ]}
              >
                सामग्री सूची, अनुमान और ज्योतिष रिपोर्ट में लागू।
              </Text>
            </View>

            {/* 5. Bottom Action Buttons */}
            <View style={styles.bottomButtonsRow}>
              {/* Preview Button */}
              <TouchableOpacity
                style={[
                  styles.previewOutlineBtn,
                  { borderColor: maroonColor },
                ]}
                onPress={() => setIsPreviewModalVisible(true)}
                activeOpacity={0.7}
              >
                <Icon name="eye" size={16} color={maroonColor} />
                <Text style={[styles.previewOutlineBtnText, { color: maroonColor }]}>
                  पूर्वावलोकन
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.saveFilledBtn,
                  { backgroundColor: maroonColor },
                ]}
                onPress={handleSaveChanges}
                activeOpacity={0.8}
              >
                <Text style={styles.saveFilledBtnText}>बदलाव सहेजें</Text>
              </TouchableOpacity>
            </View>

            {/* Note below buttons */}
            <Text
              style={[
                styles.footerNoteText,
                { color: isDark ? '#9CA3AF' : '#6B7280' },
              ]}
            >
              सहेजने के बाद नए निर्यात में बदलाव दिखेंगे।
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Full Document Preview Modal */}
      <Modal
        visible={isPreviewModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPreviewModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                maxWidth: isTablet ? 600 : '94%',
              },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <Text
                style={[
                  styles.modalHeaderTitle,
                  { color: isDark ? '#FFF' : '#1F2937' },
                ]}
              >
                ब्रांडेड PDF पूर्वावलोकन
              </Text>
              <TouchableOpacity
                onPress={() => setIsPreviewModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="x" size={22} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            {/* Modal Document Page */}
            <ScrollView
              style={styles.modalDocScroll}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.modalDocSheet,
                  {
                    backgroundColor: isDark ? '#1C1917' : '#FFFFFF',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.sheetHeader}>
                  <View style={styles.sheetBrand}>
                    <View
                      style={[
                        styles.sheetLogo,
                        {
                          backgroundColor: isDark ? '#3F1717' : '#FEE2E2',
                          borderColor: isDark ? '#7F1D1D' : '#FECACA',
                        },
                      ]}
                    >
                      {branding.logoUri ? (
                        <Image
                          source={{ uri: branding.logoUri }}
                          style={styles.sheetLogoImg}
                        />
                      ) : (
                        <Text style={[styles.sheetLogoText, { color: maroonColor }]}>
                          {branding.logoText || 'रश'}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={[styles.sheetName, { color: isDark ? '#FFF' : '#1F2937' }]}>
                        {branding.displayName}
                      </Text>
                      <Text style={[styles.sheetTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {branding.title}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sheetContact}>
                    <Text style={[styles.sheetContactText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                      {branding.mobileNumber}
                    </Text>
                    <Text style={[styles.sheetContactText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {branding.addressCity}
                    </Text>
                  </View>
                </View>

                <View style={styles.sheetDivider} />

                {/* Sample Content */}
                <Text style={[styles.sheetCategory, { color: maroonColor }]}>
                  गृह प्रवेश पूजा — सम्पूर्ण सामग्री सूची
                </Text>
                <Text style={[styles.sheetDate, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  तिथि: मार्गशीर्ष शुक्ल पक्ष • समय: प्रातः 09:15
                </Text>

                <View style={styles.sheetItemsTable}>
                  {[
                    ['1', 'रोली / कुमकुम', '50 ग्राम'],
                    ['2', 'अक्षत (बिना टूटे चावल)', '250 ग्राम'],
                    ['3', 'कपूर एवं अगरबत्ती', '1 पैकेट'],
                    ['4', 'पंचामृत सामग्री', 'दूध, दही, घी, शहद, शर्करा'],
                    ['5', 'पीला एवं लाल वस्त्र', '1.25 मीटर प्रत्येक'],
                    ['6', 'नारियल (जटा वाला)', '2 नग'],
                  ].map(([num, name, qty], idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.sheetTableRow,
                        { borderBottomColor: isDark ? '#333' : '#F1EAE4' },
                      ]}
                    >
                      <Text style={[styles.tableColNum, { color: maroonColor }]}>
                        {num}.
                      </Text>
                      <Text
                        style={[
                          styles.tableColName,
                          { color: isDark ? '#E5E7EB' : '#1F2937' },
                        ]}
                      >
                        {name}
                      </Text>
                      <Text
                        style={[
                          styles.tableColQty,
                          { color: isDark ? '#9CA3AF' : '#6B7280' },
                        ]}
                      >
                        {qty}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Footer in sheet */}
                <View style={styles.sheetFooter}>
                  <Text style={[styles.sheetFooterNote, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    विप्रा साथी • डिजिटल पंडित सहयोग प्रणाली
                  </Text>
                  <Text style={[styles.sheetFooterSign, { color: maroonColor }]}>
                    {branding.displayName}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: maroonColor }]}
              onPress={() => setIsPreviewModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>पूर्वावलोकन बंद करें</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 2,
    marginRight: 6,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  resetButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
  switchCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  cardMainTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#DC2626',
  },
  logoSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoInitialsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoActionsCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  uploadLogoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    gap: 6,
  },
  uploadLogoBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  uploadFormatText: {
    fontSize: 11,
    marginTop: 4,
  },
  removeLogoBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  removeLogoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13.5,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  columnItem: {
    flex: 1,
  },
  sameWhatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
    alignSelf: 'flex-end',
  },
  sameWhatsappText: {
    fontSize: 12,
    fontWeight: '500',
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pdfLinkBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  pdfLinkText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  previewDocBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  previewDocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  previewDocBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  previewDocLogo: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  previewDocLogoImg: {
    width: '100%',
    height: '100%',
  },
  previewDocLogoText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewDocTitles: {
    flex: 1,
  },
  previewDocName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  previewDocSub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  previewDocContactRight: {
    alignItems: 'flex-end',
  },
  previewDocContactItem: {
    fontSize: 10,
    marginTop: 1,
  },
  previewDocDivider: {
    height: 1,
    marginVertical: 8,
  },
  previewDocBody: {
    marginBottom: 6,
  },
  previewDocSectionTitle: {
    fontSize: 11.5,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  previewDocItem: {
    fontSize: 10.5,
    lineHeight: 16,
  },
  previewDocFooter: {
    fontSize: 9.5,
    textAlign: 'right',
    marginTop: 4,
  },
  previewHelpText: {
    fontSize: 11.5,
    marginTop: 8,
    textAlign: 'left',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    marginBottom: 6,
  },
  previewOutlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
    backgroundColor: 'transparent',
  },
  previewOutlineBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveFilledBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveFilledBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerNoteText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  // Modal Sheet Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 14,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDocScroll: {
    maxHeight: 460,
  },
  modalDocSheet: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sheetBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sheetLogo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  sheetLogoImg: {
    width: '100%',
    height: '100%',
  },
  sheetLogoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  sheetTitle: {
    fontSize: 11.5,
  },
  sheetContact: {
    alignItems: 'flex-end',
  },
  sheetContactText: {
    fontSize: 11,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  sheetCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sheetDate: {
    fontSize: 11,
    marginBottom: 12,
  },
  sheetItemsTable: {
    marginBottom: 16,
  },
  sheetTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  tableColNum: {
    width: 24,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableColName: {
    flex: 1,
    fontSize: 12,
  },
  tableColQty: {
    fontSize: 11.5,
  },
  sheetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sheetFooterNote: {
    fontSize: 10,
  },
  sheetFooterSign: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    marginTop: 14,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default PersonalBrandingScreen;

