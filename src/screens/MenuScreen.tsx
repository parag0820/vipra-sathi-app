import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY_MAROON = '#8B1D1D';

interface MenuItemConfig {
  title: string;
  subtitle: string;
  icon: keyof typeof Icon.glyphMap;
  screen: keyof RootStackParamList;
  badge?: string;
}

const MenuScreen = () => {
  const { theme, setTheme, isDark } = useTheme();
  const { user, logout, isGuest, exitGuestToLogin } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Clean user display name & avatar initial
  const displayName =
    (user?.fullName || user?.displayName || '')
      .replace(/\bupdated\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim() || (isHi ? 'पं. राजेश शर्मा' : 'Pt. Rajesh Sharma');

  const nameParts = displayName.replace(/^पं\.\s*|^Pt\.\s*/i, '').trim().split(/\s+/);
  const avatarInitial =
    (nameParts[nameParts.length - 1]?.[0] || nameParts[0]?.[0] || 'व').toUpperCase();

  const phoneDisplay = user?.mobileNumber
    ? `+91 ${user.mobileNumber}`
    : '+91 ••••••• 4821';

  const changeLanguage = async (lang: 'hi' | 'en') => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language_preference', lang);
    setIsLangModalOpen(false);
  };

  const handleLogoutPress = () => {
    Alert.alert(
      isHi ? 'लॉग आउट' : 'Log Out',
      isHi
        ? 'क्या आप वाकई अपने खाते से लॉग आउट करना चाहते हैं?'
        : 'Are you sure you want to log out of your account?',
      [
        { text: isHi ? 'रद्द करें' : 'Cancel', style: 'cancel' },
        {
          text: isHi ? 'लॉग आउट' : 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ],
    );
  };

  // Preserve ALL existing sections and menu options without removing any
  const manageItems: MenuItemConfig[] = [
    {
      title: t('menu.account_manager', isHi ? 'खाता प्रबंधक' : 'Account Manager'),
      subtitle: isHi ? 'आय, व्यय और खाता सारांश' : 'Income, expense & ledger',
      icon: 'pie-chart',
      screen: 'AccountManagerDashboard',
    },
    {
      title: t('menu.yajman_manager', isHi ? 'यजमान सूची' : 'Yajman Directory'),
      subtitle: isHi ? 'यजमान विवरण और संपर्क' : 'Yajman profiles & contacts',
      icon: 'users',
      screen: 'YajmanList',
    },
    {
      title: t('menu.history', isHi ? 'कार्य इतिहास' : 'Work History'),
      subtitle: isHi ? 'पूर्ण पूजा और गतिविधि रिकॉर्ड' : 'Completed rituals & activity log',
      icon: 'clock',
      screen: 'History',
    },
  ];

  const accountItems: MenuItemConfig[] = [
    {
      title: isHi ? 'मेरी प्रोफाइल' : 'My Profile',
      subtitle: isHi ? 'व्यक्तिगत विवरण, विशेषज्ञता और पता' : 'Personal details, skills & address',
      icon: 'user',
      screen: 'Profile',
    },
    {
      title: isHi ? 'मेरी ब्रांडिंग' : 'Personal Branding',
      subtitle: isHi
        ? 'निर्यात में अपना नाम, लोगो और संपर्क'
        : 'Your name, logo & contact on exports',
      icon: 'file-text',
      screen: 'PersonalBranding',
    },
    {
      title: t('menu.subscription', isHi ? 'सदस्यता एवं वॉलेट' : 'Subscription & Wallet'),
      subtitle: isHi ? 'प्लान और नवीनीकरण' : 'Plans & renewal',
      icon: 'award',
      screen: 'Subscription',
      badge: isHi ? 'सक्रिय' : 'Active',
    },
    {
      title: t('menu.settings', isHi ? 'सेटिंग्स' : 'Settings'),
      subtitle: isHi ? 'खाता और ऐप प्राथमिकताएँ' : 'Account & app preferences',
      icon: 'settings',
      screen: 'Settings',
    },
  ];

  const communitySupportItems: MenuItemConfig[] = [
    {
      title: t('menu.community', isHi ? 'समुदाय' : 'Community'),
      subtitle: isHi ? 'पंडित समुदाय चर्चा और संदेश' : 'Pandit discussions & messages',
      icon: 'message-circle',
      screen: 'Community',
    },
    {
      title: t('menu.help', isHi ? 'सहायता केंद्र' : 'Help Center'),
      subtitle: isHi ? 'ऐप, भुगतान और सदस्यता सहायता' : 'App, payment & subscription help',
      icon: 'help-circle',
      screen: 'HelpCenter',
    },
  ];

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

  const renderSectionGroup = (sectionTitle: string, items: MenuItemConfig[]) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textMuted }]}>
        {sectionTitle}
      </Text>
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: cardBg, borderColor: borderCol },
        ]}
      >
        {items.map((item, idx) => (
          <View key={item.screen}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => navigation.navigate(item.screen as any)}
              activeOpacity={0.72}
            >
              <View style={[styles.iconBox, { backgroundColor: roseBg }]}>
                <Icon name={item.icon} size={18} color={accentColor} />
              </View>

              <View style={styles.rowTextCol}>
                <Text style={[styles.rowTitle, { color: textPrimary }]}>
                  {item.title}
                </Text>
                <Text
                  style={[styles.rowSubtitle, { color: textMuted }]}
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Text>
              </View>

              {item.badge && (
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: roseBg, borderColor: roseBorder },
                  ]}
                >
                  <Text style={[styles.statusPillText, { color: accentColor }]}>
                    {item.badge}
                  </Text>
                </View>
              )}

              <Icon name="chevron-right" size={17} color={textMuted} />
            </TouchableOpacity>

            {idx < items.length - 1 && (
              <View style={[styles.divider, { backgroundColor: dividerCol }]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* Top Header matching reference screenshot */}
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
        <View>
          <Text style={[styles.headerTitle, { color: accentColor }]}>
            {isHi ? 'अधिक' : t('menu.title', 'More')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: textMuted }]}>
            {isHi ? 'प्रोफ़ाइल और ऐप सेटिंग्स' : 'Profile & App Settings'}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('Notifications' as any)}
          style={styles.bellBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="bell" size={21} color={accentColor} />
          <View style={[styles.bellDot, { backgroundColor: PRIMARY_MAROON }]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 72 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Summary Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile')}
          style={[
            styles.profileCard,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text
              style={[styles.profileName, { color: textPrimary }]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            <Text
              style={[styles.profileSub, { color: textMuted }]}
              numberOfLines={1}
            >
              {phoneDisplay}
            </Text>
          </View>

          <View
            style={[
              styles.profileActionPill,
              {
                backgroundColor: isDark ? '#252525' : '#FFFFFF',
                borderColor: accentColor,
              },
            ]}
          >
            <Text style={[styles.profileActionText, { color: accentColor }]}>
              {isHi ? 'प्रोफ़ाइल देखें' : 'View Profile'}
            </Text>
            <Icon name="chevron-right" size={14} color={accentColor} />
          </View>
        </TouchableOpacity>

        {/* Section 1: प्रबंधन (All existing management options) */}
        {renderSectionGroup(t('menu.manage', isHi ? 'प्रबंधन' : 'Management'), manageItems)}

        {/* Section 2: खाता एवं ब्रांडिंग (All existing account/profile options) */}
        {renderSectionGroup(
          t('menu.account', isHi ? 'ब्रांडिंग एवं खाता' : 'Branding & Account'),
          accountItems,
        )}

        {/* Section 3: ऐप सेटिंग्स (Inline Language, Theme Switcher, Notifications) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textMuted }]}>
            {isHi ? 'ऐप सेटिंग्स' : 'App Settings'}
          </Text>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            {/* Language Row */}
            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.72}
              onPress={() => setIsLangModalOpen(true)}
            >
              <View style={[styles.iconBox, { backgroundColor: roseBg }]}>
                <Text style={[styles.langGlyph, { color: accentColor }]}>
                  अA
                </Text>
              </View>
              <View style={styles.rowTextCol}>
                <Text style={[styles.rowTitle, { color: textPrimary }]}>
                  {isHi ? 'भाषा' : 'Language'}
                </Text>
                <Text style={[styles.rowSubtitle, { color: textMuted }]}>
                  हिंदी / English
                </Text>
              </View>
              <Text style={[styles.rightValueText, { color: textPrimary }]}>
                {isHi ? 'हिंदी' : 'English'}
              </Text>
              <Icon name="chevron-right" size={17} color={textMuted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: dividerCol }]} />

            {/* Inline Theme Switcher Row (लाइट | डार्क | सिस्टम) */}
            <View style={styles.menuRow}>
              <View style={[styles.iconBox, { backgroundColor: roseBg }]}>
                <Icon
                  name={isDark ? 'moon' : 'sun'}
                  size={18}
                  color={accentColor}
                />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={[styles.rowTitle, { color: textPrimary }]}>
                  {isHi ? 'थीम' : 'Theme'}
                </Text>
              </View>

              <View
                style={[
                  styles.themeSegmented,
                  { backgroundColor: subtleBg, borderColor: borderCol },
                ]}
              >
                {(
                  [
                    { key: 'light', labelHi: 'लाइट', labelEn: 'Light' },
                    { key: 'dark', labelHi: 'डार्क', labelEn: 'Dark' },
                    { key: 'system', labelHi: 'सिस्टम', labelEn: 'System' },
                  ] as const
                ).map((opt) => {
                  const isActive = theme === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      activeOpacity={0.78}
                      onPress={() => setTheme(opt.key)}
                      style={[
                        styles.themePill,
                        isActive && {
                          backgroundColor: roseBg,
                          borderColor: roseBorder,
                          borderWidth: 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.themePillText,
                          {
                            color: isActive ? accentColor : textMuted,
                            fontWeight: isActive ? '700' : '500',
                          },
                        ]}
                      >
                        {isHi ? opt.labelHi : opt.labelEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: dividerCol }]} />

            {/* Notifications Row */}
            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.72}
              onPress={() => navigation.navigate('Notifications' as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: roseBg }]}>
                <Icon name="bell" size={18} color={accentColor} />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={[styles.rowTitle, { color: textPrimary }]}>
                  {isHi ? 'सूचनाएँ' : 'Notifications'}
                </Text>
                <Text style={[styles.rowSubtitle, { color: textMuted }]}>
                  {isHi
                    ? 'बुकिंग, कार्य और संदेश'
                    : 'Bookings, tasks & alerts'}
                </Text>
              </View>
              <Icon name="chevron-right" size={17} color={textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 4: समुदाय एवं सहायता (All existing community & help options) */}
        {renderSectionGroup(
          t('menu.community_support', isHi ? 'समुदाय एवं सहायता' : 'Community & Support'),
          communitySupportItems,
        )}

        {/* Log Out / Guest Login Card */}
        {isGuest ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={exitGuestToLogin}
            style={[
              styles.logoutCard,
              { backgroundColor: roseBg, borderColor: roseBorder },
            ]}
          >
            <View style={styles.logoutLeft}>
              <Icon name="log-in" size={18} color={accentColor} />
              <Text style={[styles.logoutText, { color: accentColor }]}>
                {isHi ? 'लॉग इन / खाता बनाएँ' : 'Log In / Create Account'}
              </Text>
            </View>
            <Icon name="chevron-right" size={17} color={accentColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={handleLogoutPress}
            style={[
              styles.logoutCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View style={styles.logoutLeft}>
              <Icon name="log-out" size={18} color={accentColor} />
              <Text style={[styles.logoutText, { color: accentColor }]}>
                {isHi ? 'लॉग आउट' : 'Log Out'}
              </Text>
            </View>
            <Icon name="chevron-right" size={17} color={textMuted} />
          </TouchableOpacity>
        )}

        {/* Subtle App Footer */}
        <Text style={[styles.footerText, { color: textMuted }]}>
          {isHi ? 'विप्र सारथी  |  संस्करण 1.0.0' : 'Vipra Saarthi  |  v1.0.0'}
        </Text>
      </ScrollView>

      {/* Flat Language Picker Modal */}
      <Modal
        visible={isLangModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsLangModalOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.langModalCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View
              style={[
                styles.langModalHeader,
                { borderBottomColor: dividerCol },
              ]}
            >
              <Text style={[styles.langModalTitle, { color: accentColor }]}>
                {isHi ? 'भाषा चुनें' : 'Select Language'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsLangModalOpen(false)}
                style={[
                  styles.modalCloseBtn,
                  { backgroundColor: subtleBg, borderColor: borderCol },
                ]}
              >
                <Icon name="x" size={15} color={textMuted} />
              </TouchableOpacity>
            </View>

            {(
              [
                { code: 'hi', label: 'हिंदी (Hindi)' },
                { code: 'en', label: 'English' },
              ] as const
            ).map((opt) => {
              const active = opt.code === 'hi' ? isHi : !isHi;
              return (
                <TouchableOpacity
                  key={opt.code}
                  activeOpacity={0.75}
                  onPress={() => changeLanguage(opt.code)}
                  style={[
                    styles.langOptionRow,
                    active && {
                      backgroundColor: roseBg,
                      borderColor: roseBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.langOptionLabel,
                      {
                        color: active ? accentColor : textPrimary,
                        fontWeight: active ? '700' : '500',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {active && (
                    <Icon name="check" size={16} color={accentColor} />
                  )}
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
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
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: PRIMARY_MAROON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  profileName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  profileSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  profileActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  profileActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  langGlyph: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  rowTextCol: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 11,
    marginTop: 1.5,
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 1,
    marginRight: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rightValueText: {
    fontSize: 12.5,
    fontWeight: '600',
    marginRight: 4,
  },
  themeSegmented: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  themePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themePillText: {
    fontSize: 11.5,
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11.5,
    marginBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  langModalCard: {
    width: '100%',
    maxWidth: 330,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  langModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  langModalTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 6,
  },
  langOptionLabel: {
    fontSize: 12.5,
  },
});

export default MenuScreen;
