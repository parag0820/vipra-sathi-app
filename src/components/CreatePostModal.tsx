import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Feather as Icon } from '@expo/vector-icons';
import { PostType } from '../types/community';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, type: PostType) => void;
}

const POST_TYPES: { id: PostType; labelHi: string; labelEn: string }[] = [
  { id: 'question', labelHi: 'प्रश्न', labelEn: 'Question' },
  { id: 'knowledge', labelHi: 'ज्ञान', labelEn: 'Knowledge' },
  { id: 'suggestion', labelHi: 'सुझाव', labelEn: 'Suggestion' },
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<PostType>('question');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit(title.trim(), content.trim(), type);
    setTitle('');
    setContent('');
    setType('question');
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
  const canSubmit = Boolean(title.trim() && content.trim());

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              style={styles.keyboardView}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                    <View style={[styles.headerIcon, { backgroundColor: roseTintBg }]}>
                      <Icon name="edit-3" size={16} color={accentColor} />
                    </View>
                    <Text style={[styles.headerTitle, { color: accentColor }]}>
                      {isHi ? 'नई पोस्ट लिखें' : 'Create Post'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={onClose}
                    style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]}
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
                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'पोस्ट का प्रकार' : 'Post Type'}
                  </Text>
                  <View style={styles.chipRow}>
                    {POST_TYPES.map(item => {
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

                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'शीर्षक' : 'Title'} <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg },
                    ]}
                    placeholder={isHi ? 'विषय लिखें...' : 'What is this about?'}
                    placeholderTextColor={textSecondary}
                    value={title}
                    onChangeText={setTitle}
                  />

                  <Text style={[styles.label, { color: textPrimary }]}>
                    {isHi ? 'विवरण' : 'Content'} <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg },
                    ]}
                    placeholder={isHi ? 'अपने विचार या प्रश्न लिखें...' : 'Share your thoughts...'}
                    placeholderTextColor={textSecondary}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                  />
                </ScrollView>

                <View style={[styles.actionRow, { borderTopColor: dividerDynamic }]}>
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
                        backgroundColor: canSubmit
                          ? PRIMARY_MAROON
                          : isDark
                            ? '#3A2323'
                            : '#D6B4B4',
                      },
                    ]}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                    activeOpacity={0.8}
                  >
                    <Icon name="send" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.submitText}>{isHi ? 'पोस्ट करें' : 'Post'}</Text>
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
  keyboardView: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  modalContainer: {
    borderRadius: 14,
    borderWidth: 1,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    minHeight: 105,
  },
  actionRow: {
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

export default CreatePostModal;
