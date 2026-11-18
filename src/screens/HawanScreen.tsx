import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

const PRIMARY_MAROON = '#8B1D1D';

const HAWAN_STEPS = [
  { id: '1', titleKey: 'step_1', descKey: 'step_1_desc', icon: 'droplet' as const },
  { id: '2', titleKey: 'step_2', descKey: 'step_2_desc', icon: 'compass' as const },
  { id: '3', titleKey: 'step_3', descKey: 'step_3_desc', icon: 'sun' as const },
  { id: '4', titleKey: 'step_4', descKey: 'step_4_desc', icon: 'star' as const },
  { id: '5', titleKey: 'step_5', descKey: 'step_5_desc', icon: 'award' as const },
  { id: '6', titleKey: 'step_6', descKey: 'step_6_desc', icon: 'bell' as const },
];

const POPULAR_HAWANS = [
  { id: 'h1', titleKey: 'navgrah', descKey: 'navgrah_desc', tag: 'Navgrah' },
  { id: 'h2', titleKey: 'mahamrityunjaya', descKey: 'mahamrityunjaya_desc', tag: 'Arogya' },
  { id: 'h3', titleKey: 'gayatri', descKey: 'gayatri_desc', tag: 'Gayatri' },
  { id: 'h4', titleKey: 'vastu', descKey: 'vastu_desc', tag: 'Vastu' },
  { id: 'h5', titleKey: 'rudra', descKey: 'rudra_desc', tag: 'Shiva' },
  { id: 'h6', titleKey: 'lakshmi', descKey: 'lakshmi_desc', tag: 'Lakshmi' },
];

const HawanScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');
  const [activeTab, setActiveTab] = useState<'vidhi' | 'hawans'>('vidhi');

  // Flat Maroon/White theme tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const roseBorder = isDark ? '#5C2424' : '#F2D8D5';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

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
        <View style={styles.headerTextCol}>
          <Text style={[styles.headerTitle, { color: accentColor }]}>
            {t('spiritual_hub.hawan_title', isHi ? 'हवन' : 'Hawan')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: textMuted }]}>
            {t('hawan_screen.title', isHi ? 'हवन एवं यज्ञ विधि' : 'Hawan & Yajna Vidhi')}
          </Text>
        </View>
      </View>

      {/* Panchang-style Underline Tabs */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: headerBg,
            borderBottomColor: borderCol,
          },
        ]}
      >
        {(
          [
            {
              key: 'vidhi' as const,
              label: t(
                'hawan_screen.hawan_steps',
                isHi ? 'हवन विधि क्रम' : 'Hawan Sequence (Vidhi)',
              ),
            },
            {
              key: 'hawans' as const,
              label: t(
                'hawan_screen.popular_hawans',
                isHi ? 'प्रमुख हवन' : 'Popular Hawans',
              ),
            },
          ]
        ).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.75}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabItem,
                isActive && {
                  borderBottomColor: accentColor,
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? accentColor : textMuted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Flat Hero Overview Card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          <View style={styles.heroRow}>
            <View style={[styles.heroIconBox, { backgroundColor: roseBg }]}>
              <Image
                source={require('../assets/images/hawan.png')}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.heroTextContent}>
              <Text style={[styles.heroTitle, { color: textPrimary }]}>
                {t('hawan_screen.title', 'Hawan & Yajna Vidhi')}
              </Text>
              <Text style={[styles.heroSubtitle, { color: textMuted }]}>
                {t(
                  'hawan_screen.subtitle',
                  'Complete Vedic procedures, ahuti mantras, and samagri requirements',
                )}
              </Text>
            </View>
          </View>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Samagri')}
              activeOpacity={0.82}
            >
              <Icon
                name="shopping-bag"
                size={14}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.ctaButtonText} numberOfLines={1}>
                {t('hawan_screen.samagri_cta', 'View Hawan Samagri')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.ctaButtonOutline,
                { backgroundColor: roseBg, borderColor: roseBorder },
              ]}
              onPress={() => navigation.navigate('Muhurt')}
              activeOpacity={0.78}
            >
              <Icon
                name="clock"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.ctaButtonOutlineText, { color: accentColor }]}
                numberOfLines={1}
              >
                {t('hawan_screen.muhurat_cta', 'Check Muhurat')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab 1: Unified Flat Hawan Sequence Container */}
        {activeTab === 'vidhi' && (
          <View
            style={[
              styles.groupedCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            {HAWAN_STEPS.map((step, idx) => (
              <View
                key={step.id}
                style={[
                  styles.stepRow,
                  idx < HAWAN_STEPS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: dividerCol,
                  },
                ]}
              >
                <View style={[styles.stepBadge, { backgroundColor: roseBg, borderColor: roseBorder }]}>
                  <Text style={[styles.stepNumberText, { color: accentColor }]}>
                    {idx + 1}
                  </Text>
                </View>

                <View style={styles.stepBody}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[styles.stepTitle, { color: textPrimary }]}>
                      {t(`hawan_screen.${step.titleKey}`)}
                    </Text>
                    <Icon name={step.icon} size={14} color={accentColor} />
                  </View>
                  <Text style={[styles.stepDesc, { color: textMuted }]}>
                    {t(`hawan_screen.${step.descKey}`)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab 2: Popular Hawans Unified Flat Container */}
        {activeTab === 'hawans' && (
          <View
            style={[
              styles.groupedCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            {POPULAR_HAWANS.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.hawanRow,
                  idx < POPULAR_HAWANS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: dividerCol,
                  },
                ]}
              >
                <View style={styles.hawanHeaderRow}>
                  <Text style={[styles.hawanCardTitle, { color: textPrimary }]}>
                    {t(`hawan_screen.${item.titleKey}`)}
                  </Text>
                  <View
                    style={[
                      styles.tagBadge,
                      { backgroundColor: roseBg, borderColor: roseBorder },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: accentColor }]}>
                      {item.tag}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.hawanCardDesc, { color: textMuted }]}>
                  {t(`hawan_screen.${item.descKey}`)}
                </Text>
              </View>
            ))}
          </View>
        )}
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
  headerTextCol: {
    flex: 1,
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tabItem: {
    paddingVertical: 11,
    marginRight: 22,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  heroCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 32,
    height: 32,
  },
  heroTextContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 3,
  },
  heroSubtitle: {
    fontSize: 11,
    lineHeight: 17,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  ctaButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  ctaButtonOutlineText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  groupedCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  stepBody: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },
  stepDesc: {
    fontSize: 11.5,
    lineHeight: 18,
  },
  hawanRow: {
    padding: 14,
  },
  hawanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 5,
  },
  hawanCardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  hawanCardDesc: {
    fontSize: 11.5,
    lineHeight: 18,
  },
});

export default HawanScreen;
