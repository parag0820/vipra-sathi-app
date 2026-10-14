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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomHeader from '../components/CustomHeader';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedKundali, INITIAL_SAVED_KUNDALIS } from '../data/mockKundali';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Kundali'>;

const KundaliScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

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

  const handleGenerateKundali = async () => {
    const name = createDetails.name.trim() || 'Rahul Sharma';
    const dob = createDetails.dob.trim() || '24/09/1990';
    const tob = createDetails.tob.trim() || '10:30 AM';
    const place = createDetails.place.trim() || 'Jaipur, Rajasthan';
    const gender = createDetails.gender;

    if (saveToRecent) {
      const newKundali: SavedKundali = {
        id: 'k_' + Date.now(),
        name,
        gender,
        dob,
        tob,
        place,
        rashi: 'Mesh (मेष)',
        nakshatra: 'Ashwini (अश्विनी)',
        lagna: 'Leo (सिंह)',
        savedAt: 'Just now',
      };

      const updated = [newKundali, ...savedKundalis.filter(k => k.name.toLowerCase() !== name.toLowerCase())];
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
      t('kundali.delete_kundali', 'Delete Kundali'),
      `${t('kundali.confirm_delete_msg', 'Are you sure you want to delete this horoscope profile?')} (${name})`,
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('kundali.delete_kundali', 'Delete'),
          style: 'destructive',
          onPress: async () => {
            const updated = savedKundalis.filter(k => k.id !== id);
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

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    iconName?: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
        />
        {iconName && <Icon name={iconName as any} size={18} color={isDark ? '#FFF' : '#333'} />}
      </View>
    </View>
  );

  const renderDateTimePicker = (
    label: string,
    value: string,
    field: 'dob' | 'tob',
    placeholder: string,
    iconName?: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => {
          setPickerMode(field === 'dob' ? 'date' : 'time');
          setCurrentField(field);
          setPickerVisible(true);
        }}
      >
        <Text style={[styles.textInput, { color: value ? colors.text : colors.textLight, paddingTop: Platform.OS === 'ios' ? 12 : 8 }]}>
          {value || placeholder}
        </Text>
        {iconName && <Icon name={iconName as any} size={18} color={isDark ? '#FFF' : '#333'} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#800000' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CustomHeader
        title={t('kundali.title', 'Create Kundali')}
        showBack={true}
        headerBgColor="#800000"
        headerTextColor="#FFF"
      />

      <View style={[styles.mainContentWrapper, { backgroundColor: colors.background }]}>
        {/* Segmented Top Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'create'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => setActiveTab('create')}
            activeOpacity={0.8}
          >
            <Icon
              name="plus-circle"
              size={14}
              color={activeTab === 'create' ? '#FFF' : colors.textLight}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'create' ? { color: '#FFF' } : { color: colors.textLight },
              ]}
            >
              {t('kundali.create_tab', 'Create Kundali')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'saved'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.8}
          >
            <Icon
              name="bookmark"
              size={14}
              color={activeTab === 'saved' ? '#FFF' : colors.textLight}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'saved' ? { color: '#FFF' } : { color: colors.textLight },
              ]}
            >
              {t('kundali.saved_tab', 'Recent / Saved Kundali')}
            </Text>
            {savedKundalis.length > 0 && (
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor: activeTab === 'saved' ? 'rgba(255,255,255,0.25)' : colors.primary,
                  },
                ]}
              >
                <Text style={styles.tabBadgeText}>{savedKundalis.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'create' ? (
            <>
              {/* Form Card */}
              <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {renderInput(
                  t('kundali.name_label', 'Name'),
                  createDetails.name,
                  (text) => setCreateDetails({ ...createDetails, name: text }),
                  t('kundali.name_placeholder', 'Rahul Sharma'),
                  'user'
                )}

                {renderDateTimePicker(
                  t('kundali.dob_label', 'Date of Birth'),
                  createDetails.dob,
                  'dob',
                  t('kundali.dob_placeholder', '24/09/1990'),
                  'calendar'
                )}

                {renderDateTimePicker(
                  t('kundali.tob_label', 'Time of Birth'),
                  createDetails.tob,
                  'tob',
                  t('kundali.tob_placeholder', '10:30 AM'),
                  'clock'
                )}

                {renderInput(
                  t('kundali.place_label', 'Place of Birth'),
                  createDetails.place,
                  (text) => setCreateDetails({ ...createDetails, place: text }),
                  t('kundali.place_placeholder', 'Jaipur, Rajasthan'),
                  'map-pin'
                )}

                {/* Modern Visual Gender Selector */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {t('kundali.gender_label', 'Gender')}
                  </Text>
                  <View style={styles.modernGenderRow}>
                    {/* Male Selection Card */}
                    <TouchableOpacity
                      style={[
                        styles.modernGenderCard,
                        {
                          backgroundColor: colors.background,
                          borderColor:
                            createDetails.gender === 'male' ? colors.primary : colors.border,
                        },
                        createDetails.gender === 'male' && {
                          backgroundColor: isDark ? 'rgba(128,0,0,0.25)' : '#FFF6F0',
                          borderWidth: 1.8,
                        },
                      ]}
                      onPress={() => setCreateDetails({ ...createDetails, gender: 'male' })}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.genderIconCircle,
                          {
                            backgroundColor:
                              createDetails.gender === 'male'
                                ? colors.primary
                                : isDark
                                  ? '#333'
                                  : '#EDE9E3',
                          },
                        ]}
                      >
                        <Icon
                          name="user"
                          size={17}
                          color={createDetails.gender === 'male' ? '#FFF' : colors.textLight}
                        />
                      </View>
                      <View style={styles.genderTextCol}>
                        <Text
                          style={[
                            styles.modernGenderTitle,
                            {
                              color:
                                createDetails.gender === 'male'
                                  ? colors.primary
                                  : colors.text,
                            },
                          ]}
                        >
                          {t('kundali.male', 'Male')} <Text style={{ fontSize: 13 }}>♂</Text>
                        </Text>
                        <Text style={[styles.modernGenderSub, { color: colors.textLight }]}>
                          {t('kundali.male_sub', 'Boy / Groom')}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.genderRadioCircle,
                          {
                            borderColor:
                              createDetails.gender === 'male' ? colors.primary : colors.border,
                            backgroundColor:
                              createDetails.gender === 'male' ? colors.primary : 'transparent',
                          },
                        ]}
                      >
                        {createDetails.gender === 'male' && (
                          <Icon name="check" size={10} color="#FFF" />
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Female Selection Card */}
                    <TouchableOpacity
                      style={[
                        styles.modernGenderCard,
                        {
                          backgroundColor: colors.background,
                          borderColor:
                            createDetails.gender === 'female' ? colors.primary : colors.border,
                        },
                        createDetails.gender === 'female' && {
                          backgroundColor: isDark ? 'rgba(128,0,0,0.25)' : '#FFF6F0',
                          borderWidth: 1.8,
                        },
                      ]}
                      onPress={() => setCreateDetails({ ...createDetails, gender: 'female' })}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.genderIconCircle,
                          {
                            backgroundColor:
                              createDetails.gender === 'female'
                                ? colors.primary
                                : isDark
                                  ? '#333'
                                  : '#EDE9E3',
                          },
                        ]}
                      >
                        <Icon
                          name="user"
                          size={17}
                          color={createDetails.gender === 'female' ? '#FFF' : colors.textLight}
                        />
                      </View>
                      <View style={styles.genderTextCol}>
                        <Text
                          style={[
                            styles.modernGenderTitle,
                            {
                              color:
                                createDetails.gender === 'female'
                                  ? colors.primary
                                  : colors.text,
                            },
                          ]}
                        >
                          {t('kundali.female', 'Female')} <Text style={{ fontSize: 13 }}>♀</Text>
                        </Text>
                        <Text style={[styles.modernGenderSub, { color: colors.textLight }]}>
                          {t('kundali.female_sub', 'Girl / Bride')}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.genderRadioCircle,
                          {
                            borderColor:
                              createDetails.gender === 'female' ? colors.primary : colors.border,
                            backgroundColor:
                              createDetails.gender === 'female' ? colors.primary : 'transparent',
                          },
                        ]}
                      >
                        {createDetails.gender === 'female' && (
                          <Icon name="check" size={10} color="#FFF" />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Save to Recent Checkbox */}
                <TouchableOpacity
                  style={styles.saveToggleRow}
                  onPress={() => setSaveToRecent(!saveToRecent)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.customCheckbox,
                      {
                        borderColor: saveToRecent ? colors.primary : colors.border,
                        backgroundColor: saveToRecent ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {saveToRecent && <Icon name="check" size={12} color="#FFF" />}
                  </View>
                  <Text style={[styles.saveToggleText, { color: colors.text }]}>
                    {t('kundali.save_to_recent', 'Save to Recent Kundalis')}
                  </Text>
                </TouchableOpacity>

                {/* Generate Button */}
                <TouchableOpacity
                  style={[styles.generateBtn, { backgroundColor: colors.primary }]}
                  onPress={handleGenerateKundali}
                  activeOpacity={0.8}
                >
                  <Text style={styles.generateBtnText}>
                    {t('kundali.generate_btn', 'Generate Kundali')}
                  </Text>
                  <Icon name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>

              {/* Kundali Matching Banner Shortcut */}
              <TouchableOpacity
                style={[
                  styles.matchingShortcutBanner,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => navigation.navigate('KundaliMatchingForm')}
                activeOpacity={0.8}
              >
                <View style={[styles.matchingShortcutIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFF0E6' }]}>
                  <Icon name="heart" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.matchingShortcutTitle, { color: colors.text }]}>
                    {t('kundali.need_matching', 'Looking for Kundali Milan? Open Kundali Matching')}
                  </Text>
                </View>
                <Icon name="chevron-right" size={16} color={colors.primary} />
              </TouchableOpacity>

              {/* Quick Preview of Recent Kundalis */}
              {savedKundalis.length > 0 && (
                <View style={[styles.recentSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.recentSectionHeader}>
                    <Text style={[styles.recentTitle, { color: colors.text }]}>
                      {t('kundali.recent_title', 'Recent Kundalis')}
                    </Text>
                    <TouchableOpacity onPress={() => setActiveTab('saved')}>
                      <Text style={[styles.viewAllRecentText, { color: colors.primary }]}>
                        {t('home.view_all', 'View All')} ({savedKundalis.length}) →
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {savedKundalis.slice(0, 2).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.quickRecentItem,
                        { backgroundColor: colors.background, borderColor: colors.border },
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
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.recentAvatar,
                          {
                            backgroundColor:
                              item.gender === 'female'
                                ? 'rgba(236,72,153,0.15)'
                                : 'rgba(59,130,246,0.15)',
                          },
                        ]}
                      >
                        <Icon
                          name="user"
                          size={16}
                          color={item.gender === 'female' ? '#DB2777' : '#2563EB'}
                        />
                      </View>
                      <View style={styles.recentInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.recentName, { color: colors.text }]}>
                            {item.name}
                          </Text>
                          <Text style={{ fontSize: 11, color: colors.textLight }}>
                            {item.gender === 'female' ? '♀' : '♂'}
                          </Text>
                        </View>
                        <Text style={[styles.recentDate, { color: colors.textLight }]}>
                          📅 {item.dob} • ⏰ {item.tob}
                        </Text>
                      </View>
                      <Icon name="arrow-right" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          ) : (
            /* Tab 2: Saved / Recent Kundalis View */
            <View style={styles.savedTabContainer}>
              {/* Search Bar */}
              <View
                style={[
                  styles.searchBarWrapper,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Icon name="search" size={16} color={colors.textLight} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.searchTextInput, { color: colors.text }]}
                  placeholder={t('kundali.search_saved_placeholder', 'Search by name or birth place...')}
                  placeholderTextColor={colors.textLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="x" size={16} color={colors.textLight} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Filter Pills */}
              <View style={styles.filterPillsRow}>
                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    genderFilter === 'all'
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                  onPress={() => setGenderFilter('all')}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: genderFilter === 'all' ? '#FFF' : colors.text },
                    ]}
                  >
                    {t('kundali.all_filter', 'All')} ({savedKundalis.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    genderFilter === 'male'
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                  onPress={() => setGenderFilter('male')}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: genderFilter === 'male' ? '#FFF' : colors.text },
                    ]}
                  >
                    {t('kundali.male', 'Male')} ♂ (
                    {savedKundalis.filter((k) => k.gender === 'male').length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    genderFilter === 'female'
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                  onPress={() => setGenderFilter('female')}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: genderFilter === 'female' ? '#FFF' : colors.text },
                    ]}
                  >
                    {t('kundali.female', 'Female')} ♀ (
                    {savedKundalis.filter((k) => k.gender === 'female').length})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Saved Kundalis List or Empty State */}
              {filteredSavedKundalis.length === 0 ? (
                <View
                  style={[
                    styles.emptySavedState,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#333' : '#FFF0E6' }]}>
                    <Icon name="bookmark" size={32} color={colors.primary} />
                  </View>
                  <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                    {t('kundali.no_saved_title', 'No Saved Kundalis Yet')}
                  </Text>
                  <Text style={[styles.emptyStateDesc, { color: colors.textLight }]}>
                    {t(
                      'kundali.no_saved_desc',
                      'Generate and save horoscopes to view, analyze, and manage them anytime.'
                    )}
                  </Text>
                  <TouchableOpacity
                    style={[styles.emptyCtaBtn, { backgroundColor: colors.primary }]}
                    onPress={() => setActiveTab('create')}
                  >
                    <Icon name="plus" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.emptyCtaText}>
                      {t('kundali.create_new_btn', '+ Create New Kundali')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.savedList}>
                  {filteredSavedKundalis.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.savedKundaliCard,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                      ]}
                    >
                      {/* Card Header */}
                      <View style={styles.savedCardHeader}>
                        <View style={styles.savedCardUserRow}>
                          <View
                            style={[
                              styles.savedCardAvatar,
                              {
                                backgroundColor:
                                  item.gender === 'female'
                                    ? 'rgba(236,72,153,0.15)'
                                    : 'rgba(59,130,246,0.15)',
                              },
                            ]}
                          >
                            <Icon
                              name="user"
                              size={18}
                              color={item.gender === 'female' ? '#DB2777' : '#2563EB'}
                            />
                          </View>
                          <View>
                            <Text style={[styles.savedCardName, { color: colors.text }]}>
                              {item.name}
                            </Text>
                            <View style={styles.genderBadge}>
                              <Text
                                style={[
                                  styles.genderBadgeText,
                                  { color: item.gender === 'female' ? '#DB2777' : '#2563EB' },
                                ]}
                              >
                                {item.gender === 'female'
                                  ? `${t('kundali.female', 'Female')} ♀`
                                  : `${t('kundali.male', 'Male')} ♂`}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Delete Button */}
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleDeleteKundali(item.id, item.name)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Icon name="trash-2" size={16} color={colors.error || '#EF4444'} />
                        </TouchableOpacity>
                      </View>

                      {/* Details Grid */}
                      <View
                        style={[
                          styles.detailsGridBox,
                          { backgroundColor: colors.background, borderColor: colors.border },
                        ]}
                      >
                        <View style={styles.detailRowItem}>
                          <Icon name="calendar" size={13} color={colors.primary} style={{ marginRight: 6 }} />
                          <Text style={[styles.detailItemLabel, { color: colors.textLight }]}>
                            {t('kundali.dob_label', 'DOB')}:
                          </Text>
                          <Text style={[styles.detailItemVal, { color: colors.text }]}>
                            {item.dob}
                          </Text>
                        </View>

                        <View style={styles.detailRowItem}>
                          <Icon name="clock" size={13} color={colors.primary} style={{ marginRight: 6 }} />
                          <Text style={[styles.detailItemLabel, { color: colors.textLight }]}>
                            {t('kundali.tob_label', 'TOB')}:
                          </Text>
                          <Text style={[styles.detailItemVal, { color: colors.text }]}>
                            {item.tob}
                          </Text>
                        </View>

                        <View style={styles.detailRowItem}>
                          <Icon name="map-pin" size={13} color={colors.primary} style={{ marginRight: 6 }} />
                          <Text style={[styles.detailItemLabel, { color: colors.textLight }]}>
                            {t('kundali.place_label', 'Place')}:
                          </Text>
                          <Text style={[styles.detailItemVal, { color: colors.text }]} numberOfLines={1}>
                            {item.place}
                          </Text>
                        </View>
                      </View>

                      {/* Astrology Tag Pills */}
                      {(item.rashi || item.nakshatra || item.lagna) && (
                        <View style={styles.astroPillsRow}>
                          {item.rashi && (
                            <View style={[styles.astroPill, { backgroundColor: isDark ? '#333' : '#F4ECE1' }]}>
                              <Text style={[styles.astroPillText, { color: colors.text }]}>
                                ♈ {item.rashi}
                              </Text>
                            </View>
                          )}
                          {item.nakshatra && (
                            <View style={[styles.astroPill, { backgroundColor: isDark ? '#333' : '#F4ECE1' }]}>
                              <Text style={[styles.astroPillText, { color: colors.text }]}>
                                ⭐ {item.nakshatra}
                              </Text>
                            </View>
                          )}
                          {item.lagna && (
                            <View style={[styles.astroPill, { backgroundColor: isDark ? '#333' : '#F4ECE1' }]}>
                              <Text style={[styles.astroPillText, { color: colors.text }]}>
                                🪐 {item.lagna}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                      {/* Footer: Saved Date & View CTA */}
                      <View style={styles.savedCardFooter}>
                        <Text style={[styles.savedTimestamp, { color: colors.textLight }]}>
                          {item.savedAt ? `Saved: ${item.savedAt}` : 'Saved profile'}
                        </Text>
                        <TouchableOpacity
                          style={[styles.viewKundaliBtn, { backgroundColor: colors.primary }]}
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
                          <Text style={styles.viewKundaliBtnText}>
                            {t('kundali.view_kundali_btn', 'View Kundali')}
                          </Text>
                          <Icon name="arrow-right" size={13} color="#FFF" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

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
            setCreateDetails((prev) => ({ ...prev, [currentField]: formattedValue }));
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
  mainContentWrapper: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontWeight: '700',
    fontSize: 12,
  },
  tabBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
  },
  modernGenderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modernGenderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
  },
  genderIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  genderTextCol: {
    flex: 1,
  },
  modernGenderTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modernGenderSub: {
    fontSize: 10,
    marginTop: 1,
  },
  genderRadioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  saveToggleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  generateBtn: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  matchingShortcutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  matchingShortcutIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  matchingShortcutTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  recentSection: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  viewAllRecentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickRecentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  recentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 13,
    fontWeight: '700',
  },
  recentDate: {
    fontSize: 11,
    marginTop: 2,
  },
  savedTabContainer: {
    gap: 12,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  savedList: {
    gap: 12,
  },
  savedKundaliCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  savedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  savedCardUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  savedCardAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedCardName: {
    fontSize: 14,
    fontWeight: '700',
  },
  genderBadge: {
    marginTop: 2,
  },
  genderBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 6,
  },
  detailsGridBox: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    gap: 6,
    marginBottom: 10,
  },
  detailRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItemLabel: {
    fontSize: 11,
    marginRight: 4,
  },
  detailItemVal: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  astroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
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
  savedCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  savedTimestamp: {
    fontSize: 11,
  },
  viewKundaliBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewKundaliBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptySavedState: {
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  emptyCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyCtaText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default KundaliScreen;
