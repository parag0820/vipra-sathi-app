import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { calculatePanchang, PanchangData } from '../utils/panchang';

const { width } = Dimensions.get('window');

const SERVICE_CARDS = [
  {
    id: '1',
    title: 'Panchang',
    subtitle: 'Tithi, Muhurat & Festivals',
    icon: 'sun',
    gradient: ['#C75B12', '#E8944A'],
  },
  {
    id: '2',
    title: 'Kundali',
    subtitle: 'Birth Chart & Compatibility',
    icon: 'star',
    gradient: ['#16A34A', '#4ADE80'],
  },
  {
    id: '3',
    title: 'Pooja',
    subtitle: 'Book, Plan & Rituals',
    icon: 'droplet',
    gradient: ['#2563EB', '#60A5FA'],
  },
  {
    id: '4',
    title: 'Muhurat',
    subtitle: 'Auspicious Times',
    icon: 'clock',
    gradient: ['#7C3AED', '#A78BFA'],
  },
];

const QUICK_ACTIONS = [
  { id: '1', labelKey: 'pooja', icon: 'droplet', screen: 'Library', image: require('../assets/images/lotus_pooja.png') },
  { id: '2', labelKey: 'calendar', icon: 'calendar', screen: 'Calendar', image: require('../assets/images/calendar.png') },
  { id: '3', labelKey: 'dakshina', icon: 'credit-card', screen: 'DakshinaCalculator', image: require('../assets/images/dakshina.png') },
  { id: '4', labelKey: 'panchang', icon: 'sun', screen: 'Panchang', image: require('../assets/images/panchang.png') },
  { id: '5', labelKey: 'muhurat', icon: 'compass', screen: 'Muhurt', image: require('../assets/images/muhurat.png') },
  { id: '6', labelKey: 'kundali', icon: 'star', screen: 'Kundali', image: require('../assets/images/lotus_kundali.png') },
  { id: '6a', labelKey: 'kundali_match', icon: 'heart', screen: 'KundaliMatchingForm' },
  { id: '6b', labelKey: 'samagri', icon: 'shopping-bag', screen: 'Samagri' },
  { id: '7', labelKey: 'yajman', icon: 'users', screen: 'YajmanList', image: require('../assets/images/community.png') },
  { id: '8', labelKey: 'stotram', icon: 'book-open', screen: 'StotramLibrary', image: require('../assets/images/stotram.png') },
  { id: '9', labelKey: 'community', icon: 'message-circle', screen: 'Community', image: require('../assets/images/community.png') },
  { id: '10', labelKey: 'history', icon: 'clock', screen: 'History', image: require('../assets/images/history.png') },
  { id: '11', labelKey: 'account', icon: 'user', screen: 'AccountManagerDashboard', image: require('../assets/images/account.png') },
  { id: '12', labelKey: 'subscription', icon: 'award', screen: 'Subscription', image: require('../assets/images/subscription.png') },
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

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [yajmanFilter, setYajmanFilter] = useState<'today' | 'month'>('today');

  const toggleYajmanFilter = () => {
    setYajmanFilter(prev => prev === 'today' ? 'month' : 'today');
  };

  const isHindi = i18n.language === 'hi';
  const dayName = isHindi ? HI_DAYS[currentDate.getDay()] : EN_DAYS[currentDate.getDay()];
  const monthName = isHindi ? HI_MONTHS[currentDate.getMonth()] : EN_MONTHS[currentDate.getMonth()];
  const shortDayName = isHindi ? dayName.replace('वार', '') : dayName.substring(0, 3);
  const shortMonthName = monthName.substring(0, 3);
  const topDateText = `${shortDayName}, ${currentDate.getDate()} ${shortMonthName} ${currentDate.getFullYear()}`;
  const vikramSamvat = currentDate.getFullYear() + 57;
  const bottomDateText = panchang ? `${t('home.vikram_samvat', 'विक्रम संवत्')} ${vikramSamvat} ` : `${t('home.vikram_samvat', 'विक्रम संवत्')} ${vikramSamvat} | ${t('home.chaitra_shukla_paksha', 'चैत्र शुक्ल पक्ष')}`;

  const yajmanStats = yajmanFilter === 'today'
    ? { income: '₹2,500', expense: '₹450', newCount: '+3' }
    : { income: '₹45,000', expense: '₹4,200', newCount: '+28' };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fallback to New Delhi if denied
        setPanchang(calculatePanchang(28.6139, 77.2090, currentDate));
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setPanchang(calculatePanchang(location.coords.latitude, location.coords.longitude, currentDate));
      } catch (error) {
        // Fallback to New Delhi
        setPanchang(calculatePanchang(28.6139, 77.2090, currentDate));
      }
    })();
  }, [currentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 60000); // Check every minute for midnight rollover
    return () => clearInterval(timer);
  }, [currentDate]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isFocused && <StatusBar barStyle="light-content" backgroundColor={colors.primary} />}
      <View style={{ backgroundColor: colors.primary, paddingTop: insets.top, zIndex: 1 }}>
        <View style={[styles.header, { paddingBottom: 10, marginBottom: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../logo.png')}
              style={styles.logoWhite}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtnDark} onPress={toggleTheme}>
              <Icon name={isDark ? 'sun' : 'moon'} size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtnDark}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon name="bell" size={18} color="#FFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5C287', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFF' }}>
              <Icon name="user" size={18} color="#5C0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.topHeaderGradient, { marginHorizontal: -14, paddingBottom: 45, marginBottom: -20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: 24, overflow: 'hidden' }}>
            <View style={{ flex: 1, flexShrink: 1, paddingRight: 16 }}>
              <Text style={styles.greetingTextWhite} numberOfLines={1} ellipsizeMode="tail">{t('home.namaste', 'नमस्ते,')} {user?.fullName || t('home.pandit_ji', 'पंडित जी')}</Text>
              <Text style={styles.greetingSubtextWhite} numberOfLines={1} ellipsizeMode="tail">{t('home.dharma_seva', 'धर्म सेवा ही परम सेवा है')}</Text>
            </View>
            <View style={{
              alignItems: 'center', flexShrink: 0,
            }}>
              <Text style={{ color: colors.secondary, fontSize: 12, fontWeight: 'bold' }}>{t('home.sanatan', 'सनातन')}</Text>
              <Text style={{ color: colors.secondary, fontSize: 12, fontWeight: 'bold' }}>{t('home.seva_me_sadaiv', 'सेवा में सदैव')}</Text>
              <Text style={{ color: colors.secondary, fontSize: 12, marginTop: 2, fontWeight: 'bold' }}>— ॐ —</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
          {/* Daily Spiritual Card */}
          <View style={[styles.spiritualCard, { backgroundColor: colors.surface }]}>
            <View style={styles.spiritualCardTopRow}>
              <View style={styles.spiritualContent}>
                <View style={[styles.spiritualTag, { backgroundColor: colors.aajkaBg }]}>
                  <Icon name="sun" size={12} color={isDark ? '#FFF' : colors.primary} />
                  <Text style={[styles.spiritualTagText, { color: isDark ? '#FFF' : colors.primary }]}>{t('home.spiritual_card', 'Daily Spiritual Card')}</Text>
                </View>
                <Text style={[styles.quoteText, { color: colors.text }]}>
                  {t('home.daily_quote', '"Inner peace begins when you choose not to allow another person or event to control your emotions."')}
                </Text>
              </View>
              <Image
                source={require('../../logo.png')}
                style={[styles.ganeshaImage, { tintColor: isDark ? '#FFF' : colors.primary }]}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.mantraContainer, { backgroundColor: colors.aajkaBg }]}>
              <Text style={[styles.mantraLabel, { color: isDark ? '#FFF' : colors.primary }]}>{t('home.todays_mantra', "Today's Mantra")}</Text>
              <Text style={[styles.mantraText, { color: colors.text }]}>{t('home.mantra_om_gam', 'Om Gam Ganapataye Namaha')}</Text>
            </View>
          </View>

          {/* Quick Actions / Grid */}
          <View style={styles.gridSection}>
            <View style={styles.gridSectionHeader}>
              <Text style={[styles.gridSectionTitle, { color: colors.text }]}>{t('home.all_services', 'सभी सेवाएँ')}</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginTop: 2 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Icon name="sun" size={12} color={colors.border} style={{ marginHorizontal: 4 }} />
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>
              <TouchableOpacity style={styles.sarveBhavantuBtn}>
                <Text style={[styles.sarveBhavantuText, { color: isDark ? '#FFF' : colors.primary }]}>{t('home.sarve_bhavantu', 'सर्वे भवन्तु सुखिनः')}</Text>
                <Icon name="chevron-right" size={14} color={isDark ? '#FFF' : colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.quickActionsContainer}>
              {QUICK_ACTIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.quickActionCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.2 }]}
                  onPress={() => navigation.navigate(item.screen)}
                  activeOpacity={0.7}
                >
                  {item.image ? (
                    <Image source={item.image} style={{ width: 20, height: 28, marginBottom: 8, tintColor: isDark ? '#FFF' : undefined }} resizeMode="contain" />
                  ) : (
                    <Icon name={item.icon as any} size={20} color={isDark ? '#FFF' : colors.primary} style={styles.quickActionIconImage} />
                  )}
                  <Text style={[styles.quickActionLabel, { color: colors.text }]}>{t(`quick_actions.${item.labelKey}`)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Today's Panchang (Swapped order: Before Pooja) */}
          <View style={styles.panchangSection}>
            <TouchableOpacity
              style={[styles.panchangMainCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Panchang')}
              activeOpacity={0.8}
            >
              <View style={styles.panchangHeaderRow}>
                <Text style={[styles.panchangMainTitle, { color: colors.text }]}>{t('home.todays_panchang', 'आज का पंचांग')}</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginTop: 6 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                  <Icon name="sun" size={12} color={colors.border} style={{ marginHorizontal: 4 }} />
                  <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                </View>
                <View style={[styles.panchangDateInfo, { alignItems: 'flex-end', flexShrink: 1 }]}>
                  <Text style={[styles.panchangDateTextTop, { textAlign: 'right', color: colors.text }]} numberOfLines={2}>
                    {topDateText}
                  </Text>
                  <Text style={[styles.panchangDateTextBottom, { textAlign: 'right', color: colors.textLight }]} numberOfLines={2}>
                    {bottomDateText}
                  </Text>
                </View>
              </View>

              <View style={styles.panchangThreeCols}>
                <View style={styles.panchangCol}>
                  <Icon name="calendar" size={20} color={isDark ? '#FFF' : colors.primary} />
                  <Text style={[styles.panchangColLabel, { color: colors.textLight }]}>{t('tithi', 'तिथि')}</Text>
                  <Text style={[styles.panchangColValue, { color: colors.text }]}>{panchang ? (t(panchang.tithiKey)) : 'अष्टमी'}</Text>
                </View>
                <View style={[styles.panchangDividerVertical, { backgroundColor: colors.border }]} />
                <View style={styles.panchangCol}>
                  <Icon name="star" size={20} color={isDark ? '#FFF' : colors.primary} />
                  <Text style={[styles.panchangColLabel, { color: colors.textLight }]}>{t('nakshatra', 'नक्षत्र')}</Text>
                  <Text style={[styles.panchangColValue, { color: colors.text }]}>{panchang ? ('Rohini') : 'रोहिणी'}</Text>
                </View>
                <View style={[styles.panchangDividerVertical, { backgroundColor: colors.border }]} />
                <View style={styles.panchangCol}>
                  <Icon name="moon" size={20} color={isDark ? '#FFF' : colors.primary} />
                  <Text style={[styles.panchangColLabel, { color: colors.textLight }]}>{t('home.rahu_kaal', 'राहु काल')}</Text>
                  <Text style={[styles.panchangColValue, { color: colors.text }]}>03:12 - 04:48</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Today's Pooja (Swapped order: After Panchang) */}
          <View style={styles.poojaSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.poojaTitleRow}>
                <Icon name="calendar" size={18} color={isDark ? '#FFF' : colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.todays_pooja')}</Text>
              </View>
              <TouchableOpacity style={styles.viewAllBtn}>
                <Text style={[styles.viewAllText, { color: isDark ? '#FFF' : colors.primary }]}>{t('home.view_all', 'View All')}</Text>
                <Icon name="chevron-right" size={14} color={isDark ? '#FFF' : colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.poojaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Image
                source={require('../assets/images/onboarding_1.jpeg')}
                style={styles.poojaImage}
                resizeMode="cover"
              />
              <View style={styles.poojaInfo}>
                <View style={[styles.aajKaTag, { backgroundColor: colors.aajkaBg }]}>
                  <Text style={[styles.aajKaTagText, { color: isDark ? '#FFF' : colors.primary }]}>{t('home.aaj_ka_karyakram')}</Text>
                </View>
                <Text style={[styles.poojaName, { color: colors.text }]}>{t('home.griha_pravesh', 'Griha Pravesh')}</Text>
                <View style={styles.poojaDetailRow}>
                  <Icon name="user" size={13} color={colors.textLight} />
                  <Text style={[styles.poojaDetailText, { color: colors.textLight }]}>{t('home.sharma_family', 'Sharma Family')}</Text>
                </View>
                <View style={styles.poojaDetailRow}>
                  <Icon name="clock" size={13} color={colors.textLight} />
                  <Text style={[styles.poojaDetailText, { color: colors.textLight }]}>10:30 AM</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.poojaArrowBtn}>
                <Icon name="chevron-right" size={18} color={isDark ? '#FFF' : colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Yajman Overview Card */}
          <View style={styles.yajmanSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.poojaTitleRow}>
                <Icon name="users" size={18} color={isDark ? '#FFF' : colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.yajman_overview', "Yajman Overview")}</Text>
              </View>
              <TouchableOpacity style={styles.viewAllBtn} onPress={toggleYajmanFilter}>
                <Text style={[styles.viewAllText, { color: isDark ? '#FFF' : colors.primary }]}>
                  {yajmanFilter === 'today' ? t('home.today', "Today") : t('home.last_30_days', "Last 30 Days")} ▾
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.yajmanCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('YajmanList')}
              activeOpacity={0.8}
            >
              <View style={styles.yajmanStatsRow}>
                <View style={styles.yajmanStatItem}>
                  <View style={[styles.statIconBg, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <Icon name="arrow-down-left" size={16} color={colors.success} />
                  </View>
                  <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('home.income', "Income")}</Text>
                  <Text style={[styles.statValue, { color: colors.success }]}>{yajmanStats.income}</Text>
                </View>

                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                <View style={styles.yajmanStatItem}>
                  <View style={[styles.statIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                    <Icon name="arrow-up-right" size={16} color={colors.error} />
                  </View>
                  <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('home.expense', "Expense")}</Text>
                  <Text style={[styles.statValue, { color: colors.error }]}>{yajmanStats.expense}</Text>
                </View>

                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                <View style={styles.yajmanStatItem}>
                  <View style={[styles.statIconBg, { backgroundColor: 'rgba(128, 0, 0, 0.15)' }]}>
                    <Icon name="user-plus" size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('home.new_yajmans', "New Yajmans")}</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>{yajmanStats.newCount}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Upcoming Festivals */}
          <View style={styles.festivalSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.poojaTitleRow}>
                <Icon name="star" size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.upcoming_festivals', 'Upcoming Festivals')}</Text>
              </View>
            </View>

            <View style={[styles.festivalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.festivalIconContainer}>
                <Icon name="droplet" size={20} color={colors.primary} />
              </View>
              <View style={styles.festivalInfo}>
                <Text style={[styles.festivalName, { color: colors.text }]}>{t('home.ganesh_chaturthi', 'Ganesh Chaturthi')}</Text>
                <Text style={[styles.festivalDate, { color: colors.textLight }]}>7 Sep 2025</Text>
              </View>
              <TouchableOpacity style={styles.viewDetailsBtn}>
                <Text style={[styles.viewDetailsText, { color: colors.primary }]}>{t('home.view_details', 'View Details')}</Text>
                <Icon name="chevron-right" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,

  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 80,
  },
  mainCard: {
    backgroundColor: '#F8E6CE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    marginHorizontal: -14,
    paddingHorizontal: 14,
    paddingTop: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoLight: {
    width: 140,
    height: 50,
  },
  logoDark: {
    width: 140,
    height: 50,
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  profileBtn: {
    backgroundColor: '#C75B12',
    borderColor: '#C75B12',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#DC2626',
    width: 15,
    height: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  greetingSection: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  greetingSubtext: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  spiritualCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3E8DB',
    ...Platform.select({
      ios: {
        shadowColor: '#C75B12',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  spiritualCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spiritualContent: {
    flex: 1,
  },
  spiritualTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
    gap: 3,
  },
  spiritualTagText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#C75B12',
  },
  quoteText: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    opacity: 0.95,
  },
  mantraContainer: {
    backgroundColor: '#FFF0E6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  mantraLabel: {
    fontSize: 10,
    color: '#C75B12',
    marginBottom: 4,
    fontWeight: '600',
  },
  mantraText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  ganeshaImage: {
    width: 70,
    height: 85,
    marginLeft: 6,
    opacity: 0.9,
    tintColor: '#C75B12',
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 16,
    borderRadius: 12,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  quickActionCard: {
    width: (width - 60) / 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickActionIconImage: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8E6CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F3E8DB',
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  serviceSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#800000',
  },
  exploreAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  exploreAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C75B12',
  },
  serviceList: {
    paddingRight: 6,
  },
  serviceCard: {
    width: (width - 60) / 2.2,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
    minHeight: 130,
  },
  serviceCardGradient: {
    padding: 12,
    borderRadius: 12,
    flex: 1,
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  serviceCardSubtitle: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 13,
    marginBottom: 8,
  },
  serviceArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  poojaSection: {
    marginBottom: 16,
  },
  poojaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C75B12',
  },
  poojaCard: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  poojaImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  poojaInfo: {
    flex: 1,
    marginLeft: 10,
  },
  aajKaTag: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  aajKaTagText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#C75B12',
  },
  poojaName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  poojaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    gap: 4,
  },
  poojaDetailText: {
    fontSize: 10,
    color: '#6B7280',
  },
  poojaArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  festivalSection: {
    marginBottom: 12,
  },
  festivalCard: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  festivalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  festivalInfo: {
    flex: 1,
    marginLeft: 10,
  },
  festivalName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  festivalDate: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#C75B12',
  },
  panchangSection: {
    marginBottom: 16,
  },
  panchangCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E8DB',
    ...Platform.select({
      ios: {
        shadowColor: '#C75B12',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  panchangTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  panchangDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  panchangTithiText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  panchangGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 12,
  },
  panchangGridItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  panchangGridText: {
    marginLeft: 8,
  },
  panchangLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  panchangValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  yajmanSection: {
    marginBottom: 16,
  },
  yajmanCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E8DB',
    ...Platform.select({
      ios: {
        shadowColor: '#C75B12',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  yajmanStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yajmanStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  topHeaderGradient: {
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    paddingBottom: 24,
    marginBottom: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  logoWhite: {
    width: 140,
    height: 50,
    tintColor: '#FCE596',
  },
  headerIconBtnDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerIconBtnWhite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  greetingTextWhite: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    marginLeft: 14,
  },
  greetingSubtextWhite: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 14,
    marginTop: 4,
  },
  gridSection: {
    marginBottom: 10,
  },
  gridSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#800000',
    marginRight: 10,
  },
  gridSectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D4B4',
  },
  sarveBhavantuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 4,
  },
  sarveBhavantuText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#800000',
  },
  panchangMainCard: {
    backgroundColor: '#F8E6CE',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D4B4',
    ...Platform.select({
      ios: { shadowColor: '#C75B12', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  panchangHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  panchangMainTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#800000',
    marginRight: 10,
  },
  panchangHeaderDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#F8E6CE',
  },
  panchangDateInfo: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  panchangDateTextTop: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#800000',
  },
  panchangDateTextBottom: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  panchangThreeCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panchangCol: {
    alignItems: 'center',
    flex: 1,
  },
  panchangDividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: '#E8D4B4',
  },
  panchangColLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#800000',
    marginTop: 6,
    marginBottom: 2,
  },
  panchangColValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  }
});

export default HomeScreen;
