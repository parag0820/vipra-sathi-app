import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { generateMockPanchang, PanchangDetails } from '../data/mockPanchang';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';

const formatLocalizedDate = (date: Date, lang: string) => {
  if (lang === 'hi') {
    const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const LOCATIONS = [
  { id: '1', name: { en: 'Ujjain, Madhya Pradesh', hi: 'उज्जैन, मध्य प्रदेश' } },
  { id: '2', name: { en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान' } },
  { id: '3', name: { en: 'New Delhi, India', hi: 'नई दिल्ली, भारत' } },
  { id: '4', name: { en: 'Mumbai, Maharashtra', hi: 'मुंबई, महाराष्ट्र' } },
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
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [panchangData, setPanchangData] = useState<PanchangDetails | null>(null);
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
          console.log('Permission to access location was denied');
          return;
        }

        const currentPos = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync({
          latitude: currentPos.coords.latitude,
          longitude: currentPos.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const currentGeo = geocode[0];
          const city = currentGeo.city || currentGeo.district || currentGeo.subregion || 'Unknown City';
          const region = currentGeo.region || 'Unknown Region';

          const newLocText = `${city}, ${region}`;

          const dynamicLocation = {
            id: 'current',
            name: {
              en: newLocText,
              hi: newLocText,
            }
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
    const data = generateMockPanchang(currentDate);
    // Overriding mock data with translated mock strings
    data.date = formatLocalizedDate(currentDate, i18n.language);
    data.tithi = t('panchang_screen.mock_tithi');
    data.nakshatra = t('panchang_screen.mock_nakshatra');
    data.yoga = t('panchang_screen.mock_yoga');
    data.karana = t('panchang_screen.mock_karana');
    data.sunrise = '06:12 AM';
    data.sunset = '06:28 PM';
    data.rahuKaal = '01:30 PM - 03:00 PM';
    data.yamaganda = '06:00 AM - 07:30 AM';
    data.choghadiya = '08:00 AM - 09:30 AM';
    data.festivals = [t('panchang_screen.mock_fest1'), t('panchang_screen.mock_fest2')];
    setPanchangData(data);
  }, [currentDate, i18n.language]);

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
              {item.type === 'shubh' ? (isHi ? 'शुभ' : 'Shubh') : (isHi ? 'अशुभ' : 'Ashubh')}
            </Text>
          )}
        </View>
        <Text style={[styles.itemTime, { color: isCurrent ? colors.primary : textColor }]}>{item.time}</Text>
      </View>
    );
  };

  const renderDataRow = (iconName: string, label: string, value: string, subValue?: string) => (
    <View style={[styles.dataRow, { borderBottomColor: borderColor }]}>
      <View style={styles.iconLabelContainer}>
        <MaterialCommunityIcons name={iconName as any} size={20} color={colors.secondary} style={styles.rowIcon} />
        <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.rowValue, { color: textColor }]}>{value}</Text>
        {subValue && <Text style={[styles.rowSubValue, { color: colors.textLight }]}>{subValue}</Text>}
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
          <Text style={[styles.dateText, { color: textColor }]}>{panchangData.date}</Text>
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
              {i18n.language === 'hi' ? location.name.hi : location.name.en}
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
              {/* Panchang List */}
              <View style={styles.listContainer}>
                {renderDataRow('moon-waning-crescent', t('panchang_screen.labels.tithi'), panchangData.tithi, i18n.language === 'hi' ? '(11:20 PM तक)' : '(Till 11:20 PM)')}
                {renderDataRow('star-four-points-outline', t('panchang_screen.labels.nakshatra'), panchangData.nakshatra, i18n.language === 'hi' ? '(04:15 PM तक)' : '(Till 04:15 PM)')}
                {renderDataRow('meditation', t('panchang_screen.labels.yoga'), panchangData.yoga)}
                {renderDataRow('hands-pray', t('panchang_screen.labels.karana'), panchangData.karana)}

                {renderDataRow('weather-sunset-up', t('panchang_screen.labels.sunrise'), panchangData.sunrise)}
                {renderDataRow('weather-sunset-down', t('panchang_screen.labels.sunset'), panchangData.sunset)}

                {renderDataRow('clock-outline', t('panchang_screen.labels.rahukaal'), panchangData.rahuKaal)}
                {renderDataRow('clock-outline', t('panchang_screen.labels.yamaganda'), panchangData.yamaganda)}
                {renderDataRow('clock-outline', t('panchang_screen.labels.choghadiya'), panchangData.choghadiya)}
              </View>

              {/* Festivals Section */}
              {panchangData.festivals && panchangData.festivals.length > 0 && (
                <View style={[styles.festivalsCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.festivalsTitle, { color: colors.primary }]}>{t('panchang_screen.festivals_title')}</Text>
                  {panchangData.festivals.map((fest, index) => (
                    <View key={index} style={styles.festivalItem}>
                      <MaterialCommunityIcons name="play-circle" size={16} color={colors.secondary} style={{ marginRight: 8 }} />
                      <Text style={[styles.festivalText, { color: textColor }]}>{fest}</Text>
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
                    {i18n.language === 'hi' ? item.name.hi : item.name.en}
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
    paddingBottom: 24,
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
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 16,
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
    paddingVertical: 5,
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
  listContainer: {
    paddingVertical: 8,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  rowIcon: {
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  rowSubValue: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  festivalsCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  festivalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 12,
  },
  festivalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  festivalText: {
    fontSize: 15,
    fontWeight: '500',
  },
  muhuratTabContainer: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 0,
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

