import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Feather as Icon } from '@expo/vector-icons';
import { CalendarEvent, EventType, EventStatus } from '../types/calendar';
import { DUMMY_YAJMANS } from '../data/mockCalendar';
import DatePicker from 'react-native-date-picker';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (id: string) => void;
  initialData?: CalendarEvent | null;
  selectedDate: string;
}

const EVENT_TYPES: { id: EventType; labelHi: string; labelEn: string }[] = [
  { id: 'pooja', labelHi: 'पूजा', labelEn: 'Pooja' },
  { id: 'task', labelHi: 'कार्य', labelEn: 'Task' },
  { id: 'festival', labelHi: 'पर्व', labelEn: 'Festival' },
];

const EVENT_STATUSES: { id: EventStatus; labelHi: string; labelEn: string }[] = [
  { id: 'upcoming', labelHi: 'आगामी', labelEn: 'Upcoming' },
  { id: 'done', labelHi: 'पूर्ण', labelEn: 'Done' },
  { id: 'cancelled', labelHi: 'रद्द', labelEn: 'Cancelled' },
];

const EventModal: React.FC<EventModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  initialData,
  selectedDate,
}) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('pooja');
  const [status, setStatus] = useState<EventStatus>('upcoming');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [yajmanName, setYajmanName] = useState('');
  const [yajmanPhone, setYajmanPhone] = useState('');
  const [showYajmanPicker, setShowYajmanPicker] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setStatus(initialData.status);
      setTime(initialData.time || '');
      setDescription(initialData.description || '');
      setYajmanName(initialData.yajmanName || '');
      setYajmanPhone(initialData.yajmanPhone || '');
    } else {
      resetForm();
    }
    setShowYajmanPicker(false);
  }, [initialData, visible]);

  const resetForm = () => {
    setTitle('');
    setType('pooja');
    setStatus('upcoming');
    setTime('');
    setDescription('');
    setYajmanName('');
    setYajmanPhone('');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      date: initialData?.date || selectedDate,
      type,
      status,
      time: time.trim(),
      description: description.trim(),
      yajmanName: yajmanName.trim(),
      yajmanPhone: yajmanPhone.trim(),
    });
    onClose();
  };

  const surfaceBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const inputBg = isDark ? '#141414' : '#FFFFFF';
  const borderDynamic = isDark ? '#2D2D2D' : CARD_BORDER;
  const dividerDynamic = isDark ? '#2A2A2A' : ROW_DIVIDER;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const roseTintBg = isDark ? '#2B1B1B' : SOFT_ROSE_BG;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardWrap}
            >
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: surfaceBg, borderColor: borderDynamic },
                ]}
              >
                {/* Clean Flat Header */}
                <View style={[styles.header, { borderBottomColor: dividerDynamic }]}>
                  <View style={styles.headerLeft}>
                    <View style={[styles.headerIconBox, { backgroundColor: roseTintBg }]}>
                      <Icon
                        name={initialData ? 'edit-3' : 'calendar'}
                        size={16}
                        color={accentColor}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.headerTitle, { color: accentColor }]}>
                        {initialData
                          ? isHi
                            ? 'कार्यक्रम संपादित करें'
                            : 'Edit Event'
                          : isHi
                            ? 'नया कार्यक्रम जोड़ें'
                            : 'Add Event'}
                      </Text>
                      <Text style={[styles.headerDateSub, { color: textSecondary }]}>
                        {initialData?.date || selectedDate}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={onClose}
                    style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activeOpacity={0.7}
                  >
                    <Icon name="x" size={16} color={textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  contentContainerStyle={styles.content}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Title */}
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'कार्यक्रम का शीर्षक' : 'Title'}{' '}
                    <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg },
                    ]}
                    placeholder={isHi ? 'जैसे: गृह प्रवेश पूजा' : 'Event title...'}
                    placeholderTextColor={textSecondary}
                    value={title}
                    onChangeText={setTitle}
                  />

                  {/* Date + Time Picker */}
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'दिनांक एवं समय' : 'Date & Time'}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.selectBtn,
                      { borderColor: borderDynamic, backgroundColor: inputBg },
                    ]}
                    onPress={() => setDatePickerVisible(true)}
                    activeOpacity={0.75}
                  >
                    <Icon name="clock" size={15} color={accentColor} style={{ marginRight: 8 }} />
                    <Text
                      style={[
                        styles.selectBtnText,
                        { color: time ? textPrimary : textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {time || (isHi ? 'दिनांक एवं समय चुनें' : 'Select Date & Time')}
                    </Text>
                    <Icon name="chevron-right" size={15} color={textSecondary} />
                  </TouchableOpacity>

                  <DatePicker
                    modal
                    open={datePickerVisible}
                    theme={isDark ? 'dark' : 'light'}
                    date={new Date()}
                    mode="datetime"
                    onConfirm={date => {
                      setDatePickerVisible(false);
                      let hours = date.getHours();
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      hours = hours % 12;
                      hours = hours ? hours : 12;
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(
                        date.getMonth() + 1
                      ).padStart(2, '0')}/${date.getFullYear()}`;
                      setTime(`${dateStr} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`);
                    }}
                    onCancel={() => setDatePickerVisible(false)}
                  />

                  {/* Yajman Selection */}
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'यजमान (वैकल्पिक)' : 'Yajman (Optional)'}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.selectBtn,
                      { borderColor: borderDynamic, backgroundColor: inputBg },
                    ]}
                    onPress={() => setShowYajmanPicker(!showYajmanPicker)}
                    activeOpacity={0.75}
                  >
                    <Icon name="user" size={15} color={accentColor} style={{ marginRight: 8 }} />
                    <Text
                      style={[
                        styles.selectBtnText,
                        { color: yajmanName ? textPrimary : textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {yajmanName || (isHi ? 'यजमान चुनें' : 'Select Yajman')}
                    </Text>
                    <Icon
                      name={showYajmanPicker ? 'chevron-up' : 'chevron-down'}
                      size={15}
                      color={textSecondary}
                    />
                  </TouchableOpacity>

                  {showYajmanPicker && (
                    <View
                      style={[
                        styles.yajmanList,
                        { backgroundColor: surfaceBg, borderColor: borderDynamic },
                      ]}
                    >
                      {DUMMY_YAJMANS.map((y, i) => {
                        const selected = yajmanName === y.name;
                        const isLast = i === DUMMY_YAJMANS.length - 1;
                        return (
                          <TouchableOpacity
                            key={i}
                            style={[
                              styles.yajmanItem,
                              !isLast && { borderBottomWidth: 1, borderBottomColor: dividerDynamic },
                              selected && { backgroundColor: roseTintBg },
                            ]}
                            onPress={() => {
                              setYajmanName(y.name);
                              setYajmanPhone(y.phone);
                              setShowYajmanPicker(false);
                            }}
                            activeOpacity={0.75}
                          >
                            <View style={styles.yajmanInfo}>
                              <Text
                                style={[
                                  styles.yajmanName,
                                  { color: selected ? accentColor : textPrimary },
                                ]}
                              >
                                {y.name}
                              </Text>
                              <Text style={[styles.yajmanPhone, { color: textSecondary }]}>
                                {y.phone}
                              </Text>
                            </View>
                            {selected && <Icon name="check" size={15} color={accentColor} />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {/* Event Type */}
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'कार्यक्रम का प्रकार' : 'Event Type'}
                  </Text>
                  <View style={styles.chipRow}>
                    {EVENT_TYPES.map(item => {
                      const active = type === item.id;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.chipBtn,
                            {
                              backgroundColor: active ? roseTintBg : inputBg,
                              borderColor: active ? accentColor : borderDynamic,
                            },
                          ]}
                          onPress={() => setType(item.id)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              {
                                color: active ? accentColor : textSecondary,
                                fontWeight: active ? '700' : '500',
                              },
                            ]}
                          >
                            {isHi ? item.labelHi : item.labelEn}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Status */}
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'स्थिति' : 'Status'}
                  </Text>
                  <View style={styles.chipRow}>
                    {EVENT_STATUSES.map(item => {
                      const active = status === item.id;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.chipBtn,
                            {
                              backgroundColor: active ? roseTintBg : inputBg,
                              borderColor: active ? accentColor : borderDynamic,
                            },
                          ]}
                          onPress={() => setStatus(item.id)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              {
                                color: active ? accentColor : textSecondary,
                                fontWeight: active ? '700' : '500',
                              },
                            ]}
                          >
                            {isHi ? item.labelHi : item.labelEn}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Description */}
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'विवरण / टिप्पणी' : 'Description'}
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg },
                    ]}
                    placeholder={isHi ? 'अतिरिक्त जानकारी यहाँ लिखें...' : 'Additional details...'}
                    placeholderTextColor={textSecondary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />

                  {/* Delete Button (Edit mode only) */}
                  {initialData && onDelete && (
                    <TouchableOpacity
                      style={[
                        styles.deleteBtn,
                        {
                          backgroundColor: isDark ? '#2A1616' : '#FEF2F2',
                          borderColor: isDark ? '#5C2323' : '#FEE2E2',
                        },
                      ]}
                      onPress={() => {
                        onDelete(initialData.id);
                        onClose();
                      }}
                      activeOpacity={0.75}
                    >
                      <Icon name="trash-2" size={15} color="#DC2626" />
                      <Text style={styles.deleteText}>
                        {isHi ? 'कार्यक्रम हटाएँ' : 'Delete Event'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>

                {/* Bottom Action Buttons */}
                <View style={[styles.footerActions, { borderTopColor: dividerDynamic }]}>
                  <TouchableOpacity
                    style={[
                      styles.cancelBtn,
                      { borderColor: borderDynamic, backgroundColor: surfaceBg },
                    ]}
                    onPress={onClose}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.cancelText, { color: textSecondary }]}>
                      {isHi ? 'रद्द करें' : 'Cancel'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitBtn,
                      {
                        backgroundColor: title.trim() ? PRIMARY_MAROON : isDark ? '#3A2323' : '#D6B4B4',
                      },
                    ]}
                    onPress={handleSave}
                    disabled={!title.trim()}
                    activeOpacity={0.8}
                  >
                    <Icon name="check" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.submitText}>
                      {initialData
                        ? isHi
                          ? 'बदलाव सहेजें'
                          : 'Update'
                        : isHi
                          ? 'सहेजें'
                          : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  keyboardWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  modalContainer: {
    borderRadius: 14,
    borderWidth: 1,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    paddingRight: 8,
  },
  headerIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  headerDateSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  requiredAsterisk: {
    color: '#DC2626',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  selectBtnText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  yajmanList: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 6,
  },
  yajmanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  yajmanInfo: {
    flex: 1,
  },
  yajmanName: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  yajmanPhone: {
    fontSize: 11,
    marginTop: 1,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 11.5,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
    minHeight: 74,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  deleteText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 11.5,
  },
  footerActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1.4,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
});

export default EventModal;
