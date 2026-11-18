import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
} from 'react-native';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { calculatePanchang, PanchangData } from '../utils/panchang';
import { spiritualCardApi, SpiritualCardData } from '../api/spiritualCard';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const WARM_BG = '#FDFBF8';
const SUBTLE_CREAM = '#FAF7F3';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

interface ServiceItem {
  id: string;
  labelKey: string;
  fallbackLabel: string;
  screen: string;
  mciIcon?: string;
  featherIcon?: string;
}

const GRID_SERVICES: ServiceItem[] = [
  { id: '1', labelKey: 'pooja', fallbackLabel: 'पूजा विधि', screen: 'Library', mciIcon: 'flower-tulip-outline' },
  { id: '8', labelKey: 'stotram', fallbackLabel: 'स्तोत्र', screen: 'StotramLibrary', mciIcon: 'book-open-variant' },
  { id: '6c', labelKey: 'hawan', fallbackLabel: 'हवन', screen: 'Hawan', mciIcon: 'fire' },
  { id: '6b', labelKey: 'samagri', fallbackLabel: 'सामग्री', screen: 'Samagri', featherIcon: 'shopping-cart' },
  { id: '4', labelKey: 'panchang', fallbackLabel: 'पंचांग', screen: 'Panchang', featherIcon: 'calendar' },
  { id: '6', labelKey: 'kundali', fallbackLabel: 'कुंडली', screen: 'Kundali', mciIcon: 'grid' },
  { id: '6a', labelKey: 'kundali_match', fallbackLabel: 'मिलान', screen: 'KundaliMatchingForm', mciIcon: 'ring' },
  { id: '5', labelKey: 'muhurat', fallbackLabel: 'मुहूर्त', screen: 'Muhurt', featherIcon: 'clock' },
  { id: '7', labelKey: 'yajman', fallbackLabel: 'यजमान', screen: 'YajmanList', featherIcon: 'users' },
  { id: '3', labelKey: 'dakshina', fallbackLabel: 'कैलकुलेटर', screen: 'DakshinaCalculator', mciIcon: 'calculator-variant-outline' },
  { id: '11', labelKey: 'account', fallbackLabel: 'आय-व्यय', screen: 'AccountManagerDashboard', mciIcon: 'chart-bar' },
  { id: '2', labelKey: 'calendar', fallbackLabel: 'कैलेंडर', screen: 'Calendar', featherIcon: 'calendar' },
  { id: '10', labelKey: 'history', fallbackLabel: 'इतिहास', screen: 'History', mciIcon: 'history' },
  { id: '12', labelKey: 'subscription', fallbackLabel: 'सदस्यता', screen: 'Subscription', mciIcon: 'crown-outline' },
];

const HI_DAYS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const HI_MONTHS = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
const EN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { isDark, colors, setTheme } = useTheme();
  const { user } = useAuth();

  const cleanUserName =
    (user?.fullName || user?.displayName || (user as any)?.name || '')
      .replace(/\bupdated\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim() || t('home.pandit_ji', 'पंडित जी');

  const avatarInitial = cleanUserName.charAt(0).toUpperCase() || 'प';

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [spiritualCard, setSpiritualCard] = useState<SpiritualCardData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [yajmanFilter, setYajmanFilter] = useState<'today' | 'month'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleYajmanFilter = () => {
    setYajmanFilter((prev) => (prev === 'today' ? 'month' : 'today'));
  };

  const isHindi = i18n.language === 'hi';

  const toggleLanguage = async () => {
    const nextLang = isHindi ? 'en' : 'hi';
    await i18n.changeLanguage(nextLang);
    await AsyncStorage.setItem('language_preference', nextLang);
  };

  const dayName = isHindi ? HI_DAYS[currentDate.getDay()] : EN_DAYS[currentDate.getDay()];
  const monthName = isHindi ? HI_MONTHS[currentDate.getMonth()] : EN_MONTHS[currentDate.getMonth()];
  const shortDayName = isHindi ? dayName.replace('वार', '') : dayName.substring(0, 3);
  const shortMonthName = monthName.substring(0, 3);
  const topDateText = `${shortDayName}, ${currentDate.getDate()} ${shortMonthName} ${currentDate.getFullYear()}`;
  const vikramSamvat = currentDate.getFullYear() + 57;
  const bottomDateText = panchang
    ? `${t('home.vikram_samvat', 'विक्रम संवत्')} ${vikramSamvat}`
    : `${t('home.vikram_samvat', 'विक्रम संवत्')} ${vikramSamvat} | ${t('home.chaitra_shukla_paksha', 'चैत्र शुक्ल पक्ष')}`;

  const yajmanStats =
    yajmanFilter === 'today'
      ? { income: '₹2,500', expense: '₹450', newCount: '+3' }
      : { income: '₹45,000', expense: '₹4,200', newCount: '+28' };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPanchang(calculatePanchang(28.6139, 77.209, currentDate));
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setPanchang(calculatePanchang(location.coords.latitude, location.coords.longitude, currentDate));
      } catch {
        setPanchang(calculatePanchang(28.6139, 77.209, currentDate));
      }
    })();
  }, [currentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [currentDate]);

  useEffect(() => {
    let isMounted = true;
    const fetchSpiritualCard = async () => {
      try {
        const cached = await AsyncStorage.getItem('daily_spiritual_card_cache');
        if (cached && isMounted) {
          try {
            setSpiritualCard(JSON.parse(cached));
          } catch {
            // ignore cache parse error
          }
        }
        const data = await spiritualCardApi.getTodayCard();
        if (data && isMounted) {
          setSpiritualCard(data);
          await AsyncStorage.setItem('daily_spiritual_card_cache', JSON.stringify(data));
        }
      } catch (err) {
        console.warn('Error fetching spiritual card:', err);
      }
    };

    fetchSpiritualCard();

    return () => {
      isMounted = false;
    };
  }, [currentDate]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Dynamic theme colors
  const bgScreen = isDark ? '#121212' : WARM_BG;
  const surfaceBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : SUBTLE_CREAM;
  const borderDynamic = isDark ? '#2D2D2D' : CARD_BORDER;
  const dividerDynamic = isDark ? '#2A2A2A' : ROW_DIVIDER;
  const iconBoxBg = isDark ? '#2B1B1B' : SOFT_ROSE_BG;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;

  // Filter grid services by search query
  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GRID_SERVICES;
    return GRID_SERVICES.filter((item) => {
      const label = t(`quick_actions.${item.labelKey}`, item.fallbackLabel).toLowerCase();
      return label.includes(q) || item.fallbackLabel.toLowerCase().includes(q) || item.labelKey.includes(q);
    });
  }, [searchQuery, t]);

  // Chunk into 2-column rows for the clean card grid
  const serviceRows = useMemo(() => {
    const rows: ServiceItem[][] = [];
    for (let i = 0; i < filteredServices.length; i += 2) {
      rows.push(filteredServices.slice(i, i + 2));
    }
    return rows;
  }, [filteredServices]);

  return (
    <View style={[styles.container, { backgroundColor: bgScreen }]}>
      {isFocused && (
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={surfaceBg}
        />
      )}

      {/* Clean White Top Header */}
      <View
        style={[
          styles.headerWrapper,
          {
            paddingTop: Math.max(insets.top, 10),
            backgroundColor: surfaceBg,
            borderBottomColor: dividerDynamic,
          },
        ]}
      >
        {/* Row 1: Brand Logo + Greeting on Left, Actions + Avatar on Right */}
        <View style={styles.headerTopRow}>
          <View style={styles.brandCol}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={[styles.greetingText, { color: textPrimary }]} numberOfLines={1}>
              {t('home.namaste', 'नमस्ते,')} {cleanUserName}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconCircleBtn, { backgroundColor: iconBoxBg }]}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <Icon name={isDark ? 'sun' : 'moon'} size={16} color={accentColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconCircleBtn, { backgroundColor: iconBoxBg }]}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Icon name="bell" size={17} color={accentColor} />
              <View style={styles.notifDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.75}
            >
              <Text style={styles.avatarBtnText}>{avatarInitial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Dharma/Location Pill + Language Selector */}
        <View style={styles.headerMetaRow}>
          <View style={styles.locationPill}>
            <Icon name="sun" size={11} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={styles.locationPillText} numberOfLines={1}>
              {t('home.dharma_seva', 'धर्म सेवा ही परम सेवा है')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.langPillBtn}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={[styles.langPillText, { color: textPrimary }]}>
              {isHindi ? 'हिंदी' : 'English'}
            </Text>
            <Icon name="chevron-down" size={13} color={accentColor} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Clean Search Bar */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: surfaceBg, borderColor: borderDynamic },
          ]}
        >
          <Icon name="search" size={16} color={textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            placeholder={
              isHindi
                ? 'पूजा, स्तोत्र या सेवा खोजें'
                : 'Search pooja, stotram or service'
            }
            placeholderTextColor={textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="x" size={15} color={textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick 3 Action Strip (Booking / Calculator / Account) */}
        <View style={styles.quickActionStrip}>
          <TouchableOpacity
            style={[styles.quickStripCard, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}
            onPress={() => navigation.navigate('Calendar')}
            activeOpacity={0.75}
          >
            <Icon name="calendar" size={14} color={accentColor} />
            <Text style={[styles.quickStripText, { color: textPrimary }]} numberOfLines={1}>
              + {t('quick_actions.calendar', 'बुकिंग')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickStripCard, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}
            onPress={() => navigation.navigate('DakshinaCalculator')}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons name="calculator-variant-outline" size={15} color={accentColor} />
            <Text style={[styles.quickStripText, { color: textPrimary }]} numberOfLines={1}>
              {t('quick_actions.dakshina', 'कैलकुलेटर')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickStripCard, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}
            onPress={() => navigation.navigate('AccountManagerDashboard')}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons name="chart-bar" size={15} color={accentColor} />
            <Text style={[styles.quickStripText, { color: textPrimary }]} numberOfLines={1}>
              + {t('quick_actions.account', 'आय/खर्च')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 1: Daily Spiritual Card */}
        <View
          style={[
            styles.spiritualCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: borderDynamic },
          ]}
        >
          <View style={styles.spiritualTopRow}>
            <View style={styles.spiritualContent}>
              <View style={[styles.spiritualTag, { backgroundColor: iconBoxBg }]}>
                <Icon name="sun" size={11} color={accentColor} />
                <Text style={[styles.spiritualTagText, { color: accentColor }]}>
                  {t('home.spiritual_card', 'Daily Spiritual Card')}
                </Text>
              </View>
              <Text style={[styles.quoteText, { color: textPrimary }]}>
                {spiritualCard?.thought?.content
                  ? spiritualCard.thought.content.startsWith('"')
                    ? spiritualCard.thought.content
                    : `"${spiritualCard.thought.content}"`
                  : t(
                      'home.daily_quote',
                      '"Inner peace begins when you choose not to allow another person or event to control your emotions."'
                    )}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.mantraStrip,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderTopColor: dividerDynamic,
              },
            ]}
          >
            <Text style={[styles.mantraLabel, { color: accentColor }]}>
              {t('home.todays_mantra', "Today's Mantra")}
            </Text>
            <Text style={[styles.mantraText, { color: textPrimary }]}>
              {spiritualCard?.mantra?.text || t('home.mantra_om_gam', 'Om Gam Ganapataye Namaha')}
            </Text>
          </View>
        </View>

        {/* Section 2: All Services — Clean 2-Column List Grid (Matching Reference Image) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {t('home.all_services', 'सभी सुविधाएँ')}
            </Text>
            <Text style={[styles.sectionTagText, { color: accentColor }]}>
              {t('home.sarve_bhavantu', 'सर्वे भवन्तु सुखिनः')}
            </Text>
          </View>

          <View
            style={[
              styles.servicesGridCard,
              { backgroundColor: surfaceBg, borderColor: borderDynamic },
            ]}
          >
            {serviceRows.length === 0 ? (
              <View style={styles.emptySearchBox}>
                <Text style={[styles.emptySearchText, { color: textSecondary }]}>
                  {isHindi ? 'कोई सेवा नहीं मिली' : 'No matching service found'}
                </Text>
              </View>
            ) : (
              serviceRows.map((row, rowIndex) => {
                const isLastRow = rowIndex === serviceRows.length - 1;
                return (
                  <View
                    key={`service-row-${rowIndex}`}
                    style={[
                      styles.serviceGridRow,
                      !isLastRow && { borderBottomWidth: 1, borderBottomColor: dividerDynamic },
                    ]}
                  >
                    {row.map((item, colIndex) => {
                      const label = t(`quick_actions.${item.labelKey}`, item.fallbackLabel);
                      const isLeft = colIndex === 0;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.serviceGridCell,
                            isLeft && row.length === 2 && {
                              borderRightWidth: 1,
                              borderRightColor: dividerDynamic,
                            },
                          ]}
                          onPress={() => navigation.navigate(item.screen)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.serviceIconBox, { backgroundColor: iconBoxBg }]}>
                            {item.mciIcon ? (
                              <MaterialCommunityIcons
                                name={item.mciIcon as any}
                                size={18}
                                color={accentColor}
                              />
                            ) : (
                              <Icon
                                name={(item.featherIcon || 'grid') as any}
                                size={16}
                                color={accentColor}
                              />
                            )}
                          </View>
                          <Text
                            style={[styles.serviceCellLabel, { color: textPrimary }]}
                            numberOfLines={1}
                          >
                            {label}
                          </Text>
                          <Icon name="chevron-right" size={14} color={textSecondary} />
                        </TouchableOpacity>
                      );
                    })}
                    {row.length === 1 && <View style={styles.serviceGridCell} />}
                  </View>
                );
              })
            )}
          </View>

          {/* Community Full-Width Row (Matching "समुदाय में प्रश्न पूछें >") */}
          <TouchableOpacity
            style={[
              styles.communityRowCard,
              { backgroundColor: surfaceBg, borderColor: borderDynamic },
            ]}
            onPress={() => navigation.navigate('Community')}
            activeOpacity={0.75}
          >
            <View style={[styles.serviceIconBox, { backgroundColor: iconBoxBg }]}>
              <Icon name="message-circle" size={17} color={accentColor} />
            </View>
            <Text style={[styles.communityRowText, { color: textPrimary }]}>
              {isHindi ? 'समुदाय में प्रश्न पूछें' : t('quick_actions.community', 'Ask in Community')}
            </Text>
            <Icon name="chevron-right" size={15} color={textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Section 3: Today's Panchang */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {t('home.todays_panchang', 'आज का पंचांग')}
            </Text>
            <TouchableOpacity
              style={styles.viewAllLink}
              onPress={() => navigation.navigate('Panchang')}
              activeOpacity={0.7}
            >
              <Text style={[styles.viewAllText, { color: accentColor }]}>
                {t('home.view_details', 'विस्तृत देखें')}
              </Text>
              <Icon name="chevron-right" size={14} color={accentColor} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.panchangCard,
              { backgroundColor: surfaceBg, borderColor: borderDynamic },
            ]}
            onPress={() => navigation.navigate('Panchang')}
            activeOpacity={0.75}
          >
            <View style={[styles.panchangTopStrip, { backgroundColor: subtleBg, borderBottomColor: dividerDynamic }]}>
              <Text style={[styles.panchangDateMain, { color: textPrimary }]} numberOfLines={1}>
                {topDateText}
              </Text>
              <Text style={[styles.panchangDateSub, { color: textSecondary }]} numberOfLines={1}>
                {bottomDateText}
              </Text>
            </View>

            <View style={styles.panchangColsRow}>
              <View style={styles.panchangCol}>
                <View style={[styles.miniIconBadge, { backgroundColor: iconBoxBg }]}>
                  <Icon name="calendar" size={14} color={accentColor} />
                </View>
                <Text style={[styles.panchangLabel, { color: textSecondary }]}>
                  {t('panchang_screen.labels.tithi', 'तिथि')}
                </Text>
                <Text style={[styles.panchangValue, { color: textPrimary }]} numberOfLines={1}>
                  {panchang ? t(panchang.tithiKey) : isHindi ? 'अष्टमी' : 'Ashtami'}
                </Text>
              </View>

              <View style={[styles.verticalDivider, { backgroundColor: dividerDynamic }]} />

              <View style={styles.panchangCol}>
                <View style={[styles.miniIconBadge, { backgroundColor: iconBoxBg }]}>
                  <Icon name="star" size={14} color={accentColor} />
                </View>
                <Text style={[styles.panchangLabel, { color: textSecondary }]}>
                  {t('panchang_screen.labels.nakshatra', 'नक्षत्र')}
                </Text>
                <Text style={[styles.panchangValue, { color: textPrimary }]} numberOfLines={1}>
                  {isHindi ? 'रोहिणी' : 'Rohini'}
                </Text>
              </View>

              <View style={[styles.verticalDivider, { backgroundColor: dividerDynamic }]} />

              <View style={styles.panchangCol}>
                <View style={[styles.miniIconBadge, { backgroundColor: iconBoxBg }]}>
                  <Icon name="moon" size={14} color={accentColor} />
                </View>
                <Text style={[styles.panchangLabel, { color: textSecondary }]}>
                  {t('home.rahu_kaal', 'राहु काल')}
                </Text>
                <Text style={[styles.panchangValue, { color: textPrimary }]} numberOfLines={1}>
                  03:12 - 04:48
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 4: Today's Pooja */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {t('home.todays_pooja', 'आज की पूजा')}
            </Text>
            <TouchableOpacity
              style={styles.viewAllLink}
              onPress={() => navigation.navigate('Library')}
              activeOpacity={0.7}
            >
              <Text style={[styles.viewAllText, { color: accentColor }]}>
                {t('home.view_all', 'सभी देखें')}
              </Text>
              <Icon name="chevron-right" size={14} color={accentColor} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.poojaCard,
              { backgroundColor: surfaceBg, borderColor: borderDynamic },
            ]}
            onPress={() => navigation.navigate('PoojaLibrary')}
            activeOpacity={0.75}
          >
            <View style={styles.poojaAccentBar} />
            <View style={[styles.poojaIconBox, { backgroundColor: iconBoxBg }]}>
              <Image
                source={require('../assets/images/lotus_pooja.png')}
                style={styles.poojaImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.poojaInfo}>
              <View style={[styles.aajKaTag, { backgroundColor: iconBoxBg }]}>
                <Text style={[styles.aajKaTagText, { color: accentColor }]}>
                  {t('home.aaj_ka_karyakram', 'पूजा संग्रह')}
                </Text>
              </View>
              <Text style={[styles.poojaName, { color: textPrimary }]} numberOfLines={1}>
                {t('home.pooja_library_title', 'पूजा विधि एवं नित्य पाठ')}
              </Text>
              <Text style={[styles.poojaDetailText, { color: textSecondary }]} numberOfLines={1}>
                {t('home.pooja_library_subtitle', 'देवता अनुसार पूजा विधि, मंत्र, आरती व सामग्री')}
              </Text>
            </View>
            <Icon name="chevron-right" size={16} color={textSecondary} />
          </TouchableOpacity>

          {/* Pooja Quick Bottom Pills */}
          <View style={styles.poojaQuickRow}>
            {[
              { key: 'pooja', label: 'पूजा विधि', route: 'PoojaLibrary', icon: 'book-open' as const },
              { key: 'stotram', label: 'स्तोत्रम्', route: 'StotramLibrary', icon: 'file-text' as const },
              { key: 'aarti', label: 'आरती', route: 'AartiLibrary', icon: 'sun' as const },
              { key: 'samagri', label: 'सामग्री', route: 'Samagri', icon: 'list' as const },
            ].map((pill) => (
              <TouchableOpacity
                key={pill.key}
                style={[
                  styles.poojaQuickPill,
                  { backgroundColor: surfaceBg, borderColor: borderDynamic },
                ]}
                onPress={() => navigation.navigate(pill.route)}
                activeOpacity={0.75}
              >
                <Icon name={pill.icon} size={13} color={accentColor} />
                <Text
                  style={[styles.poojaQuickPillText, { color: textPrimary }]}
                  numberOfLines={1}
                >
                  {pill.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 5: Yajman Overview */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {t('home.yajman_overview', 'यजमान सारांश')}
            </Text>
            <TouchableOpacity
              style={[styles.filterPillBtn, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}
              onPress={toggleYajmanFilter}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, { color: accentColor }]}>
                {yajmanFilter === 'today'
                  ? t('home.today', 'आज')
                  : t('home.last_30_days', 'पिछले 30 दिन')}{' '}
                ▾
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.yajmanCard,
              { backgroundColor: surfaceBg, borderColor: borderDynamic },
            ]}
            onPress={() => navigation.navigate('YajmanList')}
            activeOpacity={0.75}
          >
            <View style={styles.yajmanStatsRow}>
              <View style={styles.yajmanStatItem}>
                <View style={[styles.miniIconBadge, { backgroundColor: 'rgba(34, 197, 94, 0.14)' }]}>
                  <Icon name="arrow-down-left" size={14} color={colors.success} />
                </View>
                <Text style={[styles.statLabel, { color: textSecondary }]}>
                  {t('home.income', 'आय')}
                </Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {yajmanStats.income}
                </Text>
              </View>

              <View style={[styles.verticalDivider, { backgroundColor: dividerDynamic }]} />

              <View style={styles.yajmanStatItem}>
                <View style={[styles.miniIconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.14)' }]}>
                  <Icon name="arrow-up-right" size={14} color={colors.error} />
                </View>
                <Text style={[styles.statLabel, { color: textSecondary }]}>
                  {t('home.expense', 'व्यय')}
                </Text>
                <Text style={[styles.statValue, { color: colors.error }]}>
                  {yajmanStats.expense}
                </Text>
              </View>

              <View style={[styles.verticalDivider, { backgroundColor: dividerDynamic }]} />

              <View style={styles.yajmanStatItem}>
                <View style={[styles.miniIconBadge, { backgroundColor: iconBoxBg }]}>
                  <Icon name="user-plus" size={14} color={accentColor} />
                </View>
                <Text style={[styles.statLabel, { color: textSecondary }]}>
                  {t('home.new_yajmans', 'नए यजमान')}
                </Text>
                <Text style={[styles.statValue, { color: textPrimary }]}>
                  {yajmanStats.newCount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 6: Upcoming Festivals */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {t('home.upcoming_festivals', 'आगामी पर्व एवं व्रत')}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.festivalCard,
              { backgroundColor: surfaceBg, borderColor: borderDynamic },
            ]}
            onPress={() => navigation.navigate('Panchang')}
            activeOpacity={0.75}
          >
            <View style={[styles.serviceIconBox, { backgroundColor: iconBoxBg }]}>
              <Icon name="star" size={17} color={accentColor} />
            </View>
            <View style={styles.festivalInfo}>
              <Text style={[styles.festivalName, { color: textPrimary }]} numberOfLines={1}>
                {t('home.panchang_festivals', 'व्रत एवं पर्व कैलेंडर')}
              </Text>
              <Text style={[styles.festivalDate, { color: textSecondary }]} numberOfLines={1}>
                {t('home.check_upcoming_vrat', 'आगामी प्रमुख त्योहार और शुभ तिथियाँ देखें')}
              </Text>
            </View>
            <Icon name="chevron-right" size={16} color={textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandCol: {
    flex: 1,
    paddingRight: 10,
  },
  brandLogo: {
    width: 136,
    height: 36,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  greetingText: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_MAROON,
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_MAROON,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    maxWidth: '72%',
  },
  locationPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  langPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  langPillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  quickActionStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  quickStripCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 6,
  },
  quickStripText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  spiritualCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  spiritualTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  spiritualContent: {
    flex: 1,
  },
  spiritualTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
    gap: 4,
  },
  spiritualTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  quoteText: {
    fontSize: 11.5,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  mantraStrip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  mantraLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  mantraText: {
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  sectionTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  servicesGridCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  serviceGridRow: {
    flexDirection: 'row',
  },
  serviceGridCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  serviceIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  serviceCellLabel: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    marginRight: 4,
  },
  emptySearchBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 11.5,
  },
  communityRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  communityRowText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
  },
  panchangCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  panchangTopStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  panchangDateMain: {
    fontSize: 12,
    fontWeight: '700',
  },
  panchangDateSub: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  panchangColsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  panchangCol: {
    flex: 1,
    alignItems: 'center',
  },
  miniIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  panchangLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  panchangValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 40,
  },
  poojaCard: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  poojaAccentBar: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: PRIMARY_MAROON,
  },
  poojaIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 11,
  },
  poojaImage: {
    width: 24,
    height: 24,
  },
  poojaInfo: {
    flex: 1,
    marginRight: 6,
  },
  aajKaTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  aajKaTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  poojaName: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  poojaDetailText: {
    fontSize: 11,
  },
  poojaQuickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  poojaQuickPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  poojaQuickPillText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  filterPillBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  yajmanCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  yajmanStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yajmanStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  festivalCard: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  festivalInfo: {
    flex: 1,
    marginRight: 6,
  },
  festivalName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  festivalDate: {
    fontSize: 11,
    marginTop: 2,
  },
});

export default HomeScreen;
