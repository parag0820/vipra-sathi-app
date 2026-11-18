import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import ModernVedicChart, { ChartPlanet } from '../components/ModernVedicChart';

type KundaliGeneratedRouteProp = RouteProp<RootStackParamList, 'KundaliGenerated'>;

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_PINK_BG = '#FFF5F5';
const SOFT_ROSE_BG = '#FFF0ED';
const BORDER_COLOR = '#E5E7EB';
const SUBTLE_BORDER = '#F3F4F6';
const MUTED_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const INFO_BG = '#F3F6FA';
const INFO_BORDER = '#E2E8F0';
const INFO_TEXT = '#475569';

interface ChartOption {
  id: string;
  shortLabel: string;
  fullLabel: string;
  lagnaSign: number;
  planets: ChartPlanet[];
}

const CHART_OPTIONS: ChartOption[] = [
  {
    id: 'D1',
    shortLabel: 'D1 • जन्म कुंडली',
    fullLabel: 'D1 • जन्म / राशि कुंडली',
    lagnaSign: 1,
    planets: [
      { name: 'Ma', house: 1 },
      { name: 'Me', house: 1 },
      { name: 'Ju', house: 5 },
      { name: 'Ra', house: 6 },
      { name: 'Su', house: 7 },
      { name: 'Mo', house: 7 },
      { name: 'Ke', house: 10 },
      { name: 'Sa', house: 11 },
      { name: 'Ve', house: 12 },
    ],
  },
  {
    id: 'D2',
    shortLabel: 'D2 • होरा कुंडली',
    fullLabel: 'D2 • होरा कुंडली',
    lagnaSign: 4,
    planets: [
      { name: 'Su', house: 1 },
      { name: 'Mo', house: 2 },
      { name: 'Ma', house: 3 },
      { name: 'Me', house: 4 },
      { name: 'Ju', house: 5 },
      { name: 'Ve', house: 6 },
      { name: 'Sa', house: 7 },
      { name: 'Ra', house: 8 },
      { name: 'Ke', house: 9 },
    ],
  },
  {
    id: 'D3',
    shortLabel: 'D3 • द्रेष्काण कुंडली',
    fullLabel: 'D3 • द्रेष्काण कुंडली',
    lagnaSign: 5,
    planets: [
      { name: 'Su', house: 1 },
      { name: 'Mo', house: 4 },
      { name: 'Ma', house: 7 },
      { name: 'Me', house: 10 },
      { name: 'Ju', house: 2 },
      { name: 'Ve', house: 5 },
      { name: 'Sa', house: 8 },
      { name: 'Ra', house: 11 },
      { name: 'Ke', house: 3 },
    ],
  },
  {
    id: 'D4',
    shortLabel: 'D4 • चतुर्थांश कुंडली',
    fullLabel: 'D4 • चतुर्थांश कुंडली',
    lagnaSign: 10,
    planets: [
      { name: 'Su', house: 4 },
      { name: 'Mo', house: 7 },
      { name: 'Ma', house: 10 },
      { name: 'Me', house: 1 },
      { name: 'Ju', house: 5 },
      { name: 'Ve', house: 9 },
      { name: 'Sa', house: 12 },
      { name: 'Ra', house: 3 },
      { name: 'Ke', house: 6 },
    ],
  },
  {
    id: 'D7',
    shortLabel: 'D7 • सप्तमांश कुंडली',
    fullLabel: 'D7 • सप्तमांश कुंडली',
    lagnaSign: 7,
    planets: [
      { name: 'Su', house: 7 },
      { name: 'Mo', house: 1 },
      { name: 'Ma', house: 4 },
      { name: 'Me', house: 10 },
      { name: 'Ju', house: 2 },
      { name: 'Ve', house: 8 },
      { name: 'Sa', house: 11 },
      { name: 'Ra', house: 5 },
      { name: 'Ke', house: 9 },
    ],
  },
  {
    id: 'D9',
    shortLabel: 'D9 • नवांश कुंडली',
    fullLabel: 'D9 • नवांश कुंडली',
    lagnaSign: 9,
    planets: [
      { name: 'Ju', house: 1 },
      { name: 'Ve', house: 2 },
      { name: 'Su', house: 5 },
      { name: 'Mo', house: 8 },
      { name: 'Ma', house: 10 },
      { name: 'Me', house: 11 },
      { name: 'Sa', house: 3 },
      { name: 'Ra', house: 4 },
      { name: 'Ke', house: 10 },
    ],
  },
  {
    id: 'D10',
    shortLabel: 'D10 • दशमांश कुंडली',
    fullLabel: 'D10 • दशमांश कुंडली',
    lagnaSign: 10,
    planets: [
      { name: 'Su', house: 10 },
      { name: 'Me', house: 10 },
      { name: 'Mo', house: 11 },
      { name: 'Ma', house: 2 },
      { name: 'Ju', house: 4 },
      { name: 'Ve', house: 5 },
      { name: 'Sa', house: 7 },
      { name: 'Ra', house: 1 },
      { name: 'Ke', house: 7 },
    ],
  },
  {
    id: 'D12',
    shortLabel: 'D12 • द्वादशांश कुंडली',
    fullLabel: 'D12 • द्वादशांश कुंडली',
    lagnaSign: 2,
    planets: [
      { name: 'Su', house: 1 },
      { name: 'Mo', house: 2 },
      { name: 'Ma', house: 3 },
      { name: 'Me', house: 4 },
      { name: 'Ju', house: 5 },
      { name: 'Ve', house: 6 },
      { name: 'Sa', house: 7 },
      { name: 'Ra', house: 8 },
      { name: 'Ke', house: 9 },
    ],
  },
];

const VIMSHOTTARI_DASHAS = [
  { id: 'ketu', planet: 'केतु', years: 7, duration: '7 वर्ष', start: '—', end: '—' },
  { id: 'shukra', planet: 'शुक्र', years: 20, duration: '20 वर्ष', start: '—', end: '—' },
  { id: 'surya', planet: 'सूर्य', years: 6, duration: '6 वर्ष', start: '—', end: '—' },
  { id: 'chandra', planet: 'चन्द्र', years: 10, duration: '10 वर्ष', start: '—', end: '—' },
  { id: 'mangal', planet: 'मंगल', years: 7, duration: '7 वर्ष', start: '—', end: '—' },
  { id: 'rahu', planet: 'राहु', years: 18, duration: '18 वर्ष', start: '—', end: '—' },
  { id: 'guru', planet: 'गुरु', years: 16, duration: '16 वर्ष', start: '—', end: '—' },
  { id: 'shani', planet: 'शनि', years: 19, duration: '19 वर्ष', start: '—', end: '—' },
  { id: 'budh', planet: 'बुध', years: 17, duration: '17 वर्ष', start: '—', end: '—' },
];

const PLANET_POSITIONS = [
  { planet: 'सूर्य', rashi: 'मकर', degree: "03°14'", nakshatra: 'उ.षाढ़ा', bhava: '1', strength: '82% • बलवान', aspect: '7वीं दृष्टि', retro: 'मार्गी • सामान्य', pada: 'चरण 2 (सूर्य)' },
  { planet: 'चन्द्र', rashi: 'धनु', degree: "08°22'", nakshatra: 'मूल', bhava: '12', strength: '74% • मध्यम', aspect: '7वीं दृष्टि', retro: 'मार्गी • सामान्य', pada: 'चरण 3 (केतु)' },
  { planet: 'मंगल', rashi: 'मकर', degree: "16°40'", nakshatra: 'श्रवण', bhava: '1', strength: '91% • उच्च', aspect: '4, 7, 8वीं दृष्टि', retro: 'मार्गी • सामान्य', pada: 'चरण 2 (चन्द्र)' },
  { planet: 'बुध', rashi: 'मकर', degree: "12°08'", nakshatra: 'श्रवण', bhava: '1', strength: '68% • मित्र', aspect: '7वीं दृष्टि', retro: 'मार्गी • अस्त', pada: 'चरण 1 (चन्द्र)' },
  { planet: 'गुरु', rashi: 'धनु', degree: "09°11'", nakshatra: 'मूल', bhava: '12', strength: '88% • स्वगृही', aspect: '5, 7, 9वीं दृष्टि', retro: 'मार्गी • सामान्य', pada: 'चरण 3 (केतु)' },
  { planet: 'शुक्र', rashi: 'कुम्भ', degree: "05°36'", nakshatra: 'धनिष्ठा', bhava: '2', strength: '79% • मित्र', aspect: '7वीं दृष्टि', retro: 'मार्गी • सामान्य', pada: 'चरण 4 (मंगल)' },
  { planet: 'शनि', rashi: 'कुम्भ', degree: "27°20'", nakshatra: 'पू.भाद्र', bhava: '2', strength: '86% • स्वगृही', aspect: '3, 7, 10वीं दृष्टि', retro: 'वक्री • सामान्य', pada: 'चरण 3 (गुरु)' },
  { planet: 'राहु', rashi: 'कन्या', degree: "23°18'", nakshatra: 'चित्रा', bhava: '9', strength: '65% • सम', aspect: '5, 7, 9वीं दृष्टि', retro: 'सदैव वक्री', pada: 'चरण 1 (मंगल)' },
  { planet: 'केतु', rashi: 'मीन', degree: "23°18'", nakshatra: 'रेवती', bhava: '3', strength: '64% • सम', aspect: '5, 7, 9वीं दृष्टि', retro: 'सदैव वक्री', pada: 'चरण 2 (बुध)' },
];

const PLANET_LEGEND = [
  { short: 'सू', full: 'सूर्य' },
  { short: 'चं', full: 'चन्द्र' },
  { short: 'मं', full: 'मंगल' },
  { short: 'बु', full: 'बुध' },
  { short: 'गु', full: 'गुरु' },
  { short: 'शु', full: 'शुक्र' },
  { short: 'श', full: 'शनि' },
  { short: 'रा', full: 'राहु' },
  { short: 'के', full: 'केतु' },
];

type MainTabType = 'basic' | 'kundli' | 'dasha' | 'planets';

const KundaliGeneratedScreen: React.FC = () => {
  const route = useRoute<KundaliGeneratedRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const { name, dob, tob, place } = route.params || {
    name: 'आदित्य मिश्रा',
    dob: '18/01/1996',
    tob: '06:45 AM',
    place: 'प्रयागराज, उत्तर प्रदेश, भारत',
  };

  const { width: windowWidth } = Dimensions.get('window');
  const chartSize = Math.min(windowWidth - 52, 320);

  const [activeTab, setActiveTab] = useState<MainTabType>('basic');

  // Kundli tab state
  const [selectedChartId, setSelectedChartId] = useState<string>('D1');
  const [chartDropdownOpen, setChartDropdownOpen] = useState<boolean>(false);
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');

  // Basic tab accordion
  const [janmaksharExpanded, setJanmaksharExpanded] = useState<boolean>(false);

  // Dasha tab state
  const [dashaSystem, setDashaSystem] = useState<string>('विंशोत्तरी दशा');
  const [dashaDropdownOpen, setDashaDropdownOpen] = useState<boolean>(false);
  const [dashaLevel, setDashaLevel] = useState<'mahadasha' | 'antardasha' | 'pratyantar'>('mahadasha');
  const [selectedMahadasha, setSelectedMahadasha] = useState<string | null>(null);

  // Planetary Positions tab state
  const [planetDropdownOpen, setPlanetDropdownOpen] = useState<boolean>(false);
  const [expandedPlanetAccordion, setExpandedPlanetAccordion] = useState<string | null>(null);

  const currentChart = CHART_OPTIONS.find((c) => c.id === selectedChartId) || CHART_OPTIONS[0];

  const bgMain = isDark ? '#121212' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#262626' : '#F9FAFB';
  const borderDynamic = isDark ? '#333333' : BORDER_COLOR;
  const lineDivider = isDark ? '#2D2D2D' : SUBTLE_BORDER;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `जन्म कुंडली - ${name}\nजन्म तिथि: ${dob} | समय: ${tob}\nस्थान: ${place}\nलग्न: मकर | चन्द्र राशि: धनु | नक्षत्र: मूल (चरण 2)`,
      });
    } catch (error) {
      // ignore cancel
    }
  };

  const handleExport = () => {
    Alert.alert(
      'कुंडली एक्सपोर्ट',
      `${name} की जन्म कुंडली PDF रिपोर्ट के रूप में तैयार की जा रही है।`
    );
  };

  const getSubDashas = (mahaPlanet: string) => {
    const startIdx = VIMSHOTTARI_DASHAS.findIndex((d) => d.planet === mahaPlanet);
    if (startIdx === -1) return [];
    const rotated = [
      ...VIMSHOTTARI_DASHAS.slice(startIdx),
      ...VIMSHOTTARI_DASHAS.slice(0, startIdx),
    ];
    return rotated.slice(0, 5).map((sub) => ({
      maha: mahaPlanet,
      antar: sub.planet,
      pratyantar: `${sub.planet} (${sub.duration})`,
    }));
  };

  const togglePlanetAccordion = (key: string) => {
    setExpandedPlanetAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgMain}
      />

      {/* Top Header Bar */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: bgMain,
            borderBottomColor: borderDynamic,
            paddingTop: Math.max(insets.top, 8),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={24} color={PRIMARY_MAROON} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>जन्म कुंडली</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="edit-2" size={16} color={PRIMARY_MAROON} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 18 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Person Summary Strip */}
        <View
          style={[
            styles.personCard,
            { backgroundColor: cardBg, borderColor: borderDynamic },
          ]}
        >
          <View style={styles.personTopRow}>
            <Icon name="user" size={14} color={textSecondary} style={{ marginRight: 6 }} />
            <Text style={[styles.personName, { color: textPrimary }]} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View style={styles.personMetaRow}>
            <View style={styles.metaChip}>
              <Icon name="calendar" size={11} color={textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.metaText, { color: textSecondary }]}>{dob}</Text>
            </View>
            <View style={styles.metaChip}>
              <Icon name="clock" size={11} color={textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.metaText, { color: textSecondary }]}>{tob}</Text>
            </View>
            <View style={[styles.metaChip, { flex: 1 }]}>
              <Icon name="map-pin" size={11} color={textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.metaText, { color: textSecondary }]} numberOfLines={1}>
                {place}
              </Text>
            </View>
          </View>
        </View>

        {/* 4-Tab Bar (Panchang-style Underline Tabs) */}
        <View style={[styles.tabBar, { borderBottomColor: borderDynamic }]}>
          <View style={styles.tabsRow}>
            {[
              { id: 'basic', label: 'मूल विवरण' },
              { id: 'kundli', label: 'कुंडली' },
              { id: 'dasha', label: 'दशा' },
              { id: 'planets', label: 'ग्रह स्थिति' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabBtn,
                    isActive && { borderBottomColor: isDark ? '#FCA5A5' : PRIMARY_MAROON },
                  ]}
                  onPress={() => {
                    setActiveTab(tab.id as MainTabType);
                    setChartDropdownOpen(false);
                    setDashaDropdownOpen(false);
                    setPlanetDropdownOpen(false);
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      isActive && styles.tabBtnTextActive,
                      {
                        color: isActive
                          ? isDark
                            ? '#FCA5A5'
                            : PRIMARY_MAROON
                          : textSecondary,
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
        </View>

        {/* Demo Disclaimer Strip */}
        <View
          style={[
            styles.demoBanner,
            {
              backgroundColor: isDark ? '#1C222B' : INFO_BG,
              borderColor: isDark ? '#2D3748' : INFO_BORDER,
            },
          ]}
        >
          <Icon
            name="info"
            size={12}
            color={isDark ? '#94A3B8' : INFO_TEXT}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.demoBannerText, { color: isDark ? '#CBD5E1' : INFO_TEXT }]}>
            डेमो विवरण • वास्तविक गणना नहीं।
          </Text>
        </View>

        {/* ============================================================
            TAB 1: मूल विवरण (BASIC DETAILS)
           ============================================================ */}
        {activeTab === 'basic' && (
          <View>
            {/* Card 1: जन्म विवरण */}
            <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}>
              <View style={[styles.sectionHeader, { borderBottomColor: lineDivider }]}>
                <Icon name="user" size={13} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderText}>जन्म विवरण</Text>
              </View>
              {[
                { k: 'पूरा नाम', v: name },
                { k: 'जन्म तिथि', v: dob },
                { k: 'जन्म समय', v: `${tob} (IST)` },
                { k: 'जन्म स्थान', v: place },
                { k: 'अक्षांश (Latitude)', v: '25.44° N' },
                { k: 'देशांतर (Longitude)', v: '81.85° E' },
                { k: 'समय क्षेत्र (Timezone)', v: 'IST (UTC+05:30)' },
              ].map((row, idx, arr) => (
                <View
                  key={row.k}
                  style={[
                    styles.kvRow,
                    {
                      borderBottomColor: lineDivider,
                      borderBottomWidth: idx === arr.length - 1 ? 0 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.kvKey, { color: textSecondary }]}>{row.k}</Text>
                  <Text style={[styles.kvVal, { color: textPrimary }]} numberOfLines={1}>
                    {row.v}
                  </Text>
                </View>
              ))}
            </View>

            {/* Card 2: पंचांग विवरण */}
            <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}>
              <View style={[styles.sectionHeader, { borderBottomColor: lineDivider }]}>
                <Icon name="calendar" size={13} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderText}>पंचांग विवरण</Text>
              </View>
              {[
                { k: 'वार', v: 'गुरुवार' },
                { k: 'तिथि', v: 'कृष्ण त्रयोदशी' },
                { k: 'नक्षत्र', v: 'मूल (चरण 2)' },
                { k: 'योग', v: 'ध्रुव' },
                { k: 'करण', v: 'वणिज' },
              ].map((row, idx, arr) => (
                <View
                  key={row.k}
                  style={[
                    styles.kvRow,
                    {
                      borderBottomColor: lineDivider,
                      borderBottomWidth: idx === arr.length - 1 ? 0 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.kvKey, { color: textSecondary }]}>{row.k}</Text>
                  <Text style={[styles.kvVal, { color: textPrimary }]}>{row.v}</Text>
                </View>
              ))}
            </View>

            {/* Card 3: ज्योतिषीय विवरण */}
            <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}>
              <View style={[styles.sectionHeader, { borderBottomColor: lineDivider }]}>
                <Icon name="sun" size={13} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderText}>ज्योतिषीय विवरण</Text>
              </View>
              {[
                { k: 'लग्न', v: 'मकर' },
                { k: 'चन्द्र राशि', v: 'धनु' },
                { k: 'सूर्य राशि', v: 'मकर' },
                { k: 'राशि स्वामी', v: 'गुरु' },
                { k: 'नक्षत्र स्वामी', v: 'केतु' },
                { k: 'अयनांश', v: 'लाहिड़ी (डिफ़ॉल्ट)' },
              ].map((row, idx, arr) => (
                <View
                  key={row.k}
                  style={[
                    styles.kvRow,
                    {
                      borderBottomColor: lineDivider,
                      borderBottomWidth: idx === arr.length - 1 ? 0 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.kvKey, { color: textSecondary }]}>{row.k}</Text>
                  <Text style={[styles.kvVal, { color: textPrimary }]}>{row.v}</Text>
                </View>
              ))}
            </View>

            {/* Accordion: जन्माक्षर एवं अन्य विवरण */}
            <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setJanmaksharExpanded(!janmaksharExpanded)}
                activeOpacity={0.75}
              >
                <View style={styles.accordionLeft}>
                  <Icon name="file-text" size={13} color={PRIMARY_MAROON} style={{ marginRight: 8 }} />
                  <Text style={[styles.accordionTitle, { color: textPrimary }]}>
                    जन्माक्षर एवं अन्य विवरण
                  </Text>
                </View>
                <Icon
                  name={janmaksharExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={textSecondary}
                />
              </TouchableOpacity>
              {janmaksharExpanded && (
                <View style={[styles.accordionBody, { borderTopColor: lineDivider }]}>
                  {[
                    { k: 'वर्ण / वश्य', v: 'क्षत्रिय / नर' },
                    { k: 'योनि / गण', v: 'श्वान / राक्षस' },
                    { k: 'नाड़ी / पाया', v: 'आद्य / रजत' },
                    { k: 'नामाक्षर', v: 'ये, यो, भा, भी' },
                  ].map((row, idx, arr) => (
                    <View
                      key={row.k}
                      style={[
                        styles.kvRow,
                        {
                          borderBottomColor: lineDivider,
                          borderBottomWidth: idx === arr.length - 1 ? 0 : 1,
                        },
                      ]}
                    >
                      <Text style={[styles.kvKey, { color: textSecondary }]}>{row.k}</Text>
                      <Text style={[styles.kvVal, { color: textPrimary }]}>{row.v}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* ============================================================
            TAB 2: कुंडली (KUNDLI CHARTS)
           ============================================================ */}
        {activeTab === 'kundli' && (
          <View style={styles.kundliTabWrap}>
            {/* Controls Row: Chart Dropdown + North/South Toggle */}
            <View style={styles.chartControlsRow}>
              {/* Chart Selector Button */}
              <TouchableOpacity
                style={[
                  styles.dropdownTrigger,
                  { backgroundColor: cardBg, borderColor: borderDynamic },
                ]}
                onPress={() => setChartDropdownOpen(!chartDropdownOpen)}
                activeOpacity={0.75}
              >
                <Text style={[styles.dropdownTriggerText, { color: textPrimary }]} numberOfLines={1}>
                  {currentChart.shortLabel}
                </Text>
                <Icon
                  name={chartDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={textPrimary}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>

              {/* North / South Toggle */}
              <View style={styles.styleToggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.styleToggleBtn,
                    chartStyle === 'north'
                      ? { backgroundColor: PRIMARY_MAROON, borderColor: PRIMARY_MAROON }
                      : { backgroundColor: cardBg, borderColor: PRIMARY_MAROON },
                  ]}
                  onPress={() => setChartStyle('north')}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.styleToggleText,
                      { color: chartStyle === 'north' ? '#FFFFFF' : PRIMARY_MAROON },
                    ]}
                  >
                    उत्तर भारतीय
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.styleToggleBtn,
                    chartStyle === 'south'
                      ? { backgroundColor: PRIMARY_MAROON, borderColor: PRIMARY_MAROON }
                      : { backgroundColor: cardBg, borderColor: PRIMARY_MAROON },
                  ]}
                  onPress={() => setChartStyle('south')}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.styleToggleText,
                      { color: chartStyle === 'south' ? '#FFFFFF' : PRIMARY_MAROON },
                    ]}
                  >
                    दक्षिण भारतीय
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Inline / Overlay Dropdown Menu (Matches Image 1 Left Panel) */}
            {chartDropdownOpen && (
              <View
                style={[
                  styles.dropdownMenu,
                  { backgroundColor: cardBg, borderColor: borderDynamic },
                ]}
              >
                {CHART_OPTIONS.map((opt, idx) => {
                  const selected = opt.id === selectedChartId;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.dropdownItem,
                        {
                          borderBottomColor: lineDivider,
                          borderBottomWidth: idx === CHART_OPTIONS.length - 1 ? 0 : 1,
                          backgroundColor: selected
                            ? isDark
                              ? '#2B1616'
                              : SOFT_PINK_BG
                            : 'transparent',
                        },
                      ]}
                      onPress={() => {
                        setSelectedChartId(opt.id);
                        setChartDropdownOpen(false);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: selected ? PRIMARY_MAROON : textPrimary,
                            fontWeight: selected ? '700' : '500',
                          },
                        ]}
                      >
                        {opt.fullLabel}
                      </Text>
                      {selected && <Icon name="check" size={14} color={PRIMARY_MAROON} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Chart Box */}
            <View
              style={[
                styles.chartBoxCard,
                { backgroundColor: cardBg, borderColor: borderDynamic },
              ]}
            >
              <ModernVedicChart
                planets={currentChart.planets}
                lagnaSign={currentChart.lagnaSign}
                chartStyle={chartStyle}
                size={chartSize}
                isDark={isDark}
                centerLabel={currentChart.id}
              />
            </View>

            {/* Legend Card Below Chart */}
            <View
              style={[
                styles.legendCard,
                { backgroundColor: cardBg, borderColor: borderDynamic },
              ]}
            >
              <View style={[styles.legendHeader, { borderBottomColor: lineDivider }]}>
                <Text style={styles.legendTitle}>
                  {currentChart.fullLabel.replace('D1 • ', '')}
                </Text>
              </View>
              <View style={styles.legendGrid}>
                {PLANET_LEGEND.map((item) => (
                  <View key={item.short} style={styles.legendItem}>
                    <Text style={styles.legendShort}>{item.short}</Text>
                    <Text style={[styles.legendFull, { color: textSecondary }]}>
                      {item.full}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ============================================================
            TAB 3: दशा (DASHA)
           ============================================================ */}
        {activeTab === 'dasha' && (
          <View>
            {/* Card 1: दशा विवरण */}
            <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}>
              <View style={[styles.sectionHeader, { borderBottomColor: lineDivider }]}>
                <Icon name="settings" size={13} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderText}>दशा विवरण</Text>
              </View>

              {/* Dasha System Row */}
              <View style={styles.dashaSystemRow}>
                <Text style={[styles.dashaSystemLabel, { color: textSecondary }]}>
                  दशा पद्धति
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dashaSelectPill,
                    { backgroundColor: subtleBg, borderColor: borderDynamic },
                  ]}
                  onPress={() => setDashaDropdownOpen(!dashaDropdownOpen)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.dashaSelectText, { color: textPrimary }]}>
                    {dashaSystem}
                  </Text>
                  <Icon name="chevron-down" size={13} color={textSecondary} />
                </TouchableOpacity>
              </View>

              {dashaDropdownOpen && (
                <View
                  style={[
                    styles.dashaDropdownList,
                    { backgroundColor: cardBg, borderColor: borderDynamic },
                  ]}
                >
                  {['विंशोत्तरी दशा', 'योगिनी दशा', 'अष्टोत्तरी दशा'].map((sys) => (
                    <TouchableOpacity
                      key={sys}
                      style={[
                        styles.dropdownItem,
                        { borderBottomColor: lineDivider, borderBottomWidth: 1 },
                      ]}
                      onPress={() => {
                        setDashaSystem(sys);
                        setDashaDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: dashaSystem === sys ? PRIMARY_MAROON : textPrimary,
                            fontWeight: dashaSystem === sys ? '700' : '500',
                          },
                        ]}
                      >
                        {sys}
                      </Text>
                      {dashaSystem === sys && (
                        <Icon name="check" size={13} color={PRIMARY_MAROON} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Level Tabs (Panchang-style Underline): महादशा | अंतर्दशा | प्रत्यंतर */}
              <View style={[styles.dashaTabBar, { borderBottomColor: lineDivider }]}>
                <View style={styles.dashaLevelRow}>
                  {[
                    { id: 'mahadasha', label: 'महादशा' },
                    { id: 'antardasha', label: 'अंतर्दशा' },
                    { id: 'pratyantar', label: 'प्रत्यंतर' },
                  ].map((lvl) => {
                    const active = dashaLevel === lvl.id;
                    return (
                      <TouchableOpacity
                        key={lvl.id}
                        style={[
                          styles.dashaLevelPill,
                          active && { borderBottomColor: isDark ? '#FCA5A5' : PRIMARY_MAROON },
                        ]}
                        onPress={() => setDashaLevel(lvl.id as any)}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            styles.dashaLevelText,
                            active && styles.dashaLevelTextActive,
                            {
                              color: active
                                ? isDark
                                  ? '#FCA5A5'
                                  : PRIMARY_MAROON
                                : textSecondary,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {lvl.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Tap Hint */}
              <View style={styles.dashaHintRow}>
                <Icon name="info" size={11} color={textSecondary} style={{ marginRight: 5 }} />
                <Text style={[styles.dashaHintText, { color: textSecondary }]}>
                  किसी दशा पर टैप करके उपदशाएँ देखें।
                </Text>
              </View>

              {/* Table Header */}
              <View style={[styles.tableHeaderRow, { backgroundColor: subtleBg, borderColor: lineDivider }]}>
                <Text style={[styles.tableHeadText, { flex: 1.1, color: textPrimary }]}>ग्रह</Text>
                <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center', color: textPrimary }]}>आरंभ</Text>
                <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center', color: textPrimary }]}>समाप्ति</Text>
                <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: textPrimary }]}>अवधि</Text>
                <View style={{ width: 18 }} />
              </View>

              {/* Dasha Rows */}
              {VIMSHOTTARI_DASHAS.map((item, idx) => {
                const isSelected = selectedMahadasha === item.planet;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.tableDataRow,
                      {
                        borderBottomColor: lineDivider,
                        borderBottomWidth: idx === VIMSHOTTARI_DASHAS.length - 1 ? 0 : 1,
                        backgroundColor: isSelected
                          ? isDark
                            ? '#2B1616'
                            : SOFT_PINK_BG
                          : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      setSelectedMahadasha(
                        isSelected ? null : item.planet
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tableCellBold,
                        {
                          flex: 1.1,
                          color: isSelected ? PRIMARY_MAROON : textPrimary,
                        },
                      ]}
                    >
                      {item.planet}
                    </Text>
                    <Text style={[styles.tableCellMuted, { flex: 1, textAlign: 'center', color: textSecondary }]}>
                      {item.start}
                    </Text>
                    <Text style={[styles.tableCellMuted, { flex: 1, textAlign: 'center', color: textSecondary }]}>
                      {item.end}
                    </Text>
                    <Text style={[styles.tableCellDark, { flex: 1, textAlign: 'right', color: textPrimary }]}>
                      {item.duration}
                    </Text>
                    <View style={{ width: 18, alignItems: 'flex-end' }}>
                      <Icon
                        name="chevron-right"
                        size={12}
                        color={isSelected ? PRIMARY_MAROON : textSecondary}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Card 2: उपदशा विवरण */}
            <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}>
              <View style={[styles.sectionHeader, { borderBottomColor: lineDivider }]}>
                <Icon name="file-text" size={13} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderText}>उपदशा विवरण</Text>
              </View>

              <Text style={[styles.subDashaHint, { color: textSecondary }]}>
                {selectedMahadasha
                  ? `${selectedMahadasha} महादशा की प्रमुख अंतर्दशाएँ:`
                  : 'महादशा चुनने पर उसकी अंतर्दशाएँ यहाँ दिखेंगी।'}
              </Text>

              {/* Sub-dasha Table Header */}
              <View style={[styles.tableHeaderRow, { backgroundColor: subtleBg, borderColor: lineDivider }]}>
                <Text style={[styles.tableHeadText, { flex: 1, color: textPrimary }]}>महादशा</Text>
                <Text style={[styles.tableHeadText, { flex: 1, color: textPrimary }]}>अंतर्दशा</Text>
                <Text style={[styles.tableHeadText, { flex: 1.2, color: textPrimary }]}>प्रत्यंतर</Text>
                <View style={{ width: 16 }} />
              </View>

              {selectedMahadasha ? (
                getSubDashas(selectedMahadasha).map((sub, i, arr) => (
                  <View
                    key={`${sub.maha}-${sub.antar}`}
                    style={[
                      styles.tableDataRow,
                      {
                        borderBottomColor: lineDivider,
                        borderBottomWidth: i === arr.length - 1 ? 0 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.tableCellDark, { flex: 1, color: textPrimary }]}>{sub.maha}</Text>
                    <Text style={[styles.tableCellBold, { flex: 1, color: PRIMARY_MAROON }]}>{sub.antar}</Text>
                    <Text style={[styles.tableCellMuted, { flex: 1.2, color: textSecondary }]}>{sub.pratyantar}</Text>
                    <View style={{ width: 16, alignItems: 'flex-end' }}>
                      <Icon name="chevron-right" size={11} color={textSecondary} />
                    </View>
                  </View>
                ))
              ) : (
                [0, 1, 2].map((emptyRow) => (
                  <View
                    key={`empty-${emptyRow}`}
                    style={[
                      styles.tableDataRow,
                      {
                        borderBottomColor: lineDivider,
                        borderBottomWidth: emptyRow === 2 ? 0 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.tableCellMuted, { flex: 1, color: textSecondary }]}>—</Text>
                    <Text style={[styles.tableCellMuted, { flex: 1, color: textSecondary }]}>—</Text>
                    <Text style={[styles.tableCellMuted, { flex: 1.2, color: textSecondary }]}>—</Text>
                    <View style={{ width: 16, alignItems: 'flex-end' }}>
                      <Icon name="chevron-right" size={11} color={textSecondary} />
                    </View>
                  </View>
                ))
              )}

              <View style={[styles.subDashaFooterNote, { borderTopColor: lineDivider }]}>
                <Icon name="info" size={11} color={textSecondary} style={{ marginRight: 5 }} />
                <Text style={[styles.dashaHintText, { color: textSecondary }]}>
                  अवधि और तिथियाँ जन्म विवरण के अनुसार गणना के बाद दिखेंगी।
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================
            TAB 4: ग्रह स्थिति (PLANETARY POSITIONS)
           ============================================================ */}
        {activeTab === 'planets' && (
          <View>
            {/* Planetary Table Card */}
            <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}>
              <TouchableOpacity
                style={[styles.planetCardDropdownHeader, { borderBottomColor: lineDivider }]}
                onPress={() => setPlanetDropdownOpen(!planetDropdownOpen)}
                activeOpacity={0.75}
              >
                <View style={styles.accordionLeft}>
                  <Icon name="bar-chart-2" size={13} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
                  <Text style={styles.sectionHeaderText}>
                    {currentChart.fullLabel.replace('•', '-')}
                  </Text>
                </View>
                <Icon
                  name={planetDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={15}
                  color={textSecondary}
                />
              </TouchableOpacity>

              {planetDropdownOpen && (
                <View
                  style={[
                    styles.dashaDropdownList,
                    { backgroundColor: cardBg, borderColor: borderDynamic, marginHorizontal: 10 },
                  ]}
                >
                  {CHART_OPTIONS.slice(0, 6).map((opt) => (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.dropdownItem,
                        { borderBottomColor: lineDivider, borderBottomWidth: 1 },
                      ]}
                      onPress={() => {
                        setSelectedChartId(opt.id);
                        setPlanetDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: opt.id === selectedChartId ? PRIMARY_MAROON : textPrimary,
                            fontWeight: opt.id === selectedChartId ? '700' : '500',
                          },
                        ]}
                      >
                        {opt.fullLabel}
                      </Text>
                      {opt.id === selectedChartId && (
                        <Icon name="check" size={13} color={PRIMARY_MAROON} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.planetDemoCaption, { color: textSecondary }]}>
                यह एक डेमो कुंडली है। वास्तविक गणना नहीं।
              </Text>

              {/* 5-Col Header */}
              <View style={[styles.tableHeaderRow, { backgroundColor: subtleBg, borderColor: lineDivider }]}>
                <Text style={[styles.tableHeadText, { flex: 1.1, color: textPrimary }]}>ग्रह</Text>
                <Text style={[styles.tableHeadText, { flex: 1, color: textPrimary }]}>राशि</Text>
                <Text style={[styles.tableHeadText, { flex: 1, color: textPrimary }]}>अंश</Text>
                <Text style={[styles.tableHeadText, { flex: 1.1, color: textPrimary }]}>नक्षत्र</Text>
                <Text style={[styles.tableHeadText, { flex: 0.6, textAlign: 'center', color: textPrimary }]}>भाव</Text>
              </View>

              {/* 9 Rows */}
              {PLANET_POSITIONS.map((row, idx, arr) => (
                <View
                  key={row.planet}
                  style={[
                    styles.tableDataRow,
                    {
                      borderBottomColor: lineDivider,
                      borderBottomWidth: idx === arr.length - 1 ? 0 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.tableCellBold, { flex: 1.1, color: textPrimary }]}>
                    {row.planet}
                  </Text>
                  <Text style={[styles.tableCellDark, { flex: 1, color: textPrimary }]}>
                    {row.rashi}
                  </Text>
                  <Text style={[styles.tableCellMuted, { flex: 1, color: textSecondary }]}>
                    {row.degree}
                  </Text>
                  <Text style={[styles.tableCellDark, { flex: 1.1, color: textPrimary }]} numberOfLines={1}>
                    {row.nakshatra}
                  </Text>
                  <Text style={[styles.tableCellDark, { flex: 0.6, textAlign: 'center', color: textPrimary }]}>
                    {row.bhava}
                  </Text>
                </View>
              ))}
            </View>

            {/* 4 Expandable Detail Accordions */}
            {[
              {
                key: 'strength',
                icon: 'bar-chart-2',
                title: 'ग्रह बल एवं अवस्था',
                subtitle: 'प्रत्येक ग्रह का बल, अवस्था और स्थिति विवरण।',
                getVal: (p: (typeof PLANET_POSITIONS)[0]) => p.strength,
              },
              {
                key: 'aspect',
                icon: 'eye',
                title: 'दृष्टि एवं युति',
                subtitle: 'ग्रहों की दृष्टि और प्रमुख युति विवरण।',
                getVal: (p: (typeof PLANET_POSITIONS)[0]) => p.aspect,
              },
              {
                key: 'retro',
                icon: 'refresh-cw',
                title: 'वक्री एवं अस्त विवरण',
                subtitle: 'वक्री (Retrograde) और अस्त (Combust) ग्रहों की जानकारी।',
                getVal: (p: (typeof PLANET_POSITIONS)[0]) => p.retro,
              },
              {
                key: 'nakshatra',
                icon: 'star',
                title: 'नक्षत्र चरण एवं स्वामी',
                subtitle: 'प्रत्येक ग्रह का नक्षत्र, चरण और नक्षत्र स्वामी।',
                getVal: (p: (typeof PLANET_POSITIONS)[0]) => p.pada,
              },
            ].map((acc) => {
              const isOpen = expandedPlanetAccordion === acc.key;
              return (
                <View
                  key={acc.key}
                  style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderDynamic }]}
                >
                  <TouchableOpacity
                    style={styles.planetAccordionHeader}
                    onPress={() => togglePlanetAccordion(acc.key)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.planetAccIconBox, { backgroundColor: isDark ? '#2B1616' : SOFT_ROSE_BG }]}>
                      <Icon name={acc.icon as any} size={13} color={PRIMARY_MAROON} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.planetAccTitle, { color: textPrimary }]}>
                        {acc.title}
                      </Text>
                      <Text style={[styles.planetAccSub, { color: textSecondary }]} numberOfLines={1}>
                        {acc.subtitle}
                      </Text>
                    </View>
                    <Icon
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={textSecondary}
                    />
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={[styles.accordionBody, { borderTopColor: lineDivider }]}>
                      {PLANET_POSITIONS.map((p, idx, arr) => (
                        <View
                          key={`${acc.key}-${p.planet}`}
                          style={[
                            styles.kvRow,
                            {
                              borderBottomColor: lineDivider,
                              borderBottomWidth: idx === arr.length - 1 ? 0 : 1,
                            },
                          ]}
                        >
                          <Text style={[styles.kvKey, { color: textPrimary, fontWeight: '600' }]}>
                            {p.planet} ({p.rashi})
                          </Text>
                          <Text style={[styles.kvVal, { color: textSecondary }]}>
                            {acc.getVal(p)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Persistent Bottom Action Bar (एक्सपोर्ट + शेयर करें) */}
      <View
        style={[
          styles.bottomFooter,
          {
            backgroundColor: bgMain,
            borderTopColor: borderDynamic,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.exportBtn,
            { backgroundColor: cardBg, borderColor: isDark ? '#404040' : '#D1D5DB' },
          ]}
          onPress={handleExport}
          activeOpacity={0.75}
        >
          <Icon name="download" size={14} color={textPrimary} style={{ marginRight: 6 }} />
          <Text style={[styles.exportBtnText, { color: textPrimary }]}>एक्सपोर्ट</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Icon name="share-2" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.shareBtnText}>शेयर करें</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: 4,
    width: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  scrollContent: {
    padding: 14,
  },
  personCard: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  personTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  personName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  personMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 10.5,
  },
  tabBar: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabBtnTextActive: {
    fontWeight: '700',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  demoBannerText: {
    fontSize: 10.5,
  },
  sectionCard: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  kvKey: {
    fontSize: 11,
    flex: 1,
  },
  kvVal: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1.2,
    textAlign: 'right',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  accordionBody: {
    borderTopWidth: 1,
  },
  kundliTabWrap: {
    position: 'relative',
  },
  chartControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderWidth: 1,
    minWidth: 130,
  },
  dropdownTriggerText: {
    fontSize: 11,
    fontWeight: '700',
  },
  styleToggleGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  styleToggleBtn: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleToggleText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  dropdownMenu: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 11.5,
  },
  chartBoxCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  legendCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  legendHeader: {
    paddingBottom: 6,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '17%',
    minWidth: 55,
    gap: 4,
  },
  legendShort: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  legendFull: {
    fontSize: 10,
  },
  dashaSystemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  dashaSystemLabel: {
    fontSize: 11,
  },
  dashaSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 165,
  },
  dashaSelectText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dashaDropdownList: {
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dashaTabBar: {
    borderBottomWidth: 1,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  dashaLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dashaLevelPill: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  dashaLevelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dashaLevelTextActive: {
    fontWeight: '700',
  },
  dashaHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  dashaHintText: {
    fontSize: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tableHeadText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7.5,
    paddingHorizontal: 12,
  },
  tableCellBold: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableCellDark: {
    fontSize: 11,
    fontWeight: '500',
  },
  tableCellMuted: {
    fontSize: 10.5,
  },
  subDashaHint: {
    fontSize: 10.5,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  subDashaFooterNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  planetCardDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  planetDemoCaption: {
    fontSize: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  planetAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
  },
  planetAccIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  planetAccTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  planetAccSub: {
    fontSize: 10,
    marginTop: 1,
  },
  bottomFooter: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  exportBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  shareBtn: {
    flex: 1.15,
    height: 40,
    borderRadius: 8,
    backgroundColor: PRIMARY_MAROON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default KundaliGeneratedScreen;
