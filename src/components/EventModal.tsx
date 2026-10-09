import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { CalendarEvent, EventType, EventStatus } from '../types/calendar';
import { DUMMY_YAJMANS } from '../data/mockCalendar';
import DatePicker from 'react-native-date-picker';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (id: string) => void;
  initialData?: CalendarEvent | null;
  selectedDate: string;
}

const EventModal: React.FC<EventModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  initialData,
  selectedDate
}) => {
  const { colors, isDark } = useTheme();

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

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>

          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.primary, justifyContent: 'center' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <View style={[styles.headerIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Icon name={initialData ? 'edit-3' : 'plus'} size={18} color="#FFF" />
              </View>
              <Text style={[styles.headerTitle, { color: '#FFF' }]}>
                {initialData ? 'Edit Event' : 'Add Event'}
              </Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Event Title..."
              placeholderTextColor={colors.textLight + '80'}
              value={title}
              onChangeText={setTitle}
            />

            {/* Date + Time Picker */}
            <Text style={[styles.label, { color: colors.text }]}>Date & Time</Text>
            <TouchableOpacity
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Icon name="clock" size={16} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={{ color: time ? colors.text : colors.textLight + '80', fontSize: 15, flex: 1 }}>
                {time || 'Select Date & Time'}
              </Text>
              <Icon name="chevron-right" size={16} color={colors.textLight} />
            </TouchableOpacity>

            <DatePicker
              modal
              open={datePickerVisible}
              theme={isDark ? 'dark' : 'light'}
              date={new Date()}
              mode="datetime"
              onConfirm={(date) => {
                setDatePickerVisible(false);
                let hours = date.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                setTime(`${dateStr} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />

            {/* Yajman Selection */}
            <Text style={[styles.label, { color: colors.text }]}>Yajman (Optional)</Text>
            <TouchableOpacity
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => setShowYajmanPicker(!showYajmanPicker)}
            >
              <Icon name="user" size={16} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={{ color: yajmanName ? colors.text : colors.textLight + '80', fontSize: 15, flex: 1 }}>
                {yajmanName || 'Select Yajman'}
              </Text>
              <Icon name={showYajmanPicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textLight} />
            </TouchableOpacity>

            {showYajmanPicker && (
              <View style={[styles.yajmanList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {DUMMY_YAJMANS.map((y, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.yajmanItem, { borderBottomColor: colors.border }, yajmanName === y.name && { backgroundColor: colors.primary + '10' }]}
                    onPress={() => {
                      setYajmanName(y.name);
                      setYajmanPhone(y.phone);
                      setShowYajmanPicker(false);
                    }}
                  >
                    <View style={styles.yajmanInfo}>
                      <Text style={[styles.yajmanName, { color: yajmanName === y.name ? colors.primary : colors.text }]}>{y.name}</Text>
                      <Text style={[styles.yajmanPhone, { color: colors.textLight }]}>{y.phone}</Text>
                    </View>
                    {yajmanName === y.name && <Icon name="check-circle" size={18} color={colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.label, { color: colors.text }]}>Event Type</Text>
            <View style={[styles.segmentedControl, { borderColor: colors.border }]}>
              {(['pooja', 'task', 'festival'] as EventType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.segmentButton,
                    type === t && { backgroundColor: colors.primary },
                    { borderColor: colors.border },
                  ]}
                  onPress={() => setType(t)}
                >
                  <Text style={[
                    styles.segmentText,
                    { color: type === t ? '#FFF' : colors.text },
                  ]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Status</Text>
            <View style={[styles.segmentedControl, { borderColor: colors.border }]}>
              {(['upcoming', 'done', 'cancelled'] as EventStatus[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.segmentButton,
                    status === s && { backgroundColor: colors.primary },
                    { borderColor: colors.border },
                  ]}
                  onPress={() => setStatus(s)}
                >
                  <Text style={[
                    styles.segmentText,
                    { color: status === s ? '#FFF' : colors.text },
                  ]}>
                    {s === 'done' ? 'Done' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Additional details..."
              placeholderTextColor={colors.textLight + '80'}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {initialData && onDelete && (
              <TouchableOpacity
                style={[styles.deleteBtn, { backgroundColor: '#DC262610' }]}
                onPress={() => {
                  onDelete(initialData.id);
                  onClose();
                }}
              >
                <Icon name="trash-2" size={18} color="#DC2626" />
                <Text style={styles.deleteText}>Delete Event</Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelText, { color: colors.textLight }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Icon name="check" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={[styles.submitText, { color: '#FFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 20,
    maxHeight: '90%',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { paddingHorizontal: 20, paddingBottom: 10 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRightWidth: 1,
  },
  segmentText: { fontSize: 13, fontWeight: '600' },
  yajmanList: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  yajmanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  yajmanInfo: {
    flex: 1,
  },
  yajmanName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  yajmanPhone: {
    fontSize: 12,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 14,
    borderRadius: 12,
  },
  deleteText: {
    color: '#DC2626',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelText: { fontSize: 15, fontWeight: '600' },
  submitBtn: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { fontSize: 15, fontWeight: '700' },
});

export default EventModal;
