import React, { useState, useEffect } from 'react';
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

const PanchangScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [panchangData, setPanchangData] = useState<PanchangDetails | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [availableLocations, setAvailableLocations] = useState(LOCATIONS);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const TABS = [
    { key: 'summary', label: t('panchang_screen.tabs.summary') },
    { key: 'tithi', label: t('panchang_screen.tabs.tithi') },
    { key: 'nakshatra', label: t('panchang_screen.tabs.nakshatra') },
    { key: 'yoga', label: t('panchang_screen.tabs.yoga') },
    { key: 'karana', label: t('panchang_screen.tabs.karana') }
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
                  <Text style={[
                    styles.tabText, 
                    isActive && styles.tabTextActive, 
                    { color: isActive ? colors.primary : colors.textLight }
                  ]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'summary' ? (
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
          ) : (
            <View style={styles.emptyTabContent}>
              <Text style={{ color: colors.textLight }}>{t('panchang_screen.empty_tab', { tab: TABS.find(t => t.key === activeTab)?.label })}</Text>
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
  emptyTabContent: {
    padding: 24,
    alignItems: 'center',
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

