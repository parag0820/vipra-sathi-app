import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

interface CustomMultiSelectDropdownProps {
  label?: string;
  placeholder?: string;
  values: string[];
  options: string[];
  onSelect: (values: string[]) => void;
  error?: string;
}

const CustomMultiSelectDropdown: React.FC<CustomMultiSelectDropdownProps> = ({
  label,
  placeholder = 'Select options',
  values = [],
  options,
  onSelect,
  error,
}) => {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  const toggleOption = (item: string) => {
    if (values.includes(item)) {
      onSelect(values.filter(v => v !== item));
    } else {
      onSelect([...values, item]);
    }
  };

  const clearSelections = () => {
    onSelect([]);
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
    <>
      <View style={styles.fieldContainer}>
        {label && <Text style={[styles.label, { color: textPrimary }]}>{label}</Text>}
        <TouchableOpacity
          style={[
            styles.trigger,
            {
              backgroundColor: inputBg,
              borderColor: error ? '#DC2626' : borderDynamic,
            },
          ]}
          onPress={() => setVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.triggerContent}>
            {values.length === 0 ? (
              <Text style={[styles.placeholderText, { color: textSecondary }]} numberOfLines={1}>
                {placeholder}
              </Text>
            ) : (
              <View style={styles.chipContainer}>
                {values.map(v => (
                  <View
                    key={v}
                    style={[
                      styles.chip,
                      { backgroundColor: roseTintBg, borderColor: borderDynamic },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: accentColor }]} numberOfLines={1}>
                      {v}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
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
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: accentColor }]} numberOfLines={1}>
                      {label || placeholder}
                    </Text>
                    {values.length > 0 && (
                      <Text style={[styles.subtitle, { color: textSecondary }]}>
                        {values.length} selected
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.headerRight}>
                  {values.length > 0 && (
                    <TouchableOpacity onPress={clearSelections} style={styles.clearBtn}>
                      <Text style={[styles.clearText, { color: accentColor }]}>Clear</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]}
                    activeOpacity={0.7}
                  >
                    <Icon name="x" size={16} color={textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <FlatList
                data={options}
                keyExtractor={item => item}
                renderItem={({ item, index }) => {
                  const isSelected = values.includes(item);
                  const isLast = index === options.length - 1;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        !isLast && { borderBottomWidth: 1, borderBottomColor: dividerDynamic },
                        isSelected && { backgroundColor: roseTintBg },
                      ]}
                      onPress={() => toggleOption(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionLeft}>
                        <View
                          style={[
                            styles.checkbox,
                            {
                              borderColor: isSelected ? PRIMARY_MAROON : borderDynamic,
                              backgroundColor: isSelected ? PRIMARY_MAROON : 'transparent',
                            },
                          ]}
                        >
                          {isSelected && <Icon name="check" size={12} color="#FFFFFF" />}
                        </View>
                        <Text
                          style={[
                            styles.optionText,
                            { color: isSelected ? accentColor : textPrimary },
                            isSelected && styles.optionTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                style={styles.optionList}
                showsVerticalScrollIndicator={false}
              />

              <View style={[styles.modalFooter, { borderTopColor: dividerDynamic }]}>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={[styles.okBtn, { backgroundColor: PRIMARY_MAROON }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.okBtnText}>OK</Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 4,
    marginLeft: 2,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    minHeight: 40,
  },
  triggerContent: {
    flex: 1,
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 11.5,
    fontWeight: '400',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
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
    maxHeight: '75%',
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
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 11.5,
    fontWeight: '700',
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
    gap: 10,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  modalFooter: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  okBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CustomMultiSelectDropdown;
