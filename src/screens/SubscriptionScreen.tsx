import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useTheme } from '../theme/ThemeContext';

const PRIMARY_MAROON = '#8B1D1D';

interface PlanConfig {
  id: string;
  name: string;
  price: string;
  icon: keyof typeof Icon.glyphMap;
  included: string[];
  notIncluded: string[];
  idealFor: string;
  isPopular?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    id: 'basic',
    name: 'Vipra Saarthi Basic',
    price: '₹51',
    icon: 'book-open',
    included: [
      'Pooja Library',
      'Stotram Library',
      'Availability Calendar',
      'Community Access',
      'Work & Activity History',
    ],
    notIncluded: [
      'Branded PDF Generation',
      'Kundali Generation',
      'Kundali Matching',
      'Muhurt',
      'Panchang',
    ],
    idealFor:
      'Pandits who primarily require Pooja references, Stotrams, booking management, and community access.',
  },
  {
    id: 'plus',
    name: 'Vipra Saarthi Plus',
    price: '₹201',
    icon: 'star',
    included: [
      'Everything in Basic',
      'Muhurt',
      'Panchang',
      'Branded PDF Generation',
    ],
    notIncluded: ['Kundali Generation', 'Kundali Matching'],
    idealFor:
      'Pandits who regularly perform rituals and ceremonies requiring Panchang, Muhurt, and branded reports.',
    isPopular: true,
  },
  {
    id: 'pro',
    name: 'Vipra Saarthi Pro',
    price: '₹351',
    icon: 'award',
    included: [
      'Everything in Plus',
      'Kundali Generation',
      'Kundali Matching',
      'Complete Pooja & Stotram Library',
      'Community & Availability Calendar',
      'Complete Work History',
      'Branded PDF Generation for All Modules',
    ],
    notIncluded: [],
    idealFor:
      'Professional Pandits running a complete digital practice who need full access to every premium tool and branded report.',
  },
];

const SubscriptionScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plus');

  // Flat Maroon/White theme tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : '#FAF7F3';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const popularTintBg = isDark ? '#241717' : '#FFF8F6';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  const handleSelectPlan = (plan: PlanConfig) => {
    setSelectedPlanId(plan.id);
    Toast.show({
      type: 'info',
      text1: plan.name,
      text2: isHi
        ? `${plan.price}/माह प्लान चुना गया`
        : `${plan.price}/Month plan selected`,
    });
  };

  const renderFeatureColumn = (
    title: string,
    features: string[],
    included: boolean,
  ) => (
    <View style={styles.featureGroup}>
      <Text style={[styles.featureListTitle, { color: textPrimary }]}>
        {title}
      </Text>
      {features.map((feature, idx) => (
        <View key={idx} style={styles.featureRow}>
          <Icon
            name={included ? 'check-circle' : 'minus-circle'}
            size={13}
            color={included ? (isDark ? '#34D399' : '#059669') : textMuted}
            style={{ marginTop: 2 }}
          />
          <Text
            style={[
              styles.featureText,
              {
                color: included ? textPrimary : textMuted,
                textDecorationLine: included ? 'none' : 'line-through',
              },
            ]}
          >
            {feature}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderPlanCard = (plan: PlanConfig) => {
    const isPopular = Boolean(plan.isPopular);
    const isSelected = selectedPlanId === plan.id;

    return (
      <View
        key={plan.id}
        style={[
          styles.planCard,
          {
            backgroundColor: cardBg,
            borderColor: isPopular
              ? accentColor
              : isSelected
              ? isDark
                ? '#7F1D1D'
                : '#D9A7A7'
              : borderCol,
            borderWidth: isPopular ? 1.5 : 1,
          },
        ]}
      >
        {/* Top Section (Header + Price) */}
        <View
          style={[
            styles.planTopBlock,
            isPopular && { backgroundColor: popularTintBg },
          ]}
        >
          <View style={styles.planTitleRow}>
            <View style={styles.planIdentity}>
              <View style={[styles.planIconBox, { backgroundColor: roseBg }]}>
                <Icon name={plan.icon} size={16} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameBadgeRow}>
                  <Text style={[styles.planName, { color: textPrimary }]}>
                    {plan.name}
                  </Text>
                  {isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>
                        {isHi ? 'लोकप्रिय' : 'Most Popular'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.priceBox}>
              <Text style={[styles.priceValue, { color: accentColor }]}>
                {plan.price}
              </Text>
              <Text style={[styles.pricePeriod, { color: textMuted }]}>
                {isHi ? '/ माह' : '/ Month'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelectPlan(plan)}
            style={[
              styles.selectBtn,
              isPopular
                ? styles.selectBtnFilled
                : {
                    backgroundColor: roseBg,
                    borderColor: isDark ? '#5C2424' : '#E9C5C2',
                    borderWidth: 1,
                  },
            ]}
          >
            <Text
              style={[
                styles.selectBtnText,
                { color: isPopular ? '#FFFFFF' : accentColor },
              ]}
            >
              {isHi ? 'प्लान चुनें' : 'Select Plan'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: dividerCol }]} />

        {/* Features Section */}
        <View style={styles.planBody}>
          {plan.notIncluded.length > 0 ? (
            <View style={styles.featuresColumns}>
              <View style={styles.featureCol}>
                {renderFeatureColumn(
                  isHi ? 'शामिल सुविधाएँ' : 'Includes',
                  plan.included,
                  true,
                )}
              </View>
              <View
                style={[styles.verticalDivider, { backgroundColor: dividerCol }]}
              />
              <View style={styles.featureCol}>
                {renderFeatureColumn(
                  isHi ? 'शामिल नहीं' : 'Not Included',
                  plan.notIncluded,
                  false,
                )}
              </View>
            </View>
          ) : (
            <View>
              <View
                style={[
                  styles.allIncludedBanner,
                  {
                    backgroundColor: isDark ? '#122920' : '#ECFDF5',
                    borderColor: isDark ? '#1F4A38' : '#A7F3D0',
                  },
                ]}
              >
                <Icon
                  name="check-circle"
                  size={13}
                  color={isDark ? '#34D399' : '#047857'}
                />
                <Text
                  style={[
                    styles.allIncludedText,
                    { color: isDark ? '#34D399' : '#047857' },
                  ]}
                >
                  {isHi
                    ? 'सभी प्रीमियम मॉड्यूल एवं ब्रांडेड PDF शामिल'
                    : 'All premium modules & branded PDFs included'}
                </Text>
              </View>
              {renderFeatureColumn(
                isHi ? 'शामिल सुविधाएँ' : 'Includes',
                plan.included,
                true,
              )}
            </View>
          )}

          {/* Ideal For Note */}
          <View
            style={[
              styles.idealForBox,
              { backgroundColor: subtleBg, borderColor: borderCol },
            ]}
          >
            <Text style={[styles.idealForLabel, { color: accentColor }]}>
              {isHi ? 'किसके लिए उपयुक्त:' : 'Ideal For:'}
            </Text>
            <Text style={[styles.idealForText, { color: textMuted }]}>
              {plan.idealFor}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
            {isHi ? 'सदस्यता योजनाएँ' : 'Subscription Plans'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: textMuted }]}>
            {isHi
              ? 'अपनी आवश्यकता के अनुसार मासिक प्लान चुनें'
              : 'Choose the right monthly plan for your practice'}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
      >
        {/* Subtle Reassurance Banner */}
        <View
          style={[
            styles.infoStrip,
            {
              backgroundColor: popularTintBg,
              borderColor: isDark ? '#4A2525' : '#F2D8D5',
            },
          ]}
        >
          <View style={[styles.infoIconBox, { backgroundColor: roseBg }]}>
            <Icon name="shield" size={16} color={accentColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: textPrimary }]}>
              {isHi ? 'विप्र सारथी प्रीमियम लाभ' : 'Vipra Saarthi Membership'}
            </Text>
            <Text style={[styles.infoSub, { color: textMuted }]}>
              {isHi
                ? 'किसी भी समय प्लान अपग्रेड करें • सुरक्षित क्लाउड सिंक शामिल'
                : 'Upgrade anytime • Includes secure cloud backup & priority support'}
            </Text>
          </View>
        </View>

        {PLANS.map(renderPlanCard)}
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
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 14,
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  infoSub: {
    fontSize: 11.5,
    marginTop: 1,
    lineHeight: 16,
  },
  planCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  planTopBlock: {
    padding: 15,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  planIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  planIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  planName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  popularBadge: {
    backgroundColor: PRIMARY_MAROON,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
  },
  pricePeriod: {
    fontSize: 11,
    fontWeight: '500',
  },
  selectBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBtnFilled: {
    backgroundColor: PRIMARY_MAROON,
  },
  selectBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  planBody: {
    padding: 15,
  },
  featuresColumns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureCol: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch',
  },
  featureGroup: {
    marginBottom: 8,
  },
  featureListTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },
  featureText: {
    fontSize: 11.5,
    flex: 1,
    lineHeight: 16,
  },
  allIncludedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  allIncludedText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  idealForBox: {
    marginTop: 6,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
  },
  idealForLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    marginBottom: 3,
  },
  idealForText: {
    fontSize: 11.5,
    lineHeight: 17,
  },
});

export default SubscriptionScreen;
