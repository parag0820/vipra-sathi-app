import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedKundali, INITIAL_SAVED_KUNDALIS } from '../data/mockKundali';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Kundali'>;

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_PINK_BG = '#FFF5F5';
const SOFT_ROSE_BG = '#FFF0ED';
const BORDER_COLOR = '#E5E7EB';
const CARD_BORDER = '#FEE2E2';
const MUTED_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const INFO_BG = '#F3F6FA';
const INFO_BORDER = '#E2E8F0';
const INFO_TEXT = '#475569';

const KundaliScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');

  const [createDetails, setCreateDetails] = useState({
    name: '',
    dob: '',
    tob: '',
    place: '',
    gender: 'male' as 'male' | 'female',
  });

  const [saveToRecent, setSaveToRecent] = useState(true);
  const [savedKundalis, setSavedKundalis] = useState<SavedKundali[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentField, setCurrentField] = useState<'dob' | 'tob' | null>(null);

  // Load saved kundalis from AsyncStorage
  useEffect(() => {
    const loadKundalis = async () => {
      try {
        const stored = await AsyncStorage.getItem('@saved_kundalis');
        if (stored) {
          setSavedKundalis(JSON.parse(stored));
        } else {
          setSavedKundalis(INITIAL_SAVED_KUNDALIS);
          await AsyncStorage.setItem('@saved_kundalis', JSON.stringify(INITIAL_SAVED_KUNDALIS));
        }
      } catch (error) {
        setSavedKundalis(INITIAL_SAVED_KUNDALIS);
      }
    };
    loadKundalis();
  }, []);

  const handleReset = () => {
    setCreateDetails({
      name: '',
      dob: '',
      tob: '',
      place: '',
      gender: 'male',
    });
  };

  const handleGenerateKundali = async () => {
    const name = createDetails.name.trim() || 'आदित्य मिश्रा';
    const dob = createDetails.dob.trim() || '18/01/1996';
    const tob = createDetails.tob.trim() || '06:45 AM';
    const place = createDetails.place.trim() || 'प्रयागराज, उत्तर प्रदेश';
    const gender = createDetails.gender;

    if (saveToRecent) {
      const newKundali: SavedKundali = {
        id: 'k_' + Date.now(),
        name,
        gender,
        dob,
        tob,
        place,
        rashi: 'मेष (Mesh)',
        nakshatra: 'अश्विनी (Ashwini)',
        lagna: 'सिंह (Leo)',
        savedAt: 'अभी सहेजा गया',
      };

      const updated = [
        newKundali,
        ...savedKundalis.filter((k) => k.name.toLowerCase() !== name.toLowerCase()),
      ];
      setSavedKundalis(updated);
      try {
        await AsyncStorage.setItem('@saved_kundalis', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save kundali', err);
      }
    }

    navigation.navigate('KundaliGenerated', {
      name,
      dob,
      tob,
      place,
      gender,
    });
  };

  const handleDeleteKundali = (id: string, name: string) => {
    Alert.alert(
      t('kundali.delete_kundali', 'कुंडली हटाएं'),
      `${t('kundali.confirm_delete_msg', 'क्या आप इस सहेजी गई कुंडली को हटाना चाहते हैं?')} (${name})`,
      [
        { text: t('common.cancel', 'रद्द करें'), style: 'cancel' },
        {
          text: t('kundali.delete_kundali', 'हटाएं'),
          style: 'destructive',
          onPress: async () => {
            const updated = savedKundalis.filter((k) => k.id !== id);
            setSavedKundalis(updated);
            try {
              await AsyncStorage.setItem('@saved_kundalis', JSON.stringify(updated));
            } catch (err) {
              console.error('Failed to update saved kundalis', err);
            }
          },
        },
      ]
    );
  };

  const filteredSavedKundalis = savedKundalis.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.place.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender =
      genderFilter === 'all' || item.gender === genderFilter;
    return matchesQuery && matchesGender;
  });

  const bgMain = isDark ? '#121212' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const inputBg = isDark ? '#262626' : '#FFFFFF';
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;
  const borderDynamic = isDark ? '#333333' : BORDER_COLOR;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgMain }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="chevron-left" size={24} color={PRIMARY_MAROON} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('kundali.title', 'कुंडली बनाएँ')}
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>

      {/* Top Underline Tabs (Panchang-style Tab Bar) */}
      <View
        style={[
          styles.tabBar,
          { backgroundColor: bgMain, borderBottomColor: borderDynamic },
        ]}
      >
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'create' && {
                borderBottomColor: isDark ? '#FCA5A5' : PRIMARY_MAROON,
              },
            ]}
            onPress={() => setActiveTab('create')}
            activeOpacity={0.75}
          >
            <Icon
              name="plus-circle"
              size={14}
              color={
                activeTab === 'create'
                  ? isDark
                    ? '#FCA5A5'
                    : PRIMARY_MAROON
                  : textSecondary
              }
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'create' && styles.tabTextActive,
                {
                  color:
                    activeTab === 'create'
                      ? isDark
                        ? '#FCA5A5'
                        : PRIMARY_MAROON
                      : textSecondary,
                },
              ]}
            >
              {t('kundali.create_tab', 'कुंडली बनाएँ')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'saved' && {
                borderBottomColor: isDark ? '#FCA5A5' : PRIMARY_MAROON,
              },
            ]}
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.75}
          >
            <Icon
              name="bookmark"
              size={14}
              color={
                activeTab === 'saved'
                  ? isDark
                    ? '#FCA5A5'
                    : PRIMARY_MAROON
                  : textSecondary
              }
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'saved' && styles.tabTextActive,
                {
                  color:
                    activeTab === 'saved'
                      ? isDark
                        ? '#FCA5A5'
                        : PRIMARY_MAROON
                      : textSecondary,
                },
              ]}
            >
              {t('kundali.saved_tab', 'सहेजी गई')}
            </Text>
            {savedKundalis.length > 0 && (
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor: isDark ? '#2B1B1B' : SOFT_ROSE_BG,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    { color: isDark ? '#FCA5A5' : PRIMARY_MAROON },
                  ]}
                >
                  {savedKundalis.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Scroll Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === 'create' ? (
          <>
            {/* Form Container */}
            <View style={styles.formSection}>
              {/* 1. Name Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  {t('kundali.name_label', 'पूरा नाम')}{' '}
                  <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputBox,
                    { backgroundColor: inputBg, borderColor: borderDynamic },
                  ]}
                >
                  <Icon
                    name="user"
                    size={14}
                    color={textSecondary}
                    style={styles.leftIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: textPrimary }]}
                    placeholder={t('kundali.name_placeholder', 'आदित्य मिश्रा')}
                    placeholderTextColor={textSecondary}
                    value={createDetails.name}
                    onChangeText={(text) =>
                      setCreateDetails({ ...createDetails, name: text })
                    }
                  />
                </View>
              </View>

              {/* 2. Gender Field (Matching image radio pills) */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  {t('kundali.gender_label', 'लिंग')}{' '}
                  <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.genderRow}>
                  {/* Male Radio Pill */}
                  <TouchableOpacity
                    style={[
                      styles.genderPillCard,
                      {
                        backgroundColor:
                          createDetails.gender === 'male'
                            ? isDark
                              ? '#2B1616'
                              : SOFT_PINK_BG
                            : cardBg,
                        borderColor:
                          createDetails.gender === 'male'
                            ? PRIMARY_MAROON
                            : borderDynamic,
                      },
                    ]}
                    onPress={() =>
                      setCreateDetails({ ...createDetails, gender: 'male' })
                    }
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        {
                          borderColor:
                            createDetails.gender === 'male'
                              ? PRIMARY_MAROON
                              : '#9CA3AF',
                        },
                      ]}
                    >
                      {createDetails.gender === 'male' && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.genderPillText,
                        {
                          color:
                            createDetails.gender === 'male'
                              ? isDark
                                ? '#F8E6CE'
                                : PRIMARY_MAROON
                              : textPrimary,
                          fontWeight:
                            createDetails.gender === 'male' ? '700' : '500',
                        },
                      ]}
                    >
                      {t('kundali.male', 'पुरुष')}
                    </Text>
                  </TouchableOpacity>

                  {/* Female Radio Pill */}
                  <TouchableOpacity
                    style={[
                      styles.genderPillCard,
                      {
                        backgroundColor:
                          createDetails.gender === 'female'
                            ? isDark
                              ? '#2B1616'
                              : SOFT_PINK_BG
                            : cardBg,
                        borderColor:
                          createDetails.gender === 'female'
                            ? PRIMARY_MAROON
                            : borderDynamic,
                      },
                    ]}
                    onPress={() =>
                      setCreateDetails({ ...createDetails, gender: 'female' })
                    }
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        {
                          borderColor:
                            createDetails.gender === 'female'
                              ? PRIMARY_MAROON
                              : '#9CA3AF',
                        },
                      ]}
                    >
                      {createDetails.gender === 'female' && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.genderPillText,
                        {
                          color:
                            createDetails.gender === 'female'
                              ? isDark
                                ? '#F8E6CE'
                                : PRIMARY_MAROON
                              : textPrimary,
                          fontWeight:
                            createDetails.gender === 'female' ? '700' : '500',
                        },
                      ]}
                    >
                      {t('kundali.female', 'महिला')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 3. Date of Birth & Time of Birth (Side-by-Side Row like reference) */}
              <View style={styles.rowInputs}>
                {/* Date of Birth */}
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {t('kundali.dob_label', 'जन्मतिथि')}{' '}
                    <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.inputBox,
                      { backgroundColor: inputBg, borderColor: borderDynamic },
                    ]}
                    onPress={() => {
                      setPickerMode('date');
                      setCurrentField('dob');
                      setPickerVisible(true);
                    }}
                    activeOpacity={0.75}
                  >
                    <Icon
                      name="calendar"
                      size={13}
                      color={textSecondary}
                      style={styles.leftIcon}
                    />
                    <Text
                      style={[
                        styles.pickerText,
                        {
                          color: createDetails.dob
                            ? textPrimary
                            : textSecondary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {createDetails.dob || t('kundali.dob_placeholder', '18/01/1996')}
                    </Text>
                    <Icon name="calendar" size={12} color={PRIMARY_MAROON} />
                  </TouchableOpacity>
                </View>

                {/* Time of Birth */}
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {t('kundali.tob_label', 'जन्मसमय')}{' '}
                    <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.inputBox,
                      { backgroundColor: inputBg, borderColor: borderDynamic },
                    ]}
                    onPress={() => {
                      setPickerMode('time');
                      setCurrentField('tob');
                      setPickerVisible(true);
                    }}
                    activeOpacity={0.75}
                  >
                    <Icon
                      name="clock"
                      size={13}
                      color={textSecondary}
                      style={styles.leftIcon}
                    />
                    <Text
                      style={[
                        styles.pickerText,
                        {
                          color: createDetails.tob
                            ? textPrimary
                            : textSecondary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {createDetails.tob || t('kundali.tob_placeholder', '06:45 AM')}
                    </Text>
                    <Icon name="clock" size={12} color={PRIMARY_MAROON} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 4. Place of Birth */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  {t('kundali.place_label', 'जन्म स्थान')}{' '}
                  <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputBox,
                    { backgroundColor: inputBg, borderColor: borderDynamic },
                  ]}
                >
                  <Icon
                    name="map-pin"
                    size={14}
                    color={textSecondary}
                    style={styles.leftIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: textPrimary }]}
                    placeholder={t('kundali.place_placeholder', 'प्रयागराज, उत्तर प्रदेश')}
                    placeholderTextColor={textSecondary}
                    value={createDetails.place}
                    onChangeText={(text) =>
                      setCreateDetails({ ...createDetails, place: text })
                    }
                  />
                  <Icon name="search" size={14} color={textSecondary} />
                </View>
              </View>

              {/* 5. Save to Recent Toggle */}
              <TouchableOpacity
                style={styles.saveToggleRow}
                onPress={() => setSaveToRecent(!saveToRecent)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.customCheckbox,
                    {
                      borderColor: saveToRecent ? PRIMARY_MAROON : '#9CA3AF',
                      backgroundColor: saveToRecent
                        ? PRIMARY_MAROON
                        : 'transparent',
                    },
                  ]}
                >
                  {saveToRecent && <Icon name="check" size={10} color="#FFFFFF" />}
                </View>
                <Text style={[styles.saveToggleText, { color: textPrimary }]}>
                  {t('kundali.save_to_recent', 'कुंडली सहेजें')}
                </Text>
              </TouchableOpacity>

              {/* 6. Info Hint Bar (Matching reference image) */}
              <View
                style={[
                  styles.infoHintBox,
                  {
                    backgroundColor: isDark ? '#1C222B' : INFO_BG,
                    borderColor: isDark ? '#2D3748' : INFO_BORDER,
                  },
                ]}
              >
                <Icon
                  name="info"
                  size={13}
                  color={isDark ? '#94A3B8' : INFO_TEXT}
                  style={{ marginRight: 7 }}
                />
                <Text
                  style={[
                    styles.infoHintText,
                    { color: isDark ? '#CBD5E1' : INFO_TEXT },
                  ]}
                >
                  सही गणना के लिए जन्मसमय और स्थान जाँचें।
                </Text>
              </View>

              {/* 7. Bottom Action Row: Reset + Generate Kundali */}
              <View style={styles.actionBtnRow}>
                <TouchableOpacity
                  style={[
                    styles.resetBtn,
                    {
                      backgroundColor: cardBg,
                      borderColor: isDark ? '#404040' : '#D1D5DB',
                    },
                  ]}
                  onPress={handleReset}
                  activeOpacity={0.75}
                >
                  <Icon
                    name="rotate-ccw"
                    size={13}
                    color={textPrimary}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.resetBtnText, { color: textPrimary }]}>
                    रीसेट
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.generateBtn}
                  onPress={handleGenerateKundali}
                  activeOpacity={0.8}
                >
                  <Text style={styles.generateBtnText}>
                    {t('kundali.generate_btn', 'कुंडली बनाएँ')}
                  </Text>
                  <Icon
                    name="arrow-right"
                    size={14}
                    color="#FFFFFF"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Existing Workflow: Kundali Matching Banner Shortcut */}
            <TouchableOpacity
              style={[
                styles.matchingBanner,
                {
                  backgroundColor: isDark ? '#1E1A1A' : SOFT_PINK_BG,
                  borderColor: isDark ? '#3B2020' : CARD_BORDER,
                },
              ]}
              onPress={() => navigation.navigate('KundaliMatchingForm')}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.matchingIconWrap,
                  { backgroundColor: isDark ? '#2E1E1E' : '#FFFFFF' },
                ]}
              >
                <Icon name="heart" size={14} color={PRIMARY_MAROON} />
              </View>
              <Text style={[styles.matchingTitle, { color: textPrimary }]}>
                {t('kundali.need_matching', 'कुंडली मिलान करना चाहते हैं? कुंडली मिलान खोलें')}
              </Text>
              <Icon name="chevron-right" size={15} color={PRIMARY_MAROON} />
            </TouchableOpacity>

            {/* Existing Workflow: Quick Preview of Recent Kundalis */}
            {savedKundalis.length > 0 && (
              <View
                style={[
                  styles.recentCard,
                  { backgroundColor: cardBg, borderColor: borderDynamic },
                ]}
              >
                <View style={styles.recentHeader}>
                  <Text style={[styles.recentTitle, { color: textPrimary }]}>
                    {t('kundali.recent_title', 'हाल की कुंडलियां')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActiveTab('saved')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>
                      {t('home.view_all', 'सभी देखें')} ({savedKundalis.length}) →
                    </Text>
                  </TouchableOpacity>
                </View>

                {savedKundalis.slice(0, 2).map((item, idx) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.recentRowItem,
                      {
                        backgroundColor: isDark ? '#262626' : '#FAFAFA',
                        borderColor: borderDynamic,
                        marginBottom: idx === 0 && savedKundalis.length > 1 ? 8 : 0,
                      },
                    ]}
                    onPress={() =>
                      navigation.navigate('KundaliGenerated', {
                        name: item.name,
                        dob: item.dob,
                        tob: item.tob,
                        place: item.place,
                        gender: item.gender,
                      })
                    }
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.recentAvatar,
                        {
                          backgroundColor:
                            item.gender === 'female'
                              ? '#FCE7F3'
                              : '#EFF6FF',
                        },
                      ]}
                    >
                      <Icon
                        name="user"
                        size={14}
                        color={item.gender === 'female' ? '#DB2777' : '#2563EB'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.recentNameRow}>
                        <Text
                          style={[styles.recentName, { color: textPrimary }]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text style={[styles.recentGenderTag, { color: textSecondary }]}>
                          {item.gender === 'female' ? '♀' : '♂'}
                        </Text>
                      </View>
                      <Text style={[styles.recentMeta, { color: textSecondary }]}>
                        {item.dob} • {item.tob}
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={14} color={PRIMARY_MAROON} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          /* TAB 2: Saved / Recent Kundalis View */
          <View>
            {/* Search Input */}
            <View
              style={[
                styles.searchBarBox,
                { backgroundColor: inputBg, borderColor: borderDynamic },
              ]}
            >
              <Icon
                name="search"
                size={14}
                color={textSecondary}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={[styles.searchInput, { color: textPrimary }]}
                placeholder={t(
                  'kundali.search_saved_placeholder',
                  'नाम या जन्म स्थान से खोजें...'
                )}
                placeholderTextColor={textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Icon name="x" size={14} color={textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Pills */}
            <View style={styles.filterPillsRow}>
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  genderFilter === 'all'
                    ? { backgroundColor: PRIMARY_MAROON, borderColor: PRIMARY_MAROON }
                    : { backgroundColor: cardBg, borderColor: borderDynamic },
                ]}
                onPress={() => setGenderFilter('all')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: genderFilter === 'all' ? '#FFFFFF' : textPrimary },
                  ]}
                >
                  {t('kundali.all_filter', 'सभी')} ({savedKundalis.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  genderFilter === 'male'
                    ? { backgroundColor: PRIMARY_MAROON, borderColor: PRIMARY_MAROON }
                    : { backgroundColor: cardBg, borderColor: borderDynamic },
                ]}
                onPress={() => setGenderFilter('male')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: genderFilter === 'male' ? '#FFFFFF' : textPrimary },
                  ]}
                >
                  {t('kundali.male', 'पुरुष')} ♂ (
                  {savedKundalis.filter((k) => k.gender === 'male').length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  genderFilter === 'female'
                    ? { backgroundColor: PRIMARY_MAROON, borderColor: PRIMARY_MAROON }
                    : { backgroundColor: cardBg, borderColor: borderDynamic },
                ]}
                onPress={() => setGenderFilter('female')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: genderFilter === 'female' ? '#FFFFFF' : textPrimary },
                  ]}
                >
                  {t('kundali.female', 'महिला')} ♀ (
                  {savedKundalis.filter((k) => k.gender === 'female').length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Empty or List */}
            {filteredSavedKundalis.length === 0 ? (
              <View
                style={[
                  styles.emptyBox,
                  { backgroundColor: cardBg, borderColor: borderDynamic },
                ]}
              >
                <View style={styles.emptyIconCircle}>
                  <Icon name="bookmark" size={24} color={PRIMARY_MAROON} />
                </View>
                <Text style={[styles.emptyTitle, { color: textPrimary }]}>
                  {t('kundali.no_saved_title', 'कोई सहेजी गई कुंडली नहीं मिली')}
                </Text>
                <Text style={[styles.emptyDesc, { color: textSecondary }]}>
                  {t(
                    'kundali.no_saved_desc',
                    'नई कुंडली बनाकर सहेजें ताकि आप उन्हें कभी भी देख और प्रबंधित कर सकें।'
                  )}
                </Text>
                <TouchableOpacity
                  style={styles.emptyCtaBtn}
                  onPress={() => setActiveTab('create')}
                >
                  <Icon
                    name="plus"
                    size={14}
                    color="#FFFFFF"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.emptyCtaText}>
                    {t('kundali.create_new_btn', 'नई कुंडली बनाएं')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.savedList}>
                {filteredSavedKundalis.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.savedCard,
                      { backgroundColor: cardBg, borderColor: borderDynamic },
                    ]}
                  >
                    {/* Header Row */}
                    <View style={styles.savedCardTop}>
                      <View style={styles.savedUserRow}>
                        <View
                          style={[
                            styles.savedAvatar,
                            {
                              backgroundColor:
                                item.gender === 'female' ? '#FCE7F3' : '#EFF6FF',
                            },
                          ]}
                        >
                          <Icon
                            name="user"
                            size={15}
                            color={item.gender === 'female' ? '#DB2777' : '#2563EB'}
                          />
                        </View>
                        <View>
                          <Text style={[styles.savedName, { color: textPrimary }]}>
                            {item.name}
                          </Text>
                          <Text
                            style={[
                              styles.savedGenderSub,
                              {
                                color:
                                  item.gender === 'female' ? '#DB2777' : '#2563EB',
                              },
                            ]}
                          >
                            {item.gender === 'female'
                              ? `${t('kundali.female', 'महिला')} ♀`
                              : `${t('kundali.male', 'पुरुष')} ♂`}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleDeleteKundali(item.id, item.name)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={styles.deleteBtn}
                      >
                        <Icon name="trash-2" size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    {/* Compact Details */}
                    <View
                      style={[
                        styles.savedDetailsBox,
                        {
                          backgroundColor: isDark ? '#262626' : '#F9FAFB',
                          borderColor: isDark ? '#333' : '#F3F4F6',
                        },
                      ]}
                    >
                      <View style={styles.detailLine}>
                        <Icon
                          name="calendar"
                          size={12}
                          color={PRIMARY_MAROON}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.detailText, { color: textPrimary }]}>
                          {item.dob}  •  {item.tob}
                        </Text>
                      </View>
                      <View style={styles.detailLine}>
                        <Icon
                          name="map-pin"
                          size={12}
                          color={PRIMARY_MAROON}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[styles.detailText, { color: textSecondary }]}
                          numberOfLines={1}
                        >
                          {item.place}
                        </Text>
                      </View>
                    </View>

                    {/* Astro Tags */}
                    {(item.rashi || item.nakshatra || item.lagna) && (
                      <View style={styles.astroPillsRow}>
                        {item.rashi && (
                          <View style={[styles.astroPill, { backgroundColor: isDark ? '#2D1A1A' : SOFT_ROSE_BG }]}>
                            <Text style={[styles.astroPillText, { color: isDark ? '#F8E6CE' : PRIMARY_MAROON }]}>
                              {item.rashi}
                            </Text>
                          </View>
                        )}
                        {item.nakshatra && (
                          <View style={[styles.astroPill, { backgroundColor: isDark ? '#2D1A1A' : SOFT_ROSE_BG }]}>
                            <Text style={[styles.astroPillText, { color: isDark ? '#F8E6CE' : PRIMARY_MAROON }]}>
                              {item.nakshatra}
                            </Text>
                          </View>
                        )}
                        {item.lagna && (
                          <View style={[styles.astroPill, { backgroundColor: isDark ? '#2D1A1A' : SOFT_ROSE_BG }]}>
                            <Text style={[styles.astroPillText, { color: isDark ? '#F8E6CE' : PRIMARY_MAROON }]}>
                              {item.lagna}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Card Footer */}
                    <View
                      style={[
                        styles.savedFooter,
                        { borderTopColor: isDark ? '#2D2D2D' : '#F3F4F6' },
                      ]}
                    >
                      <Text style={[styles.savedTime, { color: textSecondary }]}>
                        {item.savedAt || 'सहेजी गई'}
                      </Text>
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() =>
                          navigation.navigate('KundaliGenerated', {
                            name: item.name,
                            dob: item.dob,
                            tob: item.tob,
                            place: item.place,
                            gender: item.gender,
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewBtnText}>
                          {t('kundali.view_kundali_btn', 'कुंडली देखें')}
                        </Text>
                        <Icon
                          name="arrow-right"
                          size={12}
                          color="#FFFFFF"
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <DatePicker
        modal
        open={pickerVisible}
        theme={isDark ? 'dark' : 'light'}
        date={new Date()}
        mode={pickerMode}
        onConfirm={(date) => {
          setPickerVisible(false);
          let formattedValue = '';
          if (pickerMode === 'date') {
            formattedValue = `${String(date.getDate()).padStart(2, '0')}/${String(
              date.getMonth() + 1
            ).padStart(2, '0')}/${date.getFullYear()}`;
          } else {
            let hours = date.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const minutes = String(date.getMinutes()).padStart(2, '0');
            formattedValue = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
          }

          if (currentField) {
            setCreateDetails((prev) => ({
              ...prev,
              [currentField]: formattedValue,
            }));
          }
        }}
        onCancel={() => {
          setPickerVisible(false);
        }}
      />
    </KeyboardAvoidingView>
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
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: 32,
  },
  tabBar: {
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  tabBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  formSection: {
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 5,
  },
  requiredStar: {
    color: '#DC2626',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  leftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
    height: '100%',
  },
  pickerText: {
    flex: 1,
    fontSize: 11.5,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderPillCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  radioOuter: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: PRIMARY_MAROON,
  },
  genderPillText: {
    fontSize: 11.5,
  },
  saveToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  customCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  saveToggleText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  infoHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  infoHintText: {
    fontSize: 11,
    flex: 1,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  resetBtn: {
    flex: 0.36,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  generateBtn: {
    flex: 0.64,
    height: 42,
    borderRadius: 8,
    backgroundColor: PRIMARY_MAROON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  matchingIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  matchingTitle: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
  },
  recentCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: PRIMARY_MAROON,
  },
  recentRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  recentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  recentName: {
    fontSize: 12,
    fontWeight: '700',
  },
  recentGenderTag: {
    fontSize: 10.5,
  },
  recentMeta: {
    fontSize: 10.5,
    marginTop: 1,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
    height: '100%',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyBox: {
    padding: 24,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SOFT_ROSE_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
  },
  emptyCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  savedList: {
    gap: 10,
  },
  savedCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  savedCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  savedUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  savedName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  savedGenderSub: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  savedDetailsBox: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 8,
    gap: 4,
  },
  detailLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
    flex: 1,
  },
  astroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  astroPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  astroPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  savedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  savedTime: {
    fontSize: 10,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default KundaliScreen;
