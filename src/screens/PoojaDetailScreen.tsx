import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StatusBar,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { usePoojaLibrary } from '../hooks/usePoojaLibrary';
import { MOCK_POOJAS } from '../data/mockPoojas';
import { PoojaPersonalNote, Pooja } from '../types/pooja';
import {
  Feather as Icon,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

type PoojaDetailRouteProp = {
  key: string;
  name: 'PoojaDetail';
  params: { poojaId: string };
};

const PoojaDetailScreen = () => {
  const route = useRoute<PoojaDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { poojaId } = route.params || { poojaId: 'p1' };

  // Screen view mode: 'detail' for Pooja Details, 'notes' for Personal Notes
  const [viewMode, setViewMode] = useState<'detail' | 'notes'>('detail');

  // Search and sort state for notes
  const [notesSearchQuery, setNotesSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  // Add/Edit Note Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<PoojaPersonalNote | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalIsPinned, setModalIsPinned] = useState(false);

  // Card Context Menu state
  const [activeMenuNoteId, setActiveMenuNoteId] = useState<string | null>(null);

  // Scroll ref for anchor jumps
  const scrollViewRef = useRef<ScrollView>(null);

  // Find pooja from data or fallback to first
  const pooja: Pooja = useMemo(() => {
    return MOCK_POOJAS.find(p => p.id === poojaId) || MOCK_POOJAS[0];
  }, [poojaId]);

  // Hook for personal notes, font size scaling, favorites
  const {
    personalNotes,
    addPersonalNote,
    updatePersonalNote,
    deletePersonalNote,
    togglePinNote,
    fontSizeOffset,
    increaseFontSize,
    decreaseFontSize,
  } = usePoojaLibrary(pooja.id);

  // Header display texts
  const headerPoojaTitle = pooja.headerTitle || pooja.titleHindi || pooja.title;
  const detailTitle = pooja.titleHindi || pooja.title;
  const detailSubtitle = pooja.subtitleHindi || 'संक्षिप्त पूजा क्रम';
  const breadcrumbs = pooja.breadcrumbs || `पूजा विधि  /  ${headerPoojaTitle}`;
  const anchors = pooja.navAnchors || ['सामग्री', 'प्रारंभ', 'ध्यान', 'आवाहन', 'उपचार'];

  // Handle open Add Note modal
  const handleOpenAddNote = () => {
    setEditingNote(null);
    setModalTitle('');
    setModalContent('');
    setModalIsPinned(false);
    setIsNoteModalOpen(true);
  };

  // Handle open Edit Note modal
  const handleOpenEditNote = (note: PoojaPersonalNote) => {
    setActiveMenuNoteId(null);
    setEditingNote(note);
    setModalTitle(note.title);
    setModalContent(note.content);
    setModalIsPinned(note.isPinned);
    setIsNoteModalOpen(true);
  };

  // Handle save Note (both create and update)
  const handleSaveModalNote = async () => {
    if (!modalTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'शीर्षक आवश्यक है',
        text2: 'कृपया नोट का शीर्षक दर्ज करें।',
      });
      return;
    }

    if (editingNote) {
      await updatePersonalNote(
        editingNote.id,
        modalTitle,
        modalContent,
        modalIsPinned
      );
      Toast.show({
        type: 'success',
        text1: 'बदलाव सहेजे गए',
        text2: 'नोट सफलतापूर्वक अपडेट हो गया है।',
      });
    } else {
      await addPersonalNote(modalTitle, modalContent, modalIsPinned);
      Toast.show({
        type: 'success',
        text1: 'नोट सहेजा गया',
        text2: 'नया निजी नोट जोड़ दिया गया है।',
      });
    }

    setIsNoteModalOpen(false);
    setEditingNote(null);
    setModalTitle('');
    setModalContent('');
    setModalIsPinned(false);
  };

  // Handle Delete note with confirmation
  const handleDeleteNoteConfirm = (noteId: string) => {
    setActiveMenuNoteId(null);
    Alert.alert(
      'नोट हटाएँ',
      'क्या आप इस नोट को हटाना चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'हटाएँ',
          style: 'destructive',
          onPress: async () => {
            await deletePersonalNote(noteId);
            Toast.show({
              type: 'info',
              text1: 'नोट हटाया गया',
              text2: 'नोट सफलतापूर्वक हटा दिया गया है।',
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Filtered and sorted personal notes
  const filteredNotes = useMemo(() => {
    let result = [...personalNotes];

    if (notesSearchQuery.trim()) {
      const q = notesSearchQuery.toLowerCase().trim();
      result = result.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    // Sort: Pinned notes always on top, then by timestamp
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortOrder === 'latest') {
        return (b.timestamp || 0) - (a.timestamp || 0);
      } else {
        return (a.timestamp || 0) - (b.timestamp || 0);
      }
    });

    return result;
  }, [personalNotes, notesSearchQuery, sortOrder]);

  // Back button press handler
  const handleBackPress = () => {
    if (viewMode === 'notes') {
      setViewMode('detail');
    } else {
      navigation.goBack();
    }
  };

  // ==========================================
  // RENDER: Top Header Bar
  // ==========================================
  const renderHeader = () => {
    const isNotes = viewMode === 'notes';

    return (
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, 12),
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderBottomColor: isDark ? '#2D2D2D' : '#F1F1F1',
          },
        ]}
      >
        <View style={styles.headerInnerRow}>
          {/* Back button */}
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Icon
              name="chevron-left"
              size={26}
              color={isDark ? '#F87171' : '#991B1B'}
            />
          </TouchableOpacity>

          {/* Title */}
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? '#FCA5A5' : '#991B1B' },
            ]}
            numberOfLines={1}
          >
            {isNotes ? 'निजी नोट्स' : headerPoojaTitle}
          </Text>

          <View style={styles.headerSpacer} />

          {/* Right Header Actions */}
          {!isNotes ? (
            <View style={styles.headerActionsGroup}>
              {/* Decrease font size */}
              <TouchableOpacity
                onPress={decreaseFontSize}
                style={styles.headerActionButton}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.fontActionText,
                    {
                      fontSize: 14,
                      color: isDark ? '#FCA5A5' : '#991B1B',
                      opacity: fontSizeOffset <= -2 ? 0.4 : 1,
                    },
                  ]}
                >
                  अ-
                </Text>
              </TouchableOpacity>

              {/* Increase font size */}
              <TouchableOpacity
                onPress={increaseFontSize}
                style={styles.headerActionButton}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.fontActionText,
                    {
                      fontSize: 16,
                      color: isDark ? '#FCA5A5' : '#991B1B',
                      opacity: fontSizeOffset >= 6 ? 0.4 : 1,
                    },
                  ]}
                >
                  अ+
                </Text>
              </TouchableOpacity>

              {/* Vertical divider */}
              <View
                style={[
                  styles.headerDivider,
                  { backgroundColor: isDark ? '#555' : '#E5E7EB' },
                ]}
              />

              {/* Add Note icon button */}
              <TouchableOpacity
                onPress={handleOpenAddNote}
                style={styles.headerActionButton}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={22}
                  color={isDark ? '#FCA5A5' : '#991B1B'}
                />
              </TouchableOpacity>

              {/* Grid / Menu icon button (opens Personal Notes) */}
              <TouchableOpacity
                onPress={() => setViewMode('notes')}
                style={styles.headerActionButton}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="view-grid-outline"
                  size={22}
                  color={isDark ? '#FCA5A5' : '#991B1B'}
                />
              </TouchableOpacity>
            </View>
          ) : (
            /* Notes view header right: Add Note Button */
            <TouchableOpacity
              onPress={handleOpenAddNote}
              style={[
                styles.addNoteHeaderBtn,
                {
                  borderColor: isDark ? '#F87171' : '#991B1B',
                  backgroundColor: isDark ? 'rgba(248,113,113,0.1)' : '#FFF6F6',
                },
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={16}
                color={isDark ? '#FCA5A5' : '#991B1B'}
              />
              <Text
                style={[
                  styles.addNoteHeaderText,
                  { color: isDark ? '#FCA5A5' : '#991B1B' },
                ]}
              >
                + नया नोट
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // ==========================================
  // RENDER: Pooja Details View (Image 1)
  // ==========================================
  const renderDetailView = () => {
    // Dynamic scalable font sizes
    const baseScale = fontSizeOffset;
    const breadcrumbSize = Math.max(10, 11.5 + baseScale);
    const mainTitleSize = Math.max(18, 22 + baseScale);
    const subtitleSize = Math.max(11, 13 + baseScale);
    const tagSize = Math.max(10.5, 12 + baseScale);
    const sectionHeadingSize = Math.max(13, 15 + baseScale);
    const stepHeadingSize = Math.max(12.5, 14.5 + baseScale);
    const bodySize = Math.max(11.5, 13.5 + baseScale);
    const lineHeight = bodySize * 1.55;

    return (
      <ScrollView
        ref={scrollViewRef}
        style={[
          styles.contentScrollView,
          { backgroundColor: isDark ? colors.background : '#FFFFFF' },
        ]}
        contentContainerStyle={[
          styles.detailContentContainer,
          { paddingBottom: Math.max(insets.bottom + 30, 60) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb */}
        <Text
          style={[
            styles.breadcrumbText,
            {
              fontSize: breadcrumbSize,
              color: isDark ? '#9CA3AF' : '#6B7280',
            },
          ]}
        >
          {breadcrumbs}
        </Text>

        {/* Big Pooja Title */}
        <Text
          style={[
            styles.mainPoojaTitle,
            {
              fontSize: mainTitleSize,
              color: isDark ? '#FCA5A5' : '#991B1B',
            },
          ]}
        >
          {detailTitle}
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            styles.mainSubtitle,
            {
              fontSize: subtitleSize,
              color: isDark ? '#D1D5DB' : '#4B5563',
            },
          ]}
        >
          {detailSubtitle}
        </Text>

        {/* Quick Anchor Navigation Tags */}
        <View style={styles.anchorRow}>
          <Text
            style={[
              styles.anchorText,
              {
                fontSize: tagSize,
                color: isDark ? '#9CA3AF' : '#6B7280',
              },
            ]}
          >
            {anchors.join('  •  ')}
          </Text>
        </View>

        {/* Section: आवश्यक सामग्री */}
        {pooja.samagriList && pooja.samagriList.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text
              style={[
                styles.sectionHeading,
                {
                  fontSize: sectionHeadingSize,
                  color: isDark ? '#FCA5A5' : '#991B1B',
                },
              ]}
            >
              आवश्यक सामग्री
            </Text>

            {pooja.samagriList.map((item, idx) => (
              <View key={`samagri_${idx}`} style={styles.samagriBulletRow}>
                <Text
                  style={[
                    styles.samagriBulletDot,
                    {
                      fontSize: bodySize,
                      color: isDark ? '#E5E7EB' : '#374151',
                    },
                  ]}
                >
                  •
                </Text>
                <Text
                  style={[
                    styles.samagriItemText,
                    {
                      fontSize: bodySize,
                      lineHeight: lineHeight,
                      color: isDark ? '#E5E7EB' : '#374151',
                    },
                  ]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Section: पूजा क्रम */}
        {pooja.stepsList && pooja.stepsList.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text
              style={[
                styles.sectionHeading,
                {
                  fontSize: sectionHeadingSize,
                  color: isDark ? '#FCA5A5' : '#991B1B',
                  marginTop: 18,
                  marginBottom: 10,
                },
              ]}
            >
              पूजा क्रम
            </Text>

            {pooja.stepsList.map(step => (
              <View key={step.id} style={styles.stepItemContainer}>
                {/* Step Number & Title */}
                <Text
                  style={[
                    styles.stepTitleText,
                    {
                      fontSize: stepHeadingSize,
                      color: isDark ? '#FCA5A5' : '#991B1B',
                    },
                  ]}
                >
                  {step.stepNumber}. {step.title}
                </Text>

                {/* Step Content / Vidhi / Mantras */}
                <Text
                  style={[
                    styles.stepContentText,
                    {
                      fontSize: bodySize,
                      lineHeight: lineHeight,
                      color: isDark ? '#E5E7EB' : '#374151',
                    },
                  ]}
                >
                  {step.content}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // ==========================================
  // RENDER: Personal Notes View (Image 2 Left)
  // ==========================================
  const renderNotesView = () => {
    return (
      <View
        style={[
          styles.notesViewContainer,
          { backgroundColor: isDark ? colors.background : '#FAF8F5' },
        ]}
      >
        <ScrollView
          style={styles.contentScrollView}
          contentContainerStyle={[
            styles.notesContentContainer,
            { paddingBottom: Math.max(insets.bottom + 30, 60) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Breadcrumb */}
          <Text
            style={[
              styles.notesBreadcrumbText,
              { color: isDark ? '#9CA3AF' : '#6B7280' },
            ]}
          >
            {breadcrumbs}
          </Text>

          {/* Privacy line */}
          <View style={styles.privacyBannerRow}>
            <Icon
              name="lock"
              size={14}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <Text
              style={[
                styles.privacyBannerText,
                { color: isDark ? '#9CA3AF' : '#4B5563' },
              ]}
            >
              ये नोट्स केवल आपको दिखाई देंगे।
            </Text>
          </View>

          {/* Search bar */}
          <View
            style={[
              styles.notesSearchContainer,
              {
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderColor: isDark ? '#374151' : '#E5E7EB',
              },
            ]}
          >
            <Icon
              name="search"
              size={16}
              color={isDark ? '#9CA3AF' : '#9CA3AF'}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.notesSearchInput,
                { color: isDark ? '#FFF' : '#1F2937' },
              ]}
              placeholder="इस पूजा के नोट्स खोजें"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={notesSearchQuery}
              onChangeText={setNotesSearchQuery}
            />
            {notesSearchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setNotesSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon
                  name="x"
                  size={16}
                  color={isDark ? '#9CA3AF' : '#9CA3AF'}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Count and Sort Bar */}
          <View style={styles.notesSummaryRow}>
            <Text
              style={[
                styles.notesCountText,
                { color: isDark ? '#D1D5DB' : '#374151' },
              ]}
            >
              {filteredNotes.length} नोट्स
            </Text>

            <TouchableOpacity
              onPress={() =>
                setSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'))
              }
              style={styles.sortButton}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  { color: isDark ? '#9CA3AF' : '#4B5563' },
                ]}
              >
                {sortOrder === 'latest' ? 'नवीनतम पहले ↓' : 'पुराने पहले ↑'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* List of Notes */}
          {filteredNotes.length === 0 ? (
            <View style={styles.emptyNotesContainer}>
              <Icon
                name="file-text"
                size={36}
                color={isDark ? '#4B5563' : '#CBD5E1'}
              />
              <Text
                style={[
                  styles.emptyNotesTitle,
                  { color: isDark ? '#9CA3AF' : '#64748B' },
                ]}
              >
                {notesSearchQuery
                  ? 'कोई मिलता-जुलता नोट नहीं मिला'
                  : 'अभी कोई निजी नोट नहीं है'}
              </Text>
              <TouchableOpacity
                style={[
                  styles.emptyAddBtn,
                  { backgroundColor: isDark ? '#7F1D1D' : '#991B1B' },
                ]}
                onPress={handleOpenAddNote}
              >
                <Text style={styles.emptyAddBtnText}>+ नया नोट जोड़ें</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredNotes.map(item => {
              const isMenuOpen = activeMenuNoteId === item.id;

              return (
                <View key={item.id} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.noteCard,
                      {
                        backgroundColor: isDark ? colors.surface : '#FFFFFF',
                        borderColor: isDark ? '#333333' : '#EAE8E4',
                      },
                    ]}
                    onPress={() => handleOpenEditNote(item)}
                    activeOpacity={0.85}
                  >
                    {/* Top Row: Title, Pin badge & Three dots */}
                    <View style={styles.noteCardHeaderRow}>
                      <View style={styles.noteTitleContainer}>
                        <Text
                          style={[
                            styles.noteCardTitle,
                            { color: isDark ? '#FCA5A5' : '#991B1B' },
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        {item.isPinned && (
                          <View style={styles.pinnedBadgeRow}>
                            <MaterialCommunityIcons
                              name="pin"
                              size={14}
                              color="#D97706"
                            />
                            <Text style={styles.pinnedBadgeText}>
                              पिन किया
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Three-dot menu button */}
                      <TouchableOpacity
                        style={styles.moreOptionsButton}
                        onPress={() =>
                          setActiveMenuNoteId(isMenuOpen ? null : item.id)
                        }
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <MaterialIcons
                          name="more-vert"
                          size={20}
                          color={isDark ? '#9CA3AF' : '#6B7280'}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Content Preview */}
                    <Text
                      style={[
                        styles.noteCardContent,
                        { color: isDark ? '#D1D5DB' : '#4B5563' },
                      ]}
                      numberOfLines={2}
                    >
                      {item.content}
                    </Text>

                    {/* Timestamp */}
                    <Text
                      style={[
                        styles.noteCardTimestamp,
                        { color: isDark ? '#6B7280' : '#9CA3AF' },
                      ]}
                    >
                      संशोधित: {item.updatedAt}
                    </Text>
                  </TouchableOpacity>

                  {/* Context Popup Menu for Edit / Delete / Pin */}
                  {isMenuOpen && (
                    <View
                      style={[
                        styles.contextMenuDropdown,
                        {
                          backgroundColor: isDark ? '#262626' : '#FFFFFF',
                          borderColor: isDark ? '#404040' : '#E5E7EB',
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.contextMenuItem}
                        onPress={() => handleOpenEditNote(item)}
                      >
                        <Icon
                          name="edit-2"
                          size={15}
                          color={isDark ? '#FCA5A5' : '#991B1B'}
                        />
                        <Text
                          style={[
                            styles.contextMenuText,
                            { color: isDark ? '#FCA5A5' : '#374151' },
                          ]}
                        >
                          संपादित करें
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={[
                          styles.contextDivider,
                          { backgroundColor: isDark ? '#333' : '#F3F4F6' },
                        ]}
                      />

                      <TouchableOpacity
                        style={styles.contextMenuItem}
                        onPress={async () => {
                          setActiveMenuNoteId(null);
                          await togglePinNote(item.id);
                        }}
                      >
                        <MaterialCommunityIcons
                          name={item.isPinned ? 'pin-off-outline' : 'pin-outline'}
                          size={15}
                          color={isDark ? '#D1D5DB' : '#374151'}
                        />
                        <Text
                          style={[
                            styles.contextMenuText,
                            { color: isDark ? '#D1D5DB' : '#374151' },
                          ]}
                        >
                          {item.isPinned ? 'अनपिन करें' : 'पिन करें'}
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={[
                          styles.contextDivider,
                          { backgroundColor: isDark ? '#333' : '#F3F4F6' },
                        ]}
                      />

                      <TouchableOpacity
                        style={styles.contextMenuItem}
                        onPress={() => handleDeleteNoteConfirm(item.id)}
                      >
                        <Icon name="trash-2" size={15} color="#DC2626" />
                        <Text
                          style={[styles.contextMenuText, { color: '#DC2626' }]}
                        >
                          हटाएँ
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}

          {/* Bottom helper text */}
          <Text
            style={[
              styles.bottomTapHint,
              { color: isDark ? '#9CA3AF' : '#6B7280' },
            ]}
          >
            नोट पर टैप करके खोलें और संपादित करें।
          </Text>

          {/* Return link */}
          <TouchableOpacity
            style={styles.returnLinkBtn}
            onPress={() => setViewMode('detail')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.returnLinkText,
                { color: isDark ? '#F87171' : '#991B1B' },
              ]}
            >
              ← {headerPoojaTitle} पर लौटें
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  // ==========================================
  // RENDER: Add / Edit Note Modal (Image 2 Right)
  // ==========================================
  const renderNoteModal = () => {
    const isEditing = !!editingNote;

    return (
      <Modal
        visible={isNoteModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsNoteModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsNoteModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.modalContainer}
              >
                <View
                  style={[
                    styles.modalCard,
                    { backgroundColor: isDark ? colors.surface : '#FFFFFF' },
                  ]}
                >
                  {/* Modal Header */}
                  <View style={styles.modalHeaderRow}>
                    <View style={styles.modalHeaderLeft}>
                      <Text
                        style={[
                          styles.modalMainTitle,
                          { color: isDark ? '#FFF' : '#1F2937' },
                        ]}
                      >
                        {isEditing ? 'नोट संपादित करें' : 'नया नोट जोड़ें'}
                      </Text>
                      <Text
                        style={[
                          styles.modalSubtitle,
                          { color: isDark ? '#9CA3AF' : '#6B7280' },
                        ]}
                      >
                        {headerPoojaTitle} • निजी नोट
                      </Text>
                    </View>

                    {/* Close button */}
                    <TouchableOpacity
                      onPress={() => setIsNoteModalOpen(false)}
                      style={styles.modalCloseButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Icon
                        name="x"
                        size={20}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Privacy Banner */}
                  <View style={styles.modalPrivacyRow}>
                    <Icon
                      name="lock"
                      size={13}
                      color={isDark ? '#9CA3AF' : '#4B5563'}
                    />
                    <Text
                      style={[
                        styles.modalPrivacyText,
                        { color: isDark ? '#9CA3AF' : '#4B5563' },
                      ]}
                    >
                      केवल आपको दिखाई देगा
                    </Text>
                  </View>

                  {/* Field 1: Title */}
                  <Text
                    style={[
                      styles.inputLabel,
                      { color: isDark ? '#E5E7EB' : '#374151' },
                    ]}
                  >
                    नोट का शीर्षक <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.modalTextInput,
                      {
                        backgroundColor: isDark ? colors.background : '#FFFFFF',
                        borderColor: isDark ? '#404040' : '#D1D5DB',
                        color: isDark ? '#FFF' : '#1F2937',
                      },
                    ]}
                    placeholder="नोट का शीर्षक लिखें"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    value={modalTitle}
                    onChangeText={setModalTitle}
                  />

                  {/* Field 2: Content */}
                  <Text
                    style={[
                      styles.inputLabel,
                      {
                        color: isDark ? '#E5E7EB' : '#374151',
                        marginTop: 12,
                      },
                    ]}
                  >
                    नोट का विवरण <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.modalTextArea,
                      {
                        backgroundColor: isDark ? colors.background : '#FFFFFF',
                        borderColor: isDark ? '#404040' : '#D1D5DB',
                        color: isDark ? '#FFF' : '#1F2937',
                      },
                    ]}
                    placeholder="नोट का विवरण यहाँ लिखें..."
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    multiline={true}
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={modalContent}
                    onChangeText={setModalContent}
                  />

                  {/* Checkbox: Pin Note */}
                  <TouchableOpacity
                    style={styles.pinCheckboxRow}
                    onPress={() => setModalIsPinned(!modalIsPinned)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name={
                        modalIsPinned
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline'
                      }
                      size={20}
                      color={
                        modalIsPinned
                          ? isDark
                            ? '#F87171'
                            : '#991B1B'
                          : isDark
                            ? '#9CA3AF'
                            : '#9CA3AF'
                      }
                    />
                    <Text
                      style={[
                        styles.pinCheckboxText,
                        { color: isDark ? '#E5E7EB' : '#1F2937' },
                      ]}
                    >
                      इस नोट को ऊपर पिन करें
                    </Text>
                  </TouchableOpacity>

                  {/* Metadata Row: Last updated / required note */}
                  <View style={styles.modalMetaRow}>
                    <Text
                      style={[
                        styles.modalMetaText,
                        { color: isDark ? '#9CA3AF' : '#9CA3AF' },
                      ]}
                    >
                      {isEditing && editingNote
                        ? `अंतिम संशोधन: ${editingNote.updatedAt.replace('•', ',')}`
                        : ''}
                    </Text>
                    <Text style={styles.requiredNoticeText}>
                      * आवश्यक जानकारी
                    </Text>
                  </View>

                  {/* Bottom Action Buttons */}
                  <View style={styles.modalActionsRow}>
                    {/* Cancel Button */}
                    <TouchableOpacity
                      style={[
                        styles.modalCancelBtn,
                        { borderColor: isDark ? '#4B5563' : '#D1D5DB' },
                      ]}
                      onPress={() => setIsNoteModalOpen(false)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.modalCancelText,
                          { color: isDark ? '#E5E7EB' : '#374151' },
                        ]}
                      >
                        रद्द करें
                      </Text>
                    </TouchableOpacity>

                    {/* Save Button */}
                    <TouchableOpacity
                      style={[
                        styles.modalSaveBtn,
                        {
                          backgroundColor: isDark ? '#7F1D1D' : '#991B1B',
                        },
                      ]}
                      onPress={handleSaveModalNote}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalSaveText}>
                        {isEditing ? 'बदलाव सहेजें' : 'नोट सहेजें'}
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

  // Close context menu when tapping outside
  const handleScreenTouch = () => {
    if (activeMenuNoteId) {
      setActiveMenuNoteId(null);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <View
        style={[
          styles.screenContainer,
          { backgroundColor: isDark ? colors.background : '#FFFFFF' },
        ]}
      >
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? colors.surface : '#FFFFFF'}
        />

        {/* Persistent top header bar */}
        {renderHeader()}

        {/* Main Body: Switch between Pooja Details & Personal Notes */}
        {viewMode === 'detail' ? renderDetailView() : renderNotesView()}

        {/* Note Add/Edit Modal */}
        {renderNoteModal()}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },

  // ------------------------------------------
  // Header Styles
  // ------------------------------------------
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 10,
  },
  headerInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  backButton: {
    marginRight: 6,
    padding: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    flex: 1,
  },
  headerActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontActionText: {
    fontWeight: 'bold',
  },
  headerDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 2,
  },
  addNoteHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  addNoteHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ------------------------------------------
  // Pooja Detail Content Styles
  // ------------------------------------------
  contentScrollView: {
    flex: 1,
  },
  detailContentContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  breadcrumbText: {
    marginBottom: 4,
    fontWeight: '500',
  },
  mainPoojaTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mainSubtitle: {
    fontWeight: '500',
    marginBottom: 6,
  },
  anchorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  anchorText: {
    fontWeight: '500',
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  samagriBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  samagriBulletDot: {
    marginRight: 8,
    lineHeight: 22,
  },
  samagriItemText: {
    flex: 1,
    fontWeight: '400',
  },
  stepItemContainer: {
    marginBottom: 12,
  },
  stepTitleText: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  stepContentText: {
    fontWeight: '400',
  },

  // ------------------------------------------
  // Personal Notes View Styles
  // ------------------------------------------
  notesViewContainer: {
    flex: 1,
  },
  notesContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  notesBreadcrumbText: {
    fontSize: 11.5,
    marginBottom: 6,
    fontWeight: '500',
  },
  privacyBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  privacyBannerText: {
    fontSize: 12,
    fontWeight: '400',
  },
  notesSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  notesSearchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  notesSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesCountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sortButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardWrapper: {
    position: 'relative',
    marginBottom: 5,
    zIndex: 1,
  },
  noteCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 5,

  },
  noteCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingRight: 6,
  },
  noteCardTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  pinnedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pinnedBadgeText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: 'bold',
  },
  moreOptionsButton: {
    padding: 2,
  },
  noteCardContent: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  noteCardTimestamp: {
    fontSize: 11,
    marginTop: 8,
  },
  bottomTapHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  returnLinkBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  returnLinkText: {
    fontSize: 13.5,
    fontWeight: 'bold',
  },
  emptyNotesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyNotesTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyAddBtn: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // ------------------------------------------
  // Context Menu Dropdown Styles
  // ------------------------------------------
  contextMenuDropdown: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 140,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 999,
    paddingVertical: 4,
  },
  contextMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  contextMenuText: {
    fontSize: 13,
    fontWeight: '500',
  },
  contextDivider: {
    height: 1,
    marginHorizontal: 8,
  },

  // ------------------------------------------
  // Modal Popup Styles (Image 2 Right)
  // ------------------------------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalCard: {
    borderRadius: 14,
    padding: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalMainTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalPrivacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 10,
  },
  modalPrivacyText: {
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  requiredAsterisk: {
    color: '#DC2626',
  },
  modalTextInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13.5,
  },
  modalTextArea: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13.5,
    minHeight: 110,
  },
  pinCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  pinCheckboxText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  modalMetaText: {
    fontSize: 10.5,
  },
  requiredNoticeText: {
    fontSize: 10.5,
    color: '#DC2626',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalSaveBtn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default PoojaDetailScreen;
