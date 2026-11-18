import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

// Mock offline content database
const offlineContent = [
  { id: '1', title: 'Ganesh Pooja', category: 'Pooja', content: 'Details about Ganesh Pooja...' },
  { id: '2', title: 'Ganesh Aarti', category: 'Aarti', content: 'Jai Ganesh Jai Ganesh Deva...' },
  { id: '3', title: 'Ganesh Mantra', category: 'Mantra', content: 'Om Gan Ganapataye Namo Namah...' },
  { id: '4', title: 'Ganesh Samagri', category: 'Samagri', content: 'List of items needed for Ganesh pooja...' },
  { id: '5', title: 'Ganesh Stotra', category: 'Stotra', content: 'Pranamya Shirasa Devam...' },
  { id: '6', title: 'Ganesh Muhurt', category: 'Muhurt', content: 'Best time for Ganesh Sthapana...' },
  { id: '7', title: 'Shiv Pooja', category: 'Pooja', content: 'Details about Shiv Pooja...' },
];

const GlobalSearch = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof offlineContent>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      setExpandedId(null);
      return;
    }
    const lowerQuery = text.toLowerCase();
    const filtered = offlineContent.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.category.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <Icon name="search" size={20} color={colors.textLight} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={t('search_placeholder', 'Search Aarti, Mantra, Pooja...')}
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="x" size={20} color={colors.textLight} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      {results.length > 0 && (
        <View style={[styles.resultsContainer, { backgroundColor: colors.surface }]}>
          {results.map((item) => (
            <View key={item.id} style={[styles.resultItem, { borderBottomColor: colors.border }]}>
              <TouchableOpacity style={styles.resultHeader} onPress={() => toggleExpand(item.id)}>
                <View>
                  <Text style={[styles.resultTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.resultCategory, { color: colors.textLight }]}>{item.category}</Text>
                </View>
                <Icon name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={20} color={colors.textLight} />
              </TouchableOpacity>
              
              {expandedId === item.id && (
                <View style={styles.resultContent}>
                  <Text style={{ color: colors.text }}>{item.content}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
  },
  resultsContainer: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  resultItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  resultTitle: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  resultCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  resultContent: {
    padding: 16,
    paddingTop: 0,
  }
});

export default GlobalSearch;
