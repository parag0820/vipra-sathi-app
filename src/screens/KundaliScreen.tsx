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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Kundali'>;

const KundaliScreen = () => {
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

  const [createDetails, setCreateDetails] = useState({
    name: '',
    dob: '',
    tob: '',
    place: '',
    gender: 'male'
  });

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'match' | 'create'>('create');

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerField, setCurrentPickerField] = useState<{ person: 'bride' | 'groom' | 'create', field: 'dob' | 'tob' } | null>(null);

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
    person: 'bride' | 'groom' | 'create',
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
          setCurrentPickerField({ person, field });
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
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'create' ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface }]}
            onPress={() => setActiveTab('create')}
          >
            <Text style={[styles.tabText, activeTab === 'create' ? { color: '#FFF' } : { color: colors.textLight }]}>Create Kundali</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'match' ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface }]}
            onPress={() => setActiveTab('match')}
          >
            <Text style={[styles.tabText, activeTab === 'match' ? { color: '#FFF' } : { color: colors.textLight }]}>Kundali Matching</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'match' ? (
            <>
              {/* Bride Details Section */}
              <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.sectionHeader}>
                  <Icon name="user" size={20} color={isDark ? '#FFF' : colors.text} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Bride Details</Text>
                </View>

                {renderInput('Name', brideDetails.name, (text) => setBrideDetails({ ...brideDetails, name: text }), 'Enter Bride Name')}
                {renderDateTimePicker('Date of Birth', brideDetails.dob, 'bride', 'dob', 'DD/MM/YYYY')}
                {renderDateTimePicker('Time of Birth', brideDetails.tob, 'bride', 'tob', 'HH:MM AM/PM')}
                {renderInput('Place of Birth', brideDetails.place, (text) => setBrideDetails({ ...brideDetails, place: text }), 'City, State')}
              </View>

              {/* Groom Details Section */}
              <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.sectionHeader}>
                  <Icon name="user" size={20} color={isDark ? '#FFF' : colors.text} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Groom Details</Text>
                </View>

                {renderInput('Name', groomDetails.name, (text) => setGroomDetails({ ...groomDetails, name: text }), 'Enter Groom Name')}
                {renderDateTimePicker('Date of Birth', groomDetails.dob, 'groom', 'dob', 'DD/MM/YYYY')}
                {renderDateTimePicker('Time of Birth', groomDetails.tob, 'groom', 'tob', 'HH:MM AM/PM')}
                {renderInput('Place of Birth', groomDetails.place, (text) => setGroomDetails({ ...groomDetails, place: text }), 'City, State')}
              </View>

              <TouchableOpacity
                style={[styles.matchBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('KundaliMatchingResult')}
              >
                <Text style={styles.matchBtnText}>Match Kundali</Text>
                <Icon name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Create Kundali Section */}
              <View style={{ paddingVertical: 10 }}>
                {renderInput(t('kundali.name_label', 'Name'), createDetails.name, (text) => setCreateDetails({ ...createDetails, name: text }), t('kundali.name_placeholder', 'Rahul Sharma'), 'user')}
                {renderDateTimePicker(t('kundali.dob_label', 'Date of Birth'), createDetails.dob, 'create', 'dob', t('kundali.dob_placeholder', '24/09/1990'), 'calendar')}
                {renderDateTimePicker(t('kundali.tob_label', 'Time of Birth'), createDetails.tob, 'create', 'tob', t('kundali.tob_placeholder', '10:30'), 'clock')}
                {renderInput(t('kundali.place_label', 'Place of Birth'), createDetails.place, (text) => setCreateDetails({ ...createDetails, place: text }), t('kundali.place_placeholder', 'Jaipur, Rajasthan'), 'map-pin')}

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>{t('kundali.gender_label', 'Gender')}</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[styles.genderBtn, createDetails.gender === 'male' ? styles.genderBtnActive : [styles.genderBtnInactive, { backgroundColor: colors.surface, borderColor: colors.border }]]}
                      onPress={() => setCreateDetails({ ...createDetails, gender: 'male' })}
                    >
                      <Text style={createDetails.gender === 'male' ? styles.genderBtnTextActive : [styles.genderBtnTextInactive, { color: colors.text }]}>
                        {t('kundali.male', 'Male')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderBtn, createDetails.gender === 'female' ? styles.genderBtnActive : [styles.genderBtnInactive, { backgroundColor: colors.surface, borderColor: colors.border }]]}
                      onPress={() => setCreateDetails({ ...createDetails, gender: 'female' })}
                    >
                      <Text style={createDetails.gender === 'female' ? styles.genderBtnTextActive : [styles.genderBtnTextInactive, { color: colors.text }]}>
                        {t('kundali.female', 'Female')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.generateBtn}
                onPress={() => navigation.navigate('KundaliGenerated', {
                  name: createDetails.name || 'Rahul Sharma',
                  dob: createDetails.dob || '24/09/1990',
                  tob: createDetails.tob || '10:30 AM',
                  place: createDetails.place || 'Jaipur, Rajasthan'
                })}
              >
                <Text style={styles.generateBtnText}>{t('kundali.generate_btn', 'Generate Kundali')}</Text>
                <Icon name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>

              <View style={[styles.recentSection, { backgroundColor: isDark ? colors.surface : '#F9F6EE' }]}>
                <Text style={[styles.recentTitle, { color: colors.text }]}>{t('kundali.recent_title', 'Recent Kundali')}</Text>
                <TouchableOpacity style={[styles.recentItem, { backgroundColor: isDark ? '#2A2A2A' : '#FFF' }]}>
                  <View style={[styles.recentIconWrapper, { backgroundColor: isDark ? '#444' : '#F0F0F0' }]}>
                    <Icon name="user" size={18} color={isDark ? '#FFF' : '#333'} />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text style={[styles.recentName, { color: colors.text }]}>Rakesh Sharma</Text>
                    <Text style={[styles.recentDate, { color: colors.textLight }]}>24 Sep 1990, 10:30 AM</Text>
                  </View>
                  <Icon name="chevron-right" size={18} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
              </View>
            </>
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
            if (person === 'create') setCreateDetails(prev => ({ ...prev, [field]: formattedValue }));
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
  },
  sectionCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
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
  label: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    height: '100%',
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
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

export default KundaliScreen;
