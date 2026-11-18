import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { HistoryItem, HistoryItemType } from '../types/history';
import { MOCK_HISTORY } from '../data/mockHistory';

const PRIMARY_MAROON = '#8B1D1D';

const FILTERS: {
  labelHi: string;
  labelEn: string;
  value: HistoryItemType | 'all';
  icon: keyof typeof Icon.glyphMap;
}[] = [
  { labelHi: 'सभी रिकॉर्ड', labelEn: 'All Records', value: 'all', icon: 'layers' },
  { labelHi: 'पीडीएफ (PDFs)', labelEn: 'PDFs', value: 'pdf', icon: 'file-text' },
  { labelHi: 'डाउनलोड', labelEn: 'Downloads', value: 'download', icon: 'download' },
  { labelHi: 'रसीद / बिल', labelEn: 'Invoices', value: 'invoice', icon: 'credit-card' },
  { labelHi: 'गतिविधि', labelEn: 'Activity', value: 'activity', icon: 'calendar' },
  { labelHi: 'देखे गए', labelEn: 'Views', value: 'view', icon: 'eye' },
];

const HistoryScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const [filter, setFilter] = useState<HistoryItemType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MOCK_HISTORY.filter((item) => {
      const matchesType = filter === 'all' || item.type === filter;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [filter, searchQuery]);

  // Flat Maroon/White theme tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : '#FAF7F3';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const roseBorder = isDark ? '#5C2424' : '#F2D8D5';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  const activeFilterObj = FILTERS.find((f) => f.value === filter) || FILTERS[0];

  const getIconMeta = (type: HistoryItemType) => {
    switch (type) {
      case 'pdf':
        return {
          name: 'file-text' as const,
          color: accentColor,
          bg: roseBg,
          label: isHi ? 'पीडीएफ' : 'PDF',
        };
      case 'download':
        return {
          name: 'download' as const,
          color: isDark ? '#34D399' : '#047857',
          bg: isDark ? '#122920' : '#ECFDF5',
          label: isHi ? 'डाउनलोड' : 'Download',
        };
      case 'invoice':
        return {
          name: 'credit-card' as const,
          color: isDark ? '#93C5FD' : '#1D4ED8',
          bg: isDark ? '#172338' : '#EFF6FF',
          label: isHi ? 'बिल' : 'Invoice',
        };
      case 'activity':
        return {
          name: 'calendar' as const,
          color: isDark ? '#FBBF24' : '#B45309',
          bg: isDark ? '#2D2312' : '#FEF3C7',
          label: isHi ? 'गतिविधि' : 'Activity',
        };
      case 'view':
      default:
        return {
          name: 'eye' as const,
          color: textMuted,
          bg: subtleBg,
          label: isHi ? 'देखा गया' : 'View',
        };
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const meta = getIconMeta(item.type);

    return (
      <View
        style={[
          styles.historyCard,
          { backgroundColor: cardBg, borderColor: borderCol },
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
          <Icon name={meta.name} size={18} color={meta.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.typeTag,
                { backgroundColor: subtleBg, borderColor: borderCol },
              ]}
            >
              <Text style={[styles.typeTagText, { color: meta.color }]}>
                {meta.label}
              </Text>
            </View>
            <Text style={[styles.timeText, { color: textMuted }]}>
              {new Date(item.createdAt).toLocaleDateString(
                isHi ? 'hi-IN' : 'en-IN',
                { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' },
              )}
            </Text>
          </View>

          <Text
            style={[styles.cardTitle, { color: textPrimary }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            style={[styles.cardDesc, { color: textMuted }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          {(item.metadata?.fileSize || item.metadata?.amount) && (
            <View style={styles.metaRow}>
              {item.metadata?.fileSize && (
                <View
                  style={[
                    styles.metaBadge,
                    { backgroundColor: subtleBg, borderColor: borderCol },
                  ]}
                >
                  <Icon name="paperclip" size={11} color={textMuted} />
                  <Text style={[styles.metaText, { color: textMuted }]}>
                    {item.metadata.fileSize}
                  </Text>
                </View>
              )}
              {item.metadata?.amount && (
                <View
                  style={[
                    styles.metaBadge,
                    {
                      backgroundColor: isDark ? '#122920' : '#ECFDF5',
                      borderColor: isDark ? '#1F4A38' : '#A7F3D0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metaText,
                      { color: isDark ? '#34D399' : '#047857' },
                    ]}
                  >
                    ₹{item.metadata.amount}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* Flat Maroon/White Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: headerBg,
            paddingTop: Math.max(insets.top, 12) + 6,
            borderBottomColor: dividerCol,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={24} color={accentColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: accentColor }]}>
              {isHi ? 'कार्य इतिहास' : 'History & Activity'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {isHi
                ? 'गतिविधि, पीडीएफ, डाउनलोड और बिल'
                : 'Activity, PDFs, downloads & invoices'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.countPill,
            { backgroundColor: subtleBg, borderColor: borderCol },
          ]}
        >
          <Text style={[styles.countPillText, { color: textMuted }]}>
            {filteredHistory.length}
          </Text>
        </View>
      </View>

      {/* Search Bar + Filter Button (Replaces old horizontal swipe strip) */}
      <View
        style={[
          styles.searchFilterBar,
          { backgroundColor: headerBg, borderBottomColor: borderCol },
        ]}
      >
        <View
          style={[
            styles.searchInputWrap,
            { backgroundColor: subtleBg, borderColor: borderCol },
          ]}
        >
          <Icon name="search" size={16} color={textMuted} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              isHi ? 'शीर्षक या विवरण खोजें...' : 'Search history or activity...'
            }
            placeholderTextColor={textMuted}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="x" size={15} color={textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.78}
          onPress={() => setIsFilterModalOpen(true)}
          style={[
            styles.filterBtn,
            {
              backgroundColor: filter !== 'all' ? roseBg : subtleBg,
              borderColor: filter !== 'all' ? roseBorder : borderCol,
            },
          ]}
        >
          <Icon
            name="sliders"
            size={16}
            color={filter !== 'all' ? accentColor : textPrimary}
          />
          <Text
            style={[
              styles.filterBtnText,
              { color: filter !== 'all' ? accentColor : textPrimary },
            ]}
          >
            {isHi ? 'फ़िल्टर' : 'Filter'}
          </Text>
          {filter !== 'all' && (
            <View style={[styles.filterActiveDot, { backgroundColor: accentColor }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filter Chip (shown only when a specific category is selected) */}
      {filter !== 'all' && (
        <View style={styles.activeChipRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setFilter('all')}
            style={[
              styles.activeChip,
              { backgroundColor: roseBg, borderColor: roseBorder },
            ]}
          >
            <Text style={[styles.activeChipText, { color: accentColor }]}>
              {isHi ? activeFilterObj.labelHi : activeFilterObj.labelEn}
            </Text>
            <Icon name="x" size={13} color={accentColor} />
          </TouchableOpacity>
        </View>
      )}

      {/* History List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View style={[styles.emptyIconBox, { backgroundColor: roseBg }]}>
              <Icon name="inbox" size={24} color={accentColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: textPrimary }]}>
              {isHi ? 'कोई रिकॉर्ड नहीं मिला' : 'No history found'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: textMuted }]}>
              {isHi
                ? 'खोज या फ़िल्टर बदलकर पुनः प्रयास करें।'
                : 'Try adjusting your search or selected filter.'}
            </Text>
            {(filter !== 'all' || searchQuery.trim().length > 0) && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                style={[
                  styles.resetEmptyBtn,
                  { backgroundColor: roseBg, borderColor: roseBorder },
                ]}
              >
                <Text style={[styles.resetEmptyText, { color: accentColor }]}>
                  {isHi ? 'सभी दिखाएँ' : 'Reset Filters'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Flat Maroon/White Filter Modal */}
      <Modal
        visible={isFilterModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsFilterModalOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: dividerCol }]}
            >
              <Text style={[styles.modalTitle, { color: accentColor }]}>
                {isHi ? 'इतिहास फ़िल्टर करें' : 'Filter History'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsFilterModalOpen(false)}
                style={[
                  styles.modalCloseBtn,
                  { backgroundColor: subtleBg, borderColor: borderCol },
                ]}
              >
                <Icon name="x" size={15} color={textMuted} />
              </TouchableOpacity>
            </View>

            {FILTERS.map((opt) => {
              const selected = filter === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.75}
                  onPress={() => {
                    setFilter(opt.value);
                    setIsFilterModalOpen(false);
                  }}
                  style={[
                    styles.modalOptionRow,
                    selected && {
                      backgroundColor: roseBg,
                      borderColor: roseBorder,
                    },
                  ]}
                >
                  <View style={styles.modalOptionLeft}>
                    <Icon
                      name={opt.icon}
                      size={16}
                      color={selected ? accentColor : textMuted}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        {
                          color: selected ? accentColor : textPrimary,
                          fontWeight: selected ? '700' : '500',
                        },
                      ]}
                    >
                      {isHi ? opt.labelHi : opt.labelEn}
                    </Text>
                  </View>
                  {selected && (
                    <Icon name="check" size={16} color={accentColor} />
                  )}
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 10.5,
    marginTop: 1,
  },
  countPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
  },
  countPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  searchFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 11,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeChipRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeTagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 11.5,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    marginTop: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
  resetEmptyBtn: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: 1,
  },
  resetEmptyText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  modalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalOptionText: {
    fontSize: 11.5,
  },
});

export default HistoryScreen;
