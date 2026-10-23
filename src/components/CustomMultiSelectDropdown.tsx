import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

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
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const toggleOption = (item: string) => {
    if (values.includes(item)) {
      onSelect(values.filter((v) => v !== item));
    } else {
      onSelect([...values, item]);
    }
  };

  const clearSelections = () => {
    onSelect([]);
  };

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
          <View style={styles.triggerContent}>
            {values.length === 0 ? (
              <Text style={[styles.placeholderText, { color: colors.textLight }]} numberOfLines={1}>
                {placeholder}
              </Text>
            ) : (
              <View style={styles.chipContainer}>
                {values.map((v) => (
                  <View key={v} style={[styles.chip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                    <Text style={[styles.chipText, { color: colors.primary }]} numberOfLines={1}>
                      {v}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <Icon name="chevron-down" size={16} color={colors.textLight} />
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
                  <View>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {label || placeholder}
                    </Text>
                    {values.length > 0 && (
                      <Text style={[styles.subtitle, { color: colors.textLight }]}>
                        {values.length} selected
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.headerRight}>
                  {values.length > 0 && (
                    <TouchableOpacity onPress={clearSelections} style={styles.clearBtn}>
                      <Text style={[styles.clearText, { color: colors.primary }]}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isSelected = values.includes(item);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        { borderBottomColor: colors.border },
                        isSelected && { backgroundColor: colors.primary + '08' },
                      ]}
                      onPress={() => toggleOption(item)}
                      activeOpacity={0.6}
                    >
                      <View style={styles.optionLeft}>
                        <View
                          style={[
                            styles.checkbox,
                            { 
                              borderColor: isSelected ? colors.primary : colors.border,
                              backgroundColor: isSelected ? colors.primary : 'transparent' 
                            }
                          ]}
                        >
                          {isSelected && <Icon name="check" size={12} color="#FFF" />}
                        </View>
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
                    </TouchableOpacity>
                  );
                }}
                style={styles.optionList}
              />
              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={[styles.okBtn, { backgroundColor: colors.primary }]}
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
    marginLeft: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minHeight: 42,
  },
  triggerContent: {
    flex: 1,
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 2,
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
    maxHeight: '75%',
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
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionList: {
    maxHeight: 380,
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
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  modalFooter: {
    borderTopWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okBtn: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  okBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CustomMultiSelectDropdown;
