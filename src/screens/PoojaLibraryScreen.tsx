import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { MOCK_POOJAS } from '../data/mockPoojas';
import { GOD_CATEGORIES, GodCategory, OTHER_SAMSKAR_CATEGORY } from '../data/godCategories';
import { Pooja } from '../types/pooja';
import { poojaApi, matchesGodCategory } from '../api/pooja';

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

const PoojaLibraryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();

  // Selected deity category (null means Screen 1: Deity Grid)
  const [selectedGod, setSelectedGod] = useState<GodCategory | null>(null);
  // View all poojas from /pooja/get-all directly
  const [showAllPoojas, setShowAllPoojas] = useState(false);
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // API poojas state
  const [apiPoojas, setApiPoojas] = useState<Pooja[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadPoojas = useCallback(async (refresh: boolean = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setApiError(null);
      const data = await poojaApi.getAll();
      setApiPoojas(data);
    } catch (err) {
      console.error('Failed to load poojas from /pooja/get-all:', err);
      setApiError('सर्वर से पूजा सूची लोड नहीं हो सकी।');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPoojas(false);
  }, [loadPoojas]);

  // Use live API poojas when loaded cleanly; fall back to MOCK_POOJAS only when offline/API failed
  const activePoojaSource = useMemo<Pooja[]>(() => {
    if (!apiError) {
      return apiPoojas;
    }
    return apiPoojas.length > 0 ? apiPoojas : MOCK_POOJAS;
  }, [apiPoojas, apiError]);

  // Count poojas per deity card
  const poojaCountsByGodId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const god of GOD_CATEGORIES) {
      counts[god.id] = activePoojaSource.filter((p) => matchesGodCategory(p, god)).length;
    }
    counts[OTHER_SAMSKAR_CATEGORY.id] = activePoojaSource.filter((p) =>
      matchesGodCategory(p, OTHER_SAMSKAR_CATEGORY as GodCategory)
    ).length;
    return counts;
  }, [activePoojaSource]);

  // 3-column card width calculation
  const cardWidth = (width - 32 - 16) / 3;

  // Items for the selected deity, Show All, or search results
  const displayedPoojas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matchesSearch = (p: Pooja) => {
      const fields = [
        p.titleHindi,
        p.title,
        p.category,
        p.subCategory,
        p.subCategoryDescription,
        p.subtitleHindi,
        p.sectionType,
        p.content,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return fields.includes(q);
    };

    // If deity is selected
    if (selectedGod) {
      const list = activePoojaSource.filter((p) => matchesGodCategory(p, selectedGod));
      return q.length > 0 ? list.filter(matchesSearch) : list;
    }

    // If viewing all API poojas
    if (showAllPoojas) {
      return q.length > 0 ? activePoojaSource.filter(matchesSearch) : activePoojaSource;
    }

    // If searching across all deities from Screen 1
    if (q.length > 0) {
      return activePoojaSource.filter(matchesSearch);
    }

    return [];
  }, [selectedGod, showAllPoojas, searchQuery, activePoojaSource]);

  const handleSelectGod = (god: GodCategory) => {
    setSelectedGod(god);
    setShowAllPoojas(false);
    setSearchQuery('');
  };

  const handleBack = () => {
    if (selectedGod || showAllPoojas) {
      setSelectedGod(null);
      setShowAllPoojas(false);
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
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, 8),
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderBottomColor: isDark ? '#2D2D2D' : BORDER_COLOR,
          },
        ]}
      >
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
              {selectedGod
                ? selectedGod.name_hi
                : showAllPoojas
                  ? 'सभी पूजाएँ'
                  : 'पूजा'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {selectedGod
                ? 'पूजा का प्रकार चुनें'
                : showAllPoojas
                  ? 'उपलब्ध संपूर्ण पूजा संग्रह'
                  : 'देवता चुनें, फिर पूजा का प्रकार'}
            </Text>
          </View>
        </View>
      </View>

      {/* Breadcrumb line (Only in Screen 2: Inner list) */}
      {(selectedGod || showAllPoojas) && (
        <View
          style={[
            styles.breadcrumbRow,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA',
              borderBottomColor: isDark ? '#2D2D2D' : '#F3F4F6',
            },
          ]}
        >
          <Text style={styles.breadcrumbText}>
            पूजा  /  {' '}
            <Text style={styles.breadcrumbActive}>
              {selectedGod ? selectedGod.name_hi : 'सभी पूजाएँ'}
            </Text>
          </Text>
        </View>
      )}

      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDark ? '#262626' : '#FFFFFF',
              borderColor: isDark ? '#383838' : BORDER_COLOR,
            },
          ]}
        >
          <Icon name="search" size={16} color={MUTED_TEXT} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
            placeholder={
              selectedGod
                ? `${selectedGod.name_hi} पूजा खोजें`
                : 'देवता या पूजा का नाम खोजें'
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

      {/* Offline / Error retry bar */}
      {apiError && !isLoading && (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor: isDark ? '#2A1B1B' : '#FEF2F2',
              borderColor: isDark ? '#5C2323' : CARD_BORDER,
            },
          ]}
        >
          <Text style={[styles.errorBannerText, { color: isDark ? '#FCA5A5' : PRIMARY_MAROON }]}>
            {apiError}
          </Text>
          <TouchableOpacity onPress={() => loadPoojas(false)} hitSlop={{ top: 6, bottom: 6, left: 8, right: 8 }}>
            <Text style={styles.retryLinkText}>पुनः प्रयास करें</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadPoojas(true)}
            colors={[PRIMARY_MAROON]}
            tintColor={PRIMARY_MAROON}
          />
        }
      >
        {/* ============================================================
            SCREEN 1: DEITY GRID VIEW (When selectedGod is null & not viewing all/searching)
           ============================================================ */}
        {!selectedGod && !showAllPoojas && searchQuery.trim().length === 0 && (
          <View>
            {/* Section Title + All Poojas Link */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                देवता के अनुसार पूजा
              </Text>
              {isLoading ? (
                <ActivityIndicator size="small" color={PRIMARY_MAROON} />
              ) : (
                activePoojaSource.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowAllPoojas(true);
                      setSearchQuery('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllLinkText}>
                      सभी देखें ({activePoojaSource.length}) &gt;
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* 3-Column Grid */}
            <View style={styles.gridContainer}>
              {chunkArray(GOD_CATEGORIES, 3).map((row, rowIndex) => (
                <View key={`grid-row-${rowIndex}`} style={styles.gridRow}>
                  {row.map((item) => {
                    const count = poojaCountsByGodId[item.id] || 0;
                    const countLabel = isLoading
                      ? 'पूजाएं देखें >'
                      : count > 0
                        ? `${count === 1 ? '1 पूजा' : `${count} पूजाएं`} >`
                        : 'पूजाएं देखें >';

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.gridCard,
                          {
                            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                            borderColor: isDark ? '#2D2D2D' : CARD_BORDER,
                          },
                        ]}
                        onPress={() => handleSelectGod(item)}
                        activeOpacity={0.75}
                      >
                        {/* Icon Container */}
                        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2B1B1B' : SOFT_PINK_BG }]}>
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

                        {/* Deity Name */}
                        <Text
                          style={[styles.deityName, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                          numberOfLines={1}
                        >
                          {item.name_hi}
                        </Text>

                        {/* CTA / Count Subtext */}
                        <Text
                          style={[
                            styles.viewLinkText,
                            {
                              color: !isLoading && count === 0 ? '#9CA3AF' : PRIMARY_MAROON,
                              fontWeight: count > 0 ? '600' : '400',
                            },
                          ]}
                        >
                          {countLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {Array.from({ length: 3 - row.length }).map((_, i) => (
                    <View key={`spacer-${i}`} style={styles.gridCardSpacer} />
                  ))}
                </View>
              ))}
            </View>

            {/* Bottom Wide Banner: अन्य पूजा एवं संस्कार */}
            <TouchableOpacity
              style={[
                styles.bannerCard,
                {
                  backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                  borderColor: isDark ? '#2D2D2D' : CARD_BORDER,
                },
              ]}
              onPress={() => handleSelectGod(OTHER_SAMSKAR_CATEGORY as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.bannerIconCircle, { backgroundColor: isDark ? '#2B1B1B' : SOFT_PINK_BG }]}>
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={20}
                  color={PRIMARY_MAROON}
                />
              </View>

              <View style={styles.bannerTextCol}>
                <Text style={[styles.bannerTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                  अन्य पूजा एवं संस्कार
                </Text>
                <Text style={styles.bannerSubtitle}>गृह प्रवेश, विवाह एवं अन्य अनुष्ठान</Text>
              </View>

              {(poojaCountsByGodId[OTHER_SAMSKAR_CATEGORY.id] || 0) > 0 && (
                <View style={[styles.bannerCountBadge, { backgroundColor: SOFT_PINK_BG }]}>
                  <Text style={styles.bannerCountText}>
                    {poojaCountsByGodId[OTHER_SAMSKAR_CATEGORY.id]}
                  </Text>
                </View>
              )}

              <Icon name="chevron-right" size={18} color={MUTED_TEXT} />
            </TouchableOpacity>

            <Text style={styles.footerCaption}>देवता चुनकर उपलब्ध पूजाएँ देखें।</Text>
          </View>
        )}

        {/* ============================================================
            SCREEN 2: DEITY'S INNER POOJA LIST VIEW / ALL POOJAS / SEARCH RESULTS
           ============================================================ */}
        {(selectedGod || showAllPoojas || searchQuery.trim().length > 0) && (
          <View>
            {/* List Header */}
            <View style={styles.listHeaderRow}>
              <Text style={[styles.listHeaderTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                {showAllPoojas
                  ? 'सभी उपलब्ध पूजाएँ'
                  : selectedGod
                    ? 'उपलब्ध पूजाएँ'
                    : 'खोज परिणाम'}
              </Text>
              <Text style={styles.listHeaderCount}>
                {displayedPoojas.length} पूजाएँ
              </Text>
            </View>

            {/* Loading State inside List */}
            {isLoading && displayedPoojas.length === 0 ? (
              <View style={styles.emptyStateBox}>
                <ActivityIndicator size="small" color={PRIMARY_MAROON} />
                <Text style={[styles.emptyStateText, { marginTop: 8 }]}>
                  पूजाएँ लोड हो रही हैं...
                </Text>
              </View>
            ) : (
              <>
                {/* List Items */}
                {displayedPoojas.map((pooja, index) => {
                  const formattedNumber = String(index + 1).padStart(2, '0');
                  const title = pooja.titleHindi || pooja.title;

                  const subtitleParts: string[] = [];
                  if (!selectedGod && pooja.category) {
                    subtitleParts.push(pooja.category);
                  }
                  if (pooja.subCategory && pooja.subCategory !== pooja.category) {
                    subtitleParts.push(pooja.subCategory);
                  } else if (selectedGod && pooja.subCategory) {
                    subtitleParts.push(pooja.subCategory);
                  }
                  if (pooja.content && pooja.content.length <= 55) {
                    subtitleParts.push(pooja.content);
                  }
                  const uniqueSubtitleParts = subtitleParts.filter(
                    (val, idx, arr) => arr.indexOf(val) === idx
                  );
                  const subtitle =
                    uniqueSubtitleParts.join(' • ') ||
                    pooja.subtitleHindi ||
                    pooja.sectionType ||
                    'संक्षिप्त पूजा क्रम';

                  return (
                    <TouchableOpacity
                      key={pooja.id}
                      style={[
                        styles.poojaItemCard,
                        {
                          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                          borderColor: isDark ? '#2D2D2D' : '#F3F4F6',
                        },
                      ]}
                      onPress={() => navigation.navigate('PoojaDetail', { poojaId: pooja.id })}
                      activeOpacity={0.7}
                    >
                      {/* Left Number Pill */}
                      <View style={[styles.numberPill, { backgroundColor: isDark ? '#2B1B1B' : SOFT_PINK_BG }]}>
                        <Text style={styles.numberPillText}>{formattedNumber}</Text>
                      </View>

                      {/* Center Text Info */}
                      <View style={styles.poojaItemTextCol}>
                        <Text
                          style={[styles.poojaItemTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}
                          numberOfLines={1}
                        >
                          {title}
                        </Text>
                        <Text style={styles.poojaItemSubtitle} numberOfLines={1}>
                          {subtitle}
                        </Text>
                      </View>

                      {/* Optional sectionType pill */}
                      {pooja.sectionType ? (
                        <View style={[styles.typeBadge, { backgroundColor: isDark ? '#2B1B1B' : SOFT_PINK_BG }]}>
                          <Text style={styles.typeBadgeText}>{pooja.sectionType}</Text>
                        </View>
                      ) : null}

                      {/* Right Chevron */}
                      <Icon name="chevron-right" size={16} color={MUTED_TEXT} />
                    </TouchableOpacity>
                  );
                })}

                {displayedPoojas.length === 0 && (
                  <View style={styles.emptyStateBox}>
                    <Text style={styles.emptyStateText}>
                      इस श्रेणी में अभी कोई पूजा उपलब्ध नहीं है।
                    </Text>
                    {selectedGod && activePoojaSource.length > 0 && searchQuery.trim().length === 0 && (
                      <TouchableOpacity
                        style={[styles.emptyViewAllBtn, { borderColor: PRIMARY_MAROON }]}
                        onPress={() => {
                          setSelectedGod(null);
                          setShowAllPoojas(true);
                        }}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.emptyViewAllBtnText}>
                          सभी उपलब्ध पूजाएँ देखें ({activePoojaSource.length})
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            )}

            {/* Footer Guidance */}
            <Text style={styles.bottomListNote}>
              पूजा चुनने पर उसका पाठ और मंत्र खुलेंगे।
            </Text>

            {/* Back to all deities button */}
            {(selectedGod || showAllPoojas) && (
              <TouchableOpacity
                style={styles.backToGridBtn}
                onPress={() => {
                  setSelectedGod(null);
                  setShowAllPoojas(false);
                }}
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
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  headerSubtitle: {
    fontSize: 11,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorBannerText: {
    fontSize: 11,
    flex: 1,
    marginRight: 8,
  },
  retryLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  viewAllLinkText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: PRIMARY_MAROON,
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
  bannerCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  bannerCountText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
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
    fontSize: 13.5,
    fontWeight: '700',
  },
  listHeaderCount: {
    fontSize: 11,
    color: MUTED_TEXT,
  },
  poojaItemCard: {
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
    fontSize: 11.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  poojaItemTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  poojaItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  poojaItemSubtitle: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: PRIMARY_MAROON,
  },
  emptyStateBox: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 12,
    color: MUTED_TEXT,
    textAlign: 'center',
  },
  emptyViewAllBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyViewAllBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: PRIMARY_MAROON,
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

export default PoojaLibraryScreen;
