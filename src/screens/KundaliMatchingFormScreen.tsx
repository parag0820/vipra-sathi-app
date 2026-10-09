import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomHeader from '../components/CustomHeader';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'KundaliMatchingForm'>;

const KundaliMatchingFormScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [brideDetails, setBrideDetails] = useState({
    name: '',
    dob: '',
    tob: '',
    place: ''
  });

  const [groomDetails, setGroomDetails] = useState({
    name: '',
    dob: '',
    tob: '',
    place: ''
  });

  const { t } = useTranslation();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerField, setCurrentPickerField] = useState<{ person: 'bride' | 'groom', field: 'dob' | 'tob' } | null>(null);

  const renderCompactInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string
  ) => (
    <View style={[styles.compactInputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.compactLabelBg, { backgroundColor: isDark ? colors.border : '#E5C69F' }]}>
        <Text style={[styles.compactLabelText, { color: isDark ? '#FFF' : colors.primary }]} numberOfLines={1}>{label}</Text>
      </View>
      <TextInput
        style={[styles.compactTextInput, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );

  const renderCompactDateTimePicker = (
    label: string,
    value: string,
    person: 'bride' | 'groom',
    field: 'dob' | 'tob',
    placeholder: string
  ) => (
    <TouchableOpacity
      style={[styles.compactInputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => {
        setPickerMode(field === 'dob' ? 'date' : 'time');
        setCurrentPickerField({ person, field });
        setPickerVisible(true);
      }}
    >
      <View style={[styles.compactLabelBg, { backgroundColor: isDark ? colors.border : '#E5C69F' }]}>
        <Text style={[styles.compactLabelText, { color: isDark ? '#FFF' : colors.primary }]} numberOfLines={1}>{label}</Text>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 8, justifyContent: 'center' }}>
        <Text style={{ color: value ? colors.text : colors.textLight, fontSize: 12 }} numberOfLines={1}>
          {value || placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#800000' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CustomHeader
        title={t('kundali.match_title', 'Kundali Matching')}
        showBack={true}
        headerBgColor="#800000"
        headerTextColor="#FFF"
      />

      <View style={[styles.mainContentWrapper, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Bride Details Section */}
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Icon name="user" size={20} color={isDark ? '#FFF' : colors.text} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Bride Details</Text>
            </View>

            <View style={styles.row}>
              {renderCompactInput('Name', brideDetails.name, (text) => setBrideDetails({ ...brideDetails, name: text }), 'Name')}
              {renderCompactDateTimePicker('DOB', brideDetails.dob, 'bride', 'dob', 'DD/MM/YY')}
            </View>
            <View style={styles.row}>
              {renderCompactDateTimePicker('TOB', brideDetails.tob, 'bride', 'tob', 'HH:MM AM')}
              {renderCompactInput('Place', brideDetails.place, (text) => setBrideDetails({ ...brideDetails, place: text }), 'City')}
            </View>
          </View>

          {/* Groom Details Section */}
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Icon name="user" size={20} color={isDark ? '#FFF' : colors.text} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Groom Details</Text>
            </View>

            <View style={styles.row}>
              {renderCompactInput('Name', groomDetails.name, (text) => setGroomDetails({ ...groomDetails, name: text }), 'Name')}
              {renderCompactDateTimePicker('DOB', groomDetails.dob, 'groom', 'dob', 'DD/MM/YY')}
            </View>
            <View style={styles.row}>
              {renderCompactDateTimePicker('TOB', groomDetails.tob, 'groom', 'tob', 'HH:MM AM')}
              {renderCompactInput('Place', groomDetails.place, (text) => setGroomDetails({ ...groomDetails, place: text }), 'City')}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.matchBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('KundaliMatchingResult')}
          >
            <Text style={styles.matchBtnText}>Match Kundali</Text>
            <Icon name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>


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
            formattedValue = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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
            if (person === 'bride') setBrideDetails(prev => ({ ...prev, [field]: formattedValue }));
            if (person === 'groom') setGroomDetails(prev => ({ ...prev, [field]: formattedValue }));
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
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  sectionCard: {
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  compactInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    overflow: 'hidden',
    marginBottom: 10,
  },
  compactLabelBg: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    minWidth: 46,
  },
  compactLabelText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  compactTextInput: {
    flex: 1,
    fontSize: 12,
    height: '100%',
    paddingHorizontal: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  genderBtnActive: {
    backgroundColor: '#800000',
    borderColor: '#800000',
  },
  genderBtnInactive: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  genderBtnTextActive: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  genderBtnTextInactive: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  generateBtn: {
    flexDirection: 'row',
    backgroundColor: '#800000',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  generateBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  matchBtn: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  matchBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recentSection: {
    marginTop: 5,
    backgroundColor: '#F9F6EE',
    borderRadius: 12,
    padding: 12,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
  },
  recentIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  recentDate: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 0,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default KundaliMatchingFormScreen;
