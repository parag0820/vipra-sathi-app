import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { useTheme } from '../theme/ThemeContext';
import {
  calculateDetailedPanchang,
  DetailedPanchangData,
} from '../utils/panchangCalculator';

const PRIMARY_MAROON = '#8B1D1D';

const LOCATIONS = [
  { id: '1', name: { en: 'Ujjain, India', hi: 'उज्जैन, भारत' }, lat: 23.1765, lon: 75.7885 },
  { id: '2', name: { en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान' }, lat: 26.9124, lon: 75.7873 },
  { id: '3', name: { en: 'New Delhi, India', hi: 'नई दिल्ली, भारत' }, lat: 28.6139, lon: 77.2090 },
  { id: '4', name: { en: 'Varanasi, Uttar Pradesh', hi: 'वाराणसी, उत्तर प्रदेश' }, lat: 25.3176, lon: 82.9739 },
  { id: '5', name: { en: 'Mumbai, Maharashtra', hi: 'मुंबई, महाराष्ट्र' }, lat: 19.0760, lon: 72.8777 },
];

const getMuhuratData = (isHi: boolean) => ({
  lagna: [
    { name: isHi ? 'कन्या' : 'Virgo', time: '06:18 - 07:56', current: false },
    { name: isHi ? 'तुला' : 'Libra', time: '07:56 - 10:11', current: false },
    { name: isHi ? 'वृश्चिक' : 'Scorpio', time: '10:11 - 12:27', current: false },
    { name: isHi ? 'धनु' : 'Sagittarius', time: '12:27 - 14:32', current: false },
    { name: isHi ? 'मकर' : 'Capricorn', time: '14:32 - 16:19', current: false },
    { name: isHi ? 'कुम्भ' : 'Aquarius', time: '16:19 - 17:52', current: true },
    { name: isHi ? 'मीन' : 'Pisces', time: '17:52 - 19:22', current: false },
    { name: isHi ? 'मेष' : 'Aries', time: '19:22 - 21:02', current: false },
    { name: isHi ? 'वृषभ' : 'Taurus', time: '21:02 - 23:00', current: false },
    { name: isHi ? 'मिथुन' : 'Gemini', time: '23:00 - 01:15', current: false },
    { name: isHi ? 'कर्क' : 'Cancer', time: '01:15 - 03:36', current: false },
    { name: isHi ? 'सिंह' : 'Leo', time: '03:36 - 05:49', current: false },
    { name: isHi ? 'कन्या' : 'Virgo', time: '05:49 - 06:18', current: false },
  ],
  muhurat: [
    { name: isHi ? 'राहु काल' : 'Rahu Kaal', time: '10:48 - 12:18', type: 'ashubh' },
    { name: isHi ? 'यम घंटा' : 'Yam Ghanta', time: '15:19 - 16:49', type: 'ashubh' },
    { name: isHi ? 'गुली काल' : 'Guli Kaal', time: '07:48 - 09:18', type: 'ashubh' },
    { name: isHi ? 'अभिजित' : 'Abhijit', time: '11:54 - 12:43', type: 'shubh', current: true },
    { name: isHi ? 'दूर मुहूर्त 1' : 'Dur Muhurat 1', time: '08:42 - 09:30', type: 'ashubh' },
    { name: isHi ? 'दूर मुहूर्त 2' : 'Dur Muhurat 2', time: '12:42 - 13:30', type: 'ashubh' },
  ],
  choghadiya: {
    day: [
      { name: isHi ? 'चर' : 'Char', time: '06:18 - 07:48', type: 'shubh' },
      { name: isHi ? 'लाभ' : 'Labh', time: '07:48 - 09:18', type: 'shubh' },
      { name: isHi ? 'अमृत' : 'Amrut', time: '09:18 - 10:48', type: 'shubh' },
      { name: isHi ? 'काल' : 'Kaal', time: '10:48 - 12:18', type: 'ashubh' },
      { name: isHi ? 'शुभ' : 'Shubh', time: '12:18 - 13:49', type: 'shubh' },
      { name: isHi ? 'रोग' : 'Rog', time: '13:49 - 15:19', type: 'ashubh' },
      { name: isHi ? 'उद्वेग' : 'Udveg', time: '15:19 - 16:49', type: 'ashubh', current: true },
      { name: isHi ? 'चर' : 'Char', time: '16:49 - 18:18', type: 'shubh' },
    ],
    night: [
      { name: isHi ? 'रोग' : 'Rog', time: '18:18 - 19:48', type: 'ashubh' },
      { name: isHi ? 'काल' : 'Kaal', time: '19:48 - 21:18', type: 'ashubh' },
      { name: isHi ? 'लाभ' : 'Labh', time: '21:18 - 22:48', type: 'shubh' },
      { name: isHi ? 'उद्वेग' : 'Udveg', time: '22:48 - 00:18', type: 'ashubh' },
      { name: isHi ? 'शुभ' : 'Shubh', time: '00:18 - 01:48', type: 'shubh' },
      { name: isHi ? 'अमृत' : 'Amrut', time: '01:48 - 03:18', type: 'shubh' },
      { name: isHi ? 'चर' : 'Char', time: '03:18 - 04:48', type: 'shubh' },
      { name: isHi ? 'रोग' : 'Rog', time: '04:48 - 06:18', type: 'ashubh' },
    ],
  },
  hora: [
    { name: isHi ? 'शुक्र' : 'Venus', time: '06:18 - 07:18' },
    { name: isHi ? 'बुध' : 'Mercury', time: '07:18 - 08:18' },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '08:18 - 09:18' },
    { name: isHi ? 'शनि' : 'Saturn', time: '09:18 - 10:18' },
    { name: isHi ? 'बृहस्पति' : 'Jupiter', time: '10:18 - 11:18' },
    { name: isHi ? 'मंगल' : 'Mars', time: '11:18 - 12:18' },
    { name: isHi ? 'सूर्य' : 'Sun', time: '12:18 - 13:19' },
    { name: isHi ? 'शुक्र' : 'Venus', time: '13:19 - 14:19' },
    { name: isHi ? 'बुध' : 'Mercury', time: '14:19 - 15:19' },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '15:19 - 16:19' },
    { name: isHi ? 'शनि' : 'Saturn', time: '16:19 - 17:19' },
    { name: isHi ? 'बृहस्पति' : 'Jupiter', time: '17:19 - 18:19', current: true },
    { name: isHi ? 'मंगल' : 'Mars', time: '18:19 - 19:19' },
    { name: isHi ? 'सूर्य' : 'Sun', time: '19:19 - 20:19' },
    { name: isHi ? 'शुक्र' : 'Venus', time: '20:19 - 21:19' },
    { name: isHi ? 'बुध' : 'Mercury', time: '21:19 - 22:19' },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '22:19 - 23:19' },
    { name: isHi ? 'शनि' : 'Saturn', time: '23:19 - 00:19' },
    { name: isHi ? 'बृहस्पति' : 'Jupiter', time: '00:19 - 01:19' },
    { name: isHi ? 'मंगल' : 'Mars', time: '01:19 - 02:19' },
    { name: isHi ? 'सूर्य' : 'Sun', time: '02:19 - 03:19' },
    { name: isHi ? 'शुक्र' : 'Venus', time: '03:19 - 04:19' },
    { name: isHi ? 'बुध' : 'Mercury', time: '04:19 - 05:19' },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '05:19 - 06:18' },
  ],
});

const PanchangScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [panchangData, setPanchangData] = useState<DetailedPanchangData | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [availableLocations, setAvailableLocations] = useState(LOCATIONS);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const muhuratData = useMemo(() => getMuhuratData(isHi), [isHi]);

  const TABS = useMemo(
    () => [
      { key: 'summary', label: t('panchang_screen.tabs.summary', isHi ? 'सारांश' : 'Summary') },
      { key: 'choghadiya', label: t('panchang_screen.tabs.choghadiya', isHi ? 'चौघड़िया' : 'Choghadiya') },
      { key: 'hora', label: t('panchang_screen.tabs.hora', isHi ? 'होरा' : 'Hora') },
      { key: 'muhurat', label: t('panchang_screen.tabs.muhurat', isHi ? 'मुहूर्त' : 'Muhurat') },
      { key: 'lagna', label: t('panchang_screen.tabs.lagna', isHi ? 'लग्न' : 'Lagna') },
    ],
    [t, isHi],
  );

  useEffect(() => {
    (async () => {
      try {
        setIsFetchingLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        const currentPos = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync({
          latitude: currentPos.coords.latitude,
          longitude: currentPos.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const currentGeo = geocode[0];
          const city =
            currentGeo.city ||
            currentGeo.district ||
            currentGeo.subregion ||
            'Current Location';
          const region = currentGeo.region || 'India';
          const newLocText = `${city}, ${region}`;

          const dynamicLocation = {
            id: 'current',
            name: {
              en: newLocText,
              hi: newLocText,
            },
            lat: currentPos.coords.latitude,
            lon: currentPos.coords.longitude,
          };

          setAvailableLocations([dynamicLocation, ...LOCATIONS]);
          setLocation(dynamicLocation);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsFetchingLocation(false);
      }
    })();
  }, []);

  useEffect(() => {
    const data = calculateDetailedPanchang(
      currentDate,
      location.lat || 23.1765,
      location.lon || 75.7885,
      location.name,
    );
    setPanchangData(data);
  }, [currentDate, location]);

  const goToPreviousDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const isToday = useMemo(() => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  }, [currentDate]);

  const goToToday = () => {
    setCurrentDate(new Date());
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
  const shubhColor = isDark ? '#34D399' : '#047857';
  const shubhBg = isDark ? '#122920' : '#ECFDF5';
  const ashubhColor = isDark ? '#F87171' : '#B91C1C';
  const ashubhBg = isDark ? '#2E1616' : '#FEE2E2';

  if (!panchangData) return null;

  const renderListItem = (item: any, index: number, totalLength: number) => {
    const isShubh = item.type === 'shubh';
    const isAshubh = item.type === 'ashubh';
    const statusColor = isShubh ? shubhColor : isAshubh ? ashubhColor : textMuted;
    const statusBg = isShubh ? shubhBg : isAshubh ? ashubhBg : subtleBg;
    const isCurrent = item.current;

    return (
      <View
        key={index}
        style={[
          styles.listItem,
          {
            borderBottomColor: index === totalLength - 1 ? 'transparent' : dividerCol,
            backgroundColor: isCurrent ? roseBg : 'transparent',
          },
          isCurrent && { borderLeftWidth: 3, borderLeftColor: accentColor },
        ]}
      >
        <View style={styles.listLeft}>
          <Text
            style={[
              styles.itemName,
              { color: isCurrent ? accentColor : textPrimary, fontWeight: isCurrent ? '700' : '600' },
            ]}
          >
            {item.name}
          </Text>
          {item.type && (
            <View style={[styles.miniStatusBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.miniStatusText, { color: statusColor }]}>
                {isShubh
                  ? t('panchang_screen.labels.shubh', 'शुभ')
                  : t('panchang_screen.labels.ashubh', 'अशुभ')}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.itemTime,
            { color: isCurrent ? accentColor : textPrimary, fontWeight: isCurrent ? '700' : '500' },
          ]}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  const renderDataRow = (
    iconName: string,
    label: string,
    value: string,
    subValue?: string,
    isLast: boolean = false,
    badgeType?: 'shubh' | 'ashubh',
  ) => {
    const isShubh = badgeType === 'shubh';
    const isAshubh = badgeType === 'ashubh';
    const badgeColor = isShubh ? shubhColor : isAshubh ? ashubhColor : textMuted;
    const badgeBg = isShubh ? shubhBg : isAshubh ? ashubhBg : subtleBg;

    return (
      <View
        style={[
          styles.dataRow,
          { borderBottomColor: isLast ? 'transparent' : dividerCol },
        ]}
      >
        <View style={styles.iconLabelContainer}>
          <MaterialCommunityIcons
            name={iconName as any}
            size={16}
            color={accentColor}
            style={styles.rowIcon}
          />
          <Text style={[styles.rowLabel, { color: textMuted }]}>{label}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.rowValue, { color: textPrimary }]}>{value}</Text>
          {subValue && (
            <Text style={[styles.rowSubValue, { color: textMuted }]}>
              {subValue}
            </Text>
          )}
          {badgeType && (
            <View style={[styles.miniBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.miniBadgeText, { color: badgeColor }]}>
                {isShubh
                  ? t('panchang_screen.labels.shubh', 'शुभ')
                  : t('panchang_screen.labels.ashubh', 'अशुभ')}
              </Text>
            </View>
          )}
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
            paddingTop: Math.max(insets.top, 12) + 4,
            borderBottomColor: dividerCol,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={22} color={accentColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: accentColor }]}>
              {t('panchang_screen.title', isHi ? 'पंचांग' : 'Panchang')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {isHi ? 'दैनिक पञ्चाङ्ग, चौघड़िया एवं मुहूर्त' : 'Daily Panchang, Choghadiya & Muhurat'}
            </Text>
          </View>
        </View>

        {/* Location selector pill in header */}
        <TouchableOpacity
          style={[styles.locationHeaderPill, { backgroundColor: roseBg, borderColor: roseBorder }]}
          onPress={() => setShowLocationPicker(true)}
          activeOpacity={0.75}
        >
          {isFetchingLocation ? (
            <ActivityIndicator size="small" color={accentColor} style={{ marginRight: 4 }} />
          ) : (
            <MaterialCommunityIcons
              name="map-marker"
              size={13}
              color={accentColor}
              style={{ marginRight: 3 }}
            />
          )}
          <Text
            style={[styles.locationHeaderPillText, { color: accentColor }]}
            numberOfLines={1}
          >
            {isHi ? location.name.hi.split(',')[0] : location.name.en.split(',')[0]}
          </Text>
          <Icon name="chevron-down" size={12} color={accentColor} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

      {/* Date Navigator Strip */}
      <View
        style={[
          styles.dateNavStrip,
          { backgroundColor: headerBg, borderBottomColor: dividerCol },
        ]}
      >
        <TouchableOpacity
          onPress={goToPreviousDay}
          style={styles.navArrowBtn}
          hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Icon name="chevron-left" size={18} color={accentColor} />
        </TouchableOpacity>

        <View style={styles.dateDisplayCol}>
          <Text style={[styles.dateText, { color: textPrimary }]}>
            {isHi ? panchangData.dateStr.hi : panchangData.dateStr.en}
          </Text>
        </View>

        <TouchableOpacity
          onPress={goToNextDay}
          style={styles.navArrowBtn}
          hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Icon name="chevron-right" size={18} color={accentColor} />
        </TouchableOpacity>

        {!isToday && (
          <TouchableOpacity
            onPress={goToToday}
            style={[styles.todayBtn, { backgroundColor: roseBg, borderColor: roseBorder }]}
            activeOpacity={0.75}
          >
            <Text style={[styles.todayBtnText, { color: accentColor }]}>
              {isHi ? 'आज' : 'Today'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Panchang Underline Tab Bar */}
      <View
        style={[
          styles.tabBar,
          { backgroundColor: headerBg, borderBottomColor: borderCol },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.75}
                style={[
                  styles.tabBtn,
                  isActive && { borderBottomColor: accentColor, borderBottomWidth: 2 },
                ]}
                onPress={() => setActiveTab(tab.key)}
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
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'summary' && (
          <>
            {/* Top Hero Card: Location, Moon phase, Tithi, Paksha, Month */}
            <View
              style={[
                styles.heroCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              <View style={styles.heroRow}>
                <View style={[styles.moonIconWrapper, { backgroundColor: roseBg }]}>
                  <MaterialCommunityIcons
                    name="moon-waning-crescent"
                    size={22}
                    color={accentColor}
                  />
                </View>
                <View style={styles.heroTextContainer}>
                  <Text style={[styles.heroLocation, { color: textMuted }]}>
                    {isHi ? location.name.hi : location.name.en}
                  </Text>
                  <Text style={[styles.heroSummary, { color: textPrimary }]}>
                    {isHi ? panchangData.headerSummary.hi : panchangData.headerSummary.en}
                  </Text>
                </View>
              </View>

              {/* Festival / Vrat Pill if present */}
              {panchangData.festivals.length > 0 && (
                <View
                  style={[
                    styles.festivalBanner,
                    { backgroundColor: roseBg, borderColor: roseBorder },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={13}
                    color={accentColor}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[styles.festivalBannerText, { color: accentColor }]}
                    numberOfLines={2}
                  >
                    {panchangData.festivals
                      .map((f) => (isHi ? f.hi : f.en))
                      .join(', ')}
                  </Text>
                </View>
              )}
            </View>

            {/* 1. Core Panchanga (मुख्य पञ्चाङ्ग) */}
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.sectionTitle, { color: accentColor }]}>
                {t('panchang_screen.sections.core', 'मुख्य पञ्चाङ्ग')}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {renderDataRow(
                'moon-waning-crescent',
                t('panchang_screen.labels.tithi', 'तिथि'),
                isHi ? panchangData.tithi.name.hi : panchangData.tithi.name.en,
                isHi ? panchangData.tithi.tillText.hi : panchangData.tithi.tillText.en,
              )}
              {renderDataRow(
                'brightness-6',
                t('panchang_screen.labels.paksha', 'पक्ष'),
                isHi ? panchangData.paksha.hi : panchangData.paksha.en,
              )}
              {renderDataRow(
                'star-four-points-outline',
                t('panchang_screen.labels.nakshatra', 'नक्षत्र'),
                isHi ? panchangData.nakshatra.name.hi : panchangData.nakshatra.name.en,
                isHi ? panchangData.nakshatra.tillText.hi : panchangData.nakshatra.tillText.en,
              )}
              {renderDataRow(
                'meditation',
                t('panchang_screen.labels.yoga', 'योग'),
                isHi ? panchangData.yoga.name.hi : panchangData.yoga.name.en,
                isHi ? panchangData.yoga.tillText.hi : panchangData.yoga.tillText.en,
              )}
              {renderDataRow(
                'hands-pray',
                t('panchang_screen.labels.karana1', 'करण 1'),
                isHi ? panchangData.karana1.name.hi : panchangData.karana1.name.en,
                isHi ? panchangData.karana1.tillText.hi : panchangData.karana1.tillText.en,
              )}
              {renderDataRow(
                'hands-pray',
                t('panchang_screen.labels.karana2', 'करण 2'),
                isHi ? panchangData.karana2.name.hi : panchangData.karana2.name.en,
                isHi ? panchangData.karana2.tillText.hi : panchangData.karana2.tillText.en,
              )}
              {renderDataRow(
                'calendar-today',
                t('panchang_screen.labels.waar', 'वार'),
                isHi ? panchangData.waar.hi : panchangData.waar.en,
                undefined,
                true,
              )}
            </View>

            {/* 2. Sun & Moon Timings (सूर्य एवं चंद्र समय) */}
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons
                name="weather-sunset-up"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.sectionTitle, { color: accentColor }]}>
                {t('panchang_screen.sections.sun_moon', 'सूर्य एवं चंद्र समय')}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {renderDataRow(
                'weather-sunset-up',
                t('panchang_screen.labels.sunrise', 'सूर्योदय'),
                panchangData.sunrise,
              )}
              {renderDataRow(
                'weather-sunset-down',
                t('panchang_screen.labels.sunset', 'सूर्यास्त'),
                panchangData.sunset,
              )}
              {renderDataRow(
                'timer-sand',
                t('panchang_screen.labels.din_kaal', 'दिन काल'),
                panchangData.dinKaal,
              )}
              {renderDataRow(
                'moon-waning-gibbous',
                t('panchang_screen.labels.ratri_kaal', 'रात्रि काल'),
                panchangData.ratriKaal,
              )}
              {renderDataRow(
                'weather-night',
                t('panchang_screen.labels.moonrise', 'चन्द्रोदय'),
                panchangData.moonrise,
              )}
              {renderDataRow(
                'weather-night-partly-cloudy',
                t('panchang_screen.labels.moonset', 'चन्द्रास्त'),
                panchangData.moonset,
                undefined,
                true,
              )}
            </View>

            {/* 3. Sunrise Details (सूर्योदय लग्न एवं नक्षत्र) */}
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons
                name="compass-outline"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.sectionTitle, { color: accentColor }]}>
                {t('panchang_screen.sections.sunrise', 'सूर्योदय लग्न एवं नक्षत्र')}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {renderDataRow(
                'zodiac-virgo',
                t('panchang_screen.labels.lagna', 'सूर्योदय लग्न'),
                isHi ? panchangData.sunriseLagna.hi : panchangData.sunriseLagna.en,
              )}
              {renderDataRow(
                'weather-sunny',
                t('panchang_screen.labels.sun_nakshatra', 'सूर्य नक्षत्र'),
                isHi ? panchangData.sunNakshatra.hi : panchangData.sunNakshatra.en,
              )}
              {renderDataRow(
                'moon-waxing-crescent',
                t('panchang_screen.labels.moon_nakshatra', 'चन्द्र नक्षत्र'),
                isHi ? panchangData.moonNakshatra.hi : panchangData.moonNakshatra.en,
                undefined,
                true,
              )}
            </View>

            {/* 4. Month & Zodiac (माह एवं राशि) */}
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons
                name="zodiac-cancer"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.sectionTitle, { color: accentColor }]}>
                {t('panchang_screen.sections.month_rashi', 'माह एवं राशि')}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {renderDataRow(
                'calendar-month-outline',
                t('panchang_screen.labels.amanta_month', 'अमान्त माह'),
                isHi ? panchangData.amantaMonth.hi : panchangData.amantaMonth.en,
              )}
              {renderDataRow(
                'calendar-month-outline',
                t('panchang_screen.labels.purnimanta_month', 'पूर्णिमान्त माह'),
                isHi ? panchangData.purnimantaMonth.hi : panchangData.purnimantaMonth.en,
              )}
              {renderDataRow(
                'zodiac-aquarius',
                t('panchang_screen.labels.chandra_rashi', 'चन्द्र राशि'),
                isHi ? panchangData.chandraRashi.display.hi : panchangData.chandraRashi.display.en,
              )}
              {renderDataRow(
                'zodiac-virgo',
                t('panchang_screen.labels.surya_rashi', 'सूर्य राशि'),
                isHi ? panchangData.suryaRashi.display.hi : panchangData.suryaRashi.display.en,
              )}
              {renderDataRow(
                'leaf',
                t('panchang_screen.labels.ritu', 'ऋतु'),
                isHi ? panchangData.ritu.hi : panchangData.ritu.en,
              )}
              {renderDataRow(
                'earth',
                t('panchang_screen.labels.ayan', 'अयन'),
                isHi ? panchangData.ayan.hi : panchangData.ayan.en,
                undefined,
                true,
              )}
            </View>

            {/* 5. Samvat & Eras (संवत एवं वर्ष) */}
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons
                name="history"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.sectionTitle, { color: accentColor }]}>
                {t('panchang_screen.sections.samvat', 'संवत एवं वर्ष')}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {renderDataRow(
                'numeric',
                t('panchang_screen.labels.vikram_samvat', 'विक्रम संवत'),
                isHi ? panchangData.vikramSamvat.hi : panchangData.vikramSamvat.en,
              )}
              {renderDataRow(
                'numeric',
                t('panchang_screen.labels.shaka_samvat', 'शक संवत'),
                isHi ? panchangData.shakaSamvat.hi : panchangData.shakaSamvat.en,
              )}
              {renderDataRow(
                'numeric',
                t('panchang_screen.labels.gujarati_samvat', 'गुजराती संवत'),
                isHi ? panchangData.gujaratiSamvat.hi : panchangData.gujaratiSamvat.en,
              )}
              {renderDataRow(
                'numeric',
                t('panchang_screen.labels.kali_samvat', 'कलि संवत'),
                isHi ? panchangData.kaliSamvat.hi : panchangData.kaliSamvat.en,
              )}
              {renderDataRow(
                'orbit',
                t('panchang_screen.labels.samvatsar', 'संवत्सर'),
                isHi ? panchangData.samvatsar.hi : panchangData.samvatsar.en,
              )}
              {renderDataRow(
                'orbit',
                t('panchang_screen.labels.samvatsar_north', 'संवत्सर (उत्तर)'),
                isHi ? panchangData.samvatsarNorth.hi : panchangData.samvatsarNorth.en,
              )}
              {renderDataRow(
                'weather-sunny-alert',
                t('panchang_screen.labels.saur_pravishte', 'सौर प्रविष्टे'),
                isHi ? panchangData.saurPravishte.hi : panchangData.saurPravishte.en,
                undefined,
                true,
              )}
            </View>

            {/* 6. Auspicious & Inauspicious Muhurats (शुभ एवं अशुभ समय) */}
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons
                name="clock-check-outline"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.sectionTitle, { color: accentColor }]}>
                {t('panchang_screen.sections.muhurat', 'शुभ एवं अशुभ समय')}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {renderDataRow(
                'clock-outline',
                t('panchang_screen.labels.abhijit', 'अभिजित मुहूर्त'),
                panchangData.abhijitMuhurat,
                undefined,
                false,
                'shubh',
              )}
              {renderDataRow(
                'clock-outline',
                t('panchang_screen.labels.amrit_kaal', 'अमृत काल'),
                panchangData.amritKaal,
                undefined,
                false,
                'shubh',
              )}
              {renderDataRow(
                'alert-circle-outline',
                t('panchang_screen.labels.rahukaal', 'राहु काल'),
                panchangData.rahuKaal,
                undefined,
                false,
                'ashubh',
              )}
              {renderDataRow(
                'clock-alert-outline',
                t('panchang_screen.labels.yamaganda', 'यमगण्ड'),
                panchangData.yamaganda,
                undefined,
                false,
                'ashubh',
              )}
              {renderDataRow(
                'clock-outline',
                t('panchang_screen.labels.gulika_kaal', 'गुलिक काल'),
                panchangData.gulikaKaal,
                undefined,
                false,
                'ashubh',
              )}
              {renderDataRow(
                'clock-alert-outline',
                t('panchang_screen.labels.dur_muhurat', 'दुर्मुहूर्त'),
                panchangData.durMuhurat,
                undefined,
                true,
                'ashubh',
              )}
            </View>

            {/* 7. Pada / Charan (पद, चरण) */}
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons
                name="format-list-numbered"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.sectionTitle, { color: accentColor }]}>
                {t('panchang_screen.sections.pada_charan', 'पद एवं चरण')}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {panchangData.padaCharan.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.padaRow,
                    {
                      borderBottomColor:
                        idx === panchangData.padaCharan.length - 1
                          ? 'transparent'
                          : dividerCol,
                    },
                  ]}
                >
                  <View style={styles.padaLeft}>
                    <View
                      style={[
                        styles.padaBadge,
                        { backgroundColor: roseBg, borderColor: roseBorder },
                      ]}
                    >
                      <Text style={[styles.padaNumber, { color: accentColor }]}>
                        {item.pada} {isHi ? item.syllable.hi : item.syllable.en}
                      </Text>
                    </View>
                    <Text style={[styles.padaNakshatra, { color: textPrimary }]}>
                      {isHi ? item.nakshatra.hi : item.nakshatra.en}
                    </Text>
                  </View>
                  <Text style={[styles.padaTime, { color: textMuted }]}>
                    {item.time}
                  </Text>
                </View>
              ))}
            </View>

            {/* 8. Festivals / Vrat Details Section */}
            {panchangData.festivals.length > 0 && (
              <View
                style={[
                  styles.festivalsCard,
                  { backgroundColor: cardBg, borderColor: borderCol },
                ]}
              >
                <Text style={[styles.festivalsTitle, { color: accentColor }]}>
                  {t('panchang_screen.festivals_title', 'त्यौहार एवं व्रत')}
                </Text>
                {panchangData.festivals.map((fest, index) => (
                  <View key={index} style={styles.festivalItem}>
                    <MaterialCommunityIcons
                      name="star-four-points"
                      size={13}
                      color={accentColor}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.festivalText, { color: textPrimary }]}>
                      {isHi ? fest.hi : fest.en}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {activeTab === 'choghadiya' && (
          <View style={styles.tabContentWrap}>
            <View style={styles.subSectionHeader}>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subSectionTitle, { color: accentColor }]}>
                {isHi ? 'दिन का चौघड़िया' : 'Day Choghadiya'}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol, marginBottom: 14 },
              ]}
            >
              {muhuratData.choghadiya.day.map((item: any, idx: number) =>
                renderListItem(item, idx, muhuratData.choghadiya.day.length),
              )}
            </View>

            <View style={styles.subSectionHeader}>
              <MaterialCommunityIcons
                name="weather-night"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subSectionTitle, { color: accentColor }]}>
                {isHi ? 'रात का चौघड़िया' : 'Night Choghadiya'}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {muhuratData.choghadiya.night.map((item: any, idx: number) =>
                renderListItem(item, idx, muhuratData.choghadiya.night.length),
              )}
            </View>
          </View>
        )}

        {activeTab === 'hora' && (
          <View style={styles.tabContentWrap}>
            <View style={styles.subSectionHeader}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subSectionTitle, { color: accentColor }]}>
                {isHi ? 'होरा चक्र' : 'Hora Cycle'}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {muhuratData.hora.map((item: any, index: number) =>
                renderListItem(item, index, muhuratData.hora.length),
              )}
            </View>
          </View>
        )}

        {activeTab === 'muhurat' && (
          <View style={styles.tabContentWrap}>
            <View style={styles.subSectionHeader}>
              <MaterialCommunityIcons
                name="clock-check-outline"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subSectionTitle, { color: accentColor }]}>
                {isHi ? 'शुभ एवं अशुभ मुहूर्त' : 'Auspicious & Inauspicious Muhurats'}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {muhuratData.muhurat.map((item: any, index: number) =>
                renderListItem(item, index, muhuratData.muhurat.length),
              )}
            </View>
          </View>
        )}

        {activeTab === 'lagna' && (
          <View style={styles.tabContentWrap}>
            <View style={styles.subSectionHeader}>
              <MaterialCommunityIcons
                name="zodiac-virgo"
                size={14}
                color={accentColor}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subSectionTitle, { color: accentColor }]}>
                {isHi ? 'दैनिक लग्न समय' : 'Daily Lagna Timings'}
              </Text>
            </View>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              {muhuratData.lagna.map((item: any, index: number) =>
                renderListItem(item, index, muhuratData.lagna.length),
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Location Picker Modal (Flat Maroon/White UI, zero shadows) */}
      <Modal
        visible={showLocationPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationPicker(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalContent,
              {
                backgroundColor: cardBg,
                borderColor: borderCol,
              },
            ]}
            onPress={() => {}}
          >
            <View style={[styles.modalHeader, { borderBottomColor: dividerCol }]}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.modalIconBox, { backgroundColor: roseBg }]}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={15}
                    color={accentColor}
                  />
                </View>
                <Text style={[styles.modalTitle, { color: accentColor }]}>
                  {t('panchang_screen.change_location', isHi ? 'स्थान बदलें' : 'Change Location')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowLocationPicker(false)}
                style={[styles.modalCloseBtn, { backgroundColor: subtleBg, borderColor: borderCol }]}
              >
                <Icon name="x" size={14} color={textMuted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableLocations}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const isSelected = item.id === location.id;
                const isLast = index === availableLocations.length - 1;
                return (
                  <TouchableOpacity
                    style={[
                      styles.locationOption,
                      !isLast && {
                        borderBottomWidth: 1,
                        borderBottomColor: dividerCol,
                      },
                      isSelected && {
                        backgroundColor: roseBg,
                      },
                    ]}
                    onPress={() => {
                      setLocation(item);
                      setShowLocationPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.locationOptionText,
                        {
                          color: isSelected ? accentColor : textPrimary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {isHi ? item.name.hi : item.name.en}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size={15} color={accentColor} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
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
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
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
  locationHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 130,
  },
  locationHeaderPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateNavStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  navArrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDisplayCol: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  todayBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 6,
  },
  todayBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  tabBar: {
    borderBottomWidth: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 16,
  },
  tabBtn: {
    paddingVertical: 9,
    paddingHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  heroCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moonIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroLocation: {
    fontSize: 10.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  heroSummary: {
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 18,
  },
  festivalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
  },
  festivalBannerText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  subSectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  cardBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 6,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 130,
  },
  rowIcon: {
    marginRight: 7,
  },
  rowLabel: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  rowValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  rowSubValue: {
    fontSize: 10.5,
    marginLeft: 6,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
    marginLeft: 6,
  },
  miniBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  padaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  padaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  padaBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  padaNumber: {
    fontSize: 11,
    fontWeight: '700',
  },
  padaNakshatra: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  padaTime: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  festivalsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  festivalsTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  festivalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  festivalText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  tabContentWrap: {
    paddingTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  listLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemName: {
    fontSize: 12,
  },
  miniStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  miniStatusText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  itemTime: {
    fontSize: 11.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  modalIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  modalCloseBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  locationOptionText: {
    fontSize: 12,
  },
});

export default PanchangScreen;
