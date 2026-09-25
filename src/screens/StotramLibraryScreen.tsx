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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StotramLibraryScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStotras = MOCK_STOTRAS.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStotramCard = ({ item }: { item: typeof MOCK_STOTRAS[0] }) => (
    <TouchableOpacity
      style={[styles.stotramCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('StotramDetail', { stotramId: item.id })}
      activeOpacity={0.7}
    >
      <View style={[styles.cardAccent, { backgroundColor: colors.primary }]} />
      <View style={styles.cardBody}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '12' }]}>
          <Icon name="headphones" size={20} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.category, { color: colors.textLight }]}>{item.category}</Text>
        </View>
        <View style={[styles.playBadge, { backgroundColor: colors.primary + '12' }]}>
          <Icon name="play" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Stotram Library" showBack={true} />

      {/* Filters */}
      <View style={styles.filtersRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Icon name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search Stotram..."
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
            options={STOTRAM_CATEGORIES}
            onSelect={setSelectedCategory}
            placeholder="Category"
          />
        </View>
      </View>

      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.textLight }]}>
          {filteredStotras.length} stotras
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
              No stotras found in this category.
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
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardAccent: {
    height: 3,
    width: '100%',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  category: { fontSize: 13, fontWeight: '500' },
  playBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: { padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 15, fontWeight: '500' },
});

export default StotramLibraryScreen;
