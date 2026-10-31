import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { MOCK_STOTRAS } from '../data/mockLibrary';
import { GOD_CATEGORIES, GodCategory } from '../data/godCategories';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StotramLibraryScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t, i18n } = useTranslation();

  const [selectedGod, setSelectedGod] = useState<GodCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isHindi = i18n.language === 'hi';

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

  // Count items per god category
  const godCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GOD_CATEGORIES.forEach(god => {
      counts[god.id] = MOCK_STOTRAS.filter(s => s.category === god.stotramCategory).length;
    });
    return counts;
  }, []);

  // Subcategories available for selected deity
  const availableSubCategories = useMemo(() => {
    if (!selectedGod) return [];
    const subs = new Set<string>();
    MOCK_STOTRAS.filter(s => s.category === selectedGod.stotramCategory).forEach(s => {
      if (s.subCategory) subs.add(s.subCategory);
    });
    return ['All', ...Array.from(subs)];
  }, [selectedGod]);

  // Filtered list
  const filteredStotras = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (q.length > 0) {
      return MOCK_STOTRAS.filter(s => {
        const title = getStotramTitle(s).toLowerCase();
        const cat = s.category.toLowerCase();
        const sub = (s.subCategory || '').toLowerCase();
        return title.includes(q) || cat.includes(q) || sub.includes(q);
      });
    }

    if (selectedGod) {
      return MOCK_STOTRAS.filter(s => {
        const matchesCategory = s.category === selectedGod.stotramCategory;
        const matchesSub = selectedSubCategory === 'All' || s.subCategory === selectedSubCategory;
        return matchesCategory && matchesSub;
      });
    }

    return [];
  }, [searchQuery, selectedGod, selectedSubCategory]);

  const handleSelectGod = (god: GodCategory) => {
    setSelectedGod(god);
    setSelectedSubCategory('All');
  };

  const handleClearSelection = () => {
    setSelectedGod(null);
    setSelectedSubCategory('All');
    setSearchQuery('');
  };

  const renderStotramCard = ({ item }: { item: typeof MOCK_STOTRAS[0] }) => (
    <TouchableOpacity
      style={[styles.stotramCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('StotramDetail', { stotramId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardBody}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '12' }]}>
          <Icon name="headphones" size={18} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {getStotramTitle(item)}
          </Text>
          <View style={styles.tagsRow}>
            <View style={[styles.categoryTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F2ECE2' }]}>
              <Text style={[styles.categoryTagText, { color: colors.primary }]}>{item.category}</Text>
            </View>
            {item.subCategory && (
              <View style={[styles.subCategoryTag, { backgroundColor: colors.primary + '12' }]}>
                <Text style={[styles.subCategoryTagText, { color: colors.text }]}>{item.subCategory}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={[styles.playBadge, { backgroundColor: colors.primary + '12' }]}>
          <Icon name="play" size={14} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title={t('stotram_library.title', 'Stotram Library')}
        showBack={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        {/* Top Search Bar Only (Category dropdown removed) */}
        <View style={[styles.searchBarSection, { backgroundColor: isDark ? colors.surface : '#FFF', borderBottomColor: colors.border }]}>
          <View style={[styles.searchContainer, { backgroundColor: isDark ? colors.background : '#F5ECE1', borderColor: colors.border }]}>
            <Icon name="search" size={18} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('stotram_library.search_placeholder', 'Search Stotram, Kavach, Deity...')}
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="x" size={18} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* View Mode 1: Search Active */}
        {searchQuery.trim().length > 0 ? (
          <View style={styles.activeContentContainer}>
            <View style={styles.searchHeaderRow}>
              <Text style={[styles.sectionSubtitle, { color: colors.textLight }]}>
                {filteredStotras.length} {isHindi ? 'स्तोत्र मिले' : 'stotras found'}
              </Text>
            </View>
            <FlatList
              data={filteredStotras}
              keyExtractor={(item) => item.id}
              renderItem={renderStotramCard}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="search" size={40} color={colors.border} />
                  <Text style={[styles.emptyText, { color: colors.textLight }]}>
                    {t('stotram_library.empty', 'No stotras found matching your search.')}
                  </Text>
                </View>
              }
            />
          </View>
        ) : selectedGod ? (
          /* View Mode 2: God Selected -> Shows Subcategories and Related Stotras */
          <View style={styles.activeContentContainer}>
            {/* Deity Header Bar */}
            <View style={[styles.deityHeaderBar, { backgroundColor: isDark ? colors.surface : '#FFF9F2', borderBottomColor: colors.border }]}>
              <TouchableOpacity
                onPress={handleClearSelection}
                style={[styles.backToGridBtn, { borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Icon name="arrow-left" size={15} color={colors.primary} />
                <Text style={[styles.backToGridText, { color: colors.primary }]}>
                  {isHindi ? 'सभी देव' : 'All Deities'}
                </Text>
              </TouchableOpacity>

              <View style={styles.deityHeaderTitleWrap}>
                <View style={[styles.deitySmallIcon, { backgroundColor: selectedGod.bgColor }]}>
                  <MaterialCommunityIcons name="om" size={16} color={selectedGod.color} />
                </View>
                <Text style={[styles.deityHeaderTitle, { color: colors.text }]}>
                  {isHindi ? selectedGod.name_hi : selectedGod.name_en}
                </Text>
              </View>
            </View>

            {/* Subcategory Pills */}
            {availableSubCategories.length > 1 && (
              <View style={styles.subCategoryPillsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subCategoryPillsContent}>
                  {availableSubCategories.map(sub => {
                    const isSelected = selectedSubCategory === sub;
                    return (
                      <TouchableOpacity
                        key={sub}
                        onPress={() => setSelectedSubCategory(sub)}
                        style={[
                          styles.subPill,
                          {
                            backgroundColor: isSelected ? colors.primary : isDark ? colors.surface : '#F2ECE2',
                            borderColor: isSelected ? colors.primary : colors.border,
                          },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.subPillText,
                            { color: isSelected ? '#FFF' : colors.text, fontWeight: isSelected ? 'bold' : '500' },
                          ]}
                        >
                          {sub === 'All' ? (isHindi ? 'सभी स्तोत्र' : 'All Stotras') : sub}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Stotras List for Selected Deity */}
            <FlatList
              data={filteredStotras}
              keyExtractor={(item) => item.id}
              renderItem={renderStotramCard}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="music" size={40} color={colors.border} />
                  <Text style={[styles.emptyText, { color: colors.textLight }]}>
                    {t('stotram_library.empty', 'No stotras found in this subcategory.')}
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          /* View Mode 3: Initial Screen -> Category Grid with Common God Icons */
          <ScrollView
            contentContainerStyle={styles.categoryGridScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.gridSectionHeader}>
              <Text style={[styles.gridTitle, { color: colors.text }]}>
                {isHindi ? 'देवता चुनें' : 'Select Deity'}
              </Text>
              <Text style={[styles.gridSubtitle, { color: colors.textLight }]}>
                {isHindi
                  ? 'वैदिक स्तोत्र, कवच, सहस्रनाम एवं अष्टकम पाठ हेतु देव चुनें'
                  : 'Select deity to explore sacred stotras, ashtakams, and kavachams'}
              </Text>
            </View>

            <View style={styles.godGrid}>
              {GOD_CATEGORIES.map((god) => {
                const count = godCounts[god.id] || 0;
                return (
                  <TouchableOpacity
                    key={god.id}
                    onPress={() => handleSelectGod(god)}
                    style={[
                      styles.godGridCard,
                      {
                        backgroundColor: isDark ? colors.surface : '#FFFFFF',
                        borderColor: isDark ? colors.border : '#EDE4D8',
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    {/* Common God Icon in Badge (OM icon for all gods, small size) */}
                    <View style={[styles.godIconCircle, { backgroundColor: god.bgColor }]}>
                      <MaterialCommunityIcons name="om" size={18} color={god.color} />
                    </View>

                    <Text style={[styles.godName, { color: colors.text }]} numberOfLines={1}>
                      {isHindi ? god.name_hi : god.name_en}
                    </Text>

                    <View style={[styles.itemCountBadge, { backgroundColor: colors.primary + '12' }]}>
                      <Text style={[styles.itemCountText, { color: colors.primary }]}>
                        {count} {isHindi ? 'स्तोत्र' : 'Stotras'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  searchBarSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  activeContentContainer: {
    flex: 1,
  },
  searchHeaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  deityHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  backToGridBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  backToGridText: {
    fontSize: 12,
    fontWeight: '700',
  },
  deityHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  deitySmallIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deityHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  subCategoryPillsContainer: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  subCategoryPillsContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  subPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  subPillText: {
    fontSize: 12,
  },
  listContainer: {
    padding: 14,
    paddingBottom: 30,
  },
  stotramCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  subCategoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subCategoryTagText: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  playBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryGridScroll: {
    padding: 14,
    paddingBottom: 30,
  },
  gridSectionHeader: {
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  gridTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
  },
  godGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  godGridCard: {
    width: '31.4%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 4,
  },
  godIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  godName: {
    fontSize: 11.5,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  godSubtitle: {
    display: 'none',
  },
  itemCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  itemCountText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
});

export default StotramLibraryScreen;
