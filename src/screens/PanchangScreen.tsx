import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { calculateDetailedPanchang, DetailedPanchangData } from '../utils/panchangCalculator';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';

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
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [panchangData, setPanchangData] = useState<DetailedPanchangData | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [availableLocations, setAvailableLocations] = useState(LOCATIONS);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const muhuratData = useMemo(() => getMuhuratData(isHi), [isHi]);

  const TABS = [
    { key: 'summary', label: t('panchang_screen.tabs.summary') },
    { key: 'choghadiya', label: t('panchang_screen.tabs.choghadiya') },
    { key: 'hora', label: t('panchang_screen.tabs.hora') },
    { key: 'muhurat', label: t('panchang_screen.tabs.muhurat') },
    { key: 'lagna', label: t('panchang_screen.tabs.lagna') },
  ];

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
          const city = currentGeo.city || currentGeo.district || currentGeo.subregion || 'Current Location';
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
      location.name
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

  if (!panchangData) return null;

  const headerColor = colors.primary;
  const cardBg = colors.background;
  const textColor = colors.text;
  const borderColor = colors.border;

  const renderListItem = (item: any, index: number, totalLength: number) => {
    let statusColor = colors.text;
    if (item.type === 'shubh') statusColor = '#10B981';
    if (item.type === 'ashubh') statusColor = '#EF4444';

    const isCurrent = item.current;

    return (
      <View
        key={index}
        style={[
          styles.listItem,
          { borderBottomColor: index === totalLength - 1 ? 'transparent' : borderColor },
          isCurrent && { backgroundColor: colors.primary + '15', borderLeftWidth: 4, borderLeftColor: colors.primary }
        ]}
      >
        <View style={styles.listLeft}>
          <Text style={[styles.itemName, { color: isCurrent ? colors.primary : textColor }]}>
            {item.name}
          </Text>
          {item.type && (
            <Text style={[styles.itemType, { color: statusColor }]}>
              {item.type === 'shubh' ? t('panchang_screen.labels.shubh') : t('panchang_screen.labels.ashubh')}
            </Text>
          )}
        </View>
        <Text style={[styles.itemTime, { color: isCurrent ? colors.primary : textColor }]}>{item.time}</Text>
      </View>
    );
  };

  const renderDataRow = (
    iconName: string,
    label: string,
    value: string,
    subValue?: string,
    isLast: boolean = false,
    badgeType?: 'shubh' | 'ashubh'
  ) => (
    <View style={[styles.dataRow, { borderBottomColor: isLast ? 'transparent' : borderColor }]}>
      <View style={styles.iconLabelContainer}>
        <MaterialCommunityIcons name={iconName as any} size={18} color={colors.secondary} style={styles.rowIcon} />
        <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.rowValue, { color: textColor }]}>{value}</Text>
        {subValue && (
          <Text style={[styles.rowSubValue, { color: colors.textLight }]}>
            {subValue}
          </Text>
        )}
        {badgeType && (
          <View style={[styles.miniBadge, { backgroundColor: badgeType === 'shubh' ? '#10B98120' : '#EF444420' }]}>
            <Text style={[styles.miniBadgeText, { color: badgeType === 'shubh' ? '#10B981' : '#EF4444' }]}>
              {badgeType === 'shubh' ? t('panchang_screen.labels.shubh') : t('panchang_screen.labels.ashubh')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: headerColor }]}>
      <StatusBar backgroundColor={headerColor} barStyle="light-content" translucent={true} />

      {/* Red Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('panchang_screen.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Main White Card Area */}
      <View style={[styles.mainCard, { backgroundColor: cardBg }]}>
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={goToPreviousDay}>
            <Icon name="chevron-left" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: textColor }]}>
            {isHi ? panchangData.dateStr.hi : panchangData.dateStr.en}
          </Text>
          <TouchableOpacity onPress={goToNextDay}>
            <Icon name="chevron-right" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Location Dropdown */}
        <TouchableOpacity
          style={[styles.locationSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setShowLocationPicker(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="map-marker" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.locationText, { color: textColor }]}>
              {isHi ? location.name.hi : location.name.en}
            </Text>
          </View>
          <Icon name="chevron-down" size={20} color={colors.textLight} />
        </TouchableOpacity>

        {/* Custom Tab Bar */}
        <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
          <View style={styles.tabContainer}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabBtn,
                    isActive && styles.tabBtnActive,
                    isActive && { borderBottomColor: colors.primary }
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                      { color: isActive ? colors.primary : colors.textLight }
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'summary' && (
            <>
              {/* Top Hero Card: Location, Moon phase, Tithi, Paksha, Month */}
              <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.heroRow}>
                  <View style={[styles.moonIconWrapper, { backgroundColor: colors.primary + '15' }]}>
                    <MaterialCommunityIcons name="moon-waning-crescent" size={28} color={colors.primary} />
                  </View>
                  <View style={styles.heroTextContainer}>
                    <Text style={[styles.heroLocation, { color: colors.textLight }]}>
                      {isHi ? location.name.hi : location.name.en}
                    </Text>
                    <Text style={[styles.heroSummary, { color: textColor }]}>
                      {isHi ? panchangData.headerSummary.hi : panchangData.headerSummary.en}
                    </Text>
                  </View>
                </View>

                {/* Festival / Vrat Pill if present */}
                {panchangData.festivals.length > 0 && (
                  <View style={[styles.festivalBanner, { backgroundColor: '#F59E0B15', borderColor: '#F59E0B40' }]}>
                    <MaterialCommunityIcons name="star-face" size={16} color="#D97706" style={{ marginRight: 6 }} />
                    <Text style={[styles.festivalBannerText, { color: '#B45309' }]}>
                      {panchangData.festivals.map(f => (isHi ? f.hi : f.en)).join(', ')}
                    </Text>
                  </View>
                )}
              </View>

              {/* 1. Core Panchanga (मुख्य पञ्चाङ्ग) */}
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons name="book-open-page-variant" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('panchang_screen.sections.core')}</Text>
              </View>
              <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {renderDataRow(
                  'moon-waning-crescent',
                  t('panchang_screen.labels.tithi'),
                  isHi ? panchangData.tithi.name.hi : panchangData.tithi.name.en,
                  isHi ? panchangData.tithi.tillText.hi : panchangData.tithi.tillText.en
                )}
                {renderDataRow(
                  'brightness-6',
                  t('panchang_screen.labels.paksha'),
                  isHi ? panchangData.paksha.hi : panchangData.paksha.en
                )}
                {renderDataRow(
                  'star-four-points-outline',
                  t('panchang_screen.labels.nakshatra'),
                  isHi ? panchangData.nakshatra.name.hi : panchangData.nakshatra.name.en,
                  isHi ? panchangData.nakshatra.tillText.hi : panchangData.nakshatra.tillText.en
                )}
                {renderDataRow(
                  'meditation',
                  t('panchang_screen.labels.yoga'),
                  isHi ? panchangData.yoga.name.hi : panchangData.yoga.name.en,
                  isHi ? panchangData.yoga.tillText.hi : panchangData.yoga.tillText.en
                )}
                {renderDataRow(
                  'hands-pray',
                  t('panchang_screen.labels.karana1'),
                  isHi ? panchangData.karana1.name.hi : panchangData.karana1.name.en,
                  isHi ? panchangData.karana1.tillText.hi : panchangData.karana1.tillText.en
                )}
                {renderDataRow(
                  'hands-pray',
                  t('panchang_screen.labels.karana2'),
                  isHi ? panchangData.karana2.name.hi : panchangData.karana2.name.en,
                  isHi ? panchangData.karana2.tillText.hi : panchangData.karana2.tillText.en
                )}
                {renderDataRow(
                  'calendar-today',
                  t('panchang_screen.labels.waar'),
                  isHi ? panchangData.waar.hi : panchangData.waar.en,
                  undefined,
                  true
                )}
              </View>

              {/* 2. Sun & Moon Timings (सूर्य एवं चंद्र समय) */}
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons name="weather-sunset-up" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('panchang_screen.sections.sun_moon')}</Text>
              </View>
              <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {renderDataRow('weather-sunset-up', t('panchang_screen.labels.sunrise'), panchangData.sunrise)}
                {renderDataRow('weather-sunset-down', t('panchang_screen.labels.sunset'), panchangData.sunset)}
                {renderDataRow('timer-sand', t('panchang_screen.labels.din_kaal'), panchangData.dinKaal)}
                {renderDataRow('moon-waning-gibbous', t('panchang_screen.labels.ratri_kaal'), panchangData.ratriKaal)}
                {renderDataRow('weather-night', t('panchang_screen.labels.moonrise'), panchangData.moonrise)}
                {renderDataRow('weather-night-partly-cloudy', t('panchang_screen.labels.moonset'), panchangData.moonset, undefined, true)}
              </View>

              {/* 3. Sunrise Details (सूर्योदय लग्न एवं नक्षत्र) */}
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons name="compass-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('panchang_screen.sections.sunrise')}</Text>
              </View>
              <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {renderDataRow(
                  'zodiac-virgo',
                  t('panchang_screen.labels.lagna'),
                  isHi ? panchangData.sunriseLagna.hi : panchangData.sunriseLagna.en
                )}
                {renderDataRow(
                  'weather-sunny',
                  t('panchang_screen.labels.sun_nakshatra'),
                  isHi ? panchangData.sunNakshatra.hi : panchangData.sunNakshatra.en
                )}
                {renderDataRow(
                  'moon-waxing-crescent',
                  t('panchang_screen.labels.moon_nakshatra'),
                  isHi ? panchangData.moonNakshatra.hi : panchangData.moonNakshatra.en,
                  undefined,
                  true
                )}
              </View>

              {/* 4. Month & Zodiac (माह एवं राशि) */}
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons name="zodiac-cancer" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('panchang_screen.sections.month_rashi')}</Text>
              </View>
              <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {renderDataRow(
                  'calendar-month-outline',
                  t('panchang_screen.labels.amanta_month'),
                  isHi ? panchangData.amantaMonth.hi : panchangData.amantaMonth.en
                )}
                {renderDataRow(
                  'calendar-month-outline',
                  t('panchang_screen.labels.purnimanta_month'),
                  isHi ? panchangData.purnimantaMonth.hi : panchangData.purnimantaMonth.en
                )}
                {renderDataRow(
                  'zodiac-aquarius',
                  t('panchang_screen.labels.chandra_rashi'),
                  isHi ? panchangData.chandraRashi.display.hi : panchangData.chandraRashi.display.en
                )}
                {renderDataRow(
                  'zodiac-virgo',
                  t('panchang_screen.labels.surya_rashi'),
                  isHi ? panchangData.suryaRashi.display.hi : panchangData.suryaRashi.display.en
                )}
                {renderDataRow(
                  'leaf',
                  t('panchang_screen.labels.ritu'),
                  isHi ? panchangData.ritu.hi : panchangData.ritu.en
                )}
                {renderDataRow(
                  'earth',
                  t('panchang_screen.labels.ayan'),
                  isHi ? panchangData.ayan.hi : panchangData.ayan.en,
                  undefined,
                  true
                )}
              </View>

              {/* 5. Samvat & Eras (संवत एवं वर्ष) */}
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons name="history" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('panchang_screen.sections.samvat')}</Text>
              </View>
              <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {renderDataRow(
                  'numeric',
                  t('panchang_screen.labels.vikram_samvat'),
                  isHi ? panchangData.vikramSamvat.hi : panchangData.vikramSamvat.en
                )}
                {renderDataRow(
                  'numeric',
                  t('panchang_screen.labels.shaka_samvat'),
                  isHi ? panchangData.shakaSamvat.hi : panchangData.shakaSamvat.en
                )}
                {renderDataRow(
                  'numeric',
                  t('panchang_screen.labels.gujarati_samvat'),
                  isHi ? panchangData.gujaratiSamvat.hi : panchangData.gujaratiSamvat.en
                )}
                {renderDataRow(
                  'numeric',
                  t('panchang_screen.labels.kali_samvat'),
                  isHi ? panchangData.kaliSamvat.hi : panchangData.kaliSamvat.en
                )}
                {renderDataRow(
                  'orbit',
                  t('panchang_screen.labels.samvatsar'),
                  isHi ? panchangData.samvatsar.hi : panchangData.samvatsar.en
                )}
                {renderDataRow(
                  'orbit',
                  t('panchang_screen.labels.samvatsar_north'),
                  isHi ? panchangData.samvatsarNorth.hi : panchangData.samvatsarNorth.en
                )}
                {renderDataRow(
                  'weather-sunny-alert',
                  t('panchang_screen.labels.saur_pravishte'),
                  isHi ? panchangData.saurPravishte.hi : panchangData.saurPravishte.en,
                  undefined,
                  true
                )}
              </View>

              {/* 6. Auspicious & Inauspicious Muhurats (शुभ एवं अशुभ समय) */}
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons name="clock-check-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('panchang_screen.sections.muhurat')}</Text>
              </View>
              <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {renderDataRow('clock-outline', t('panchang_screen.labels.abhijit'), panchangData.abhijitMuhurat, undefined, false, 'shubh')}
                {renderDataRow('clock-outline', t('panchang_screen.labels.amrit_kaal'), panchangData.amritKaal, undefined, false, 'shubh')}
                {renderDataRow('alert-circle-outline', t('panchang_screen.labels.rahukaal'), panchangData.rahuKaal, undefined, false, 'ashubh')}
                {renderDataRow('clock-alert-outline', t('panchang_screen.labels.yamaganda'), panchangData.yamaganda, undefined, false, 'ashubh')}
                {renderDataRow('clock-outline', t('panchang_screen.labels.gulika_kaal'), panchangData.gulikaKaal, undefined, false, 'ashubh')}
                {renderDataRow('clock-alert-outline', t('panchang_screen.labels.dur_muhurat'), panchangData.durMuhurat, undefined, true, 'ashubh')}
              </View>

              {/* 7. Pada / Charan (पद, चरण) */}
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons name="format-list-numbered" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('panchang_screen.sections.pada_charan')}</Text>
              </View>
              <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {panchangData.padaCharan.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.padaRow,
                      { borderBottomColor: idx === panchangData.padaCharan.length - 1 ? 'transparent' : borderColor }
                    ]}
                  >
                    <View style={styles.padaLeft}>
                      <View style={[styles.padaBadge, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={[styles.padaNumber, { color: colors.primary }]}>
                          {item.pada} {isHi ? item.syllable.hi : item.syllable.en}
                        </Text>
                      </View>
                      <Text style={[styles.padaNakshatra, { color: textColor }]}>
                        {isHi ? item.nakshatra.hi : item.nakshatra.en}
                      </Text>
                    </View>
                    <Text style={[styles.padaTime, { color: colors.textLight }]}>{item.time}</Text>
                  </View>
                ))}
              </View>

              {/* 8. Festivals / Vrat Details Section */}
              {panchangData.festivals.length > 0 && (
                <View style={[styles.festivalsCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                  <Text style={[styles.festivalsTitle, { color: colors.primary }]}>
                    {t('panchang_screen.festivals_title')}
                  </Text>
                  {panchangData.festivals.map((fest, index) => (
                    <View key={index} style={styles.festivalItem}>
                      <MaterialCommunityIcons name="star-circle" size={16} color={colors.secondary} style={{ marginRight: 8 }} />
                      <Text style={[styles.festivalText, { color: textColor }]}>
                        {isHi ? fest.hi : fest.en}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === 'choghadiya' && (
            <View style={styles.muhuratTabContainer}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>{isHi ? 'दिन का चौघड़िया' : 'Day Choghadiya'}</Text>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {muhuratData.choghadiya.day.map((item: any, idx: number) => renderListItem(item, idx, muhuratData.choghadiya.day.length))}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.primary, marginTop: 20 }]}>{isHi ? 'रात का चौघड़िया' : 'Night Choghadiya'}</Text>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {muhuratData.choghadiya.night.map((item: any, idx: number) => renderListItem(item, idx, muhuratData.choghadiya.night.length))}
              </View>
            </View>
          )}

          {activeTab === 'hora' && (
            <View style={styles.muhuratTabContainer}>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {muhuratData.hora.map((item: any, index: number) => renderListItem(item, index, muhuratData.hora.length))}
              </View>
            </View>
          )}

          {activeTab === 'muhurat' && (
            <View style={styles.muhuratTabContainer}>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {muhuratData.muhurat.map((item: any, index: number) => renderListItem(item, index, muhuratData.muhurat.length))}
              </View>
            </View>
          )}

          {activeTab === 'lagna' && (
            <View style={styles.muhuratTabContainer}>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {muhuratData.lagna.map((item: any, index: number) => renderListItem(item, index, muhuratData.lagna.length))}
              </View>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Location Picker Modal */}
      <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>{t('panchang_screen.change_location')}</Text>
              <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                <Icon name="x" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableLocations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.locationOption, { borderBottomColor: borderColor }]}
                  onPress={() => {
                    setLocation(item);
                    setShowLocationPicker(false);
                  }}
                >
                  <Text style={[styles.locationOptionText, { color: item.id === location.id ? colors.primary : textColor, fontWeight: item.id === location.id ? 'bold' : 'normal' }]}>
                    {isHi ? item.name.hi : item.name.en}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
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
    paddingBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabBar: {
    borderBottomWidth: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 2,
  },
  tabBtnActive: {
    borderBottomColor: '#C53030',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#C53030',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 12,
  },
  heroCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moonIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroLocation: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  heroSummary: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  festivalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  festivalBannerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 135,
  },
  rowIcon: {
    marginRight: 8,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 11,
    marginLeft: 6,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  padaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  padaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  padaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
  padaNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  padaNakshatra: {
    fontSize: 13,
    fontWeight: '500',
  },
  padaTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  festivalsCard: {
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  festivalsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  festivalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  festivalText: {
    fontSize: 13,
    fontWeight: '500',
  },
  muhuratTabContainer: {
    paddingVertical: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  listLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemType: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  itemTime: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationOption: {
    padding: 16,
    borderBottomWidth: 1,
  },
  locationOptionText: {
    fontSize: 16,
  },
});

export default PanchangScreen;
