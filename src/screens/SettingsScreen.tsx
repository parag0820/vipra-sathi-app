import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

const PRIMARY_MAROON = '#8B1D1D';

const SettingsScreen = () => {
  const { theme, setTheme, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const { logout, isGuest, exitGuestToLogin } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const changeLanguage = async (lang: 'en' | 'hi') => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language_preference', lang);
  };

  // Flat Maroon/White theme tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : '#FAF7F3';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const roseBorder = isDark ? '#5C2424' : '#F2D8D5';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  const themeOptions = [
    { key: 'light' as const, label: isHi ? 'लाइट मोड' : 'Light Mode', icon: 'sun' as const },
    { key: 'dark' as const, label: isHi ? 'डार्क मोड' : 'Dark Mode', icon: 'moon' as const },
    { key: 'system' as const, label: isHi ? 'सिस्टम डिफ़ॉल्ट' : 'System Default', icon: 'smartphone' as const },
  ];

  const langOptions = [
    { key: 'hi' as const, label: 'हिंदी (Hindi)' },
    { key: 'en' as const, label: 'English' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* Flat Maroon/White Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: headerBg,
            paddingTop: Math.max(insets.top, 12) + 6,
            borderBottomColor: dividerCol,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={24} color={accentColor} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: accentColor }]}>
            {t('menu.settings', isHi ? 'सेटिंग्स' : 'Settings')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: textMuted }]}>
            {isHi ? 'थीम, भाषा और खाता प्राथमिकताएँ' : 'Customize your app experience'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance / Theme */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>
          {isHi ? 'थीम चुनें' : 'Appearance'}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          {themeOptions.map((opt, idx) => {
            const selected = theme === opt.key;
            return (
              <View key={opt.key}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setTheme(opt.key)}
                  style={[
                    styles.optionRow,
                    selected && { backgroundColor: roseBg },
                  ]}
                >
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: selected
                          ? PRIMARY_MAROON
                          : subtleBg,
                      },
                    ]}
                  >
                    <Icon
                      name={opt.icon}
                      size={16}
                      color={selected ? '#FFFFFF' : accentColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: selected ? accentColor : textPrimary,
                        fontWeight: selected ? '700' : '500',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {selected && (
                    <Icon name="check-circle" size={18} color={accentColor} />
                  )}
                </TouchableOpacity>
                {idx < themeOptions.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: dividerCol }]} />
                )}
              </View>
            );
          })}
        </View>

        {/* Language */}
        <Text style={[styles.sectionTitle, { color: textMuted }]}>
          {isHi ? 'भाषा' : 'Language'}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          {langOptions.map((opt, idx) => {
            const selected = opt.key === 'hi' ? isHi : !isHi;
            return (
              <View key={opt.key}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => changeLanguage(opt.key)}
                  style={[
                    styles.optionRow,
                    selected && { backgroundColor: roseBg },
                  ]}
                >
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: selected
                          ? PRIMARY_MAROON
                          : subtleBg,
                      },
                    ]}
                  >
                    <Icon
                      name="globe"
                      size={16}
                      color={selected ? '#FFFFFF' : accentColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: selected ? accentColor : textPrimary,
                        fontWeight: selected ? '700' : '500',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {selected && (
                    <Icon name="check-circle" size={18} color={accentColor} />
                  )}
                </TouchableOpacity>
                {idx < langOptions.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: dividerCol }]} />
                )}
              </View>
            );
          })}
        </View>

        {/* Account Action */}
        {isGuest ? (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={exitGuestToLogin}
            activeOpacity={0.82}
          >
            <Icon name="user-plus" size={18} color="#FFFFFF" />
            <Text style={styles.loginBtnText}>
              {isHi ? 'खाता बनाएँ / लॉग इन करें' : 'Create Account / Log In'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.logoutBtn,
              { backgroundColor: roseBg, borderColor: roseBorder },
            ]}
            onPress={logout}
            activeOpacity={0.78}
          >
            <Icon name="log-out" size={17} color={accentColor} />
            <Text style={[styles.logoutBtnText, { color: accentColor }]}>
              {isHi ? 'लॉग आउट' : 'Log Out'}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.versionText, { color: textMuted }]}>
          {isHi ? 'विप्र सारथी ऐप  •  v1.0.0' : 'Vipra Saarthi App  •  v1.0.0'}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 10.5,
    marginTop: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 12.5,
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
    marginTop: 6,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 6,
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11.5,
    marginTop: 20,
  },
});

export default SettingsScreen;
