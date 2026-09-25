import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Line, Text as SvgText, Path, G, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.9;
const RADIUS = CHART_SIZE / 2;
const CENTER = RADIUS;

type TabType = 'din' | 'muhurat' | 'choghadiya' | 'hora' | 'lagna';
type SubTabType = 'muhurat' | 'choghadiya' | 'hora' | 'lagna' | 'time';

const MuhurtScreen = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('din');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('lagna');

  const TABS = [
    { id: 'din', label: isHi ? 'दिन' : 'Day' },
    { id: 'muhurat', label: isHi ? 'मुहूर्त' : 'Muhurat' },
    { id: 'choghadiya', label: isHi ? 'चौघड़िया' : 'Choghadiya' },
    { id: 'hora', label: isHi ? 'होरा' : 'Hora' },
    { id: 'lagna', label: isHi ? 'लग्न' : 'Lagna' },
  ];

  const SUB_TABS = [
    { id: 'muhurat', label: isHi ? 'मुहूर्त' : 'Muhurat' },
    { id: 'choghadiya', label: isHi ? 'चौघड़िया' : 'Choghadiya' },
    { id: 'hora', label: isHi ? 'होरा' : 'Hora' },
    { id: 'lagna', label: isHi ? 'लग्न' : 'Lagna' },
    { id: 'time', label: 'Time' },
  ];

  const chartTheme = {
    bg: '#480918', // Deep maroon from the logo
    lines: '#FCE4E8', // Light matching color for contrast
    highlightBg: 'rgba(252, 228, 232, 0.25)', // translucent light color
    green: 'rgba(34, 197, 94, 0.6)',
    red: 'rgba(239, 68, 68, 0.6)',
    darkWedge: 'rgba(0, 0, 0, 0.3)'
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

  const MOCK_DATA: any = {
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
      ]
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
  };

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

  const getStatusFillColor = (type: string, isCurrent: boolean) => {
    if (type === 'shubh') return chartTheme.green;
    if (type === 'ashubh') return chartTheme.red;
    return isCurrent ? chartTheme.highlightBg : chartTheme.darkWedge;
  };

  const timeToAngle = (time: number) => {
    // 6 AM = -90 deg (top)
    return (time - 6) * 15 - 90;
  };

  const drawChartSegments = () => {
    let segments: any[] = [];
    if (activeSubTab === 'choghadiya') {
      segments = [...MOCK_DATA.choghadiya.day, ...MOCK_DATA.choghadiya.night];
    } else if (activeSubTab !== 'time') {
      segments = MOCK_DATA[activeSubTab] || [];
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

      const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;

      const d = [
        `M ${x1Inner} ${y1Inner}`,
        `L ${x1Outer} ${y1Outer}`,
        `A ${outerRad} ${outerRad} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
        `L ${x2Inner} ${y2Inner}`,
        `A ${innerRad} ${innerRad} 0 ${largeArc} 0 ${x1Inner} ${y1Inner}`,
        'Z'
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
          <Path d={d} fill={color} stroke={chartTheme.lines} strokeWidth={0.5} opacity={isCurrent ? 1 : 0.7} />
          <G transform={`translate(${textX}, ${textY}) rotate(${rotation})`}>
            <SvgText
              fill={chartTheme.lines}
              fontSize="12"
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
      { t: 6, l: '6AM' }, { t: 9, l: '9AM' }, { t: 12, l: '12PM' },
      { t: 15, l: '3PM' }, { t: 18, l: '6PM' }, { t: 21, l: '9PM' },
      { t: 24, l: '12AM' }, { t: 27, l: '3AM' },
    ];
    return hours.map((h, i) => {
      const angle = timeToAngle(h.t) * (Math.PI / 180);
      const x = CENTER + r * Math.cos(angle);
      const y = CENTER + r * Math.sin(angle);
      return (
        <SvgText key={`hr-${i}`} x={x} y={y} fill={chartTheme.lines} fontSize="11" textAnchor="middle" alignmentBaseline="middle">
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
          <SvgText fill={chartTheme.lines} fontSize="12" textAnchor="middle" alignmentBaseline="middle">
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

      ticks.push(<Line key={`t-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={chartTheme.lines} strokeWidth={isFive ? 1 : 0.5} />);

      if (isFive) {
        const tx = CENTER + rText * Math.cos(angle);
        const ty = CENTER + rText * Math.sin(angle);
        let rotation = (angle * 180) / Math.PI;
        if (rotation > 90 && rotation < 270) {
          rotation += 180;
        }
        ticks.push(
          <G key={`tt-${i}`} transform={`translate(${tx}, ${ty}) rotate(${rotation})`}>
            <SvgText fill={chartTheme.lines} fontSize="8" textAnchor="middle" alignmentBaseline="middle">
              {i < 10 ? `0${i}` : i}
            </SvgText>
          </G>
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

  const renderTabContent = () => {
    if (activeTab === 'din') {
      return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={styles.chartContainer}>
            <View style={[styles.chartWrapper, { backgroundColor: chartTheme.bg }]}>
              <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
                {/* Rings */}
                <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.98} stroke={chartTheme.lines} strokeWidth="1" fill="none" />
                <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.90} stroke={chartTheme.lines} strokeWidth="0.5" fill="none" />
                <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.78} stroke={chartTheme.lines} strokeWidth="0.5" fill="none" />
                <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.65} stroke={chartTheme.lines} strokeWidth="0.5" fill="none" />
                <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.15} stroke={chartTheme.lines} strokeWidth="0.5" fill="none" />

                {/* 24 Hour separator lines */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45 - 90) * (Math.PI / 180);
                  const x1 = CENTER + (RADIUS * 0.15) * Math.cos(angle);
                  const y1 = CENTER + (RADIUS * 0.15) * Math.sin(angle);
                  const x2 = CENTER + (RADIUS * 0.98) * Math.cos(angle);
                  const y2 = CENTER + (RADIUS * 0.98) * Math.sin(angle);
                  return <Line key={`hrl-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={chartTheme.lines} strokeWidth="0.3" opacity="0.5" />;
                })}

                {drawGhatiTicks()}
                {drawPrahars()}
                {draw24HourLabels()}
                {drawChartSegments()}
                {drawCenterHand()}

                {/* Sun icon at top (6 AM) */}
                <Circle cx={CENTER} cy={CENTER - RADIUS * 0.98 - 6} r="3" fill={chartTheme.lines} />
                <Path d={`M ${CENTER} ${CENTER - RADIUS * 0.98 - 12} L ${CENTER} ${CENTER - RADIUS * 0.98}`} stroke={chartTheme.lines} strokeWidth="1" />
              </Svg>
            </View>
          </View>

          {/* Sub Tabs Container aligned to bottom */}
          <View style={[styles.bottomTabOuter, { backgroundColor: chartTheme.bg }]}>
            <View style={styles.bottomTabRow}>
              {SUB_TABS.map((subTab) => {
                const isActive = activeSubTab === subTab.id;
                return (
                  <TouchableOpacity
                    key={subTab.id}
                    style={[
                      styles.bottomTabPill,
                      isActive && { backgroundColor: chartTheme.highlightBg }
                    ]}
                    onPress={() => setActiveSubTab(subTab.id as SubTabType)}
                  >
                    <Text
                      style={[
                        styles.bottomTabText,
                        { color: chartTheme.lines, fontWeight: isActive ? 'bold' : '500', opacity: isActive ? 1 : 0.7 }
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
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

    // List Views
    if (activeTab === 'choghadiya') {
      const { day, night } = MOCK_DATA.choghadiya;
      return (
        <View style={styles.listContainer}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{isHi ? 'दिन का चौघड़िया' : 'Day Choghadiya'}</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {day.map((item: any, idx: number) => renderListItem(item, idx, day.length))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.primary, marginTop: 24 }]}>{isHi ? 'रात का चौघड़िया' : 'Night Choghadiya'}</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {night.map((item: any, idx: number) => renderListItem(item, idx, night.length))}
          </View>
        </View>
      );
    }

    const data = MOCK_DATA[activeTab] || [];
    return (
      <View style={styles.listContainer}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {data.map((item: any, index: number) => renderListItem(item, index, data.length))}
        </View>
      </View>
    );
  };

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
          { borderBottomColor: index === totalLength - 1 ? 'transparent' : colors.border },
          isCurrent && { backgroundColor: colors.primary + '15', borderLeftWidth: 4, borderLeftColor: colors.primary }
        ]}
      >
        <View style={styles.listLeft}>
          <Text style={[styles.itemName, { color: isCurrent ? colors.primary : colors.text }]}>
            {item.name}
          </Text>
          {item.type && (
            <Text style={[styles.itemType, { color: statusColor }]}>
              {item.type === 'shubh' ? (isHi ? 'शुभ' : 'Shubh') : (isHi ? 'अशुभ' : 'Ashubh')}
            </Text>
          )}
        </View>
        <Text style={[styles.itemTime, { color: isCurrent ? colors.primary : colors.text }]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: activeTab === 'din' ? chartTheme.bg : colors.background, paddingBottom: insets.bottom }]}>
      <CustomHeader title={isHi ? 'मुहूर्त' : 'Muhurt'} showBack={true} />

      {/* Date Navigator */}
      <View style={[styles.dateNav, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.navBtn}>
          <Icon name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateSelector}>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {currentDate.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextDay} style={styles.navBtn}>
          <Icon name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Custom Fixed Top Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
            onPress={() => setActiveTab(tab.id as TabType)}
          >
            <Text
              style={[styles.tabText, { color: activeTab === tab.id ? colors.primary : colors.textLight }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'din' ? (
        renderTabContent()
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderTabContent()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  navBtn: {
    padding: 8,
  },
  dateSelector: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabContainer: {
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#480918',
  },
  chartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabOuter: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  bottomTabPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabText: {
    fontSize: 11,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
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
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  listLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemType: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  itemTime: {
    fontSize: 11,
    fontWeight: 'bold',
  }
});

export default MuhurtScreen;
