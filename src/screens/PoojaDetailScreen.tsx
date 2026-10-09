import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import DynamicSection from '../components/DynamicSection';
import { usePoojaLibrary } from '../hooks/usePoojaLibrary';
import { MOCK_POOJAS } from '../data/mockPoojas';
import CustomHeader from '../components/CustomHeader';
import { Feather as Icon } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

type PoojaDetailRouteProp = {
  key: string;
  name: 'PoojaDetail';
  params: { poojaId: string };
};

const PoojaDetailScreen = () => {
  const route = useRoute<PoojaDetailRouteProp>();
  const navigation = useNavigation();
  const { poojaId } = route.params;
  const { colors, isDark } = useTheme();

  const [isCeremonyMode, setIsCeremonyMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Keep screen awake during ceremony mode
  useKeepAwake();

  const pooja = MOCK_POOJAS.find(p => p.id === poojaId);

  const { favorites, toggleFavorite, notes, saveNotes, isReady } = usePoojaLibrary(poojaId);
  const [localNotes, setLocalNotes] = useState(notes);

  React.useEffect(() => {
    if (isReady) {
      setLocalNotes(notes);
    }
  }, [isReady, notes]);

  const handleSaveNotes = (text: string) => {
    setLocalNotes(text);
    saveNotes(poojaId, text);
  };

  const handleDuplicate = () => {
    Toast.show({
      type: 'success',
      text1: 'Template Created',
      text2: 'My Satyanarayan Pooja has been added to your personal library.',
    });
  };

  // Group sections by Heading to create "Steps" for Ceremony Mode
  const steps = useMemo(() => {
    if (!pooja) return [];
    const grouped: { title: string, sections: any[] }[] = [];
    let currentStep: { title: string, sections: any[] } = { title: pooja.title, sections: [] };

    pooja.sections.forEach(sec => {
      if (sec.sectionType === 'Heading') {
        if (currentStep.sections.length > 0) {
          grouped.push(currentStep);
        }
        currentStep = { title: sec.content, sections: [sec] };
      } else {
        currentStep.sections.push(sec);
      }
    });
    if (currentStep.sections.length > 0) {
      grouped.push(currentStep);
    }
    return grouped;
  }, [pooja]);

  const renderCeremonyMode = () => {
    if (steps.length === 0) return null;
    const currentStep = steps[currentStepIndex];

    return (
      <View style={[styles.screenContainer, { backgroundColor: colors.primary }]}>
        <CustomHeader 
          title={pooja?.title} 
          showBack={true} 
          onBackPress={() => setIsCeremonyMode(false)}
          headerBgColor={colors.primary} 
          headerTextColor="#FFF" 
        />
        <View style={[styles.mainCard, { backgroundColor: isDark ? colors.background : '#FFFDF9' }]}>
          <ScrollView contentContainerStyle={styles.ceremonyContent} showsVerticalScrollIndicator={false}>
          {/* Top Step Pill & Title */}
          <View style={styles.ceremonyStepPillContainer}>
            <View style={styles.ceremonyStepPill}>
              <Text style={[styles.ceremonyStepPillText, { color: colors.primary }]}>
                {currentStepIndex + 1} / {steps.length}  •  {currentStep.title}
              </Text>
            </View>
          </View>

          {/* Step Image (Static for now) */}
          <Image
            source={require('../assets/images/kalash_sthapana.jpg')}
            style={styles.ceremonyStepImage}
            resizeMode="cover"
          />

          {currentStep.sections.map((sec, idx) => {
            if (sec.sectionType === 'Heading') return null;

            if (sec.sectionType === 'Vidhi') {
              // Split vidhi by sentences to make numbered list
              const sentences = sec.content.split('. ').filter((s: string) => s.trim().length > 0);
              return (
                <View key={idx} style={styles.ceremonySection}>
                  <View style={styles.sectionTitleRow}>
                    <Icon name="book-open" size={20} color={colors.primaryDark} />
                    <Text style={[styles.sectionTitleText, { color: colors.primaryDark }]}>Vidhi</Text>
                  </View>
                  <View style={[styles.vidhiCard, { backgroundColor: isDark ? colors.surface : '#FDF7F5' }]}>
                    {sentences.map((sentence: string, sIdx: number) => (
                      <View key={sIdx} style={styles.vidhiRow}>
                        <View style={[styles.vidhiNumberCircle, { backgroundColor: '#FADEDD' }]}>
                          <Text style={[styles.vidhiNumberText, { color: colors.primaryDark }]}>{sIdx + 1}</Text>
                        </View>
                        <Text style={[styles.vidhiRowText, { color: colors.text }]}>{sentence.trim()}{!sentence.endsWith('.') ? '.' : ''}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            if (sec.sectionType === 'Mantra') {
              return (
                <View key={idx} style={styles.ceremonySection}>
                  <View style={styles.sectionTitleRow}>
                    <Icon name="music" size={20} color={colors.primaryDark} />
                    <Text style={[styles.sectionTitleText, { color: colors.primaryDark }]}>Mantra</Text>
                  </View>
                  <View style={[styles.mantraAudioCard, { backgroundColor: isDark ? colors.surface : '#F4EAE9' }]}>
                    <TouchableOpacity style={[styles.mantraPlayButton, { backgroundColor: colors.primary }]}>
                      <Icon name="play" size={20} color="#FFF" style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                    <View style={styles.mantraTextContainer}>
                      <Text style={[styles.mantraSanskritText, { color: colors.primary }]}>{sec.content}</Text>
                    </View>
                  </View>
                </View>
              );
            }
            if (sec.sectionType === 'Description') {
              return (
                <Text key={idx} style={[styles.ceremonyDescription, { color: colors.text }]}>
                  {sec.content}
                </Text>
              );
            }

            if (sec.sectionType === 'Audio') {
              return (
                <View key={idx} style={[styles.ceremonyAudioSection, { backgroundColor: isDark ? colors.surface : '#F4EAE9' }]}>
                  <TouchableOpacity style={[styles.audioPlayBtn, { backgroundColor: colors.primary }]}>
                    <Icon name="play" size={20} color="#FFF" style={{ marginLeft: 2 }} />
                  </TouchableOpacity>
                  <View style={styles.audioDetails}>
                    <Text style={[styles.audioTitle, { color: colors.primaryDark }]}>Audio Track</Text>
                    <Text style={[styles.audioSubtitle, { color: colors.primary }]}>{sec.content}</Text>
                  </View>
                </View>
              );
            }

            return null;
          })}

          <View style={[styles.notesContainer, { backgroundColor: isDark ? colors.surface : '#FDFCF4', marginTop: 20 }]}>
            <View style={styles.notesHeaderRow}>
              <Icon name="edit-3" size={18} color={colors.primary} />
              <Text style={[styles.notesTitle, { color: colors.primaryDark, marginBottom: 0, marginLeft: 8 }]}>Personal Notes</Text>
            </View>
            <TextInput
              style={[styles.notesInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              multiline
              placeholder="Add your personal notes for this step..."
              placeholderTextColor={colors.textLight}
              value={localNotes}
              onChangeText={handleSaveNotes}
            />
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={[styles.ceremonyFooter, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton, currentStepIndex === 0 && { opacity: 0.5 }]}
            onPress={() => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
          >
            <Icon name="chevron-left" size={20} color={colors.primary} />
            <Text style={[styles.navButtonText, { color: colors.primary }]}>Previous</Text>
          </TouchableOpacity>

          {currentStepIndex < steps.length - 1 ? (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
              onPress={() => setCurrentStepIndex(currentStepIndex + 1)}
            >
              <Text style={styles.nextButtonText}>Next Step</Text>
              <Icon name="arrow-right" size={18} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: '#10B981' }]}
              onPress={() => {
                Toast.show({ type: 'success', text1: 'Pooja Completed', text2: 'May God bless you!' });
                setIsCeremonyMode(false);
              }}
            >
              <Text style={styles.nextButtonText}>Complete Pooja</Text>
              <Icon name="check-circle" size={18} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.isNotesSection) {
      return (
        <View style={[styles.notesContainer, { backgroundColor: isDark ? colors.surface : '#f8f9fa' }]}>
          <Text style={[styles.notesTitle, { color: colors.primaryDark }]}>My Notes</Text>
          <TextInput
            style={[
              styles.notesInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            multiline
            placeholder="Add your personal notes for this pooja..."
            placeholderTextColor={colors.textLight}
            value={localNotes}
            onChangeText={handleSaveNotes}
          />
        </View>
      );
    }

    if (item.isHeader) {
      return (
        <View style={styles.headerContainer}>
          <View style={styles.headerImageContainer}>
            <Image
              source={require('../assets/images/kalash_sthapana.jpg')}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.headerImageOverlay}>
              <Text style={styles.headerImageTitle}>Pooja Detail & Samagri</Text>
              <View style={styles.headerPillsRow}>
                <View style={styles.headerPill}>
                  <Text style={styles.headerPillText}>{steps.length} Steps • 45 Mins</Text>
                </View>
                <View style={styles.headerPill}>
                  <Text style={styles.headerPillText}>{pooja?.subCategory || 'Pauranik'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setCurrentStepIndex(0);
                setIsCeremonyMode(true);
              }}
            >
              <Text style={styles.primaryActionText}>Start Pooja Mode (Focus Mode)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryActionBtn, { backgroundColor: '#FDF7F5', borderColor: '#FDECE6' }]}
              onPress={handleDuplicate}
            >
              <Icon name="copy" size={16} color={colors.primary} />
              <Text style={[styles.secondaryActionText, { color: colors.primary }]}>Copy & Customize Paddhati</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabsRow}>
            <View style={[styles.tabActive, { borderColor: colors.border }]}>
              <Icon name="list" size={16} color={colors.primaryDark} />
              <Text style={[styles.tabActiveText, { color: colors.primaryDark }]}>Steps & Vidhi</Text>
            </View>
            <View style={[styles.tabInactive, { backgroundColor: '#FDF7F5' }]}>
              <Icon name="package" size={16} color={colors.textLight} />
              <Text style={[styles.tabInactiveText, { color: colors.textLight }]}>Samagri List (24/28)</Text>
            </View>
          </View>

          <View style={styles.stepsListHeader}>
            <Text style={styles.stepsListTitle}>Anushthan Kram</Text>
            <Text style={styles.stepsListSubtitle}>{steps.length} Total</Text>
          </View>
        </View>
      );
    }

    if (item.isStep) {
      const stepIndex = item.index + 1;
      const hasAudio = item.sections.some((s: any) => s.sectionType === 'Audio' || s.sectionType === 'Mantra');
      const audioSection = item.sections.find((s: any) => s.sectionType === 'Audio');

      return (
        <TouchableOpacity style={styles.stepRow} onPress={() => {
          setCurrentStepIndex(item.index);
          setIsCeremonyMode(true);
        }}>
          <View style={[styles.stepCircle, { backgroundColor: '#FDF7F5' }]}>
            <Text style={{ color: colors.primaryDark, fontWeight: 'bold' }}>{stepIndex}</Text>
          </View>

          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.primaryDark }]}>
              {stepIndex}. {item.title}
            </Text>
            {item.sections.some((s: any) => s.sectionType === 'Vidhi') && (
              <Text style={styles.stepSubtitle} numberOfLines={1}>
                {item.sections.find((s: any) => s.sectionType === 'Vidhi')?.content}
              </Text>
            )}

            {hasAudio && (
              <View style={[styles.stepActiveAudio, { backgroundColor: '#FDF7F5' }]}>
                <View style={[styles.smallPlayButton, { backgroundColor: colors.primary }]}>
                  <Icon name="play" size={12} color="#FFF" style={{ marginLeft: 2 }} />
                </View>
                <Text style={styles.smallAudioText}>
                  {audioSection ? `Audio: ${audioSection.content}` : 'Mantra Audio Available'}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <DynamicSection
        section={item}
        isFavorite={favorites.has(item.sectionId)}
        onToggleFavorite={toggleFavorite}
      />
    );
  };

  if (!pooja || !isReady) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isCeremonyMode) {
    return renderCeremonyMode();
  }

  const listData = [
    { isHeader: true, id: 'header' },
    ...steps.map((step, idx) => ({ ...step, isStep: true, id: `step_${idx}`, index: idx })),
    { isNotesSection: true, id: 'notes' }
  ];

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader title={pooja.title} showBack={true} headerBgColor={colors.primary} headerTextColor="#FFF" />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <FlatList
          data={listData}
          keyExtractor={(item: any) => item.sectionId || item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  headerImageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    height: 160,
    backgroundColor: '#000',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  headerImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  headerImageTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerPillsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  headerPill: {
    backgroundColor: '#FFFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#800000',
  },
  actionButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  tabActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF',
    gap: 6,
    elevation: 1,
  },
  tabActiveText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  tabInactive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabInactiveText: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepsListSubtitle: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: 'bold',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDECE6',
    elevation: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  stepActiveAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDECE6',
  },
  smallPlayButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  smallAudioText: {
    fontSize: 12,
    color: '#800000',
    fontStyle: 'italic',
  },
  notesContainer: {
    marginTop: 5,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  notesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notesInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 12,
  },

  // Ceremony Mode Styles
  ceremonyContainer: {
    flex: 1,
    paddingTop: 30, // Adjust for notch if needed
  },
  ceremonyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  ceremonyHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ceremonyContent: {
    padding: 20,
    paddingBottom: 60,
  },
  ceremonyStepPillContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ceremonyStepPill: {
    backgroundColor: '#FDECE6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ceremonyStepPillText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ceremonyStepImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 24,
  },
  ceremonySection: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vidhiCard: {
    padding: 16,
    borderRadius: 16,
  },
  vidhiRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  vidhiNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  vidhiNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  vidhiRowText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  mantraAudioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  mantraPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mantraTextContainer: {
    flex: 1,
  },
  mantraSanskritText: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  ceremonyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    // paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 6,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },
  prevButton: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginRight: 10,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ceremonyDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  ceremonyAudioSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    // marginBottom: 16,
    gap: 12,
  },
  audioPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioDetails: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  audioSubtitle: {
    fontSize: 11,
  }
});

export default PoojaDetailScreen;
