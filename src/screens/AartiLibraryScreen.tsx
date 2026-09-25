import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { AARTI_CATEGORIES, MOCK_AARTIS } from '../data/mockLibrary';
import { Feather as Icon } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AartiLibraryScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAartis = MOCK_AARTIS.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderAartiCard = ({ item }: { item: typeof MOCK_AARTIS[0] }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.aartiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('AartiDetail', { aartiId: item.id })}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="book-open" size={24} color={colors.primary} />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{item.category}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart" size={20} color={colors.textLight} />
        </TouchableOpacity>
        <View style={[styles.playButtonSmall, { backgroundColor: colors.primary }]}>
          <Icon name="play" size={16} color="#FFF" style={styles.playIconSmall} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Aarti Library" showBack={true} />

      <View style={styles.filtersRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Icon name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search Aarti..."
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
            options={AARTI_CATEGORIES}
            onSelect={setSelectedCategory}
          />
        </View>
      </View>

      <FlatList
        data={filteredAartis}
        keyExtractor={(item) => item.id}
        renderItem={renderAartiCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              No aartis found in this category.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  listContainer: { padding: 16, paddingBottom: 30 },
  aartiCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  playButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconSmall: {
    marginLeft: 2,
  },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 16 }
});

export default AartiLibraryScreen;
