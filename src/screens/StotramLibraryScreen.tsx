import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { STOTRAM_CATEGORIES, MOCK_STOTRAS } from '../data/mockLibrary';
import { Feather as Icon } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StotramLibraryScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const categoryOptions = STOTRAM_CATEGORIES.map(cat => ({
    label: getCategoryLabel(cat),
    value: cat,
  }));

  const filteredStotras = MOCK_STOTRAS.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const translatedTitle = getStotramTitle(s);
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.title.toLowerCase().includes(q) || translatedTitle.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

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
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{getStotramTitle(item)}</Text>
          <Text style={[styles.category, { color: colors.textLight }]}>{getCategoryLabel(item.category)}</Text>
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
        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('stotram_library.search_placeholder', 'Search Stotram...')}
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="x" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dropdownContainer}>
            <CustomDropdown
              value={selectedCategory}
              options={categoryOptions}
              onSelect={setSelectedCategory}
              placeholder={t('stotram_library.category_placeholder', 'Category')}
            />
          </View>
        </View>

        <View style={styles.countRow}>
          <Text style={[styles.countText, { color: colors.textLight }]}>
            {filteredStotras.length} {t('stotram_library.count_suffix', 'stotras')}
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
              <Icon name="music" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                {t('stotram_library.empty', 'No stotras found in this category.')}
              </Text>
            </View>
          }
        />
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
    paddingTop: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingTop: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  dropdownContainer: {
    flex: 1,
  },
  countRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContainer: { padding: 16, paddingBottom: 30 },
  stotramCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  category: { fontSize: 12, fontWeight: '500' },
  playBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: { padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '500' },
});

export default StotramLibraryScreen;
