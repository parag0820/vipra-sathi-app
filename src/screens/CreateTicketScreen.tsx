import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useTickets } from '../hooks/useTickets';
import { TicketCategoryType } from '../types/ticket';
import CustomDropdown from '../components/CustomDropdown';
import { ticketApi } from '../api/ticket';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { addTicket } = useTickets();

  const [categories, setCategories] = useState<TicketCategoryType[]>([]);
  const [categoryName, setCategoryName] = useState('Suggestions');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ticketApi.getCategories();
        if (res && res.data) {
          const sorted = res.data.sort((a: TicketCategoryType, b: TicketCategoryType) => a.categoryName.localeCompare(b.categoryName));
          setCategories(sorted);
          if (sorted.length > 0) {
            setCategoryName(sorted[0].categoryName);
          }
        } else if (Array.isArray(res)) {
          const sorted = res.sort((a: TicketCategoryType, b: TicketCategoryType) => a.categoryName.localeCompare(b.categoryName));
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Find the matched category's ID if fetched, else fallback to name
      const matched = categories.find(c => c.categoryName === categoryName);
      const categoryId = matched ? matched._id : categoryName;

      await addTicket({
        categoryId,
        subject: subject.trim(),
        description: description.trim(),
        remarks: remarks.trim(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create ticket. Please try again.');
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
    options?: { multiline?: boolean; numberOfLines?: number }
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: errors[field] ? colors.error : colors.border,
            color: colors.text
          },
          options?.multiline && styles.multilineInput
        ]}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (errors[field]) {
            setErrors(e => {
              const newErrors = { ...e };
              delete newErrors[field];
              return newErrors;
            });
          }
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines || 1}
        textAlignVertical={options?.multiline ? 'top' : 'center'}
      />
      {errors[field] && <Text style={[styles.errorText, { color: colors.error }]}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.darkHeader} translucent={true} />

      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.darkHeader, borderBottomColor: colors.darkHeader, paddingTop: Math.max(insets.top, 14), justifyContent: 'center' }]}>
        <Text style={[styles.headerTitle, { color: '#FFF' }]}>Raise Ticket</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>

        <View style={styles.section}>
          <CustomDropdown
            label="Select Category"
            value={categoryName}
            options={categories.length > 0 ? categories.map(c => c.categoryName) : FALLBACK_CATEGORIES}
            onSelect={(val) => setCategoryName(val)}
          />
        </View>

        <View style={styles.section}>
          {renderInput(subject, setSubject, 'subject', 'Subject', 'E.g. Unable to generate kundali')}
          {renderInput(description, setDescription, 'description', 'Description', 'Please describe the issue in detail...', { multiline: true, numberOfLines: 5 })}
          {renderInput(remarks, setRemarks, 'remarks', 'Remarks (Optional)', 'Any additional notes...', { multiline: true, numberOfLines: 3 })}
        </View>

      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.cancelBtn, { borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={[styles.saveBtnText, { color: '#FFF' }]}>
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12.5,
  },
  multilineInput: {
    height: 100,
    paddingTop: 16,
    paddingBottom: 10,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
    marginBottom: 5,
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

export default CreateTicketScreen;
