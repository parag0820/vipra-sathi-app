import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  StatusBar,
} from 'react-native';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Line, Text as SvgText, Path, G } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width * 0.88, 330);
const RADIUS = CHART_SIZE / 2;
const CENTER = RADIUS;

const PRIMARY_MAROON = '#8B1D1D';

type TabType = 'din' | 'muhurat' | 'choghadiya' | 'hora' | 'lagna';
type SubTabType = 'muhurat' | 'choghadiya' | 'hora' | 'lagna' | 'time';

interface OptionItem {
  id: string;
  name: { en: string; hi: string };
  icon?: string;
}

const WORK_TYPES: OptionItem[] = [
  { id: 'vivah', name: { en: 'Marriage', hi: 'विवाह' }, icon: 'heart' },
  { id: 'griha_pravesh', name: { en: 'Griha Pravesh', hi: 'गृह प्रवेश' }, icon: 'home' },
  { id: 'namkaran', name: { en: 'Naming Ceremony', hi: 'नामकरण' }, icon: 'user' },
  { id: 'mundan', name: { en: 'Mundan Sanskar', hi: 'मुंडन' }, icon: 'scissors' },
  { id: 'vehicle', name: { en: 'Vehicle Purchase', hi: 'वाहन खरीद' }, icon: 'truck' },
  { id: 'property', name: { en: 'Property Purchase', hi: 'संपत्ति क्रय' }, icon: 'briefcase' },
  { id: 'business', name: { en: 'Business Opening', hi: 'व्यापार आरंभ' }, icon: 'trending-up' },
  { id: 'upanayan', name: { en: 'Upanayana / Janeu', hi: 'जनेऊ संस्कार' }, icon: 'award' },
];

const LOCATIONS: OptionItem[] = [
  { id: '1', name: { en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान' } },
  { id: '2', name: { en: 'Ujjain, India', hi: 'उज्जैन, भारत' } },
  { id: '3', name: { en: 'New Delhi, India', hi: 'नई दिल्ली, भारत' } },
  { id: '4', name: { en: 'Varanasi, UP', hi: 'वाराणसी, उत्तर प्रदेश' } },
  { id: '5', name: { en: 'Mumbai, Maharashtra', hi: 'मुंबई, महाराष्ट्र' } },
  { id: '6', name: { en: 'Haridwar, Uttarakhand', hi: 'हरिद्वार, उत्तराखंड' } },
  { id: '7', name: { en: 'Ayodhya, UP', hi: 'अयोध्या, उत्तर प्रदेश' } },
];

const DATE_RANGES: OptionItem[] = [
  { id: 'curr_month', name: { en: 'Current Month (Nov 2026)', hi: 'चालू माह (नवंबर 2026)' } },
  { id: 'next_month', name: { en: 'Next Month (Dec 2026)', hi: 'अगला माह (दिसंबर 2026)' } },
  { id: 'next_3m', name: { en: 'Next 3 Months', hi: 'अगले 3 माह' } },
  { id: 'year_2027', name: { en: 'Full Year 2026-27', hi: 'संपूर्ण वर्ष 2026-27' } },
];

const getMuhuratData = (isHi: boolean) => ({
  lagna: [
    { name: isHi ? 'कन्या' : 'Virgo', time: '06:18 - 07:56', current: false, start: 6.3, end: 7.93 },
    { name: isHi ? 'तुला' : 'Libra', time: '07:56 - 10:11', current: false, start: 7.93, end: 10.18 },
    { name: isHi ? 'वृश्चिक' : 'Scorpio', time: '10:11 - 12:27', current: false, start: 10.18, end: 12.45 },
    { name: isHi ? 'धनु' : 'Sagittarius', time: '12:27 - 14:32', current: false, start: 12.45, end: 14.53 },
    { name: isHi ? 'मकर' : 'Capricorn', time: '14:32 - 16:19', current: false, start: 14.53, end: 16.31 },
    { name: isHi ? 'कुम्भ' : 'Aquarius', time: '16:19 - 17:52', current: true, start: 16.31, end: 17.86 },
    { name: isHi ? 'मीन' : 'Pisces', time: '17:52 - 19:22', current: false, start: 17.86, end: 19.36 },
    { name: isHi ? 'मेष' : 'Aries', time: '19:22 - 21:02', current: false, start: 19.36, end: 21.03 },
    { name: isHi ? 'वृषभ' : 'Taurus', time: '21:02 - 23:00', current: false, start: 21.03, end: 23.0 },
    { name: isHi ? 'मिथुन' : 'Gemini', time: '23:00 - 01:15', current: false, start: 23.0, end: 25.25 },
    { name: isHi ? 'कर्क' : 'Cancer', time: '01:15 - 03:36', current: false, start: 25.25, end: 27.6 },
    { name: isHi ? 'सिंह' : 'Leo', time: '03:36 - 05:49', current: false, start: 27.6, end: 29.81 },
    { name: isHi ? 'कन्या' : 'Virgo', time: '05:49 - 06:18', current: false, start: 29.81, end: 30.3 },
  ],
  muhurat: [
    { name: isHi ? 'राहु काल' : 'Rahu Kaal', time: '10:48 - 12:18', type: 'ashubh', start: 10.8, end: 12.3 },
    { name: isHi ? 'यम घंटा' : 'Yam Ghanta', time: '15:19 - 16:49', type: 'ashubh', start: 15.31, end: 16.81 },
    { name: isHi ? 'गुली काल' : 'Guli Kaal', time: '07:48 - 09:18', type: 'ashubh', start: 7.8, end: 9.3 },
    { name: isHi ? 'अभिजित' : 'Abhijit', time: '11:54 - 12:43', type: 'shubh', start: 11.9, end: 12.71, current: true },
    { name: isHi ? 'दूर मुहूर्त 1' : 'Dur Muhurat 1', time: '08:42 - 09:30', type: 'ashubh', start: 8.7, end: 9.5 },
    { name: isHi ? 'दूर मुहूर्त 2' : 'Dur Muhurat 2', time: '12:42 - 13:30', type: 'ashubh', start: 12.7, end: 13.5 },
  ],
  choghadiya: {
    day: [
      { name: isHi ? 'चर' : 'Char', time: '06:18 - 07:48', type: 'shubh', start: 6.3, end: 7.8 },
      { name: isHi ? 'लाभ' : 'Labh', time: '07:48 - 09:18', type: 'shubh', start: 7.8, end: 9.3 },
      { name: isHi ? 'अमृत' : 'Amrut', time: '09:18 - 10:48', type: 'shubh', start: 9.3, end: 10.8 },
      { name: isHi ? 'काल' : 'Kaal', time: '10:48 - 12:18', type: 'ashubh', start: 10.8, end: 12.3 },
      { name: isHi ? 'शुभ' : 'Shubh', time: '12:18 - 13:49', type: 'shubh', start: 12.3, end: 13.81 },
      { name: isHi ? 'रोग' : 'Rog', time: '13:49 - 15:19', type: 'ashubh', start: 13.81, end: 15.31 },
      { name: isHi ? 'उद्वेग' : 'Udveg', time: '15:19 - 16:49', type: 'ashubh', start: 15.31, end: 16.81, current: true },
      { name: isHi ? 'चर' : 'Char', time: '16:49 - 18:18', type: 'shubh', start: 16.81, end: 18.3 },
    ],
    night: [
      { name: isHi ? 'रोग' : 'Rog', time: '18:18 - 19:48', type: 'ashubh', start: 18.3, end: 19.8 },
      { name: isHi ? 'काल' : 'Kaal', time: '19:48 - 21:18', type: 'ashubh', start: 19.8, end: 21.3 },
      { name: isHi ? 'लाभ' : 'Labh', time: '21:18 - 22:48', type: 'shubh', start: 21.3, end: 22.8 },
      { name: isHi ? 'उद्वेग' : 'Udveg', time: '22:48 - 00:18', type: 'ashubh', start: 22.8, end: 24.3 },
      { name: isHi ? 'शुभ' : 'Shubh', time: '00:18 - 01:48', type: 'shubh', start: 24.3, end: 25.8 },
      { name: isHi ? 'अमृत' : 'Amrut', time: '01:48 - 03:18', type: 'shubh', start: 25.8, end: 27.3 },
      { name: isHi ? 'चर' : 'Char', time: '03:18 - 04:48', type: 'shubh', start: 27.3, end: 28.8 },
      { name: isHi ? 'रोग' : 'Rog', time: '04:48 - 06:18', type: 'ashubh', start: 28.8, end: 30.3 },
    ],
  },
  hora: [
    { name: isHi ? 'शुक्र' : 'Venus', time: '06:18 - 07:18', start: 6.3, end: 7.3 },
    { name: isHi ? 'बुध' : 'Mercury', time: '07:18 - 08:18', start: 7.3, end: 8.3 },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '08:18 - 09:18', start: 8.3, end: 9.3 },
    { name: isHi ? 'शनि' : 'Saturn', time: '09:18 - 10:18', start: 9.3, end: 10.3 },
    { name: isHi ? 'बृहस्पति' : 'Jupiter', time: '10:18 - 11:18', start: 10.3, end: 11.3 },
    { name: isHi ? 'मंगल' : 'Mars', time: '11:18 - 12:18', start: 11.3, end: 12.3 },
    { name: isHi ? 'सूर्य' : 'Sun', time: '12:18 - 13:19', start: 12.3, end: 13.31 },
    { name: isHi ? 'शुक्र' : 'Venus', time: '13:19 - 14:19', start: 13.31, end: 14.31 },
    { name: isHi ? 'बुध' : 'Mercury', time: '14:19 - 15:19', start: 14.31, end: 15.31 },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '15:19 - 16:19', start: 15.31, end: 16.31 },
    { name: isHi ? 'शनि' : 'Saturn', time: '16:19 - 17:19', start: 16.31, end: 17.31 },
    { name: isHi ? 'बृहस्पति' : 'Jupiter', time: '17:19 - 18:19', start: 17.31, end: 18.31, current: true },
    { name: isHi ? 'मंगल' : 'Mars', time: '18:19 - 19:19', start: 18.31, end: 19.31 },
    { name: isHi ? 'सूर्य' : 'Sun', time: '19:19 - 20:19', start: 19.31, end: 20.31 },
    { name: isHi ? 'शुक्र' : 'Venus', time: '20:19 - 21:19', start: 20.31, end: 21.31 },
    { name: isHi ? 'बुध' : 'Mercury', time: '21:19 - 22:19', start: 21.31, end: 22.31 },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '22:19 - 23:19', start: 22.31, end: 23.31 },
    { name: isHi ? 'शनि' : 'Saturn', time: '23:19 - 00:19', start: 23.31, end: 24.31 },
    { name: isHi ? 'बृहस्पति' : 'Jupiter', time: '00:19 - 01:19', start: 24.31, end: 25.31 },
    { name: isHi ? 'मंगल' : 'Mars', time: '01:19 - 02:19', start: 25.31, end: 26.31 },
    { name: isHi ? 'सूर्य' : 'Sun', time: '02:19 - 03:19', start: 26.31, end: 27.31 },
    { name: isHi ? 'शुक्र' : 'Venus', time: '03:19 - 04:19', start: 27.31, end: 28.31 },
    { name: isHi ? 'बुध' : 'Mercury', time: '04:19 - 05:19', start: 28.31, end: 29.31 },
    { name: isHi ? 'चन्द्र' : 'Moon', time: '05:19 - 06:18', start: 29.31, end: 30.3 },
  ],
});

const MuhurtScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('din');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('lagna');

  // Search Filter State (One-line compact arrangement above date)
  const [selectedWork, setSelectedWork] = useState<OptionItem>(WORK_TYPES[0]);
  const [selectedLocation, setSelectedLocation] = useState<OptionItem>(LOCATIONS[0]);
  const [selectedDateRange, setSelectedDateRange] = useState<OptionItem>(DATE_RANGES[0]);
  const [activePicker, setActivePicker] = useState<'work' | 'location' | 'date_range' | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const muhuratData = useMemo(() => getMuhuratData(isHi), [isHi]);

  // Flat Maroon & White tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : '#FAF7F3';
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const roseBorder = isDark ? '#5C2424' : '#F2D8D5';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const textPrimary = isDark ? '#F3F4F6' : '#1C1917';
  const textMuted = isDark ? '#9CA3AF' : '#78716C';

  const TABS = useMemo(
    () => [
      { id: 'din', label: isHi ? 'दिन' : 'Day' },
      { id: 'muhurat', label: isHi ? 'मुहूर्त' : 'Muhurat' },
      { id: 'choghadiya', label: isHi ? 'चौघड़िया' : 'Choghadiya' },
      { id: 'hora', label: isHi ? 'होरा' : 'Hora' },
      { id: 'lagna', label: isHi ? 'लग्न' : 'Lagna' },
    ],
    [isHi],
  );

  const SUB_TABS = useMemo(
    () => [
      { id: 'muhurat', label: isHi ? 'मुहूर्त' : 'Muhurat' },
      { id: 'choghadiya', label: isHi ? 'चौघड़िया' : 'Choghadiya' },
      { id: 'hora', label: isHi ? 'होरा' : 'Hora' },
      { id: 'lagna', label: isHi ? 'लग्न' : 'Lagna' },
      { id: 'time', label: isHi ? 'समय' : 'Time' },
    ],
    [isHi],
  );

  const chartTheme = {
    bg: '#380612',
    lines: '#FCE4E8',
    highlightBg: 'rgba(252, 228, 232, 0.28)',
    green: 'rgba(34, 197, 94, 0.7)',
    red: 'rgba(239, 68, 68, 0.7)',
    darkWedge: 'rgba(0, 0, 0, 0.35)',
  };

  const prahars = [
    { name: isHi ? 'पूर्वाह्न' : 'Purvahn', start: 6, end: 9 },
    { name: isHi ? 'मध्याह्न' : 'Madhyahn', start: 9, end: 12 },
    { name: isHi ? 'अपराह्न' : 'Aparahn', start: 12, end: 15 },
    { name: isHi ? 'सायंकाल' : 'Sayankal', start: 15, end: 18 },
    { name: isHi ? 'प्रदोष' : 'Pradosh', start: 18, end: 21 },
    { name: isHi ? 'निशीथ' : 'Nisheeth', start: 21, end: 24 },
    { name: isHi ? 'त्रियामा' : 'Triyama', start: 24, end: 27 },
    { name: isHi ? 'उषा' : 'Usha', start: 27, end: 30 },
  ];

  const searchResults = useMemo(() => {
    const workName = selectedWork.name[isHi ? 'hi' : 'en'];
    return [
      {
        date: isHi ? '12 नवंबर 2026, गुरुवार' : '12 Nov 2026, Thursday',
        time: '07:15 AM - 09:45 AM',
        type: `${workName} ${isHi ? 'हेतु शुभ मुहूर्त (अभिजित)' : 'Muhurat (Abhijit)'}`,
        badge: isHi ? 'उत्तम' : 'Excellent',
        badgeColor: '#047857',
        badgeBg: '#ECFDF5',
      },
      {
        date: isHi ? '18 नवंबर 2026, बुधवार' : '18 Nov 2026, Wednesday',
        time: '10:30 AM - 12:15 PM',
        type: `${workName} ${isHi ? 'हेतु लग्न मुहूर्त (अमृत)' : 'Muhurat (Amrut)'}`,
        badge: isHi ? 'शुभ' : 'Auspicious',
        badgeColor: '#1D4ED8',
        badgeBg: '#EFF6FF',
      },
      {
        date: isHi ? '25 नवंबर 2026, बुधवार' : '25 Nov 2026, Wednesday',
        time: '06:30 AM - 08:00 AM',
        type: `${workName} ${isHi ? 'हेतु अमृत मुहूर्त' : 'Muhurat (Amrut)'}`,
        badge: isHi ? 'शुभ' : 'Auspicious',
        badgeColor: '#1D4ED8',
        badgeBg: '#EFF6FF',
      },
    ];
  }, [selectedWork, isHi]);

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

  const getStatusFillColor = (type: string, isCurrent: boolean) => {
    if (type === 'shubh') return chartTheme.green;
    if (type === 'ashubh') return chartTheme.red;
    return isCurrent ? chartTheme.highlightBg : chartTheme.darkWedge;
  };

  const timeToAngle = (time: number) => {
    return (time - 6) * 15 - 90;
  };

  const drawChartSegments = () => {
    let segments: any[] = [];
    if (activeSubTab === 'choghadiya') {
      segments = [...muhuratData.choghadiya.day, ...muhuratData.choghadiya.night];
    } else if (activeSubTab !== 'time') {
      segments = (muhuratData as any)[activeSubTab] || [];
    }

    const innerRad = RADIUS * 0.15;
    const outerRad = RADIUS * 0.65;

    return segments.map((seg, i) => {
      const startAngle = timeToAngle(seg.start) * (Math.PI / 180);
      const endAngle = timeToAngle(seg.end) * (Math.PI / 180);
      const isCurrent = !!seg.current;
      const color = getStatusFillColor(seg.type, isCurrent);

      const x1Inner = CENTER + innerRad * Math.cos(startAngle);
      const y1Inner = CENTER + innerRad * Math.sin(startAngle);
      const x2Inner = CENTER + innerRad * Math.cos(endAngle);
      const y2Inner = CENTER + innerRad * Math.sin(endAngle);

      const x1Outer = CENTER + outerRad * Math.cos(startAngle);
      const y1Outer = CENTER + outerRad * Math.sin(startAngle);
      const x2Outer = CENTER + outerRad * Math.cos(endAngle);
      const y2Outer = CENTER + outerRad * Math.sin(endAngle);

      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

      const d = [
        `M ${x1Inner} ${y1Inner}`,
        `L ${x1Outer} ${y1Outer}`,
        `A ${outerRad} ${outerRad} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
        `L ${x2Inner} ${y2Inner}`,
        `A ${innerRad} ${innerRad} 0 ${largeArc} 0 ${x1Inner} ${y1Inner}`,
        'Z',
      ].join(' ');

      const midAngle = startAngle + (endAngle - startAngle) / 2;
      const textRad = outerRad - (outerRad - innerRad) / 2;
      const textX = CENTER + textRad * Math.cos(midAngle);
      const textY = CENTER + textRad * Math.sin(midAngle);

      let rotation = (midAngle * 180) / Math.PI;
      if (rotation > 90 && rotation < 270) {
        rotation += 180;
      }

      return (
        <G key={i}>
          <Path
            d={d}
            fill={color}
            stroke={chartTheme.lines}
            strokeWidth={0.5}
            opacity={isCurrent ? 1 : 0.75}
          />
          <G transform={`translate(${textX}, ${textY}) rotate(${rotation})`}>
            <SvgText
              fill={chartTheme.lines}
              fontSize="11"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {seg.name}
            </SvgText>
          </G>
        </G>
      );
    });
  };

  const draw24HourLabels = () => {
    const r = RADIUS * 0.72;
    const hours = [
      { t: 6, l: '6AM' },
      { t: 9, l: '9AM' },
      { t: 12, l: '12PM' },
      { t: 15, l: '3PM' },
      { t: 18, l: '6PM' },
      { t: 21, l: '9PM' },
      { t: 24, l: '12AM' },
      { t: 27, l: '3AM' },
    ];
    return hours.map((h, i) => {
      const angle = timeToAngle(h.t) * (Math.PI / 180);
      const x = CENTER + r * Math.cos(angle);
      const y = CENTER + r * Math.sin(angle);
      return (
        <SvgText
          key={`hr-${i}`}
          x={x}
          y={y}
          fill={chartTheme.lines}
          fontSize="10"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {h.l}
        </SvgText>
      );
    });
  };

  const drawPrahars = () => {
    const r = RADIUS * 0.84;
    return prahars.map((p, i) => {
      const midHour = p.start + (p.end - p.start) / 2;
      const angle = timeToAngle(midHour) * (Math.PI / 180);
      const x = CENTER + r * Math.cos(angle);
      const y = CENTER + r * Math.sin(angle);

      let rotation = (angle * 180) / Math.PI;
      if (rotation > 90 && rotation < 270) {
        rotation += 180;
      }

      return (
        <G key={`pr-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
          <SvgText
            fill={chartTheme.lines}
            fontSize="10.5"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {p.name}
          </SvgText>
        </G>
      );
    });
  };

  const drawGhatiTicks = () => {
    const ticks = [];
    const rOuter = RADIUS * 0.98;
    const rInnerShort = RADIUS * 0.95;
    const rInnerLong = RADIUS * 0.93;
    const rText = RADIUS * 0.91;
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isFive = i % 5 === 0;
      const x1 = CENTER + rOuter * Math.cos(angle);
      const y1 = CENTER + rOuter * Math.sin(angle);
      const x2 = CENTER + (isFive ? rInnerLong : rInnerShort) * Math.cos(angle);
      const y2 = CENTER + (isFive ? rInnerLong : rInnerShort) * Math.sin(angle);

      ticks.push(
        <Line
          key={`t-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={chartTheme.lines}
          strokeWidth={isFive ? 1 : 0.5}
        />,
      );

      if (isFive) {
        const tx = CENTER + rText * Math.cos(angle);
        const ty = CENTER + rText * Math.sin(angle);
        let rotation = (angle * 180) / Math.PI;
        if (rotation > 90 && rotation < 270) {
          rotation += 180;
        }
        ticks.push(
          <G key={`tt-${i}`} transform={`translate(${tx}, ${ty}) rotate(${rotation})`}>
            <SvgText
              fill={chartTheme.lines}
              fontSize="7.5"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {i < 10 ? `0${i}` : i}
            </SvgText>
          </G>,
        );
      }
    }
    return ticks;
  };

  const drawCenterHand = () => {
    const currentAngle = timeToAngle(17.5) * (Math.PI / 180);
    const rHand = RADIUS * 0.65;
    const x = CENTER + rHand * Math.cos(currentAngle);
    const y = CENTER + rHand * Math.sin(currentAngle);

    return (
      <G>
        <Circle cx={CENTER} cy={CENTER} r="4" fill={chartTheme.lines} />
        <Line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke={chartTheme.lines} strokeWidth="2" />
        <Circle cx={x} cy={y} r="2" fill={chartTheme.lines} />
      </G>
    );
  };

  const renderListItem = (item: any, index: number, totalLength: number) => {
    const isShubh = item.type === 'shubh';
    const isAshubh = item.type === 'ashubh';
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
          isCurrent && {
            borderLeftWidth: 3,
            borderLeftColor: accentColor,
          },
        ]}
      >
        <View style={styles.listLeft}>
          <Text
            style={[
              styles.itemName,
              {
                color: isCurrent ? accentColor : textPrimary,
                fontWeight: isCurrent ? '700' : '600',
              },
            ]}
          >
            {item.name}
          </Text>
          {item.type && (
            <View
              style={[
                styles.miniStatusBadge,
                {
                  backgroundColor: isShubh
                    ? isDark
                      ? '#064E3B'
                      : '#ECFDF5'
                    : isDark
                    ? '#7F1D1D'
                    : '#FEE2E2',
                },
              ]}
            >
              <Text
                style={[
                  styles.miniStatusText,
                  {
                    color: isShubh
                      ? isDark
                        ? '#6EE7B7'
                        : '#047857'
                      : isDark
                      ? '#FCA5A5'
                      : '#B91C1C',
                  },
                ]}
              >
                {isShubh ? (isHi ? 'शुभ' : 'Shubh') : isHi ? 'अशुभ' : 'Ashubh'}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.itemTime,
            {
              color: isCurrent ? accentColor : textMuted,
              fontWeight: isCurrent ? '700' : '500',
            },
          ]}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'din') {
      return (
        <View style={[styles.chartCard, { backgroundColor: chartTheme.bg, borderColor: '#5C1D26' }]}>
          <View style={styles.chartHeaderRow}>
            <View style={styles.chartHeaderPill}>
              <MaterialCommunityIcons name="clock-outline" size={13} color={chartTheme.lines} />
              <Text style={styles.chartHeaderTitle}>
                {isHi ? '24 घंटे का अहोरात्र चक्र' : '24-Hour Ahoratra Wheel'}
              </Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS * 0.98}
                stroke={chartTheme.lines}
                strokeWidth="1"
                fill="none"
              />
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS * 0.9}
                stroke={chartTheme.lines}
                strokeWidth="0.5"
                fill="none"
              />
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS * 0.78}
                stroke={chartTheme.lines}
                strokeWidth="0.5"
                fill="none"
              />
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS * 0.65}
                stroke={chartTheme.lines}
                strokeWidth="0.5"
                fill="none"
              />
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS * 0.15}
                stroke={chartTheme.lines}
                strokeWidth="0.5"
                fill="none"
              />

              {[...Array(8)].map((_, i) => {
                const angle = (i * 45 - 90) * (Math.PI / 180);
                const x1 = CENTER + RADIUS * 0.15 * Math.cos(angle);
                const y1 = CENTER + RADIUS * 0.15 * Math.sin(angle);
                const x2 = CENTER + RADIUS * 0.98 * Math.cos(angle);
                const y2 = CENTER + RADIUS * 0.98 * Math.sin(angle);
                return (
                  <Line
                    key={`hrl-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={chartTheme.lines}
                    strokeWidth="0.3"
                    opacity={0.5}
                  />
                );
              })}

              {drawGhatiTicks()}
              {drawPrahars()}
              {draw24HourLabels()}
              {drawChartSegments()}
              {drawCenterHand()}

              <Circle
                cx={CENTER}
                cy={CENTER - RADIUS * 0.98 - 6}
                r="3"
                fill={chartTheme.lines}
              />
              <Path
                d={`M ${CENTER} ${CENTER - RADIUS * 0.98 - 12} L ${CENTER} ${CENTER - RADIUS * 0.98}`}
                stroke={chartTheme.lines}
                strokeWidth="1"
              />
            </Svg>
          </View>

          {/* Sub-tabs below chart */}
          <View style={styles.bottomTabOuter}>
            <View style={styles.bottomTabRow}>
              {SUB_TABS.map((subTab) => {
                const isActive = activeSubTab === subTab.id;
                return (
                  <TouchableOpacity
                    key={subTab.id}
                    style={[
                      styles.bottomTabPill,
                      isActive && { backgroundColor: chartTheme.highlightBg },
                    ]}
                    onPress={() => setActiveSubTab(subTab.id as SubTabType)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.bottomTabText,
                        {
                          color: chartTheme.lines,
                          fontWeight: isActive ? '700' : '500',
                          opacity: isActive ? 1 : 0.75,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {subTab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      );
    }

    if (activeTab === 'choghadiya') {
      const { day, night } = muhuratData.choghadiya;
      return (
        <View style={styles.listContainer}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="white-balance-sunny" size={14} color={accentColor} style={{ marginRight: 5 }} />
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {isHi ? 'दिन का चौघड़िया' : 'Day Choghadiya'}
            </Text>
          </View>
          <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
            {day.map((item: any, idx: number) => renderListItem(item, idx, day.length))}
          </View>

          <View style={[styles.sectionHeaderRow, { marginTop: 14 }]}>
            <MaterialCommunityIcons name="weather-night" size={14} color={accentColor} style={{ marginRight: 5 }} />
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {isHi ? 'रात का चौघड़िया' : 'Night Choghadiya'}
            </Text>
          </View>
          <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
            {night.map((item: any, idx: number) => renderListItem(item, idx, night.length))}
          </View>
        </View>
      );
    }

    const data = (muhuratData as any)[activeTab] || [];
    const sectionTitle =
      activeTab === 'muhurat'
        ? isHi ? 'शुभ एवं अशुभ मुहूर्त' : 'Auspicious & Inauspicious Muhurats'
        : activeTab === 'hora'
        ? isHi ? 'दैनिक होरा चक्र' : 'Daily Hora Cycle'
        : isHi ? 'दैनिक लग्न समय' : 'Daily Lagna Timings';

    return (
      <View style={styles.listContainer}>
        <View style={styles.sectionHeaderRow}>
          <MaterialCommunityIcons name="star-four-points-outline" size={14} color={accentColor} style={{ marginRight: 5 }} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            {sectionTitle}
          </Text>
        </View>
        <View style={[styles.cardBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
          {data.map((item: any, index: number) => renderListItem(item, index, data.length))}
        </View>
      </View>
    );
  };

  const getPickerData = () => {
    switch (activePicker) {
      case 'work':
        return {
          title: isHi ? 'कार्य का प्रकार चुनें' : 'Select Type of Work',
          icon: 'briefcase',
          data: WORK_TYPES,
          selectedId: selectedWork.id,
          onSelect: (item: OptionItem) => setSelectedWork(item),
        };
      case 'location':
        return {
          title: isHi ? 'स्थान चुनें' : 'Select Location',
          icon: 'map-pin',
          data: LOCATIONS,
          selectedId: selectedLocation.id,
          onSelect: (item: OptionItem) => setSelectedLocation(item),
        };
      case 'date_range':
        return {
          title: isHi ? 'तिथि अवधि चुनें' : 'Select Date Range',
          icon: 'calendar',
          data: DATE_RANGES,
          selectedId: selectedDateRange.id,
          onSelect: (item: OptionItem) => setSelectedDateRange(item),
        };
      default:
        return null;
    }
  };

  const currentPicker = getPickerData();

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* 1. Flat Maroon/White Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 6,
            backgroundColor: headerBg,
            borderBottomColor: borderCol,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: roseBg }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="chevron-left" size={18} color={accentColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: accentColor }]}>
              {isHi ? 'मुहूर्त' : 'Muhurt'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {isHi ? 'दैनिक शुभ-अशुभ मुहूर्त एवं अहोरात्र चक्र' : 'Daily Muhurat & Ahoratra Cycle'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. ONE-LINE FILTER BAR (ABOVE THE DATE: Work Type + Location + Date Range (Icon Only) + Search Button) */}
      <View style={[styles.oneLineFilterBar, { backgroundColor: cardBg, borderBottomColor: borderCol }]}>
        {/* Field 1: Type of Work Dropdown */}
        <TouchableOpacity
          style={[styles.workDropdownBtn, { backgroundColor: subtleBg, borderColor: borderCol }]}
          onPress={() => setActivePicker('work')}
          activeOpacity={0.7}
        >
          <View style={styles.dropdownLeftContent}>
            <Icon name="check-circle" size={11} color={accentColor} style={{ marginRight: 4 }} />
            <Text style={[styles.dropdownText, { color: textPrimary }]} numberOfLines={1}>
              {selectedWork.name[isHi ? 'hi' : 'en']}
            </Text>
          </View>
          <Icon name="chevron-down" size={11} color={textMuted} />
        </TouchableOpacity>

        {/* Field 2: Location Dropdown */}
        <TouchableOpacity
          style={[styles.locationDropdownBtn, { backgroundColor: subtleBg, borderColor: borderCol }]}
          onPress={() => setActivePicker('location')}
          activeOpacity={0.7}
        >
          <View style={styles.dropdownLeftContent}>
            <Icon name="map-pin" size={11} color={accentColor} style={{ marginRight: 4 }} />
            <Text style={[styles.dropdownText, { color: textPrimary }]} numberOfLines={1}>
              {selectedLocation.name[isHi ? 'hi' : 'en'].split(',')[0]}
            </Text>
          </View>
          <Icon name="chevron-down" size={11} color={textMuted} />
        </TouchableOpacity>

        {/* Field 3: Date Range (JUST AN ICON ONLY!) */}
        <TouchableOpacity
          style={[
            styles.dateRangeIconBtn,
            {
              backgroundColor: selectedDateRange.id !== 'curr_month' ? roseBg : subtleBg,
              borderColor: selectedDateRange.id !== 'curr_month' ? roseBorder : borderCol,
            },
          ]}
          onPress={() => setActivePicker('date_range')}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon
            name="calendar"
            size={13.5}
            color={selectedDateRange.id !== 'curr_month' ? accentColor : textPrimary}
          />
        </TouchableOpacity>

        {/* Action: Search Button */}
        <TouchableOpacity
          style={[styles.searchIconBtn, { backgroundColor: PRIMARY_MAROON }]}
          onPress={() => setShowSearchResults(true)}
          activeOpacity={0.85}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon name="search" size={13.5} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 3. Date Navigator Strip (NOW BELOW THE ONE-LINE FILTER BAR) */}
      <View style={[styles.dateNavStrip, { backgroundColor: cardBg, borderBottomColor: borderCol }]}>
        <TouchableOpacity
          onPress={goToPreviousDay}
          style={[styles.navArrowBtn, { backgroundColor: subtleBg }]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon name="chevron-left" size={15} color={textPrimary} />
        </TouchableOpacity>

        <View style={styles.dateDisplayCol}>
          <Text style={[styles.dateText, { color: textPrimary }]}>
            {currentDate.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        {!isToday && (
          <TouchableOpacity
            onPress={goToToday}
            style={[styles.todayBtn, { borderColor: roseBorder, backgroundColor: roseBg }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.todayBtnText, { color: accentColor }]}>
              {isHi ? 'आज' : 'Today'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={goToNextDay}
          style={[styles.navArrowBtn, { backgroundColor: subtleBg }]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon name="chevron-right" size={15} color={textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 4. Flat Underline Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: headerBg, borderBottomColor: borderCol }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabBtn,
                  isActive && {
                    borderBottomColor: accentColor,
                    borderBottomWidth: 2,
                  },
                ]}
                onPress={() => setActiveTab(tab.id as TabType)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? accentColor : textMuted,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 5. Scrollable Screen Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Suitable Muhurat Search Results (Appears cleanly below tab bar when user searches) */}
        {showSearchResults && (
          <View style={styles.searchResultsContainer}>
            <View style={styles.resultsHeaderRow}>
              <View style={styles.resultsHeaderLeft}>
                <MaterialCommunityIcons name="star-check-outline" size={13} color={accentColor} />
                <Text style={[styles.searchResultsTitle, { color: textPrimary }]}>
                  {selectedWork.name[isHi ? 'hi' : 'en']} • {selectedLocation.name[isHi ? 'hi' : 'en'].split(',')[0]}
                </Text>
                <View style={[styles.resultCountBadge, { backgroundColor: roseBg }]}>
                  <Text style={[styles.resultCountText, { color: accentColor }]}>
                    {searchResults.length}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowSearchResults(false)}
                style={[styles.clearBtn, { backgroundColor: subtleBg, borderColor: borderCol }]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="x" size={11} color={textMuted} />
                <Text style={[styles.clearBtnText, { color: textMuted }]}>
                  {isHi ? 'छिपाएं' : 'Hide'}
                </Text>
              </TouchableOpacity>
            </View>

            {searchResults.map((item, index) => (
              <View
                key={index}
                style={[styles.searchResultCard, { backgroundColor: cardBg, borderColor: borderCol }]}
              >
                <View style={[styles.searchResultLeftStrip, { backgroundColor: item.badgeColor }]} />
                <View style={styles.searchResultContent}>
                  <View style={styles.resultTopRow}>
                    <Text style={[styles.searchResultDate, { color: textPrimary }]}>
                      {item.date}
                    </Text>
                    <View style={[styles.badgeContainer, { backgroundColor: item.badgeBg }]}>
                      <Text style={[styles.badgeText, { color: item.badgeColor }]}>
                        {item.badge}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.resultBottomRow}>
                    <Icon name="clock" size={11} color={textMuted} style={{ marginRight: 4 }} />
                    <Text style={[styles.searchResultTime, { color: textMuted }]}>
                      {item.time}
                    </Text>
                    <Text style={[styles.searchResultDot, { color: textMuted }]}>•</Text>
                    <Text style={[styles.searchResultType, { color: textMuted }]} numberOfLines={1}>
                      {item.type}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab Content (Dial Wheel or List Views) */}
        {renderTabContent()}

        <View style={{ height: 28 }} />
      </ScrollView>

      {/* Interactive Selection Modal (Flat Maroon/White, zero shadows) */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
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
            {currentPicker && (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: dividerCol }]}>
                  <View style={styles.modalHeaderLeft}>
                    <View style={[styles.modalIconBox, { backgroundColor: roseBg }]}>
                      <Icon name={currentPicker.icon as any} size={14} color={accentColor} />
                    </View>
                    <Text style={[styles.modalTitle, { color: accentColor }]}>
                      {currentPicker.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setActivePicker(null)}
                    style={[styles.modalCloseBtn, { backgroundColor: subtleBg, borderColor: borderCol }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="x" size={13} color={textMuted} />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={currentPicker.data}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => {
                    const isSelected = item.id === currentPicker.selectedId;
                    const isLast = index === currentPicker.data.length - 1;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          !isLast && {
                            borderBottomWidth: 1,
                            borderBottomColor: dividerCol,
                          },
                          isSelected && {
                            backgroundColor: roseBg,
                          },
                        ]}
                        onPress={() => {
                          currentPicker.onSelect(item);
                          setActivePicker(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionItemText,
                            {
                              color: isSelected ? accentColor : textPrimary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {item.name[isHi ? 'hi' : 'en']}
                        </Text>
                        {isSelected && (
                          <Icon name="check" size={14} color={accentColor} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </>
            )}
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
    paddingBottom: 9,
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
    marginRight: 8,
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
  // One-line filter bar above the date
  oneLineFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    gap: 6,
  },
  workDropdownBtn: {
    flex: 1.25,
    height: 32,
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  locationDropdownBtn: {
    flex: 1.1,
    height: 32,
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dropdownLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 4,
  },
  dropdownText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  dateRangeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  navArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  searchResultsContainer: {
    marginBottom: 10,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  resultsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  searchResultsTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultCountBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  resultCountText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 1,
    gap: 3,
  },
  clearBtnText: {
    fontSize: 10,
    fontWeight: '600',
  },
  searchResultCard: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
    overflow: 'hidden',
  },
  searchResultLeftStrip: {
    width: 3.5,
  },
  searchResultContent: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  searchResultDate: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  resultBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  searchResultDot: {
    marginHorizontal: 5,
    fontSize: 10,
  },
  searchResultType: {
    fontSize: 11,
    flex: 1,
  },
  chartCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 2,
  },
  chartHeaderRow: {
    marginBottom: 8,
  },
  chartHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  chartHeaderTitle: {
    color: '#FCE4E8',
    fontSize: 11,
    fontWeight: '700',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  bottomTabOuter: {
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 8,
  },
  bottomTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomTabPill: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabText: {
    fontSize: 10.5,
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  cardBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  itemName: {
    fontSize: 12,
  },
  miniStatusBadge: {
    paddingHorizontal: 5,
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
    maxWidth: 340,
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
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  modalCloseBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10.5,
  },
  optionItemText: {
    fontSize: 12,
  },
});

export default MuhurtScreen;
