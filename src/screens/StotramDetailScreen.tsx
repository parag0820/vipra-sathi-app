import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { MOCK_STOTRAS } from '../data/mockLibrary';
import AudioPlayerUI from '../components/AudioPlayerUI';
import { useTranslation } from 'react-i18next';

type StotramDetailRouteProp = {
  key: string;
  name: 'StotramDetail';
  params: { stotramId: string };
};

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const BORDER_LIGHT = '#EFECE8';

const StotramDetailScreen = () => {
  const route = useRoute<StotramDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { stotramId } = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const [fontSizeOffset, setFontSizeOffset] = useState(0);

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

  const bgMain = isDark ? '#121212' : '#FFFFFF';
  const headerBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const borderDynamic = isDark ? '#2D2D2D' : BORDER_LIGHT;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  if (!stotram) {
    return (
      <View style={[styles.center, { backgroundColor: bgMain }]}>
        <Text style={{ color: textPrimary }}>
          {t('stotram_library.not_found', 'Stotram not found')}
        </Text>
      </View>
    );
  }

  const displayTitle = getStotramTitle(stotram);
  const categoryLabel = getCategoryLabel(stotram.category);
  const baseFontSize = Math.max(10.5, 12.5 + fontSizeOffset);

  return (
    <View style={[styles.screenContainer, { backgroundColor: bgMain }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* Clean Flat Top Header */}
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, 10),
            backgroundColor: headerBg,
            borderBottomColor: borderDynamic,
          },
        ]}
      >
        <View style={styles.headerInnerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={26} color={accentColor} />
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: accentColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayTitle}
          </Text>

          <View style={styles.fontZoomGroup}>
            <TouchableOpacity
              onPress={() => setFontSizeOffset(prev => Math.max(-2, prev - 1))}
              style={styles.zoomActionButton}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.fontActionText,
                  {
                    fontSize: 13.,
                    color: accentColor,
                    opacity: fontSizeOffset <= -2 ? 0.4 : 1,
                  },
                ]}
              >
                अ-
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFontSizeOffset(prev => Math.min(6, prev + 1))}
              style={styles.zoomActionButton}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.fontActionText,
                  {
                    fontSize: 15.5,
                    color: accentColor,
                    opacity: fontSizeOffset >= 6 ? 0.4 : 1,
                  },
                ]}
              >
                अ+
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Single Continuous Reading Section (No Separate Boxes or Cards) */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb & Heading */}
        <Text style={[styles.breadcrumbText, { color: textSecondary }]}>
          स्तोत्रम् संग्रह  /  {categoryLabel}
        </Text>

        <Text style={[styles.mainTitle, { color: accentColor }]}>
          {displayTitle}
        </Text>

        <View
          style={[
            styles.categoryPill,
            { backgroundColor: isDark ? '#2B1B1B' : SOFT_ROSE_BG },
          ]}
        >
          <Text style={[styles.categoryPillText, { color: accentColor }]}>
            {categoryLabel}
          </Text>
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: borderDynamic }]} />

        {/* Unified Stotram Content */}
        <Text
          style={[
            styles.sanskritText,
            {
              color: textPrimary,
              fontSize: baseFontSize,
              lineHeight: baseFontSize * 1.65,
            },
          ]}
        >
          {stotram.content}
        </Text>

        {/* Closing Mangalam */}
        <View style={styles.closingMangalam}>
          <Text style={[styles.closingText, { color: accentColor }]}>
            ॥ इति स्तोत्रम् सम्पूर्णम् ॥
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Flat Audio Player */}
      <AudioPlayerUI title={displayTitle} audioUrl={stotram.audioUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
  },
  backButton: {
    marginRight: 6,
    padding: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 10,
  },
  fontZoomGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 10,
    flexShrink: 0,
  },
  zoomActionButton: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontActionText: {
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 24,
  },
  breadcrumbText: {
    fontSize: 11.5,
    fontWeight: '500',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 14,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    marginBottom: 16,
  },
  sanskritText: {
    fontWeight: '500',
    textAlign: 'left',
  },
  closingMangalam: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 8,
  },
  closingText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default StotramDetailScreen;
