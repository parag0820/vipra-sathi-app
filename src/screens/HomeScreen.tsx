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
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
  { id: '1', labelKey: 'pooja', icon: 'droplet', screen: 'PoojaLibrary' },
  { id: '2', labelKey: 'calendar', icon: 'calendar', screen: 'Calendar' },
  { id: '3', labelKey: 'dakshina', icon: 'credit-card', screen: 'Dakshina' },
  { id: '4', labelKey: 'panchang', icon: 'sun', screen: 'Panchang' },
  { id: '5', labelKey: 'muhurat', icon: 'compass', screen: 'Muhurt' },
  { id: '6', labelKey: 'kundali', icon: 'star', screen: 'Kundali' },
  { id: '7', labelKey: 'yajman', icon: 'users', screen: 'YajmanList' },
  { id: '8', labelKey: 'stotram', icon: 'book-open', screen: 'StotramLibrary' },
  { id: '9', labelKey: 'community', icon: 'message-circle', screen: 'Community' },
  { id: '10', labelKey: 'history', icon: 'clock', screen: 'History' },
  { id: '11', labelKey: 'account', icon: 'user', screen: 'Settings' },
  { id: '12', labelKey: 'subscription', icon: 'award', screen: 'Subscription' },
];

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDark, colors, setTheme } = useTheme();
  const { user } = useAuth();

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [yajmanFilter, setYajmanFilter] = useState<'today' | 'month'>('today');

  const toggleYajmanFilter = () => {
    setYajmanFilter(prev => prev === 'today' ? 'month' : 'today');
  };

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
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      {/* Header - outside ScrollView to avoid content padding */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isDark ? (
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoDark}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoLight}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.headerIconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={toggleTheme}>
            <Icon name={isDark ? 'sun' : 'moon'} size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="bell" size={18} color={colors.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerIconBtn, styles.profileBtn]}
          >
            <Icon name="user" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingRow}>
            <Text style={[styles.greetingSubtext, { color: colors.textLight }]}>{t('home.namaste')}</Text>
            <Text style={[styles.greetingText, { color: colors.text }]}>{user?.fullName || t('home.pandit_ji')}</Text>
          </View>
        </View>

        {/* Daily Spiritual Card */}
        <View style={[styles.spiritualCard, { backgroundColor: '#FFF5EE' }]}>
          <View style={styles.spiritualCardTopRow}>
            <View style={styles.spiritualContent}>
              <View style={styles.spiritualTag}>
                <Icon name="sun" size={12} color="#C75B12" />
                <Text style={styles.spiritualTagText}>{t('home.spiritual_card')}</Text>
              </View>
              <Text style={styles.quoteText}>
                "Inner peace begins when you choose not to allow another person or event to control your emotions."
              </Text>
            </View>
            <Image
              source={require('../../logo.png')}
              style={styles.ganeshaImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.mantraContainer}>
            <Text style={styles.mantraLabel}>Today's Mantra</Text>
            <Text style={styles.mantraText}>Om Gam Ganapataye Namaha</Text>
          </View>
        </View>

        {/* Quick Actions Row */}
        <View style={[styles.quickActionsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickActionItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: isDark ? colors.surface : '#FFF5EE', borderColor: colors.border }]}>
                <Icon name={item.icon as any} size={20} color="#C75B12" />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>{t(`quick_actions.${item.labelKey}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* What would you like to do? */}
        {/* <View style={styles.serviceSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>What would you like to do?</Text>
            <TouchableOpacity style={styles.exploreAllBtn}>
              <Text style={styles.exploreAllText}>Explore All</Text>
              <Icon name="arrow-right" size={14} color="#C75B12" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={SERVICE_CARDS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.serviceList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(item.title === 'Panchang' ? 'Panchang' : item.title === 'Kundali' ? 'Kundali' : item.title === 'Pooja' ? 'PoojaLibrary' : 'Muhurt')}
              >
                <LinearGradient
                  colors={item.gradient as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.serviceCardGradient}
                >
                  <View style={styles.serviceIconContainer}>
                    <Icon name={item.icon as any} size={22} color="#FFF" />
                  </View>
                  <Text style={styles.serviceCardTitle}>{item.title}</Text>
                  <Text style={styles.serviceCardSubtitle}>{item.subtitle}</Text>
                  <View style={styles.serviceArrow}>
                    <Icon name="arrow-right" size={14} color="#FFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View> */}

        {/* Today's Pooja */}
        <View style={styles.poojaSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.poojaTitleRow}>
              <Icon name="calendar" size={18} color="#C75B12" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.todays_pooja')}</Text>
            </View>
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-right" size={14} color="#C75B12" />
            </TouchableOpacity>
          </View>

          <View style={[styles.poojaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image
              source={require('../assets/images/onboarding_1.jpg')}
              style={styles.poojaImage}
              resizeMode="cover"
            />
            <View style={styles.poojaInfo}>
              <View style={styles.aajKaTag}>
                <Text style={styles.aajKaTagText}>{t('home.aaj_ka_karyakram')}</Text>
              </View>
              <Text style={[styles.poojaName, { color: colors.text }]}>Griha Pravesh</Text>
              <View style={styles.poojaDetailRow}>
                <Icon name="user" size={13} color={colors.textLight} />
                <Text style={[styles.poojaDetailText, { color: colors.textLight }]}>Sharma Family</Text>
              </View>
              <View style={styles.poojaDetailRow}>
                <Icon name="clock" size={13} color={colors.textLight} />
                <Text style={[styles.poojaDetailText, { color: colors.textLight }]}>10:30 AM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.poojaArrowBtn}>
              <Icon name="chevron-right" size={18} color="#C75B12" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Yajman Overview Card */}
        <View style={styles.yajmanSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.poojaTitleRow}>
              <Icon name="users" size={18} color="#C75B12" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.yajman_overview', "Yajman Overview")}</Text>
            </View>
            <TouchableOpacity style={styles.viewAllBtn} onPress={toggleYajmanFilter}>
              <Text style={styles.viewAllText}>
                {yajmanFilter === 'today' ? t('home.today', "Today") : t('home.last_30_days', "Last 30 Days")} ▾
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.yajmanCard, { backgroundColor: '#FFF5EE' }]}
            onPress={() => navigation.navigate('YajmanList')}
            activeOpacity={0.8}
          >
            <View style={styles.yajmanStatsRow}>
              <View style={styles.yajmanStatItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                  <Icon name="arrow-down-left" size={16} color="#22C55E" />
                </View>
                <Text style={styles.statLabel}>{t('home.income', "Income")}</Text>
                <Text style={[styles.statValue, { color: '#22C55E' }]}>{yajmanStats.income}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.yajmanStatItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Icon name="arrow-up-right" size={16} color="#EF4444" />
                </View>
                <Text style={styles.statLabel}>{t('home.expense', "Expense")}</Text>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>{yajmanStats.expense}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.yajmanStatItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(199, 91, 18, 0.15)' }]}>
                  <Icon name="user-plus" size={16} color="#C75B12" />
                </View>
                <Text style={styles.statLabel}>{t('home.new_yajmans', "New Yajmans")}</Text>
                <Text style={[styles.statValue, { color: '#1E293B' }]}>{yajmanStats.newCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Today's Panchang */}
        <View style={styles.panchangSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.poojaTitleRow}>
              <Icon name="sun" size={18} color="#C75B12" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.todays_panchang', "Today's Panchang")}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.panchangCard, { backgroundColor: '#FFF5EE' }]}
            onPress={() => navigation.navigate('Panchang')}
            activeOpacity={0.8}
          >
            <View style={styles.panchangTopRow}>
              <View>
                <Text style={[styles.panchangDateText, { color: '#1E293B' }]}>
                  {panchang ? `${t(panchang.monthKey)}, ${t(panchang.pakshaKey)}` : t('home.mock_month_paksha', "Phalguna, Krishna Paksha")}
                </Text>
                <Text style={[styles.panchangTithiText, { color: '#C75B12' }]}>
                  {panchang ? t(panchang.tithiKey) : t('home.mock_tithi', "Tritiya Tithi")}
                </Text>
              </View>
              <Icon name="calendar" size={24} color="#C75B12" />
            </View>

            <View style={[styles.panchangGrid, { backgroundColor: 'rgba(199, 91, 18, 0.08)' }]}>
              <View style={styles.panchangGridItem}>
                <Icon name="sunrise" size={16} color="#C75B12" />
                <View style={styles.panchangGridText}>
                  <Text style={[styles.panchangLabel, { color: '#6B7280' }]}>{t('home.sunrise', "Sunrise")}</Text>
                  <Text style={[styles.panchangValue, { color: '#1E293B' }]}>{panchang ? panchang.sunrise : '--:-- AM'}</Text>
                </View>
              </View>
              <View style={styles.panchangGridItem}>
                <Icon name="sunset" size={16} color="#C75B12" />
                <View style={styles.panchangGridText}>
                  <Text style={[styles.panchangLabel, { color: '#6B7280' }]}>{t('home.sunset', "Sunset")}</Text>
                  <Text style={[styles.panchangValue, { color: '#1E293B' }]}>{panchang ? panchang.sunset : '--:-- PM'}</Text>
                </View>
              </View>
              <View style={styles.panchangGridItem}>
                <Icon name="moon" size={16} color="#C75B12" />
                <View style={styles.panchangGridText}>
                  <Text style={[styles.panchangLabel, { color: '#6B7280' }]}>{t('home.moonrise', "Moonrise")}</Text>
                  <Text style={[styles.panchangValue, { color: '#1E293B' }]}>{panchang ? panchang.moonrise : '--:-- PM'}</Text>
                </View>
              </View>
              <View style={styles.panchangGridItem}>
                <Icon name="moon" size={16} color="#C75B12" />
                <View style={styles.panchangGridText}>
                  <Text style={[styles.panchangLabel, { color: '#6B7280' }]}>{t('home.moonset', "Moonset")}</Text>
                  <Text style={[styles.panchangValue, { color: '#1E293B' }]}>{panchang ? panchang.moonset : '--:-- AM'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Festivals */}
        <View style={styles.festivalSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.poojaTitleRow}>
              <Icon name="star" size={18} color="#C75B12" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Festivals</Text>
            </View>
          </View>

          <View style={[styles.festivalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.festivalIconContainer}>
              <Icon name="droplet" size={20} color="#C75B12" />
            </View>
            <View style={styles.festivalInfo}>
              <Text style={[styles.festivalName, { color: colors.text }]}>Ganesh Chaturthi</Text>
              <Text style={[styles.festivalDate, { color: colors.textLight }]}>7 Sep 2025</Text>
            </View>
            <TouchableOpacity style={styles.viewDetailsBtn}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Icon name="chevron-right" size={14} color="#C75B12" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 2,
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
  quickActionItem: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF5EE',
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
    color: '#1E293B',
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
});

export default HomeScreen;
