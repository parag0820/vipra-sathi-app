import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import CustomDropdown from '../components/CustomDropdown';

type EarningEntryRouteProp = RouteProp<RootStackParamList, 'EarningEntry'>;

const PRIMARY_MAROON = '#8B1D1D';

const EARNING_CATEGORIES = [
  'Dakshina',
  'Karmkand',
  'Astrology',
  'Puja Path',
  'Jyotish Consultation',
  'Vastu Consulting',
  'Hastarekha',
  'Numerology',
  'Tarot Reading',
  'Other Income',
];

const EarningEntryScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<EarningEntryRouteProp>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const defaultCategory = route.params?.defaultCategory || 'Dakshina';

  const [formData, setFormData] = useState({
    source: '',
    category: defaultCategory,
    amount: '',
    remark: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flat Maroon/White theme tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const inputBg = isDark ? '#252525' : '#FAF7F3';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const roseBorder = isDark ? '#5C2424' : '#F2D8D5';
  const greenBg = isDark ? '#122920' : '#ECFDF5';
  const greenText = isDark ? '#34D399' : '#166534';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';
  const errorColor = isDark ? '#F87171' : '#DC2626';

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.source.trim()) {
      newErrors.source = t('validation.required', isHi ? 'यह फ़ील्ड आवश्यक है' : 'This field is required');
    }
    if (!formData.amount.trim() || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = t('validation.validAmount', isHi ? 'मान्य राशि दर्ज करें' : 'Enter a valid amount');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.goBack();
    }, 350);
  };

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
            paddingTop: Math.max(insets.top, 12) + 4,
            borderBottomColor: dividerCol,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={22} color={accentColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: accentColor }]}>
              {isHi ? 'आय जोड़ें' : t('accountManager.addEarning', 'Add Earning')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {isHi ? 'दक्षिणा या अन्य आय दर्ज करें' : 'Record dakshina or other income'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.typeBadge,
            { backgroundColor: greenBg, borderColor: isDark ? '#1F4A38' : '#A7F3D0' },
          ]}
        >
          <Icon name="arrow-down" size={11} color={greenText} />
          <Text style={[styles.typeBadgeText, { color: greenText }]}>
            {isHi ? 'आय' : 'Income'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Amount & Source Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>
              {isHi ? 'राशि *' : `${t('accountManager.amount', 'Amount')} *`}
            </Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: inputBg,
                  borderColor: errors.amount ? errorColor : borderCol,
                },
              ]}
            >
              <Text style={[styles.prefix, { color: greenText }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: textPrimary }]}
                placeholder="0"
                placeholderTextColor={textMuted}
                value={formData.amount}
                onChangeText={(text) => {
                  setFormData({ ...formData, amount: text });
                  if (errors.amount) setErrors({ ...errors, amount: '' });
                }}
                keyboardType="numeric"
              />
            </View>
            {errors.amount ? (
              <Text style={[styles.errorMsg, { color: errorColor }]}>
                {errors.amount}
              </Text>
            ) : null}
          </View>

          {/* Category Dropdown */}
          <View style={styles.inputGroup}>
            <CustomDropdown
              label={isHi ? 'श्रेणी चुनें *' : `${t('accountManager.category', 'Select Category')} *`}
              value={formData.category}
              options={EARNING_CATEGORIES}
              onSelect={(val) => setFormData({ ...formData, category: val })}
            />
          </View>

          {/* Source of Receiving */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>
              {isHi
                ? 'स्रोत / यजमान का नाम *'
                : `${t('accountManager.sourceOfReceiving', 'Source of Receiving')} *`}
            </Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: inputBg,
                  borderColor: errors.source ? errorColor : borderCol,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: textPrimary }]}
                placeholder={
                  isHi ? 'उदा. शर्मा परिवार या गृह प्रवेश पूजा' : 'e.g. Yajman Name or Event'
                }
                placeholderTextColor={textMuted}
                value={formData.source}
                onChangeText={(text) => {
                  setFormData({ ...formData, source: text });
                  if (errors.source) setErrors({ ...errors, source: '' });
                }}
              />
            </View>
            {errors.source ? (
              <Text style={[styles.errorMsg, { color: errorColor }]}>
                {errors.source}
              </Text>
            ) : null}
          </View>

          {/* Remark */}
          <View style={[styles.inputGroup, { marginBottom: 0 }]}>
            <Text style={[styles.label, { color: textPrimary }]}>
              {isHi ? 'टिप्पणी (वैकल्पिक)' : `${t('accountManager.remark', 'Remark')} (Optional)`}
            </Text>
            <View
              style={[
                styles.inputWrap,
                styles.textAreaWrap,
                { backgroundColor: inputBg, borderColor: borderCol },
              ]}
            >
              <TextInput
                style={[styles.input, styles.textArea, { color: textPrimary }]}
                placeholder={isHi ? 'कोई अतिरिक्त विवरण लिखें...' : 'Add any notes (optional)'}
                placeholderTextColor={textMuted}
                value={formData.remark}
                onChangeText={(text) => setFormData({ ...formData, remark: text })}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Flat Footer Actions (Flush Bottom) */}
      <View
        style={[
          styles.bottomActions,
          {
            backgroundColor: headerBg,
            borderTopColor: borderCol,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.78}
          style={[
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
          style={[styles.saveBtn, { opacity: isSubmitting ? 0.65 : 1 }]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styles.saveBtnText}>
            {isSubmitting
              ? isHi
                ? 'सहेजा जा रहा है...'
                : t('common.saving', 'Saving...')
              : isHi
              ? 'आय सहेजें'
              : t('common.save', 'Save Entry')}
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
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 10.5,
    marginTop: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 28,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  textAreaWrap: {
    height: 88,
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  prefix: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 0,
  },
  input: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  textArea: {
    height: '100%',
  },
  errorMsg: {
    fontSize: 10.5,
    marginTop: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.4,
    height: 36,
    borderRadius: 8,
    backgroundColor: PRIMARY_MAROON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default EarningEntryScreen;
