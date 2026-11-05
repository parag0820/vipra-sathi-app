import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useYajmans } from '../hooks/useYajmans';
import { YajmanCategory } from '../types/yajman';
import { yajmanApi } from '../api/yajman';

type FormRouteProp = RouteProp<RootStackParamList, 'YajmanForm'>;

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_PINK = '#FFF0ED';
const BADGE_PINK = '#FEE2E2';
const TEXT_MAROON = '#991B1B';
const BORDER_COLOR = '#E5E7EB';

const STANDARD_CATEGORIES = ['व्यक्तिगत', 'परिवार', 'संस्था'];

const YajmanFormScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<FormRouteProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const { addYajman, updateYajman } = useYajmans();

  const existingYajman = route.params?.yajman;
  const isEditing = !!existingYajman;

  const [categories, setCategories] = useState<YajmanCategory[]>([]);
  const [sameAsCalling, setSameAsCalling] = useState(
    existingYajman?.callingMobile && existingYajman?.whatsappMobile
      ? existingYajman.callingMobile === existingYajman.whatsappMobile
      : true
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await yajmanApi.getCategories();
        if (res && res.data) {
          const sorted = res.data.sort((a: YajmanCategory, b: YajmanCategory) =>
            a.categoryName.localeCompare(b.categoryName)
          );
          setCategories(sorted);
        } else if (Array.isArray(res)) {
          const sorted = res.sort((a: YajmanCategory, b: YajmanCategory) =>
            a.categoryName.localeCompare(b.categoryName)
          );
          setCategories(sorted);
        }
      } catch (err) {
        console.warn('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: existingYajman?.name || '',
    email: existingYajman?.email || '',
    callingMobile: existingYajman?.callingMobile || '',
    whatsappMobile: existingYajman?.whatsappMobile || '',
    city: existingYajman?.city || '',
    state: existingYajman?.state || '',
    address: existingYajman?.address || '',
    category: existingYajman?.category || 'परिवार',
    categoryId: existingYajman?.categoryId || [],
    yearlyProgramName: existingYajman?.yearlyProgramName || '',
    remark: existingYajman?.remark || '',
  });

  const [dates, setDates] = useState({
    birthday: existingYajman?.birthday ? new Date(existingYajman.birthday) : null,
    anniversary: existingYajman?.anniversary ? new Date(existingYajman.anniversary) : null,
    yearlyProgramDate: existingYajman?.yearlyProgramDate ? new Date(existingYajman.yearlyProgramDate) : null,
    kycDate: existingYajman?.kycDate ? new Date(existingYajman.kycDate) : new Date(),
  });

  const [datePickerConfig, setDatePickerConfig] = useState<{
    open: boolean;
    field: keyof typeof dates | null;
  }>({
    open: false,
    field: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-sync WhatsApp number when checkbox is selected
  const handleCallingNumberChange = (num: string) => {
    setFormData(prev => ({
      ...prev,
      callingMobile: num,
      whatsappMobile: sameAsCalling ? num : prev.whatsappMobile,
    }));
    if (errors.callingMobile) setErrors(prev => ({ ...prev, callingMobile: '' }));
  };

  const handleSave = async () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'यजमान का नाम आवश्यक है';
    if (!formData.callingMobile.trim()) newErrors.callingMobile = 'मोबाइल नंबर आवश्यक है';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.show({
        type: 'error',
        text1: 'आवश्यक जानकारी भरें',
        text2: 'कृपया नाम और मोबाइल नंबर दर्ज करें',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formatDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : undefined);

      const payload = {
        ...formData,
        whatsappMobile: sameAsCalling ? formData.callingMobile : formData.whatsappMobile,
        birthday: formatDate(dates.birthday),
        anniversary: formatDate(dates.anniversary),
        yearlyProgramDate: formatDate(dates.yearlyProgramDate),
        kycDate: formatDate(dates.kycDate) || new Date().toISOString().split('T')[0],
      };

      if (isEditing) {
        await updateYajman(existingYajman.id, payload);
      } else {
        await addYajman(payload);
      }

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'त्रुटि',
        text2: 'यजमान सहेजने में विफल। कृपया पुनः प्रयास करें।',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDatePicker = (field: keyof typeof dates) => {
    setDatePickerConfig({ open: true, field });
  };

  const renderInput = (
    field: keyof typeof formData,
    label: string,
    placeholder: string,
    options?: {
      keyboardType?: 'numeric' | 'email-address' | 'default';
      multiline?: boolean;
      required?: boolean;
    }
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {options?.required && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          options?.multiline && styles.textArea,
          errors[field] ? styles.inputError : null,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field] as string}
        onChangeText={text => {
          if (field === 'callingMobile') {
            handleCallingNumberChange(text);
          } else {
            setFormData(prev => ({ ...prev, [field]: text }));
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
          }
        }}
        keyboardType={options?.keyboardType || 'default'}
        multiline={options?.multiline}
        textAlignVertical={options?.multiline ? 'top' : 'center'}
      />
      {errors[field] ? <Text style={styles.errorMsg}>{errors[field]}</Text> : null}
    </View>
  );

  const renderDatePicker = (field: keyof typeof dates, label: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.datePickerBtn}
        onPress={() => openDatePicker(field)}
        activeOpacity={0.8}
      >
        <Text style={[styles.datePickerText, !dates[field] && styles.placeholderText]}>
          {dates[field] ? dates[field]!.toLocaleDateString('hi-IN') : `चुनें`}
        </Text>
        <Icon name="calendar" size={14} color={PRIMARY_MAROON} />
      </TouchableOpacity>
    </View>
  );

  // Available categories list
  const allCategoryNames = Array.from(
    new Set([
      ...STANDARD_CATEGORIES,
      ...categories.map(c => c.categoryName).filter(Boolean),
    ])
  );

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header matching the newly recreated screen style */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="arrow-left" size={20} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'यजमान संपादित करें' : 'नया यजमान जोड़ें'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditing ? 'यजमान की जानकारी बदलें' : 'यजमान की संपूर्ण जानकारी भरें'}
          </Text>
        </View>
      </View>

      {/* 2. Form Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: isTablet ? 600 : '100%', alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section 1: व्यक्तिगत विवरण (Personal Details) */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Icon name="user" size={13} color={PRIMARY_MAROON} />
            </View>
            <Text style={styles.cardHeaderTitle}>व्यक्तिगत विवरण</Text>
          </View>

          {renderInput('name', 'पूरा नाम', 'यजमान का पूरा नाम दर्ज करें', { required: true })}

          {/* Quick Category Selection matching YajmanListScreen pills */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>यजमान श्रेणी</Text>
            <View style={styles.categoryPillsRow}>
              {allCategoryNames.map(cat => {
                const isSelected = formData.category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                    onPress={() => setFormData(prev => ({ ...prev, category: cat }))}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {renderInput('remark', 'गोत्र / परिचय', 'उदा. गोत्र: भारद्वाज, परिवार के 4 सदस्य')}
        </View>

        {/* Section 2: संपर्क जानकारी (Contact Information) */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Icon name="phone" size={13} color={PRIMARY_MAROON} />
            </View>
            <Text style={styles.cardHeaderTitle}>संपर्क जानकारी</Text>
          </View>

          {renderInput('callingMobile', 'कॉलिंग मोबाइल नंबर', '10 अंकों का मोबाइल नंबर', {
            keyboardType: 'numeric',
            required: true,
          })}

          {/* Sync checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => {
              const nextState = !sameAsCalling;
              setSameAsCalling(nextState);
              if (nextState) {
                setFormData(prev => ({ ...prev, whatsappMobile: prev.callingMobile }));
              }
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.checkboxSquare, sameAsCalling && styles.checkboxSquareActive]}>
              {sameAsCalling && <Icon name="check" size={12} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>व्हाट्सएप नंबर कॉलिंग नंबर के समान है</Text>
          </TouchableOpacity>

          {!sameAsCalling ? (
            renderInput('whatsappMobile', 'व्हाट्सएप नंबर', 'व्हाट्सएप नंबर दर्ज करें', {
              keyboardType: 'numeric',
            })
          ) : null}

          {renderInput('email', 'ईमेल पता (वैकल्पिक)', 'उदा. yajman@gmail.com', {
            keyboardType: 'email-address',
          })}
        </View>

        {/* Section 3: स्थान व पता (Address & Location) */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Icon name="map-pin" size={13} color={PRIMARY_MAROON} />
            </View>
            <Text style={styles.cardHeaderTitle}>स्थान व पता</Text>
          </View>

          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              {renderInput('city', 'शहर', 'उदा. वाराणसी')}
            </View>
            <View style={styles.halfCol}>
              {renderInput('state', 'राज्य', 'उदा. उत्तर प्रदेश')}
            </View>
          </View>

          {renderInput('address', 'पूरा पता', 'मकान नं, गली, क्षेत्र...', { multiline: true })}
        </View>

        {/* Section 4: महत्वपूर्ण तिथियाँ (Important Dates) */}
        <View style={styles.formCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Icon name="calendar" size={13} color={PRIMARY_MAROON} />
            </View>
            <Text style={styles.cardHeaderTitle}>महत्वपूर्ण तिथियाँ</Text>
          </View>

          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              {renderDatePicker('birthday', 'जन्मदिन')}
            </View>
            <View style={styles.halfCol}>
              {renderDatePicker('anniversary', 'वर्षगांठ')}
            </View>
          </View>

          {renderInput('yearlyProgramName', 'वार्षिक कार्यक्रम का नाम', 'उदा. वार्षिक श्राद्ध / सत्यनारायण')}
          {renderDatePicker('yearlyProgramDate', 'वार्षिक कार्यक्रम की तिथि')}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 3. Bottom Fixed Action Buttons */}
      <View
        style={[
          styles.bottomActionsBar,
          { paddingBottom: Math.max(insets.bottom + 8, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelBtnText}>रद्द करें</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>
              {isEditing ? 'बदलाव सहेजें' : 'यजमान सहेजें'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <DatePicker
        modal
        open={datePickerConfig.open}
        theme={isDark ? 'dark' : 'light'}
        date={
          datePickerConfig.field && dates[datePickerConfig.field]
            ? dates[datePickerConfig.field]!
            : new Date()
        }
        mode="date"
        title="तिथि चुनें"
        confirmText="स्वीकार करें"
        cancelText="रद्द करें"
        onConfirm={date => {
          if (datePickerConfig.field) {
            setDates(prev => ({ ...prev, [datePickerConfig.field!]: date }));
          }
          setDatePickerConfig({ open: false, field: null });
        }}
        onCancel={() => {
          setDatePickerConfig({ open: false, field: null });
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_MAROON,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 1,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconBg: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: SOFT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  requiredStar: {
    color: PRIMARY_MAROON,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 12.5,
    color: '#1F2937',
  },
  textArea: {
    height: 72,
    paddingVertical: 8,
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  errorMsg: {
    fontSize: 10.5,
    color: '#DC2626',
    marginTop: 2,
    marginLeft: 2,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: '#F9FAFB',
  },
  categoryPillActive: {
    backgroundColor: SOFT_PINK,
    borderColor: '#FCA5A5',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  categoryPillTextActive: {
    color: PRIMARY_MAROON,
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxSquareActive: {
    backgroundColor: PRIMARY_MAROON,
    borderColor: PRIMARY_MAROON,
  },
  checkboxLabel: {
    fontSize: 11.5,
    color: '#4B5563',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },
  datePickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
  },
  datePickerText: {
    fontSize: 12.5,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  bottomActionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4B5563',
  },
  saveBtn: {
    flex: 2,
    height: 42,
    borderRadius: 10,
    backgroundColor: PRIMARY_MAROON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default YajmanFormScreen;
