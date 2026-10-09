import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { HistoryItem, HistoryItemType } from '../types/history';
import { MOCK_HISTORY } from '../data/mockHistory';
import CustomHeader from '../components/CustomHeader';

const FILTERS: { label: string; value: HistoryItemType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'PDFs', value: 'pdf' },
  { label: 'Downloads', value: 'download' },
  { label: 'Invoices', value: 'invoice' },
  { label: 'Activity', value: 'activity' },
  { label: 'Views', value: 'view' },
];

const HistoryScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<HistoryItemType | 'all'>('all');

  const filteredHistory = filter === 'all'
    ? MOCK_HISTORY
    : MOCK_HISTORY.filter(h => h.type === filter);

  const getIconProps = (type: HistoryItemType) => {
    switch (type) {
      case 'pdf': return { name: 'file-text', color: '#DC2626' }; // Red
      case 'download': return { name: 'download', color: '#16A34A' }; // Green
      case 'invoice': return { name: 'dollar-sign', color: '#2563EB' }; // Blue
      case 'activity': return { name: 'calendar', color: '#8B5CF6' }; // Purple
      case 'view': return { name: 'eye', color: '#6B7280' }; // Gray
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const iconProps = getIconProps(item.type);

    return (
      <View style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: iconProps.color + '15' }]}>
          <Icon name={iconProps.name as any} size={20} color={iconProps.color} />
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.cardDesc, { color: colors.textLight }]} numberOfLines={2}>{item.description}</Text>

          <View style={styles.cardFooter}>
            <Text style={[styles.timeText, { color: colors.textLight }]}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            {/* Optional Metadata Badges */}
            {item.metadata?.fileSize && (
              <View style={[styles.metaBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.metaText, { color: colors.textLight }]}>{item.metadata.fileSize}</Text>
              </View>
            )}
            {item.metadata?.amount && (
              <View style={[styles.metaBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.metaText, { color: '#16A34A' }]}>₹{item.metadata.amount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title="History & Activity"
        showBack={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>

        <View style={styles.filterWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTERS}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  filter === item.value
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.surface, borderColor: colors.border }
                ]}
                onPress={() => setFilter(item.value)}
              >
                <Text style={[
                  styles.filterText,
                  { color: filter === item.value ? '#FFF' : colors.text }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <FlatList
          data={filteredHistory}
          keyExtractor={item => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={48} color={colors.textLight} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>No history found for this category.</Text>
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
  },
  filterWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 8,
  },
  filterText: { fontSize: 14, fontWeight: '600' },

  listContainer: { padding: 16, paddingBottom: 40 },
  historyCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: 14, marginBottom: 8, lineHeight: 20 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: { fontSize: 12 },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  metaText: { fontSize: 12, fontWeight: 'bold' },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 12,
  }
});

export default HistoryScreen;
