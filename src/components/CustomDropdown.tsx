import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

export interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: (string | DropdownOption)[];
  onSelect: (value: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onSelect,
  error,
  containerStyle,
  triggerStyle,
}) => {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  const getOptionLabel = (opt: string | DropdownOption) =>
    typeof opt === 'string' ? opt : opt.label;
  const getOptionValue = (opt: string | DropdownOption) =>
    typeof opt === 'string' ? opt : opt.value;

  const selectedOpt = options.find(opt => getOptionValue(opt) === value);
  const selectedText = selectedOpt ? getOptionLabel(selectedOpt) : value || '';

  const surfaceBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const inputBg = isDark ? '#141414' : '#FFFFFF';
  const borderDynamic = isDark ? '#2D2D2D' : CARD_BORDER;
  const dividerDynamic = isDark ? '#2A2A2A' : ROW_DIVIDER;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const roseTintBg = isDark ? '#2B1B1B' : SOFT_ROSE_BG;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;

  return (
    <>
      <View style={[styles.fieldContainer, containerStyle]}>
        {label && <Text style={[styles.label, { color: textPrimary }]}>{label}</Text>}
        <TouchableOpacity
          style={[
            styles.trigger,
            {
              backgroundColor: inputBg,
              borderColor: error ? '#DC2626' : borderDynamic,
            },
            triggerStyle,
          ]}
          onPress={() => setVisible(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.triggerText,
              { color: selectedText ? textPrimary : textSecondary },
            ]}
            numberOfLines={1}
          >
            {selectedText || placeholder}
          </Text>
          <Icon name="chevron-down" size={16} color={accentColor} />
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
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
                { backgroundColor: surfaceBg, borderColor: borderDynamic },
              ]}
              onPress={e => e.stopPropagation()}
            >
              {/* Clean Flat Header */}
              <View style={[styles.modalHeader, { borderBottomColor: dividerDynamic }]}>
                <View style={styles.headerLeft}>
                  <View style={[styles.headerIcon, { backgroundColor: roseTintBg }]}>
                    <Icon name="list" size={15} color={accentColor} />
                  </View>
                  <Text style={[styles.modalTitle, { color: accentColor }]} numberOfLines={1}>
                    {label || placeholder}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]}
                  activeOpacity={0.7}
                >
                  <Icon name="x" size={16} color={textSecondary} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                keyExtractor={item => getOptionValue(item)}
                renderItem={({ item, index }) => {
                  const optVal = getOptionValue(item);
                  const optLabel = getOptionLabel(item);
                  const isSelected = optVal === value;
                  const isLast = index === options.length - 1;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        !isLast && { borderBottomWidth: 1, borderBottomColor: dividerDynamic },
                        isSelected && { backgroundColor: roseTintBg },
                      ]}
                      onPress={() => {
                        onSelect(optVal);
                        setVisible(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionLeft}>
                        <Text
                          style={[
                            styles.optionText,
                            { color: isSelected ? accentColor : textPrimary },
                            isSelected && styles.optionTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {optLabel}
                        </Text>
                      </View>
                      {isSelected && <Icon name="check" size={16} color={accentColor} />}
                    </TouchableOpacity>
                  );
                }}
                style={styles.optionList}
                showsVerticalScrollIndicator={false}
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
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 2,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  triggerText: {
    fontSize: 11.5,
    flex: 1,
    fontWeight: '600',
    marginRight: 8,
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
    marginLeft: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalWrapper: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '68%',
  },
  modalContent: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
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
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionList: {
    maxHeight: 340,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  optionText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '700',
  },
});

export default CustomDropdown;
