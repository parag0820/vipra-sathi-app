import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { MOCK_STOTRAS } from '../data/mockLibrary';
import { GOD_CATEGORIES, GodCategory, OTHER_SAMSKAR_CATEGORY } from '../data/godCategories';

const { width } = Dimensions.get('window');

const PRIMARY_MAROON = '#8B1D1D';
const BORDER_COLOR = '#E5E7EB';
const CARD_BORDER = '#FEE2E2';
const MUTED_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const SOFT_PINK_BG = '#FFF0ED';

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StotramLibraryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();

  const [selectedGod, setSelectedGod] = useState<GodCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cardWidth = (width - 32 - 16) / 3;

  const displayedStotras = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (selectedGod) {
      let list = MOCK_STOTRAS.filter(
        (s) => s.category === selectedGod.stotramCategory
      );

      // Fallback stotras if none exist directly
      if (list.length === 0) {
        list = [
          {
            id: `st_${selectedGod.id}_1`,
            title: `${selectedGod.name_hi} स्तोत्रम्`,
            titleHindi: `${selectedGod.name_hi} स्तोत्रम्`,
            subtitleHindi: 'सर्व बाधा निवारक पावन स्तोत्र',
            category: selectedGod.stotramCategory,
            subCategory: 'Stotram',
            content: `ॐ ${selectedGod.name_hi} नमः। जय जय हे परमेश्वर पाहि माम्।`
          },
          {
            id: `st_${selectedGod.id}_2`,
            title: `${selectedGod.name_hi} कवचम्`,
            titleHindi: `${selectedGod.name_hi} कवचम्`,
            subtitleHindi: 'दिव्य रक्षा एवं शांति कवच पाठ',
            category: selectedGod.stotramCategory,
            subCategory: 'Kavach',
            content: `अस्य श्री ${selectedGod.name_hi} कवचस्य ऋषिः ब्रह्मा। सर्व सिद्धि प्रदायकम्।`
          },
          {
            id: `st_${selectedGod.id}_3`,
            title: `${selectedGod.name_hi} अष्टकम्`,
            titleHindi: `${selectedGod.name_hi} अष्टकम्`,
            subtitleHindi: 'अष्ट पद्य स्तुति पाठ',
            category: selectedGod.stotramCategory,
            subCategory: 'Ashtakam',
            content: `नमामि नमामि देवं सर्वाभीष्ट फलप्रदम्।`
          }
        ];
      }

      if (q.length > 0) {
        return list.filter((s) => {
          const title = (s.titleHindi || s.title).toLowerCase();
          const sub = (s.subtitleHindi || s.subCategory || '').toLowerCase();
          return title.includes(q) || sub.includes(q);
        });
      }

      return list;
    }

    if (q.length > 0) {
      return MOCK_STOTRAS.filter((s) => {
        const title = (s.titleHindi || s.title).toLowerCase();
        const cat = s.category.toLowerCase();
        const sub = (s.subtitleHindi || s.subCategory || '').toLowerCase();
        return title.includes(q) || cat.includes(q) || sub.includes(q);
      });
    }

    return [];
  }, [selectedGod, searchQuery]);

  const handleSelectGod = (god: GodCategory) => {
    setSelectedGod(god);
    setSearchQuery('');
  };

  const handleBack = () => {
    if (selectedGod) {
      setSelectedGod(null);
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#FFFFFF'}
      />

      {/* Top Header Bar */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="chevron-left" size={26} color={PRIMARY_MAROON} />
          </TouchableOpacity>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerTitle}>
              {selectedGod ? selectedGod.name_hi : 'स्तोत्र'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {selectedGod ? 'स्तोत्र का प्रकार चुनें' : 'देवता चुनें, फिर स्तोत्र का पाठ'}
            </Text>
          </View>
        </View>
      </View>

      {/* Breadcrumb line (Only in Screen 2) */}
      {selectedGod && (
        <View style={[styles.breadcrumbRow, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA' }]}>
          <Text style={styles.breadcrumbText}>
            स्तोत्र  /  <Text style={styles.breadcrumbActive}>{selectedGod.name_hi}</Text>
          </Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? '#262626' : '#FFFFFF', borderColor: BORDER_COLOR }]}>
          <Icon name="search" size={16} color={MUTED_TEXT} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
            placeholder={
              selectedGod
                ? `${selectedGod.name_hi} स्तोत्र खोजें`
                : 'देवता या स्तोत्र का नाम खोजें'
            }
            placeholderTextColor={MUTED_TEXT}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="x" size={16} color={MUTED_TEXT} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================
            SCREEN 1: DEITY GRID VIEW
           ============================================================ */}
        {!selectedGod && searchQuery.trim().length === 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
              देवता के अनुसार स्तोत्र
            </Text>

            {/* 3-Column Grid */}
            <View style={styles.gridContainer}>
              {chunkArray(GOD_CATEGORIES, 3).map((row, rowIndex) => (
                <View key={`grid-row-${rowIndex}`} style={styles.gridRow}>
                  {row.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.gridCard,
                        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
                      ]}
                      onPress={() => handleSelectGod(item)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.iconCircle, { backgroundColor: SOFT_PINK_BG }]}>
                        {item.symbolText ? (
                          <Text style={styles.symbolText}>{item.symbolText}</Text>
                        ) : (
                          <MaterialCommunityIcons
                            name={item.iconName as any}
                            size={22}
                            color={PRIMARY_MAROON}
                          />
                        )}
                      </View>

                      <Text
                        style={[styles.deityName, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                        numberOfLines={1}
                      >
                        {item.name_hi}
                      </Text>

                      <Text style={styles.viewLinkText}>स्तोत्र देखें &gt;</Text>
                    </TouchableOpacity>
                  ))}
                  {Array.from({ length: 3 - row.length }).map((_, i) => (
                    <View key={`spacer-${i}`} style={styles.gridCardSpacer} />
                  ))}
                </View>
              ))}
            </View>

            {/* Bottom Wide Banner */}
            <TouchableOpacity
              style={[styles.bannerCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
              onPress={() => handleSelectGod(OTHER_SAMSKAR_CATEGORY as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.bannerIconCircle, { backgroundColor: SOFT_PINK_BG }]}>
                <MaterialCommunityIcons
                  name="book-open-page-variant"
                  size={20}
                  color={PRIMARY_MAROON}
                />
              </View>

              <View style={styles.bannerTextCol}>
                <Text style={[styles.bannerTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                  प्रमुख वैदिक एवं पौराणिक स्तोत्र
                </Text>
                <Text style={styles.bannerSubtitle}>श्री सूक्त, पुरुष सूक्त एवं शांति पाठ</Text>
              </View>

              <Icon name="chevron-right" size={18} color={MUTED_TEXT} />
            </TouchableOpacity>

            <Text style={styles.footerCaption}>देवता चुनकर उपलब्ध स्तोत्र देखें।</Text>
          </View>
        )}

        {/* ============================================================
            SCREEN 2: INNER STOTRAM LIST VIEW
           ============================================================ */}
        {(selectedGod || searchQuery.trim().length > 0) && (
          <View>
            <View style={styles.listHeaderRow}>
              <Text style={[styles.listHeaderTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                {selectedGod ? 'उपलब्ध स्तोत्र' : 'खोज परिणाम'}
              </Text>
              <Text style={styles.listHeaderCount}>
                {displayedStotras.length} स्तोत्र
              </Text>
            </View>

            {displayedStotras.map((stotra, index) => {
              const formattedNumber = String(index + 1).padStart(2, '0');
              const title = stotra.titleHindi || stotra.title;
              const subtitle = stotra.subtitleHindi || stotra.subCategory || 'पावन स्तोत्र पाठ';

              return (
                <TouchableOpacity
                  key={stotra.id}
                  style={[styles.itemCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
                  onPress={() => navigation.navigate('StotramDetail', { stotramId: stotra.id })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.numberPill, { backgroundColor: SOFT_PINK_BG }]}>
                    <Text style={styles.numberPillText}>{formattedNumber}</Text>
                  </View>

                  <View style={styles.itemTextCol}>
                    <Text
                      style={[styles.itemTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                      numberOfLines={1}
                    >
                      {title}
                    </Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {subtitle}
                    </Text>
                  </View>

                  <Icon name="chevron-right" size={16} color={MUTED_TEXT} />
                </TouchableOpacity>
              );
            })}

            {displayedStotras.length === 0 && (
              <View style={styles.emptyStateBox}>
                <Text style={styles.emptyStateText}>कोई स्तोत्र नहीं मिला।</Text>
              </View>
            )}

            <Text style={styles.bottomListNote}>
              स्तोत्र चुनने पर उसका संपूर्ण पाठ व अर्थ खुलेगा।
            </Text>

            {selectedGod && (
              <TouchableOpacity
                style={styles.backToGridBtn}
                onPress={() => setSelectedGod(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.backToGridBtnText}>← सभी देवता</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 2,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    marginTop: 1,
  },
  breadcrumbRow: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breadcrumbText: {
    fontSize: 10.5,
    color: MUTED_TEXT,
  },
  breadcrumbActive: {
    color: PRIMARY_MAROON,
    fontWeight: '600',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  gridContainer: {
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  gridCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardSpacer: {
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  symbolText: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  deityName: {
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  viewLinkText: {
    fontSize: 9.5,
    color: PRIMARY_MAROON,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 12,
    marginBottom: 10,
  },
  bannerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  bannerSubtitle: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  footerCaption: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  listHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  listHeaderCount: {
    fontSize: 11,
    color: MUTED_TEXT,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  numberPill: {
    width: 28,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  itemTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  emptyStateBox: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 11.5,
    color: MUTED_TEXT,
  },
  bottomListNote: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  backToGridBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  backToGridBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_MAROON,
  },
});

export default StotramLibraryScreen;
