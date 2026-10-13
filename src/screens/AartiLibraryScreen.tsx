import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { AARTI_CATEGORIES, MOCK_AARTIS } from '../data/mockLibrary';
import { Feather as Icon } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AartiLibraryScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const getAartiTitle = (item: typeof MOCK_AARTIS[0]) => {
    switch (item.id) {
      case 'a1': return t('aarti_library.aartis.jai_ganesh', item.title);
      case 'a2': return t('aarti_library.aartis.om_jai_jagdish', item.title);
      case 'a3': return t('aarti_library.aartis.aarti_kije_hanuman', item.title);
      default: return item.title;
    }
  };

  const categoryOptions = AARTI_CATEGORIES.map(cat => ({
    label: getCategoryLabel(cat),
    value: cat,
  }));

  const filteredAartis = MOCK_AARTIS.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const translatedTitle = getAartiTitle(a);
    const q = searchQuery.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(q) || translatedTitle.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const renderAartiCard = ({ item }: { item: typeof MOCK_AARTIS[0] }) => (
    <TouchableOpacity
      style={[styles.aartiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('AartiDetail', { aartiId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardBody}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '12' }]}>
          <Icon name="book-open" size={18} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{getAartiTitle(item)}</Text>
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
        title={t('aarti_library.title', 'Aarti Library')}
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
              placeholder={t('aarti_library.search_placeholder', 'Search Aarti...')}
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
              placeholder={t('aarti_library.category_placeholder', 'Category')}
            />
          </View>
        </View>

        <View style={styles.countRow}>
          <Text style={[styles.countText, { color: colors.textLight }]}>
            {filteredAartis.length} {t('aarti_library.count_suffix', 'aartis')}
          </Text>
        </View>

        <FlatList
          data={filteredAartis}
          keyExtractor={(item) => item.id}
          renderItem={renderAartiCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="book-open" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                {t('aarti_library.empty', 'No aartis found in this category.')}
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
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContainer: { padding: 16, paddingBottom: 30 },
  aartiCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
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

export default AartiLibraryScreen;
