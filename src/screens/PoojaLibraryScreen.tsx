import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { CATEGORIES, MOCK_POOJAS } from '../data/mockPoojas';
import { Feather as Icon } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const PoojaLibraryScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'All': return t('pooja_library.categories.all', 'All');
      case 'Vishnu Pooja': return t('pooja_library.categories.vishnu', 'Vishnu Pooja');
      case 'Ganesh Pooja': return t('pooja_library.categories.ganesh', 'Ganesh Pooja');
      case 'Shiva Pooja': return t('pooja_library.categories.shiva', 'Shiva Pooja');
      case 'Durga Pooja': return t('pooja_library.categories.durga', 'Durga Pooja');
      case 'Lakshmi Pooja': return t('pooja_library.categories.lakshmi', 'Lakshmi Pooja');
      case 'Hanuman Pooja': return t('pooja_library.categories.hanuman', 'Hanuman Pooja');
      default: return cat;
    }
  };

  const getSubCategoryLabel = (sub: string) => {
    switch (sub) {
      case 'Shodashopchar Pooja': return t('pooja_library.subcategories.shodashopchar', 'Shodashopchar Pooja');
      case 'Panchopchar Pooja': return t('pooja_library.subcategories.panchopchar', 'Panchopchar Pooja');
      case 'Rajopchar Pooja': return t('pooja_library.subcategories.rajopchar', 'Rajopchar Pooja');
      case 'Complete Setup': return t('pooja_library.subcategories.complete_setup', 'Complete Setup');
      case 'Pauranik': return t('pooja_library.subcategories.pauranik', 'Pauranik');
      default: return sub;
    }
  };

  const getPoojaTitle = (item: typeof MOCK_POOJAS[0]) => {
    if (item.id === 'p1') return t('pooja_library.poojas.ganesh_chaturthi', item.title);
    if (item.id === 'p2') return t('pooja_library.poojas.satyanarayan', item.title);
    if (item.id === 'p3') return t('pooja_library.poojas.shivratri', item.title);
    if (item.id === 'p4') return t('pooja_library.poojas.comprehensive', item.title);
    return item.title;
  };

  const categoryDropdownOptions = CATEGORIES.map((cat) => ({
    label: getCategoryLabel(cat),
    value: cat,
  }));

  const filteredPoojas = MOCK_POOJAS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const title = getPoojaTitle(p);
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || title.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const renderPoojaCard = ({ item }: { item: typeof MOCK_POOJAS[0] }) => (
    <TouchableOpacity
      style={[styles.poojaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('PoojaDetail', { poojaId: item.id })}
    >
      <View style={styles.poojaCardContent}>
        <View style={styles.poojaIconContainer}>
          <Icon name="book-open" size={20} color={colors.primary} />
        </View>
        <View style={styles.poojaTextContainer}>
          <Text style={[styles.poojaTitle, { color: colors.text }]}>{getPoojaTitle(item)}</Text>
          <Text style={[styles.poojaCategory, { color: colors.textLight }]}>
            {getCategoryLabel(item.category)} {item.subCategory ? `• ${getSubCategoryLabel(item.subCategory)}` : ''}
          </Text>
        </View>
        <Icon name="chevron-right" size={18} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title={t('pooja_library.title', 'Pooja Library')}
        showBack={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <View style={styles.filtersRow}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('pooja_library.search_placeholder', 'Search Pooja...')}
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
              options={categoryDropdownOptions}
              onSelect={setSelectedCategory}
            />
          </View>
        </View>

        <FlatList
          data={filteredPoojas}
          keyExtractor={(item) => item.id}
          renderItem={renderPoojaCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                {t('pooja_library.empty_text', 'No poojas found in this category.')}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  poojaCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  poojaCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poojaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0', // subtle tint
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  poojaTextContainer: {
    flex: 1,
  },
  poojaTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  poojaCategory: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  }
});

export default PoojaLibraryScreen;
