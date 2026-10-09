import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';
import VedicChart from '../components/VedicChart';
import { Feather as Icon } from '@expo/vector-icons';

type KundaliGeneratedRouteProp = RouteProp<RootStackParamList, 'KundaliGenerated'>;

const ALL_CHARTS = [
  // Lagna Charts (12 Rashis)
  'Mesha (Aries) Lagna',
  'Vrishabha (Taurus) Lagna',
  'Mithuna (Gemini) Lagna',
  'Karka (Cancer) Lagna',
  'Simha (Leo) Lagna',
  'Kanya (Virgo) Lagna',
  'Tula (Libra) Lagna',
  'Vrischika (Scorpio) Lagna',
  'Dhanu (Sagittarius) Lagna',
  'Makara (Capricorn) Lagna',
  'Kumbha (Aquarius) Lagna',
  'Meena (Pisces) Lagna',
  // Divisional Charts
  'Lagna (D1)',
  'Hora (D2)',
  'Drekkana (D3)',
  'Chaturthamsha (D4)',
  'Saptamamsha (D7)',
  'Navamsha (D9)',
  'Dashamsha (D10)',
  'Dwadashamsha (D12)',
  'Shodashamsha (D16)',
  'Vimshamsha (D20)',
  'Chaturvimshamsha (D24)',
  'Saptavimshamsha (D27)',
  'Trimsamsha (D30)',
  'Khavedamsha (D40)',
  'Akshavedamsha (D45)',
  'Shashtyamsha (D60)',
  // Special Lagnas
  'Chandra Lagna',
  'Surya Lagna',
  'Arudha Lagna',
  // Dashas
  'Dashas',
];

type ChartKey = 'Lagna' | 'Hora' | 'Drekkana' | 'Chaturthamsha' | 'Saptamamsha' | 'Navamsha' | 'Dashamsha' | 'Dwadashamsha' | 'Shodashamsha' | 'Vimshamsha' | 'Chaturvimshamsha' | 'Saptavimshamsha' | 'Trimsamsha' | 'Khavedamsha' | 'Akshavedamsha' | 'Shashtyamsha' | 'ChandraLagna' | 'SuryaLagna' | 'ArudhaLagna' | 'MeshaLagna' | 'VrishabhaLagna' | 'MithunaLagna' | 'KarkaLagna' | 'SimhaLagna' | 'KanyaLagna' | 'TulaLagna' | 'VrischikaLagna' | 'DhanuLagna' | 'MakaraLagna' | 'KumbhaLagna' | 'MeenaLagna';

const MOCK_CHARTS: Record<ChartKey, { name: string; house: number }[]> = {
  // Lagna (D1) - default
  Lagna: [
    { name: 'Su', house: 1 }, { name: 'Me', house: 1 },
    { name: 'Mo', house: 4 }, { name: 'Ma', house: 7 },
    { name: 'Ju', house: 9 }, { name: 'Ve', house: 10 },
    { name: 'Sa', house: 12 }, { name: 'Ra', house: 6 }, { name: 'Ke', house: 12 },
  ],
  // 12 Rashi Lagna charts
  MeshaLagna: [
    { name: 'Su', house: 1 }, { name: 'Me', house: 2 },
    { name: 'Mo', house: 4 }, { name: 'Ma', house: 1 },
    { name: 'Ju', house: 9 }, { name: 'Ve', house: 3 },
    { name: 'Sa', house: 10 }, { name: 'Ra', house: 5 }, { name: 'Ke', house: 11 },
  ],
  VrishabhaLagna: [
    { name: 'Su', house: 4 }, { name: 'Me', house: 2 },
    { name: 'Mo', house: 3 }, { name: 'Ma', house: 12 },
    { name: 'Ju', house: 8 }, { name: 'Ve', house: 1 },
    { name: 'Sa', house: 9 }, { name: 'Ra', house: 6 }, { name: 'Ke', house: 12 },
  ],
  MithunaLagna: [
    { name: 'Su', house: 4 }, { name: 'Me', house: 1 },
    { name: 'Mo', house: 2 }, { name: 'Ma', house: 11 },
    { name: 'Ju', house: 7 }, { name: 'Ve', house: 12 },
    { name: 'Sa', house: 8 }, { name: 'Ra', house: 7 }, { name: 'Ke', house: 1 },
  ],
  KarkaLagna: [
    { name: 'Su', house: 2 }, { name: 'Me', house: 12 },
    { name: 'Mo', house: 1 }, { name: 'Ma', house: 10 },
    { name: 'Ju', house: 6 }, { name: 'Ve', house: 11 },
    { name: 'Sa', house: 7 }, { name: 'Ra', house: 8 }, { name: 'Ke', house: 2 },
  ],
  SimhaLagna: [
    { name: 'Su', house: 1 }, { name: 'Me', house: 11 },
    { name: 'Mo', house: 12 }, { name: 'Ma', house: 9 },
    { name: 'Ju', house: 5 }, { name: 'Ve', house: 10 },
    { name: 'Sa', house: 6 }, { name: 'Ra', house: 9 }, { name: 'Ke', house: 3 },
  ],
  KanyaLagna: [
    { name: 'Su', house: 12 }, { name: 'Me', house: 1 },
    { name: 'Mo', house: 11 }, { name: 'Ma', house: 8 },
    { name: 'Ju', house: 4 }, { name: 'Ve', house: 9 },
    { name: 'Sa', house: 5 }, { name: 'Ra', house: 10 }, { name: 'Ke', house: 4 },
  ],
  TulaLagna: [
    { name: 'Su', house: 11 }, { name: 'Me', house: 12 },
    { name: 'Mo', house: 10 }, { name: 'Ma', house: 7 },
    { name: 'Ju', house: 3 }, { name: 'Ve', house: 1 },
    { name: 'Sa', house: 4 }, { name: 'Ra', house: 11 }, { name: 'Ke', house: 5 },
  ],
  VrischikaLagna: [
    { name: 'Su', house: 10 }, { name: 'Me', house: 11 },
    { name: 'Mo', house: 9 }, { name: 'Ma', house: 1 },
    { name: 'Ju', house: 2 }, { name: 'Ve', house: 12 },
    { name: 'Sa', house: 3 }, { name: 'Ra', house: 12 }, { name: 'Ke', house: 6 },
  ],
  DhanuLagna: [
    { name: 'Su', house: 9 }, { name: 'Me', house: 10 },
    { name: 'Mo', house: 8 }, { name: 'Ma', house: 12 },
    { name: 'Ju', house: 1 }, { name: 'Ve', house: 11 },
    { name: 'Sa', house: 2 }, { name: 'Ra', house: 1 }, { name: 'Ke', house: 7 },
  ],
  MakaraLagna: [
    { name: 'Su', house: 8 }, { name: 'Me', house: 9 },
    { name: 'Mo', house: 7 }, { name: 'Ma', house: 11 },
    { name: 'Ju', house: 12 }, { name: 'Ve', house: 10 },
    { name: 'Sa', house: 1 }, { name: 'Ra', house: 2 }, { name: 'Ke', house: 8 },
  ],
  KumbhaLagna: [
    { name: 'Su', house: 7 }, { name: 'Me', house: 8 },
    { name: 'Mo', house: 6 }, { name: 'Ma', house: 10 },
    { name: 'Ju', house: 11 }, { name: 'Ve', house: 9 },
    { name: 'Sa', house: 12 }, { name: 'Ra', house: 3 }, { name: 'Ke', house: 9 },
  ],
  MeenaLagna: [
    { name: 'Su', house: 7 }, { name: 'Me', house: 7 },
    { name: 'Mo', house: 5 }, { name: 'Ma', house: 9 },
    { name: 'Ju', house: 10 }, { name: 'Ve', house: 8 },
    { name: 'Sa', house: 11 }, { name: 'Ra', house: 4 }, { name: 'Ke', house: 10 },
  ],
  // Divisional Charts
  Hora: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 2 },
    { name: 'Ma', house: 3 }, { name: 'Me', house: 4 },
    { name: 'Ju', house: 5 }, { name: 'Ve', house: 6 },
    { name: 'Sa', house: 7 }, { name: 'Ra', house: 8 }, { name: 'Ke', house: 9 },
  ],
  Drekkana: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 4 },
    { name: 'Ma', house: 7 }, { name: 'Me', house: 10 },
    { name: 'Ju', house: 2 }, { name: 'Ve', house: 5 },
    { name: 'Sa', house: 8 }, { name: 'Ra', house: 11 }, { name: 'Ke', house: 3 },
  ],
  Chaturthamsha: [
    { name: 'Su', house: 4 }, { name: 'Mo', house: 7 },
    { name: 'Ma', house: 10 }, { name: 'Me', house: 1 },
    { name: 'Ju', house: 5 }, { name: 'Ve', house: 9 },
    { name: 'Sa', house: 12 }, { name: 'Ra', house: 3 }, { name: 'Ke', house: 6 },
  ],
  Saptamamsha: [
    { name: 'Su', house: 7 }, { name: 'Mo', house: 1 },
    { name: 'Ma', house: 4 }, { name: 'Me', house: 10 },
    { name: 'Ju', house: 2 }, { name: 'Ve', house: 8 },
    { name: 'Sa', house: 11 }, { name: 'Ra', house: 5 }, { name: 'Ke', house: 9 },
  ],
  Navamsha: [
    { name: 'Ju', house: 1 }, { name: 'Ve', house: 2 },
    { name: 'Su', house: 5 }, { name: 'Mo', house: 8 },
    { name: 'Ma', house: 10 }, { name: 'Me', house: 11 },
    { name: 'Sa', house: 3 }, { name: 'Ra', house: 4 }, { name: 'Ke', house: 10 },
  ],
  Dashamsha: [
    { name: 'Su', house: 10 }, { name: 'Me', house: 10 },
    { name: 'Mo', house: 11 }, { name: 'Ma', house: 2 },
    { name: 'Ju', house: 4 }, { name: 'Ve', house: 5 },
    { name: 'Sa', house: 7 }, { name: 'Ra', house: 1 }, { name: 'Ke', house: 7 },
  ],
  Dwadashamsha: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 2 },
    { name: 'Ma', house: 3 }, { name: 'Me', house: 4 },
    { name: 'Ju', house: 5 }, { name: 'Ve', house: 6 },
    { name: 'Sa', house: 7 }, { name: 'Ra', house: 8 }, { name: 'Ke', house: 9 },
  ],
  Shodashamsha: [
    { name: 'Su', house: 16 }, { name: 'Mo', house: 1 },
    { name: 'Ma', house: 5 }, { name: 'Me', house: 9 },
    { name: 'Ju', house: 13 }, { name: 'Ve', house: 2 },
    { name: 'Sa', house: 6 }, { name: 'Ra', house: 10 }, { name: 'Ke', house: 14 },
  ],
  Vimshamsha: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 5 },
    { name: 'Ma', house: 9 }, { name: 'Me', house: 13 },
    { name: 'Ju', house: 17 }, { name: 'Ve', house: 2 },
    { name: 'Sa', house: 6 }, { name: 'Ra', house: 10 }, { name: 'Ke', house: 14 },
  ],
  Chaturvimshamsha: [
    { name: 'Ju', house: 1 }, { name: 'Ve', house: 2 },
    { name: 'Su', house: 5 }, { name: 'Mo', house: 8 },
    { name: 'Ma', house: 10 }, { name: 'Me', house: 11 },
    { name: 'Sa', house: 3 }, { name: 'Ra', house: 7 }, { name: 'Ke', house: 12 },
  ],
  Saptavimshamsha: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 7 },
    { name: 'Ma', house: 13 }, { name: 'Me', house: 19 },
    { name: 'Ju', house: 25 }, { name: 'Ve', house: 4 },
    { name: 'Sa', house: 10 }, { name: 'Ra', house: 16 }, { name: 'Ke', house: 22 },
  ],
  Trimsamsha: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 6 },
    { name: 'Ma', house: 11 }, { name: 'Me', house: 16 },
    { name: 'Ju', house: 21 }, { name: 'Ve', house: 26 },
    { name: 'Sa', house: 2 }, { name: 'Ra', house: 12 }, { name: 'Ke', house: 22 },
  ],
  Khavedamsha: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 11 },
    { name: 'Ma', house: 21 }, { name: 'Me', house: 31 },
    { name: 'Ju', house: 40 }, { name: 'Ve', house: 5 },
    { name: 'Sa', house: 15 }, { name: 'Ra', house: 25 }, { name: 'Ke', house: 35 },
  ],
  Akshavedamsha: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 13 },
    { name: 'Ma', house: 25 }, { name: 'Me', house: 37 },
    { name: 'Ju', house: 45 }, { name: 'Ve', house: 5 },
    { name: 'Sa', house: 17 }, { name: 'Ra', house: 29 }, { name: 'Ke', house: 41 },
  ],
  Shashtyamsha: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 2 },
    { name: 'Ma', house: 3 }, { name: 'Me', house: 4 },
    { name: 'Ju', house: 5 }, { name: 'Ve', house: 6 },
    { name: 'Sa', house: 7 }, { name: 'Ra', house: 8 }, { name: 'Ke', house: 9 },
  ],
  ChandraLagna: [
    { name: 'Mo', house: 1 }, { name: 'Ma', house: 4 },
    { name: 'Su', house: 10 }, { name: 'Me', house: 10 },
    { name: 'Ju', house: 6 }, { name: 'Ve', house: 7 },
    { name: 'Sa', house: 9 }, { name: 'Ra', house: 3 }, { name: 'Ke', house: 9 },
  ],
  SuryaLagna: [
    { name: 'Su', house: 1 }, { name: 'Me', house: 1 },
    { name: 'Mo', house: 4 }, { name: 'Ma', house: 7 },
    { name: 'Ju', house: 9 }, { name: 'Ve', house: 10 },
    { name: 'Sa', house: 12 }, { name: 'Ra', house: 6 }, { name: 'Ke', house: 12 },
  ],
  ArudhaLagna: [
    { name: 'Su', house: 1 }, { name: 'Mo', house: 3 },
    { name: 'Ma', house: 5 }, { name: 'Me', house: 7 },
    { name: 'Ju', house: 9 }, { name: 'Ve', house: 11 },
    { name: 'Sa', house: 2 }, { name: 'Ra', house: 4 }, { name: 'Ke', house: 8 },
  ],
};

const MOCK_DASHAS = [
  { planet: 'Jupiter', duration: '2010 - 2026', current: true },
  { planet: 'Saturn', duration: '2026 - 2045', current: false },
  { planet: 'Mercury', duration: '2045 - 2062', current: false },
  { planet: 'Ketu', duration: '2062 - 2069', current: false },
  { planet: 'Venus', duration: '2069 - 2089', current: false },
  { planet: 'Sun', duration: '2089 - 2095', current: false },
  { planet: 'Moon', duration: '2095 - 2105', current: false },
  { planet: 'Mars', duration: '2105 - 2112', current: false },
  { planet: 'Rahu', duration: '2112 - 2130', current: false },
];

const getChartKey = (label: string): ChartKey | null => {
  const map: Record<string, ChartKey> = {
    'Mesha (Aries) Lagna': 'MeshaLagna',
    'Vrishabha (Taurus) Lagna': 'VrishabhaLagna',
    'Mithuna (Gemini) Lagna': 'MithunaLagna',
    'Karka (Cancer) Lagna': 'KarkaLagna',
    'Simha (Leo) Lagna': 'SimhaLagna',
    'Kanya (Virgo) Lagna': 'KanyaLagna',
    'Tula (Libra) Lagna': 'TulaLagna',
    'Vrischika (Scorpio) Lagna': 'VrischikaLagna',
    'Dhanu (Sagittarius) Lagna': 'DhanuLagna',
    'Makara (Capricorn) Lagna': 'MakaraLagna',
    'Kumbha (Aquarius) Lagna': 'KumbhaLagna',
    'Meena (Pisces) Lagna': 'MeenaLagna',
    'Lagna (D1)': 'Lagna',
    'Hora (D2)': 'Hora',
    'Drekkana (D3)': 'Drekkana',
    'Chaturthamsha (D4)': 'Chaturthamsha',
    'Saptamamsha (D7)': 'Saptamamsha',
    'Navamsha (D9)': 'Navamsha',
    'Dashamsha (D10)': 'Dashamsha',
    'Dwadashamsha (D12)': 'Dwadashamsha',
    'Shodashamsha (D16)': 'Shodashamsha',
    'Vimshamsha (D20)': 'Vimshamsha',
    'Chaturvimshamsha (D24)': 'Chaturvimshamsha',
    'Saptavimshamsha (D27)': 'Saptavimshamsha',
    'Trimsamsha (D30)': 'Trimsamsha',
    'Khavedamsha (D40)': 'Khavedamsha',
    'Akshavedamsha (D45)': 'Akshavedamsha',
    'Shashtyamsha (D60)': 'Shashtyamsha',
    'Chandra Lagna': 'ChandraLagna',
    'Surya Lagna': 'SuryaLagna',
    'Arudha Lagna': 'ArudhaLagna',
    'Dashas': 'Lagna',
  };
  return map[label] || null;
};

const getChartTitle = (label: string): string => {
  if (label === 'Dashas') return 'Vimshottari Dasha';
  if (label.includes('Lagna') && !label.includes('(')) return label.replace(' Lagna', '') + ' Lagna Chart';
  if (label.includes('(')) return label.split('(')[0].trim() + ' Chart';
  return label + ' Chart';
};

const KundaliGeneratedScreen = () => {
  const route = useRoute<KundaliGeneratedRouteProp>();
  const { colors } = useTheme();
  const { name, dob, tob, place } = route.params;

  const { width: windowWidth } = Dimensions.get('window');
  // Dynamic size: screen width minus padding (e.g. 64 = 32px on each side), max 360.
  const chartSize = Math.min(windowWidth - 24, 360);

  const [selectedChart, setSelectedChart] = useState('Lagna (D1)');
  const [activeTab, setActiveTab] = useState<'kundli' | 'dasha' | 'panchang'>('kundli');
  const isDashas = selectedChart === 'Dashas';
  const chartKey = getChartKey(selectedChart);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader title="Your Kundali" showBack={true} headerBgColor={colors.primary} headerTextColor="#FFF" />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        {(['kundli', 'dasha', 'panchang'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab ? { color: '#FFF' } : { color: colors.textLight }]}>
              {tab === 'kundli' ? 'Kundli' : tab === 'dasha' ? 'Dasha' : 'Panchang'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <View style={[styles.userInfoCard, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 2 }]}>
          <View style={[styles.userIconBg, { backgroundColor: colors.primary }]}>
            <Icon name="user" size={24} color="#FFF" />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>{name}</Text>
            <Text style={[styles.userInfoText, { color: colors.textLight }]}>{dob} · {tob}</Text>
            <Text style={[styles.userInfoText, { color: colors.textLight }]}>{place}</Text>
          </View>
        </View>

        {activeTab === 'kundli' ? (
          <>
            {/* Dropdown */}
            <CustomDropdown
              label="Select Chart"
              value={selectedChart}
              options={ALL_CHARTS}
              onSelect={setSelectedChart}
            />

            {/* Content Area */}
            <View style={styles.contentArea}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {getChartTitle(selectedChart)}
              </Text>

              {!isDashas && chartKey && MOCK_CHARTS[chartKey] ? (
                <View style={styles.chartWrapper}>
                  <VedicChart planets={MOCK_CHARTS[chartKey]} size={chartSize} showAsc={chartKey === 'Lagna'} />
                </View>
              ) : (
                <View style={styles.dashasContainer}>
                  {MOCK_DASHAS.map((dasha, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dashaItem,
                        { borderBottomColor: colors.border },
                        dasha.current && {
                          backgroundColor: colors.primary + '08',
                          borderLeftColor: colors.primary,
                          borderLeftWidth: 4,
                        },
                      ]}
                    >
                      <View>
                        <Text style={[styles.dashaPlanet, { color: dasha.current ? colors.primary : colors.text }]}>
                          {dasha.planet} Mahadasha
                        </Text>
                        <Text style={[styles.dashaDuration, { color: colors.textLight }]}>{dasha.duration}</Text>
                      </View>
                      {dasha.current && (
                        <View style={[styles.activeBadge, { backgroundColor: colors.primary }]}>
                          <Text style={styles.activeBadgeText}>Current</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.underConstruction}>
            <Icon name="tool" size={40} color={colors.textLight} />
            <Text style={[styles.underConstructionText, { color: colors.textLight }]}>
              {activeTab === 'dasha' ? 'Dasha' : 'Panchang'} Feature Under Construction
            </Text>
            <Text style={[styles.underConstructionSubtext, { color: colors.textLight }]}>
              Coming Soon
            </Text>
          </View>
        )}
      </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 40,
  },
  userInfoCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userInfoText: {
    fontSize: 11,
    marginBottom: 1,
    fontWeight: '500',
  },
  contentArea: {
    borderRadius: 12,
    padding: 12,
    minHeight: 400,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dashasContainer: {
    marginTop: 6,
  },
  dashaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  dashaPlanet: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dashaDuration: {
    fontSize: 11,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  underConstruction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  underConstructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  underConstructionSubtext: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
});

export default KundaliGeneratedScreen;
