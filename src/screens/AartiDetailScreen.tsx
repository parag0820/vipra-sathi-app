import React, { useMemo, useState } from 'react';
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
import { useTheme } from '../theme/ThemeContext';
import { MOCK_AARTIS } from '../data/mockLibrary';
import AudioPlayerUI from '../components/AudioPlayerUI';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type AartiDetailRouteProp = {
  key: string;
  name: 'AartiDetail';
  params: { aartiId: string };
};

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const BORDER_LIGHT = '#EFECE8';

const AartiDetailScreen = () => {
  const route = useRoute<AartiDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { aartiId } = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const [isFavorite, setIsFavorite] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState(0);

  const aarti = MOCK_AARTIS.find(a => a.id === aartiId);

  const getAartiTitle = (item: typeof MOCK_AARTIS[0]) => {
    switch (item.id) {
      case 'a1': return t('aarti_library.aartis.jai_ganesh', item.title);
      case 'a2': return t('aarti_library.aartis.om_jai_jagdish', item.title);
      case 'a3': return t('aarti_library.aartis.aarti_kije_hanuman', item.title);
      default: return item.title;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'All': return t('aarti_library.categories.all', 'All');
      case 'Ganesh Aarti': return t('aarti_library.categories.ganesh', 'Ganesh Aarti');
      case 'Shiva Aarti': return t('aarti_library.categories.shiva', 'Shiva Aarti');
      case 'Durga Aarti': return t('aarti_library.categories.durga', 'Durga Aarti');
      case 'Lakshmi Aarti': return t('aarti_library.categories.lakshmi', 'Lakshmi Aarti');
      case 'Hanuman Aarti': return t('aarti_library.categories.hanuman', 'Hanuman Aarti');
      case 'Vishnu Aarti': return t('aarti_library.categories.vishnu', 'Vishnu Aarti');
      default: return cat;
    }
  };

  const stanzas = useMemo(() => {
    if (!aarti?.content) return [];
    return aarti.content
      .split(/\n\s*\n/)
      .map(s => s.trim())
      .filter(Boolean);
  }, [aarti?.content]);

  const bgMain = isDark ? '#121212' : '#FFFFFF';
  const headerBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const borderDynamic = isDark ? '#2D2D2D' : BORDER_LIGHT;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';

  if (!aarti) {
    return (
      <View style={[styles.center, { backgroundColor: bgMain }]}>
        <Text style={{ color: textPrimary }}>
          {t('aarti_library.not_found', 'Aarti not found')}
        </Text>
      </View>
    );
  }

  const displayTitle = getAartiTitle(aarti);
  const categoryLabel = getCategoryLabel(aarti.category);
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

          <View style={styles.headerRight}>
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
                      fontSize: 13.5,
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

            <TouchableOpacity
              onPress={() => setIsFavorite(prev => !prev)}
              style={[
                styles.favBtn,
                {
                  backgroundColor: isFavorite
                    ? isDark
                      ? '#3D1F1F'
                      : '#FEE2E2'
                    : isDark
                      ? '#2B1B1B'
                      : SOFT_ROSE_BG,
                },
              ]}
              activeOpacity={0.7}
            >
              <Icon
                name="heart"
                size={16}
                color={isFavorite ? '#DC2626' : accentColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Clean Single Continuous Aarti Content Section (No Shadow / No Elevation) */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.breadcrumbText, { color: textSecondary }]}>
          आरती संकलन  /  {categoryLabel}
        </Text>

        <Text style={[styles.mainTitle, { color: accentColor }]}>
          {displayTitle}
        </Text>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: isDark ? '#2B1B1B' : SOFT_ROSE_BG },
            ]}
          >
            <Text style={[styles.categoryBadgeText, { color: accentColor }]}>
              {categoryLabel}
            </Text>
          </View>
          <Text style={[styles.verseCountText, { color: textSecondary }]}>
            {stanzas.length} {t('aarti_detail.verses', 'पद')}
          </Text>
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: borderDynamic }]} />

        {/* Stanzas flowing cleanly in one unified reading layout */}
        {stanzas.map((stanza, idx) => (
          <View
            key={idx}
            style={[
              styles.stanzaBlock,
              idx !== stanzas.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#242424' : '#F3EFEA',
              },
            ]}
          >
            <View style={styles.stanzaHeader}>
              <Text style={[styles.stanzaLabel, { color: accentColor }]}>
                {`॥ पद ${idx + 1} ॥`}
              </Text>
            </View>

            <Text
              style={[
                styles.stanzaText,
                {
                  color: textPrimary,
                  fontSize: baseFontSize,
                  lineHeight: baseFontSize * 1.65,
                },
              ]}
            >
              {stanza}
            </Text>
          </View>
        ))}

        {/* Closing Mangalam */}
        <View style={styles.closingMangalam}>
          <Text style={[styles.closingText, { color: accentColor }]}>
            ॥ इति आरती सम्पूर्णम् ॥
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Flat Audio Player */}
      <AudioPlayerUI title={displayTitle} audioUrl={aarti.audioUrl} />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  fontZoomGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 10,
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
  favBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  verseCountText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  sectionDivider: {
    height: 1,
    marginBottom: 6,
  },
  stanzaBlock: {
    paddingVertical: 14,
  },
  stanzaHeader: {
    alignItems: 'center',
    marginBottom: 6,
  },
  stanzaLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  stanzaText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  closingMangalam: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  closingText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default AartiDetailScreen;
