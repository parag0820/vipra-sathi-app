import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { MOCK_STOTRAS } from '../data/mockLibrary';
import AudioPlayerUI from '../components/AudioPlayerUI';
import CustomHeader from '../components/CustomHeader';
import { useTranslation } from 'react-i18next';

type StotramDetailRouteProp = {
  key: string;
  name: 'StotramDetail';
  params: { stotramId: string };
};

const StotramDetailScreen = () => {
  const route = useRoute<StotramDetailRouteProp>();
  const { stotramId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const stotram = MOCK_STOTRAS.find(s => s.id === stotramId);

  const getStotramTitle = (item: typeof MOCK_STOTRAS[0]) => {
    switch (item.id) {
      case 's1': return t('stotram_library.stotras.sankat_nashan', item.title);
      case 's2': return t('stotram_library.stotras.atharvashirsha', item.title);
      case 's3': return t('stotram_library.stotras.pancharatnam', item.title);
      case 's4': return t('stotram_library.stotras.vishnu_sahasranamam', item.title);
      case 's5': return t('stotram_library.stotras.ganesh_kavach', item.title);
      case 's6': return t('stotram_library.stotras.vakratunda', item.title);
      default: return item.title;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'All': return t('stotram_library.categories.all', 'All');
      case 'Vishnu Stotras': return t('stotram_library.categories.vishnu', 'Vishnu Stotras');
      case 'Ganesh Stotras': return t('stotram_library.categories.ganesh', 'Ganesh Stotras');
      case 'Shiva Stotras': return t('stotram_library.categories.shiva', 'Shiva Stotras');
      case 'Durga Stotras': return t('stotram_library.categories.durga', 'Durga Stotras');
      case 'Hanuman Stotras': return t('stotram_library.categories.hanuman', 'Hanuman Stotras');
      default: return cat;
    }
  };

  if (!stotram) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('stotram_library.not_found', 'Stotram not found')}</Text>
      </View>
    );
  }

  const displayTitle = getStotramTitle(stotram);

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader title={displayTitle} showBack={true} headerBgColor={colors.primary} headerTextColor="#FFF" />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.category, { color: colors.secondary }]}>{getCategoryLabel(stotram.category)}</Text>
        
        <View style={[styles.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sanskritText, { color: colors.text }]}>
            {stotram.content}
          </Text>
        </View>
      </ScrollView>
      
      {/* Sticky Audio Player */}
      <AudioPlayerUI title={displayTitle} audioUrl={stotram.audioUrl} />
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  contentCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sanskritText: {
    fontSize: 20,
    lineHeight: 36,
    fontWeight: '500',
    textAlign: 'center',
  }
});

export default StotramDetailScreen;
