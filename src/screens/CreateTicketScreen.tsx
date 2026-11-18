import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useTickets } from '../hooks/useTickets';
import { TicketCategoryType } from '../types/ticket';
import CustomDropdown from '../components/CustomDropdown';
import { ticketApi } from '../api/ticket';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY_MAROON = '#8B1D1D';

const FALLBACK_CATEGORIES = [
  'Suggestions',
  'Content Issues',
  'Technical Issues',
  'Payment Issues',
  'Other Queries',
  'Feature Request',
  'Account Issues',
  'Billing',
  'General Inquiry',
];

const CreateTicketScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');
  const { addTicket } = useTickets();

  const [categories, setCategories] = useState<TicketCategoryType[]>([]);
  const [categoryName, setCategoryName] = useState('Suggestions');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ticketApi.getCategories();
        if (res && res.data) {
          const sorted = res.data.sort(
            (a: TicketCategoryType, b: TicketCategoryType) =>
              a.categoryName.localeCompare(b.categoryName),
          );
          setCategories(sorted);
          if (sorted.length > 0) {
            setCategoryName(sorted[0].categoryName);
          }
        } else if (Array.isArray(res)) {
          const sorted = res.sort(
            (a: TicketCategoryType, b: TicketCategoryType) =>
              a.categoryName.localeCompare(b.categoryName),
          );
          setCategories(sorted);
          if (sorted.length > 0) {
            setCategoryName(sorted[0].categoryName);
          }
        }
      } catch (err) {
        console.error('Failed to fetch ticket categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Flat Maroon/White tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const inputBg = isDark ? '#252525' : '#FAF7F3';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';
  const errorColor = isDark ? '#F87171' : '#DC2626';

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!subject.trim()) {
      newErrors.subject = isHi ? 'विषय आवश्यक है' : 'Subject is required';
    }
    if (!description.trim()) {
      newErrors.description = isHi
        ? 'विवरण आवश्यक है'
        : 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const matched = categories.find((c) => c.categoryName === categoryName);
      const categoryId = matched ? matched._id : categoryName;

      await addTicket({
        categoryId,
        subject: subject.trim(),
        description: description.trim(),
        remarks: remarks.trim(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        isHi ? 'त्रुटि' : 'Error',
        isHi
          ? 'टिकट बनाने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Failed to create ticket. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (
    value: string,
    onChangeText: (text: string) => void,
    field: string,
    label: string,
    placeholder: string,
    options?: { multiline?: boolean; numberOfLines?: number },
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: textPrimary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: inputBg,
            borderColor: errors[field] ? errorColor : borderCol,
            color: textPrimary,
          },
          options?.multiline && styles.multilineInput,
        ]}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (errors[field]) {
            setErrors((e) => {
              const next = { ...e };
              delete next[field];
              return next;
            });
          }
        }}
        placeholder={placeholder}
        placeholderTextColor={textMuted}
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines || 1}
        textAlignVertical={options?.multiline ? 'top' : 'center'}
      />
      {errors[field] && (
        <Text style={[styles.errorText, { color: errorColor }]}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: screenBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* Flat Maroon/White Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: headerBg,
            borderBottomColor: dividerCol,
            paddingTop: Math.max(insets.top, 12) + 6,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={24} color={accentColor} />
        </TouchableOpacity>
        <View style={styles.headerTextCol}>
          <Text style={[styles.headerTitle, { color: accentColor }]}>
            {isHi ? 'नया सपोर्ट टिकट' : 'Raise Ticket'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: textMuted }]}>
            {isHi
              ? 'अपनी समस्या या सुझाव विवरण के साथ भेजें'
              : 'Describe your query or suggestion below'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.formCard,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          <View style={styles.dropdownWrap}>
            <CustomDropdown
              label={isHi ? 'श्रेणी चुनें' : 'Select Category'}
              value={categoryName}
              options={
                categories.length > 0
                  ? categories.map((c) => c.categoryName)
                  : FALLBACK_CATEGORIES
              }
              onSelect={(val) => setCategoryName(val)}
            />
          </View>

          {renderInput(
            subject,
            setSubject,
            'subject',
            isHi ? 'विषय *' : 'Subject *',
            isHi
              ? 'उदा. कुंडली बनाने में समस्या आ रही है'
              : 'E.g. Unable to generate kundali',
          )}

          {renderInput(
            description,
            setDescription,
            'description',
            isHi ? 'विवरण *' : 'Description *',
            isHi
              ? 'कृपया अपनी समस्या का पूरा विवरण लिखें...'
              : 'Please describe the issue in detail...',
            { multiline: true, numberOfLines: 5 },
          )}

          {renderInput(
            remarks,
            setRemarks,
            'remarks',
            isHi ? 'अतिरिक्त टिप्पणी (वैकल्पिक)' : 'Remarks (Optional)',
            isHi ? 'कोई अतिरिक्त जानकारी...' : 'Any additional notes...',
            { multiline: true, numberOfLines: 3 },
          )}
        </View>
      </ScrollView>

      {/* Flat Bottom Footer Bar */}
      <View
        style={[
          styles.bottomActions,
          {
            backgroundColor: headerBg,
            borderTopColor: borderCol,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.78}
          style={[
            styles.actionBtn,
            styles.cancelBtn,
            { backgroundColor: inputBg, borderColor: borderCol },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.cancelBtnText, { color: textPrimary }]}>
            {isHi ? 'रद्द करें' : 'Cancel'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.82}
          style={[
            styles.actionBtn,
            styles.saveBtn,
            { opacity: isSubmitting ? 0.65 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.saveBtnText}>
            {isSubmitting
              ? isHi
                ? 'भेजा जा रहा है...'
                : 'Submitting...'
              : isHi
              ? 'टिकट सबमिट करें'
              : 'Submit Ticket'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerTextCol: {
    flex: 1,
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
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 14,
    paddingBottom: 28,
  },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  dropdownWrap: {
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 12,
  },
  multilineInput: {
    height: 104,
    paddingTop: 12,
    paddingBottom: 10,
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 2,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  saveBtn: {
    backgroundColor: PRIMARY_MAROON,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CreateTicketScreen;
