import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomHeader from '../components/CustomHeader';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AnimatedOption = ({ label, isSelected, onPress, iconName, colors }: any) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.animatedOption,
          {
            backgroundColor: isSelected ? colors.primary + '12' : 'transparent',
            borderColor: isSelected ? colors.primary : colors.border,
            transform: [{ scale: scaleValue }]
          }
        ]}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.iconContainer, { backgroundColor: isSelected ? colors.primary : colors.surface }]}>
            <Icon name={iconName} size={18} color={isSelected ? '#FFF' : colors.textLight} />
          </View>
          <Text style={[styles.optionText, { color: isSelected ? colors.primaryDark : colors.text }]}>
            {label}
          </Text>
        </View>

        {isSelected && (
          <Animated.View style={styles.checkBadge}>
            <Icon name="check-circle" size={22} color={colors.primary} />
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const SettingsAccordion = ({ title, icon, isExpanded, onToggle, children, colors }: any) => {
  const arrowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(arrowAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const spin = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={[styles.accordionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.accordionHeaderLeft}>
          <View style={[styles.headerIconWrapper, { backgroundColor: colors.primary + '12' }]}>
            <Icon name={icon} size={20} color={colors.primary} />
          </View>
          <Text style={[styles.accordionTitle, { color: colors.text }]}>{title}</Text>
        </View>

        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Icon name="chevron-down" size={22} color={colors.textLight} />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.accordionBody, { borderTopColor: colors.border }]}>
          {children}
        </View>
      )}
    </View>
  );
};

const SettingsScreen = () => {
  const { theme, setTheme, colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { logout, isGuest, exitGuestToLogin } = useAuth();
  const insets = useSafeAreaInsets();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext({
      duration: 200,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    setExpandedSection(expandedSection === section ? null : section);
  };

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language_preference', lang);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader title={t('menu.settings', 'Settings')} icon="settings" showBack={true} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 16, 40) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('menu.settings', 'Settings')}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>
            Customize your experience
          </Text>
        </View>

        <SettingsAccordion
          title="Appearance"
          icon="layout"
          isExpanded={expandedSection === 'appearance'}
          onToggle={() => toggleSection('appearance')}
          colors={colors}
        >
          <AnimatedOption
            label="System Default"
            iconName="smartphone"
            isSelected={theme === 'system'}
            onPress={() => setTheme('system')}
            colors={colors}
          />
          <AnimatedOption
            label="Light Mode"
            iconName="sun"
            isSelected={theme === 'light'}
            onPress={() => setTheme('light')}
            colors={colors}
          />
          <AnimatedOption
            label="Dark Mode"
            iconName="moon"
            isSelected={theme === 'dark'}
            onPress={() => setTheme('dark')}
            colors={colors}
          />
        </SettingsAccordion>

        <SettingsAccordion
          title="Language"
          icon="globe"
          isExpanded={expandedSection === 'language'}
          onToggle={() => toggleSection('language')}
          colors={colors}
        >
          <AnimatedOption
            label="English"
            iconName="type"
            isSelected={i18n.language === 'en'}
            onPress={() => changeLanguage('en')}
            colors={colors}
          />
          <AnimatedOption
            label="Hindi"
            iconName="type"
            isSelected={i18n.language === 'hi'}
            onPress={() => changeLanguage('hi')}
            colors={colors}
          />
        </SettingsAccordion>

        {isGuest ? (
          <View style={[styles.guestCTAContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.loginCTAButton}
              onPress={exitGuestToLogin}
              activeOpacity={0.85}
            >
              <Icon name="user-plus" size={20} color="#FFFFFF" />
              <Text style={styles.loginCTAText}>Create Account / Log In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Icon name="log-out" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: colors.textLight }]}>Vipra Saarthi App v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  accordionContainer: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    paddingTop: 14,
  },
  animatedOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  checkBadge: {
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  guestCTAContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  loginCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C75B12',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#C75B12',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  loginCTAText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    gap: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
  }
});

export default SettingsScreen;
