import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useYajmans } from '../hooks/useYajmans';
import { YajmanCategory } from '../types/yajman';
import CustomMultiSelectDropdown from '../components/CustomMultiSelectDropdown';
import { yajmanApi } from '../api/yajman';
import CustomHeader from '../components/CustomHeader';

type FormRouteProp = RouteProp<RootStackParamList, 'YajmanForm'>;

const YajmanFormScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<FormRouteProp>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { addYajman, updateYajman } = useYajmans();

  const existingYajman = route.params?.yajman;
  const isEditing = !!existingYajman;

  const [categories, setCategories] = useState<YajmanCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await yajmanApi.getCategories();
        if (res && res.data) {
          const sorted = res.data.sort((a: YajmanCategory, b: YajmanCategory) => a.categoryName.localeCompare(b.categoryName));
          setCategories(sorted);
        } else if (Array.isArray(res)) {
          const sorted = res.sort((a: YajmanCategory, b: YajmanCategory) => a.categoryName.localeCompare(b.categoryName));
          setCategories(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
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
    category: existingYajman?.category || 'Karmkand',
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

  const [datePickerConfig, setDatePickerConfig] = useState<{ open: boolean, field: keyof typeof dates | null }>({
    open: false,
    field: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.callingMobile.trim()) newErrors.callingMobile = 'Mobile number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formatDate = (date: Date | null) => date ? date.toISOString().split('T')[0] : undefined;

      const payload = {
        ...formData,
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
      // Error handled by hook/axios interceptor
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
    options?: { keyboardType?: 'numeric' | 'email-address' | 'default', multiline?: boolean }
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label} {errors[field] && <Text style={styles.errorText}>*</Text>}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.surface, color: colors.text, borderColor: errors[field] ? '#ef4444' : colors.border },
          options?.multiline && styles.textArea
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={formData[field] as string}
        onChangeText={(text) => {
          setFormData({ ...formData, [field]: text });
          if (errors[field]) setErrors({ ...errors, [field]: '' });
        }}
        keyboardType={options?.keyboardType || 'default'}
        multiline={options?.multiline}
        textAlignVertical={options?.multiline ? 'top' : 'center'}
      />
      {errors[field] && <Text style={styles.errorMsg}>{errors[field]}</Text>}
    </View>
  );

  const renderDatePicker = (field: keyof typeof dates, label: string) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.dateInput, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => openDatePicker(field)}
      >
        <Text style={{ color: dates[field] ? colors.text : colors.textLight }}>
          {dates[field] ? dates[field]!.toLocaleDateString() : `Select ${label}`}
        </Text>
        <Icon name="calendar" size={18} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.primary }]}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={true} />

      <CustomHeader
        title={isEditing ? 'Edit Yajman' : 'New Yajman'}
        showBack={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personal Details</Text>
            {renderInput('name', 'Full Name', 'Enter yajman name')}

            <CustomMultiSelectDropdown
              label="Category"
              values={formData.category ? formData.category.split(',').map(s => s.trim()).filter(Boolean) : []}
              options={categories.length > 0 ? categories.map(c => c.categoryName) : ['Karmkand', 'Astrology', 'Others']}
              onSelect={(vals: string[]) => {
                const matchedIds = vals.map(val => {
                  const matched = categories.find(c => c.categoryName === val);
                  return matched ? matched._id : '';
                }).filter(Boolean);

                setFormData({
                  ...formData,
                  category: vals.join(', '),
                  categoryId: matchedIds
                });
              }}
            />
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Contact Information</Text>
            {renderInput('callingMobile', 'Mobile Number', 'Enter 10-digit number', { keyboardType: 'numeric' })}
            {renderInput('whatsappMobile', 'WhatsApp Number', 'Enter WhatsApp number', { keyboardType: 'numeric' })}
            {renderInput('email', 'Email Address', 'Enter email address', { keyboardType: 'email-address' })}
          </View>

          {/* Important Dates */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Important Dates</Text>
            <View style={styles.row}>
              <View style={styles.col}>{renderDatePicker('birthday', 'Birthday')}</View>
              <View style={styles.col}>{renderDatePicker('anniversary', 'Anniversary')}</View>
            </View>

            {renderInput('yearlyProgramName', 'Yearly Program Name', 'e.g. Yearly Shraddha / Tithi')}
            {renderDatePicker('yearlyProgramDate', 'Yearly Program Date')}
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Address Details</Text>
            <View style={styles.row}>
              <View style={styles.col}>{renderInput('city', 'City', 'Enter city')}</View>
              <View style={styles.col}>{renderInput('state', 'State', 'Enter state')}</View>
            </View>
            {renderInput('address', 'Full Address', 'Enter complete address', { multiline: true })}
          </View>

          {/* Other */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Other Information</Text>
            {renderDatePicker('kycDate', 'KYC Date')}
            {renderInput('remark', 'Remarks / Notes', 'Any additional notes about this yajman', { multiline: true })}
          </View>

        </ScrollView>

        {/* Bottom Actions */}
        <View style={[styles.bottomActions, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <Text style={[styles.saveBtnText, { color: '#FFF' }]}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DatePicker
        modal
        open={datePickerConfig.open}
        theme={isDark ? 'dark' : 'light'}
        date={datePickerConfig.field && dates[datePickerConfig.field] ? dates[datePickerConfig.field]! : new Date()}
        mode="date"
        onConfirm={(date) => {
          if (datePickerConfig.field) {
            setDates({ ...dates, [datePickerConfig.field]: date });
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
  container: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    color: '#ef4444',
  },
  errorMsg: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionBtn: {
    flex: 1,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  cancelBtn: {
    borderWidth: 1,
  },
  saveBtn: {
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
  }
});

export default YajmanFormScreen;
