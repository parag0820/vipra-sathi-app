import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface CustomDropdownProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  error?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onSelect,
  error,
}) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const selected = value || '';

  return (
    <>
      <View style={styles.fieldContainer}>
        {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
        <TouchableOpacity
          style={[
            styles.trigger,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.error : colors.border,
            },
          ]}
          onPress={() => setVisible(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.triggerText,
              { color: selected ? colors.text : colors.textLight },
            ]}
            numberOfLines={1}
          >
            {selected || placeholder}
          </Text>
          <Icon name="chevron-down" size={18} color={colors.textLight} />
        </TouchableOpacity>
        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalWrapper}>
            <Pressable
              style={[
                styles.modalContent,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <View style={styles.headerLeft}>
                  <View style={[styles.headerIcon, { backgroundColor: colors.primary + '15' }]}>
                    <Icon name="list" size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {label || placeholder}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={[styles.closeBtn, { backgroundColor: 'rgba(0,0,0,0.05)' }]}
                >
                  <Icon name="x" size={18} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isSelected = item === selected;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: colors.border },
                        isSelected && { backgroundColor: colors.primary + '10' },
                      ]}
                      onPress={() => {
                        onSelect(item);
                        setVisible(false);
                      }}
                      activeOpacity={0.6}
                    >
                      <View style={styles.optionLeft}>
                        {isSelected && (
                          <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            { color: isSelected ? colors.primary : colors.text },
                            isSelected && styles.optionTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {item}
                        </Text>
                      </View>
                      {isSelected && (
                        <Icon name="check-circle" size={18} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
                style={styles.optionList}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 45,
  },
  triggerText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalWrapper: {
    width: '100%',
    maxHeight: '65%',
  },
  modalContent: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionList: {
    maxHeight: 350,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
});

export default CustomDropdown;
