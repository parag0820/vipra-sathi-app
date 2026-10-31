import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { MOCK_AARTIS } from '../data/mockLibrary';
import AudioPlayerUI from '../components/AudioPlayerUI';
import { Feather as Icon } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import { useTranslation } from 'react-i18next';

type AartiDetailRouteProp = {
  key: string;
  name: 'AartiDetail';
  params: { aartiId: string };
};

const AartiDetailScreen = () => {
  const route = useRoute<AartiDetailRouteProp>();
  const { aartiId } = route.params;
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState(0); // For A- / A+ text sizing

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

  // Split Aarti into individual stanzas / verses for clean scrollable reading
  const stanzas = useMemo(() => {
    if (!aarti?.content) return [];
    return aarti.content
      .split(/\n\s*\n/)
      .map(s => s.trim())
      .filter(Boolean);
  }, [aarti?.content]);

  if (!aarti) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('aarti_library.not_found', 'Aarti not found')}</Text>
      </View>
    );
  }

  const displayTitle = getAartiTitle(aarti);
  const baseFontSize = 13.5 + fontSizeOffset;

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title={displayTitle}
        showBack={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        {/* Compact Header Bar with Category, Verse Count & Controls */}
        <View
          style={[
            styles.compactHeader,
            {
              backgroundColor: isDark ? colors.surface : '#FFF9F2',
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                {getCategoryLabel(aarti.category)}
              </Text>
            </View>
            <Text style={[styles.verseCountText, { color: colors.textLight }]}>
              {stanzas.length} {t('aarti_detail.verses', 'Stanzas / पद')}
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Text Zoom Controls */}
            <TouchableOpacity
              onPress={() => setFontSizeOffset(prev => Math.max(-2, prev - 1))}
              style={[styles.textScaleBtn, { borderColor: colors.border }]}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.textScaleLabel, { color: colors.text }]}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontSizeOffset(prev => Math.min(4, prev + 1))}
              style={[styles.textScaleBtn, { borderColor: colors.border }]}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.textScaleLabel, { color: colors.text, fontWeight: 'bold' }]}>A+</Text>
            </TouchableOpacity>

            {/* Favorite Button */}
            <TouchableOpacity
              onPress={() => setIsFavorite(prev => !prev)}
              style={[
                styles.favBtn,
                {
                  backgroundColor: isFavorite ? '#FADBD8' : isDark ? 'rgba(255,255,255,0.08)' : '#F5ECE1',
                },
              ]}
              activeOpacity={0.7}
            >
              <Icon
                name="heart"
                size={18}
                color={isFavorite ? '#E74C3C' : colors.textLight}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Small Scrollable Aarti Text List to Read */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {stanzas.map((stanza, idx) => {
            return (
              <View
                key={idx}
                style={[
                  styles.stanzaCard,
                  {
                    backgroundColor: isDark ? colors.surface : '#FFFFFF',
                    borderColor: isDark ? colors.border : '#EDE2D4',
                  },
                ]}
              >
                {/* Verse / Stanza Number Header */}
                <View style={styles.stanzaHeader}>
                  <View style={[styles.stanzaBadge, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.stanzaBadgeText, { color: colors.primary }]}>
                      {`॥ पद ${idx + 1} ॥`}
                    </Text>
                  </View>
                </View>

                {/* Stanza Text */}
                <Text
                  style={[
                    styles.stanzaText,
                    {
                      color: colors.text,
                      fontSize: baseFontSize,
                      lineHeight: baseFontSize * 1.7,
                    },
                  ]}
                >
                  {stanza}
                </Text>
              </View>
            );
          })}

          {/* Traditional Closing Mangalam Text */}
          <View style={styles.closingMangalam}>
            <Text style={[styles.closingText, { color: colors.primary }]}>
              ॥ इति आरती सम्पूर्णम् ॥
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Sticky Audio Player */}
        <AudioPlayerUI
          title={displayTitle}
          audioUrl={aarti.audioUrl}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  verseCountText: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textScaleBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 26,
    alignItems: 'center',
  },
  textScaleLabel: {
    fontSize: 11,
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
    padding: 14,
    paddingBottom: 24,
  },
  stanzaCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  stanzaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stanzaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  stanzaBadgeText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  stanzaText: {
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  closingMangalam: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  closingText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default AartiDetailScreen;
