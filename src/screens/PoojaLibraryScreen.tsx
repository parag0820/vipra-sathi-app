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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const PoojaLibraryScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPoojas = MOCK_POOJAS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderPoojaCard = ({ item }: { item: typeof MOCK_POOJAS[0] }) => (
    <TouchableOpacity
      style={[styles.poojaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('PoojaDetail', { poojaId: item.id })}
    >
      <View style={styles.poojaCardContent}>
        <View style={styles.poojaIconContainer}>
          <Icon name="book-open" size={24} color={colors.primary} />
        </View>
        <View style={styles.poojaTextContainer}>
          <Text style={[styles.poojaTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.poojaCategory, { color: colors.textLight }]}>
            {item.category} {item.subCategory ? `• ${item.subCategory}` : ''}
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Pooja Library" showBack={true} />

      <View style={styles.filtersRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Icon name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search Pooja..."
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
            options={CATEGORIES}
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
              No poojas found in this category.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
    padding: 16,
    marginBottom: 16,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0', // subtle tint
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  poojaTextContainer: {
    flex: 1,
  },
  poojaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  poojaCategory: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  }
});

export default PoojaLibraryScreen;
