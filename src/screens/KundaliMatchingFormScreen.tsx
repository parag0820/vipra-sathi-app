import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { INITIAL_SAVED_KUNDALIS, SavedKundali } from '../data/mockKundali';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'KundaliMatchingForm'>;

const PRIMARY_MAROON = '#8B1D1D';
const BORDER_COLOR = '#E5E7EB';
const MUTED_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const INPUT_BG = '#F9FAFB';

const DEMO_BRIDE = {
  name: 'अनन्या शर्मा',
  dob: '12/05/1998',
  tob: '08:30 AM',
  place: 'वाराणसी, उत्तर प्रदेश, भारत',
};

const DEMO_GROOM = {
  name: 'आदित्य मिश्रा',
  dob: '18/01/1996',
  tob: '06:45 AM',
  place: 'प्रयागराज, उत्तर प्रदेश, भारत',
};

const KundaliMatchingFormScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();

  const [brideDetails, setBrideDetails] = useState({
    name: '',
    dob: '',
    tob: '',
    place: '',
  });

  const [groomDetails, setGroomDetails] = useState({
    name: '',
    dob: '',
    tob: '',
    place: '',
  });

  const [showSavedList, setShowSavedList] = useState(false);

  // Date/Time picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerField, setCurrentPickerField] = useState<{
    person: 'bride' | 'groom';
    field: 'dob' | 'tob';
  } | null>(null);

  // Prefill demo data matching the details screen reference
  const handleFillDemo = () => {
    setBrideDetails(DEMO_BRIDE);
    setGroomDetails(DEMO_GROOM);
  };

  const handleReset = () => {
    setBrideDetails({ name: '', dob: '', tob: '', place: '' });
    setGroomDetails({ name: '', dob: '', tob: '', place: '' });
  };

  const handleSelectSaved = (item: SavedKundali) => {
    if (item.gender === 'female') {
      setBrideDetails({
        name: item.name,
        dob: item.dob,
        tob: item.tob,
        place: item.place,
      });
    } else {
      setGroomDetails({
        name: item.name,
        dob: item.dob,
        tob: item.tob,
        place: item.place,
      });
    }
  };

  const openPicker = (person: 'bride' | 'groom', field: 'dob' | 'tob') => {
    setPickerMode(field === 'dob' ? 'date' : 'time');
    setCurrentPickerField({ person, field });
    setPickerVisible(true);
  };

  const handleNavigateMatch = () => {
    navigation.navigate('KundaliMatchingResult', {
      brideDetails: brideDetails.name.trim() ? brideDetails : DEMO_BRIDE,
      groomDetails: groomDetails.name.trim() ? groomDetails : DEMO_GROOM,
    });
  };

  const isFormFilled =
    brideDetails.name.trim().length > 0 || groomDetails.name.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#FFFFFF'}
      />

      {/* Top Header Bar (Matching details screen) */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="chevron-left" size={26} color={PRIMARY_MAROON} />
          </TouchableOpacity>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerTitle}>कुंडली मिलान</Text>
            <Text style={styles.headerSubtitle}>जन्म विवरण दर्ज करें • वर एवं वधू</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.demoBtn}
          onPress={isFormFilled ? handleReset : handleFillDemo}
          activeOpacity={0.7}
        >
          <Icon
            name={isFormFilled ? 'rotate-ccw' : 'zap'}
            size={13}
            color={PRIMARY_MAROON}
            style={styles.demoIcon}
          />
          <Text style={styles.demoBtnText}>
            {isFormFilled ? 'रीसेट करें' : 'नमूना भरें'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 85 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stepper Indicator (Matching details screen, Step 1 active) */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepCircleActive}>
              <Text style={styles.stepNumberActive}>1</Text>
            </View>
            <Text style={styles.stepLabelActive}>जन्म विवरण</Text>
          </View>

          <View style={styles.stepDividerLine} />

          <View style={styles.stepItem}>
            <View style={styles.stepCircleInactive}>
              <Text style={styles.stepNumberInactive}>2</Text>
            </View>
            <Text style={styles.stepLabelInactive}>मिलान परिणाम</Text>
          </View>
        </View>

        {/* Quick Fill From Saved Profiles Toggle */}
        <View style={[styles.savedSectionWrap, { backgroundColor: isDark ? '#1E1E1E' : '#FAF5EE' }]}>
          <TouchableOpacity
            style={styles.savedSectionHeader}
            onPress={() => setShowSavedList(!showSavedList)}
            activeOpacity={0.7}
          >
            <View style={styles.savedTitleRow}>
              <Icon name="bookmark" size={14} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
              <Text style={styles.savedTitleText}>सहेजी गई कुंडली से त्वरित भरें</Text>
            </View>
            <Icon
              name={showSavedList ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={MUTED_TEXT}
            />
          </TouchableOpacity>

          {showSavedList && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.savedScrollRow}
            >
              {INITIAL_SAVED_KUNDALIS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.savedProfileChip, { backgroundColor: isDark ? '#2B1A1A' : '#FFFFFF' }]}
                  onPress={() => handleSelectSaved(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.savedGenderBadge, { backgroundColor: item.gender === 'female' ? '#FEE2E2' : '#E0E7FF' }]}>
                    <Text style={[styles.savedGenderText, { color: item.gender === 'female' ? '#DC2626' : '#2563EB' }]}>
                      {item.gender === 'female' ? 'वधू' : 'वर'}
                    </Text>
                  </View>
                  <Text style={[styles.savedProfileName, { color: isDark ? '#F8E6CE' : DARK_TEXT }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.savedProfilePlace} numberOfLines={1}>
                    {item.place.split(',')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* CARD 1: वधू का विवरण (Bride Details) */}
        <View style={[styles.formCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {/* Header Row with Avatar */}
          <View style={styles.cardHeaderRow}>
            <Image
              source={require('../assets/images/bride_avatar.jpg')}
              style={styles.cardAvatar}
            />
            <View style={styles.cardHeaderTextWrap}>
              <Text style={styles.cardTitle}>वधू का विवरण (Bride Details)</Text>
              <Text style={styles.cardSubtitle}>कन्या का नाम, जन्म तिथि, समय व स्थान</Text>
            </View>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
              पूरा नाम <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}>
              <Icon name="user" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                placeholder="जैसे: अनन्या शर्मा"
                placeholderTextColor={MUTED_TEXT}
                value={brideDetails.name}
                onChangeText={(text) => setBrideDetails({ ...brideDetails, name: text })}
              />
            </View>
          </View>

          {/* Responsive Row: DOB & TOB */}
          <View style={styles.rowInputs}>
            {/* DOB */}
            <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
              <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                जन्म तिथि <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}
                onPress={() => openPicker('bride', 'dob')}
                activeOpacity={0.8}
              >
                <Icon name="calendar" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
                <Text
                  style={[
                    styles.pickerValueText,
                    { color: brideDetails.dob ? (isDark ? '#F8E6CE' : DARK_TEXT) : MUTED_TEXT },
                  ]}
                  numberOfLines={1}
                >
                  {brideDetails.dob || 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* TOB */}
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
              <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                जन्म समय <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}
                onPress={() => openPicker('bride', 'tob')}
                activeOpacity={0.8}
              >
                <Icon name="clock" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
                <Text
                  style={[
                    styles.pickerValueText,
                    { color: brideDetails.tob ? (isDark ? '#F8E6CE' : DARK_TEXT) : MUTED_TEXT },
                  ]}
                  numberOfLines={1}
                >
                  {brideDetails.tob || 'HH:MM AM/PM'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Place of Birth */}
          <View style={[styles.inputGroup, { marginBottom: 2 }]}>
            <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
              जन्म स्थान (शहर, राज्य) <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}>
              <Icon name="map-pin" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                placeholder="जैसे: वाराणसी, उत्तर प्रदेश"
                placeholderTextColor={MUTED_TEXT}
                value={brideDetails.place}
                onChangeText={(text) => setBrideDetails({ ...brideDetails, place: text })}
              />
            </View>
          </View>
        </View>

        {/* CARD 2: वर का विवरण (Groom Details) */}
        <View style={[styles.formCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {/* Header Row with Avatar */}
          <View style={styles.cardHeaderRow}>
            <Image
              source={require('../assets/images/groom_avatar.jpg')}
              style={styles.cardAvatar}
            />
            <View style={styles.cardHeaderTextWrap}>
              <Text style={styles.cardTitle}>वर का विवरण (Groom Details)</Text>
              <Text style={styles.cardSubtitle}>वर का नाम, जन्म तिथि, समय व स्थान</Text>
            </View>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
              पूरा नाम <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}>
              <Icon name="user" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                placeholder="जैसे: आदित्य मिश्रा"
                placeholderTextColor={MUTED_TEXT}
                value={groomDetails.name}
                onChangeText={(text) => setGroomDetails({ ...groomDetails, name: text })}
              />
            </View>
          </View>

          {/* Responsive Row: DOB & TOB */}
          <View style={styles.rowInputs}>
            {/* DOB */}
            <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
              <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                जन्म तिथि <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}
                onPress={() => openPicker('groom', 'dob')}
                activeOpacity={0.8}
              >
                <Icon name="calendar" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
                <Text
                  style={[
                    styles.pickerValueText,
                    { color: groomDetails.dob ? (isDark ? '#F8E6CE' : DARK_TEXT) : MUTED_TEXT },
                  ]}
                  numberOfLines={1}
                >
                  {groomDetails.dob || 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* TOB */}
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
              <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                जन्म समय <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}
                onPress={() => openPicker('groom', 'tob')}
                activeOpacity={0.8}
              >
                <Icon name="clock" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
                <Text
                  style={[
                    styles.pickerValueText,
                    { color: groomDetails.tob ? (isDark ? '#F8E6CE' : DARK_TEXT) : MUTED_TEXT },
                  ]}
                  numberOfLines={1}
                >
                  {groomDetails.tob || 'HH:MM AM/PM'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Place of Birth */}
          <View style={[styles.inputGroup, { marginBottom: 2 }]}>
            <Text style={[styles.inputLabel, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
              जन्म स्थान (शहर, राज्य) <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={[styles.inputBox, { backgroundColor: isDark ? '#262626' : INPUT_BG }]}>
              <Icon name="map-pin" size={14} color={PRIMARY_MAROON} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                placeholder="जैसे: प्रयागराज, उत्तर प्रदेश"
                placeholderTextColor={MUTED_TEXT}
                value={groomDetails.place}
                onChangeText={(text) => setGroomDetails({ ...groomDetails, place: text })}
              />
            </View>
          </View>
        </View>

        {/* Tip / Guidance note */}
        <View style={styles.infoNoteBox}>
          <Icon name="info" size={14} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
          <Text style={styles.infoNoteText}>
            सटीक जन्म समय व स्थान दर्ज करने से अष्टकूट, मांगलिक दोष एवं ग्रह स्थिति का विश्लेषण पूर्णतः शुद्ध होता है।
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleNavigateMatch}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>कुंडली मिलान परिणाम देखें</Text>
          <Icon name="arrow-right" size={16} color="#FFFFFF" style={styles.submitBtnIcon} />
        </TouchableOpacity>
      </View>

      {/* Reusable Date / Time Modal Picker */}
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
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedValue = `${day}/${month}/${year}`;
          } else {
            let hours = date.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const minutes = String(date.getMinutes()).padStart(2, '0');
            formattedValue = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
          }

          if (currentPickerField) {
            const { person, field } = currentPickerField;
            if (person === 'bride') {
              setBrideDetails((prev) => ({ ...prev, [field]: formattedValue }));
            } else {
              setGroomDetails((prev) => ({ ...prev, [field]: formattedValue }));
            }
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 2,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    marginTop: 1,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FFF0ED',
  },
  demoIcon: {
    marginRight: 4,
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_MAROON,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PRIMARY_MAROON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLabelActive: {
    fontSize: 12,
    color: PRIMARY_MAROON,
    fontWeight: '700',
    marginLeft: 6,
  },
  stepDividerLine: {
    width: 45,
    height: 1.5,
    backgroundColor: BORDER_COLOR,
    marginHorizontal: 10,
  },
  stepCircleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberInactive: {
    fontSize: 11,
    color: MUTED_TEXT,
    fontWeight: '600',
  },
  stepLabelInactive: {
    fontSize: 12,
    color: MUTED_TEXT,
    marginLeft: 6,
  },
  savedSectionWrap: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 10,
    marginBottom: 12,
  },
  savedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedTitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_MAROON,
  },
  savedScrollRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
  },
  savedProfileChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 110,
  },
  savedGenderBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginBottom: 4,
  },
  savedGenderText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  savedProfileName: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  savedProfilePlace: {
    fontSize: 9.5,
    color: MUTED_TEXT,
    marginTop: 1,
  },
  formCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3D899',
    marginRight: 10,
  },
  cardHeaderTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  cardSubtitle: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    marginTop: 1,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  requiredStar: {
    color: '#DC2626',
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 10,
    height: 38,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
    height: '100%',
  },
  pickerValueText: {
    flex: 1,
    fontSize: 12,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  infoNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_MAROON,
    padding: 10,
    marginTop: 2,
    marginBottom: 16,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 10.5,
    color: '#4B5563',
    lineHeight: 15,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingHorizontal: 14,
    paddingTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_MAROON,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  submitBtnIcon: {
    marginLeft: 8,
  },
});

export default KundaliMatchingFormScreen;
