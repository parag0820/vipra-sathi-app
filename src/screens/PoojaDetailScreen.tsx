import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { usePoojaLibrary } from '../hooks/usePoojaLibrary';
import { MOCK_POOJAS } from '../data/mockPoojas';
import { PoojaPersonalNote, Pooja } from '../types/pooja';
import { poojaApi } from '../api/pooja';
import { isValidMongoId } from '../utils/objectId';
import RichHtmlContent from '../components/RichHtmlContent';
import DynamicSection from '../components/DynamicSection';
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

const EMPTY_POOJA_FALLBACK: Pooja = {
  id: '',
  title: 'पूजा विवरण',
  category: 'पूजा विधि',
};

const PoojaDetailScreen = () => {
  const route = useRoute<PoojaDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { poojaId } = route.params || { poojaId: 'p1' };

  // Determine whether ID refers to a local static mock item or a live backend item
  const localMockPooja = useMemo(() => {
    return MOCK_POOJAS.find((p) => p.id === poojaId) || null;
  }, [poojaId]);
  const isMockOnly = Boolean(localMockPooja) || !poojaId || poojaId.startsWith('p_');

  const [apiPooja, setApiPooja] = useState<Pooja | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!isMockOnly);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadPoojaDetail = useCallback(
    async (refresh: boolean = false) => {
      if (isMockOnly) {
        setIsLoading(false);
        return;
      }
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setApiError(null);
        const fetched = await poojaApi.getById(poojaId);
        setApiPooja(fetched);
      } catch (err) {
        console.error(`Failed to load pooja detail for id ${poojaId}:`, err);
        setApiError('पूजा विवरण लोड करने में समस्या आई।');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [poojaId, isMockOnly]
  );

  useEffect(() => {
    loadPoojaDetail(false);
  }, [loadPoojaDetail]);

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
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isLoadingNoteDetail, setIsLoadingNoteDetail] = useState(false);
  const hasEditedModalFieldsRef = useRef(false);

  // Card Context Menu state
  const [activeMenuNoteId, setActiveMenuNoteId] = useState<string | null>(null);

  // Scroll ref for anchor jumps
  const scrollViewRef = useRef<ScrollView>(null);

  // Resolve active pooja object
  const resolvedPooja: Pooja | null = useMemo(() => {
    if (isMockOnly) {
      return localMockPooja || MOCK_POOJAS[0];
    }
    return apiPooja;
  }, [isMockOnly, localMockPooja, apiPooja]);

  const pooja: Pooja = resolvedPooja || { ...EMPTY_POOJA_FALLBACK, id: poojaId || 'p1' };

  // Hook for personal notes, font size scaling, favorites
  const {
    favorites,
    toggleFavorite,
    personalNotes,
    notesLoading,
    notesRefreshing,
    notesError,
    isCloudNotesActive,
    refreshPersonalNotes,
    fetchSingleNoteDetail,
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
  const detailSubtitle = pooja.subtitleHindi || pooja.subCategory || 'संक्षिप्त पूजा क्रम';
  const breadcrumbs = pooja.breadcrumbs || `पूजा विधि  /  ${headerPoojaTitle}`;
  const anchors = pooja.navAnchors || ['सामग्री', 'प्रारंभ', 'ध्यान', 'आवाहन', 'उपचार'];

  // Handle open Add Note modal
  const handleOpenAddNote = () => {
    hasEditedModalFieldsRef.current = false;
    setEditingNote(null);
    setModalTitle('');
    setModalContent('');
    setModalIsPinned(false);
    setIsLoadingNoteDetail(false);
    setIsNoteModalOpen(true);
  };

  // Handle open Edit Note modal (also fetches latest single note detail via GET /pooja/notes/detail/:noteId)
  const handleOpenEditNote = async (note: PoojaPersonalNote) => {
    setActiveMenuNoteId(null);
    hasEditedModalFieldsRef.current = false;
    setEditingNote(note);
    setModalTitle(note.title);
    setModalContent(note.content);
    setModalIsPinned(note.isPinned);
    setIsNoteModalOpen(true);

    if (note.isApiNote && isCloudNotesActive) {
      try {
        setIsLoadingNoteDetail(true);
        const latest = await fetchSingleNoteDetail(note.id);
        if (latest && !hasEditedModalFieldsRef.current) {
          setEditingNote(latest);
          setModalTitle(latest.title);
          setModalContent(latest.content);
          setModalIsPinned(latest.isPinned);
        }
      } catch (err) {
        console.warn('Failed to fetch single note detail:', err);
      } finally {
        setIsLoadingNoteDetail(false);
      }
    }
  };

  // Handle save Note (both create and update)
  const handleSaveModalNote = async () => {
    if (isSavingNote) return;

    if (!modalTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'शीर्षक आवश्यक है',
        text2: 'कृपया नोट का शीर्षक दर्ज करें।',
      });
      return;
    }

    if (!modalContent.trim()) {
      Toast.show({
        type: 'error',
        text1: 'विवरण आवश्यक है',
        text2: 'कृपया नोट का विवरण दर्ज करें।',
      });
      return;
    }

    try {
      setIsSavingNote(true);
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
    } catch (err) {
      console.error('Failed to save pooja note:', err);
    } finally {
      setIsSavingNote(false);
    }
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
            try {
              await deletePersonalNote(noteId);
              Toast.show({
                type: 'info',
                text1: 'नोट हटाया गया',
                text2: 'नोट सफलतापूर्वक हटा दिया गया है।',
              });
            } catch (err) {
              console.error('Failed to delete pooja note:', err);
            }
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
            ellipsizeMode="tail"
          >
            {isNotes ? 'निजी नोट्स' : headerPoojaTitle}
          </Text>

          {/* Right Header Actions */}
          {!isNotes ? (
            <View style={styles.headerActionsGroup}>
              {/* Font Zoom Out / In Group */}
              <View style={styles.fontZoomGroup}>
                {/* Decrease font size */}
                <TouchableOpacity
                  onPress={decreaseFontSize}
                  style={styles.zoomActionButton}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
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
                  style={styles.zoomActionButton}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
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
              </View>

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
                onPress={() => {
                  setViewMode('notes');
                  if (isCloudNotesActive) {
                    refreshPersonalNotes(false);
                  }
                }}
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

  const handleOpenPdf = async (pdfUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Toast.show({
          type: 'error',
          text1: 'PDF नहीं खुल सका',
          text2: 'कृपया लिंक या डिवाइस सेटिंग जांचें।',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'त्रुटि',
        text2: 'दस्तावेज़ खोलने में समस्या हुई।',
      });
    }
  };

  // ==========================================
  // RENDER: Pooja Details View (Image 1)
  // ==========================================
  const renderDetailView = () => {
    if (isLoading && !resolvedPooja) {
      return (
        <View
          style={[
            styles.stateContainer,
            { backgroundColor: isDark ? colors.background : '#FFFFFF' },
          ]}
        >
          <ActivityIndicator size="large" color={isDark ? '#FCA5A5' : '#991B1B'} />
          <Text style={[styles.stateText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
            पूजा विवरण लोड हो रहा है...
          </Text>
        </View>
      );
    }

    if (apiError && !resolvedPooja) {
      return (
        <View
          style={[
            styles.stateContainer,
            { backgroundColor: isDark ? colors.background : '#FFFFFF' },
          ]}
        >
          <View
            style={[
              styles.errorStateCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFF8F6',
                borderColor: isDark ? '#5C2323' : '#FEE2E2',
              },
            ]}
          >
            <Icon name="alert-circle" size={28} color={isDark ? '#FCA5A5' : '#991B1B'} />
            <Text style={[styles.errorStateTitle, { color: isDark ? '#F8E6CE' : '#111827' }]}>
              {apiError}
            </Text>
            <TouchableOpacity
              style={styles.retryActionBtn}
              onPress={() => loadPoojaDetail(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.retryActionBtnText}>पुनः प्रयास करें</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

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

    const contentLabel =
      pooja.sectionType === 'Mantra'
        ? 'मुख्य मंत्र'
        : pooja.sectionType === 'Dhyan'
          ? 'ध्यान मंत्र'
          : pooja.sectionType === 'Vidhi'
            ? 'मुख्य विधि'
            : 'संक्षिप्त विवरण';

    const hasCompleteContent =
      Boolean(pooja.completeContent) && pooja.completeContent !== pooja.textEditor;

    return (
      <ScrollView
        ref={scrollViewRef}
        style={[
          styles.contentScrollView,
          { backgroundColor: isDark ? colors.background : '#FFFFFF' },
        ]}
        contentContainerStyle={[
          styles.detailContentContainer,
          { paddingBottom: 28 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          !isMockOnly ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadPoojaDetail(true)}
              colors={['#991B1B']}
              tintColor={isDark ? '#FCA5A5' : '#991B1B'}
            />
          ) : undefined
        }
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

        {/* Quick Anchor Navigation Tags / Badges */}
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
          {pooja.isAvailableOffline && (
            <View
              style={[
                styles.offlineBadge,
                {
                  backgroundColor: isDark ? '#1B3325' : '#ECFDF5',
                  borderColor: isDark ? '#27593D' : '#D1FAE5',
                },
              ]}
            >
              <Text style={[styles.offlineBadgeText, { color: isDark ? '#6EE7B7' : '#047857' }]}>
                ऑफ़लाइन उपलब्ध
              </Text>
            </View>
          )}
        </View>

        {/* API Short Content / Mantra Card */}
        {pooja.content ? (
          <View
            style={[
              styles.contentHighlightCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFF8F6',
                borderColor: isDark ? '#382222' : '#FEE2E2',
              },
            ]}
          >
            <Text
              style={[
                styles.contentHighlightLabel,
                {
                  fontSize: Math.max(10.5, tagSize - 0.5),
                  color: isDark ? '#FCA5A5' : '#991B1B',
                },
              ]}
            >
              {contentLabel}
            </Text>
            <Text
              style={[
                styles.contentHighlightBody,
                {
                  fontSize: bodySize + 0.5,
                  lineHeight: (bodySize + 0.5) * 1.55,
                  color: isDark ? '#F8E6CE' : '#1F2937',
                },
              ]}
            >
              {pooja.content}
            </Text>
          </View>
        ) : null}

        {/* API Rich Text Editor Content (HTML) */}
        {pooja.textEditor ? (
          <View style={styles.sectionBlock}>
            <RichHtmlContent
              html={pooja.textEditor}
              baseFontSize={bodySize}
              isDark={isDark}
            />
          </View>
        ) : null}

        {/* API Complete Content (if present) */}
        {hasCompleteContent && pooja.completeContent ? (
          <View style={styles.sectionBlock}>
            <RichHtmlContent
              html={pooja.completeContent}
              baseFontSize={bodySize}
              isDark={isDark}
            />
          </View>
        ) : null}

        {/* API PDF Resource Card */}
        {pooja.pdf ? (
          <TouchableOpacity
            style={[
              styles.pdfCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFF5F3',
                borderColor: isDark ? '#3D2626' : '#FEE2E2',
              },
            ]}
            onPress={() => handleOpenPdf(pooja.pdf!)}
            activeOpacity={0.75}
          >
            <View style={[styles.pdfIconCircle, { backgroundColor: isDark ? '#2B1B1B' : '#FFFFFF' }]}>
              <MaterialCommunityIcons
                name="file-pdf-box"
                size={22}
                color={isDark ? '#FCA5A5' : '#991B1B'}
              />
            </View>
            <View style={styles.pdfTextCol}>
              <Text style={[styles.pdfTitle, { color: isDark ? '#F8E6CE' : '#111827' }]}>
                PDF दस्तावेज़ देखें
              </Text>
              <Text style={styles.pdfSubtitle} numberOfLines={1}>
                {pooja.pdf}
              </Text>
            </View>
            <Icon name="external-link" size={16} color={isDark ? '#FCA5A5' : '#991B1B'} />
          </TouchableOpacity>
        ) : null}

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

        {/* Structured Sections fallback */}
        {pooja.sections &&
          pooja.sections.length > 0 &&
          !pooja.stepsList?.length &&
          !pooja.textEditor && (
            <View style={styles.sectionBlock}>
              {pooja.sections.map((sec) => (
                <DynamicSection
                  key={sec.sectionId}
                  section={sec}
                  isFavorite={favorites.has(sec.sectionId)}
                  onToggleFavorite={toggleFavorite}
                />
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
            { paddingBottom: 28 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={notesRefreshing}
              onRefresh={() => refreshPersonalNotes(true)}
              colors={['#991B1B']}
              tintColor={isDark ? '#FCA5A5' : '#991B1B'}
            />
          }
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
              {isCloudNotesActive || !isValidMongoId(pooja.id)
                ? 'ये नोट्स केवल आपको दिखाई देंगे।'
                : 'अतिथि / ऑफ़लाइन मोड — क्लाउड सिंक के लिए लॉगिन करें।'}
            </Text>
          </View>

          {notesError && (
            <View
              style={[
                styles.notesErrorBanner,
                {
                  backgroundColor: isDark ? '#2A1B1B' : '#FEF2F2',
                  borderColor: isDark ? '#5C2323' : '#FEE2E2',
                },
              ]}
            >
              <Text style={[styles.notesErrorText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                {notesError}
              </Text>
              <TouchableOpacity onPress={() => refreshPersonalNotes(false)}>
                <Text style={styles.notesRetryText}>पुनः प्रयास करें</Text>
              </TouchableOpacity>
            </View>
          )}

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
          {notesLoading && filteredNotes.length === 0 ? (
            <View style={styles.notesLoadingBox}>
              <ActivityIndicator size="small" color="#991B1B" />
              <Text
                style={[
                  styles.notesLoadingText,
                  { color: isDark ? '#9CA3AF' : '#6B7280' },
                ]}
              >
                पूजा के नोट्स लोड हो रहे हैं...
              </Text>
            </View>
          ) : filteredNotes.length === 0 ? (
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
                <View
                  key={item.id}
                  style={[
                    styles.cardWrapper,
                    isMenuOpen && styles.cardWrapperActive,
                  ]}
                >
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
        onRequestClose={() => {
          if (!isSavingNote) {
            setIsNoteModalOpen(false);
          }
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (!isSavingNote) {
              setIsNoteModalOpen(false);
            }
          }}
        >
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
                      disabled={isSavingNote}
                      onPress={() => setIsNoteModalOpen(false)}
                      style={[
                        styles.modalCloseButton,
                        isSavingNote && styles.modalActionDisabled,
                      ]}
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
                    {isLoadingNoteDetail && (
                      <View style={styles.modalDetailLoadingRow}>
                        <ActivityIndicator size="small" color="#991B1B" />
                        <Text
                          style={[
                            styles.modalDetailLoadingText,
                            { color: isDark ? '#FCA5A5' : '#991B1B' },
                          ]}
                        >
                          नोट लोड हो रहा है...
                        </Text>
                      </View>
                    )}
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
                    editable={!isSavingNote}
                    value={modalTitle}
                    onChangeText={text => {
                      hasEditedModalFieldsRef.current = true;
                      setModalTitle(text);
                    }}
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
                    editable={!isSavingNote}
                    value={modalContent}
                    onChangeText={text => {
                      hasEditedModalFieldsRef.current = true;
                      setModalContent(text);
                    }}
                  />

                  {/* Checkbox: Pin Note */}
                  <TouchableOpacity
                    disabled={isSavingNote}
                    style={[
                      styles.pinCheckboxRow,
                      isSavingNote && styles.modalActionDisabled,
                    ]}
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
                      disabled={isSavingNote}
                      style={[
                        styles.modalCancelBtn,
                        { borderColor: isDark ? '#4B5563' : '#D1D5DB' },
                        isSavingNote && styles.modalActionDisabled,
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
                      disabled={isSavingNote}
                      style={[
                        styles.modalSaveBtn,
                        {
                          backgroundColor: isDark ? '#7F1D1D' : '#991B1B',
                        },
                        isSavingNote && styles.modalActionDisabled,
                      ]}
                      onPress={handleSaveModalNote}
                      activeOpacity={0.8}
                    >
                      {isSavingNote ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.modalSaveText}>
                          {isEditing ? 'बदलाव सहेजें' : 'नोट सहेजें'}
                        </Text>
                      )}
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
    flex: 1,
    fontSize: 16.5,
    fontWeight: 'bold',
    marginRight: 10,
  },
  headerActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  fontZoomGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    gap: 10,
  },
  zoomActionButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginHorizontal: 4,
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  anchorText: {
    fontWeight: '500',
  },
  offlineBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  offlineBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stateText: {
    fontSize: 11.5,
    marginTop: 10,
    fontWeight: '500',
  },
  errorStateCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  errorStateTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryActionBtn: {
    marginTop: 4,
    backgroundColor: '#8B1D1D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  contentHighlightCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 3.5,
    borderLeftColor: '#8B1D1D',
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
  },
  contentHighlightLabel: {
    fontWeight: '700',
    marginBottom: 4,
  },
  contentHighlightBody: {
    fontWeight: '500',
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 10,
  },
  pdfIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfTextCol: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  pdfSubtitle: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 1,
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
    lineHeight: 18,
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
    paddingTop: 12,
  },
  notesBreadcrumbText: {
    fontSize: 11.5,
    marginBottom: 8,
    fontWeight: '500',
  },
  privacyBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  privacyBannerText: {
    fontSize: 11.5,
    fontWeight: '400',
  },
  notesErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 8,
  },
  notesErrorText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '500',
  },
  notesRetryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#991B1B',
  },
  notesLoadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 10,
  },
  notesLoadingText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  notesSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  notesSearchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  notesSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesCountText: {
    fontSize: 11.5,
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
    marginBottom: 10,
    zIndex: 1,
  },
  cardWrapperActive: {
    zIndex: 999,
    elevation: 12,
  },
  noteCard: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    fontSize: 12.5,
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
    fontSize: 11.5,
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
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  emptyNotesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyNotesTitle: {
    fontSize: 12.5,
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
    fontSize: 12,
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
    fontSize: 11.5,
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
    borderWidth: 1,
    borderColor: '#EFECE8',
    padding: 18,
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
    fontSize: 14,
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
    fontSize: 11.5,
  },
  modalDetailLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
  },
  modalDetailLoadingText: {
    fontSize: 11,
    fontWeight: '500',
  },
  modalActionDisabled: {
    opacity: 0.6,
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
    fontSize: 12,
  },
  modalTextArea: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    minHeight: 110,
  },
  pinCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  pinCheckboxText: {
    fontSize: 11.5,
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
    fontSize: 11.5,
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
    fontSize: 11.5,
    fontWeight: 'bold',
  },
});

export default PoojaDetailScreen;
