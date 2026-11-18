import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
  Share,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

const PRIMARY_MAROON = '#8B1D1D';

type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  source: string;
  amount: number;
  date: string;
  remark?: string;
}

const generateMockData = (): Transaction[] => {
  const data: Transaction[] = [];
  const now = new Date();

  data.push({
    id: '1',
    type: 'income',
    category: 'Dakshina',
    source: 'Ramesh Sharma',
    amount: 5100,
    date: now.toISOString(),
    remark: 'Satyanarayan Katha',
  });
  data.push({
    id: '2',
    type: 'expense',
    category: 'Travel',
    source: 'Uber',
    amount: 350,
    date: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    remark: 'Travel to client',
  });

  const twoDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2);
  data.push({
    id: '3',
    type: 'income',
    category: 'Astrology',
    source: 'Kiran Patel',
    amount: 2100,
    date: twoDaysAgo.toISOString(),
  });
  data.push({
    id: '4',
    type: 'expense',
    category: 'Samagri',
    source: 'Pooja Store',
    amount: 1500,
    date: twoDaysAgo.toISOString(),
  });

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  data.push({
    id: '5',
    type: 'income',
    category: 'Karmkand',
    source: 'Joshi Family',
    amount: 11000,
    date: twoMonthsAgo.toISOString(),
  });
  data.push({
    id: '6',
    type: 'income',
    category: 'Jyotish Consultation',
    source: 'Sunil Verma',
    amount: 5000,
    date: twoMonthsAgo.toISOString(),
  });

  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  data.push({
    id: '7',
    type: 'income',
    category: 'Dakshina',
    source: 'Annual Pooja',
    amount: 25000,
    date: lastYear.toISOString(),
  });

  return data;
};

const MOCK_TRANSACTIONS = generateMockData();

const FILTERS = [
  { id: 'all', labelHi: 'सभी समय', labelEn: 'All Time' },
  { id: 'today', labelHi: 'आज', labelEn: 'Today' },
  { id: 'month', labelHi: 'इस माह', labelEn: 'This Month' },
  { id: 'year', labelHi: 'इस वर्ष', labelEn: 'This Year' },
  { id: 'custom', labelHi: 'तारीख चुनें', labelEn: 'Custom Date' },
];

const AccountHistoryScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const [activeFilter, setActiveFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MOCK_TRANSACTIONS.filter((tr) => {
      const tDate = new Date(tr.date);
      const now = new Date();

      let matchesDate = true;
      if (activeFilter === 'today') {
        matchesDate = tDate.toDateString() === now.toDateString();
      } else if (activeFilter === 'month') {
        matchesDate =
          tDate.getMonth() === now.getMonth() &&
          tDate.getFullYear() === now.getFullYear();
      } else if (activeFilter === 'year') {
        matchesDate = tDate.getFullYear() === now.getFullYear();
      } else if (activeFilter === 'custom' && customDate) {
        matchesDate = tDate.toDateString() === customDate.toDateString();
      }

      const matchesType = typeFilter === 'all' || tr.type === typeFilter;
      const matchesSearch =
        !q ||
        tr.category.toLowerCase().includes(q) ||
        tr.source.toLowerCase().includes(q) ||
        (tr.remark || '').toLowerCase().includes(q);

      return matchesDate && matchesType && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeFilter, customDate, typeFilter, searchQuery]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((tr) => {
      if (tr.type === 'income') income += tr.amount;
      else expense += tr.amount;
    });
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  const handleFilterPress = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === 'custom') {
      setIsDatePickerOpen(true);
    }
  };

  const activeFilterLabel = () => {
    const found = FILTERS.find((f) => f.id === activeFilter);
    const base = found ? (isHi ? found.labelHi : found.labelEn) : '';
    if (activeFilter === 'custom' && customDate) {
      return `${base} (${customDate.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN')})`;
    }
    return base;
  };

  const handleShare = async () => {
    try {
      if (filteredTransactions.length === 0) {
        Alert.alert(
          t('accountHistory.noDataTitle', isHi ? 'कोई डेटा नहीं' : 'No Data'),
          t(
            'accountHistory.noDataMsg',
            isHi ? 'साझा करने के लिए कोई लेन-देन नहीं है।' : 'There are no transactions to share.',
          ),
        );
        return;
      }

      let message = `${t('accountHistory.reportTitle', 'Account History Report')}\n`;
      message += `Period: ${activeFilterLabel()}\n\n`;

      filteredTransactions.forEach((tr) => {
        const dateStr = new Date(tr.date).toLocaleDateString();
        message += `[${dateStr}] ${tr.type === 'income' ? '+' : '-'}₹${tr.amount} - ${tr.category} (${tr.source})\n`;
        if (tr.remark) message += `   Note: ${tr.remark}\n`;
      });

      message += `\nSummary:\n`;
      message += `Total Income: ₹${summary.income}\n`;
      message += `Total Expense: ₹${summary.expense}\n`;
      message += `Net Balance: ₹${summary.net}\n`;

      await Share.share({
        message,
        title: 'Account History',
      });
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  // Flat Maroon/White theme tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : '#FAF7F3';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const roseBorder = isDark ? '#5C2424' : '#F2D8D5';
  const greenBg = isDark ? '#122920' : '#ECFDF5';
  const greenText = isDark ? '#34D399' : '#166534';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const formattedTime = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View
        style={[
          styles.transactionCard,
          { backgroundColor: cardBg, borderColor: borderCol },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isIncome ? greenBg : roseBg },
          ]}
        >
          <Icon
            name={isIncome ? 'arrow-down' : 'arrow-up'}
            size={14}
            color={isIncome ? greenText : accentColor}
          />
        </View>

        <View style={styles.cardCenter}>
          <Text style={[styles.title, { color: textPrimary }]} numberOfLines={1}>
            {item.category}
          </Text>
          <Text style={[styles.subtitle, { color: textMuted }]} numberOfLines={1}>
            {item.source}
            {item.remark ? ` • ${item.remark}` : ''}
          </Text>
          <Text style={[styles.dateText, { color: textMuted }]}>
            {formattedDate} • {formattedTime}
          </Text>
        </View>

        <View style={styles.cardRight}>
          <Text
            style={[
              styles.amount,
              { color: isIncome ? greenText : accentColor },
            ]}
          >
            {isIncome ? '+' : '−'}₹{item.amount.toLocaleString('en-IN')}
          </Text>
          <Text
            style={[
              styles.typeTag,
              { color: isIncome ? greenText : accentColor },
            ]}
          >
            {isIncome ? (isHi ? 'आय' : 'Income') : isHi ? 'खर्च' : 'Expense'}
          </Text>
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
            paddingTop: Math.max(insets.top, 12) + 4,
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
            <Icon name="chevron-left" size={22} color={accentColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: accentColor }]}>
              {isHi
                ? 'लेन-देन इतिहास'
                : t('accountHistory.title', 'Transaction History')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {activeFilterLabel()} • {filteredTransactions.length}{' '}
              {isHi ? 'प्रविष्टियाँ' : 'entries'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleShare}
          style={styles.shareHeaderBtn}
        >
          <Icon name="share-2" size={16} color={accentColor} />
          <Text style={[styles.shareHeaderText, { color: accentColor }]}>
            {isHi ? 'साझा करें' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Compact Summary Ribbon */}
      <View
        style={[
          styles.summaryRibbon,
          { backgroundColor: headerBg, borderBottomColor: borderCol },
        ]}
      >
        <View style={styles.ribbonCol}>
          <Text style={[styles.ribbonLabel, { color: textMuted }]}>
            {isHi ? 'कुल आय' : 'Income'}
          </Text>
          <Text style={[styles.ribbonVal, { color: greenText }]}>
            +₹{summary.income.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.ribbonDivider, { backgroundColor: dividerCol }]} />
        <View style={styles.ribbonCol}>
          <Text style={[styles.ribbonLabel, { color: textMuted }]}>
            {isHi ? 'कुल खर्च' : 'Expense'}
          </Text>
          <Text style={[styles.ribbonVal, { color: accentColor }]}>
            −₹{summary.expense.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.ribbonDivider, { backgroundColor: dividerCol }]} />
        <View style={styles.ribbonCol}>
          <Text style={[styles.ribbonLabel, { color: textMuted }]}>
            {isHi ? 'शुद्ध बचत' : 'Net'}
          </Text>
          <Text style={[styles.ribbonVal, { color: textPrimary }]}>
            ₹{summary.net.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Search + Date Filter Bar + Type Pills */}
      <View style={styles.controlsWrap}>
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchInputWrap,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <Icon name="search" size={15} color={textMuted} />
            <TextInput
              style={[styles.searchInput, { color: textPrimary }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={
                isHi ? 'श्रेणी, स्रोत या टिप्पणी खोजें...' : 'Search category, source or note...'
              }
              placeholderTextColor={textMuted}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="x" size={14} color={textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.78}
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilter !== 'all' ? roseBg : cardBg,
                borderColor: activeFilter !== 'all' ? roseBorder : borderCol,
              },
            ]}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Icon
              name="sliders"
              size={14}
              color={activeFilter !== 'all' ? accentColor : textPrimary}
            />
            <Text
              style={[
                styles.filterBtnText,
                { color: activeFilter !== 'all' ? accentColor : textPrimary },
              ]}
            >
              {isHi ? 'अवधि' : t('accountHistory.filter', 'Filter')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.typePillsRow}>
          {(
            [
              { key: 'all', labelHi: 'सभी', labelEn: 'All' },
              { key: 'income', labelHi: 'आय', labelEn: 'Income' },
              { key: 'expense', labelHi: 'खर्च', labelEn: 'Expense' },
            ] as const
          ).map((tab) => {
            const active = typeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.75}
                onPress={() => setTypeFilter(tab.key)}
                style={[
                  styles.typePill,
                  {
                    backgroundColor: active ? roseBg : cardBg,
                    borderColor: active ? roseBorder : borderCol,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typePillText,
                    {
                      color: active ? accentColor : textPrimary,
                      fontWeight: active ? '700' : '500',
                    },
                  ]}
                >
                  {isHi ? tab.labelHi : tab.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: Math.max(insets.bottom, 20) + 16 },
        ]}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View style={[styles.emptyIconBox, { backgroundColor: roseBg }]}>
              <Icon name="file-text" size={22} color={accentColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: textPrimary }]}>
              {isHi ? 'कोई लेन-देन नहीं मिला' : 'No transactions found'}
            </Text>
            <Text style={[styles.emptyText, { color: textMuted }]}>
              {t(
                'accountHistory.noData',
                isHi
                  ? 'इस अवधि के लिए कोई लेन-देन उपलब्ध नहीं है।'
                  : 'No transactions found for this period.',
              )}
            </Text>
          </View>
        }
      />

      <DatePicker
        modal
        open={isDatePickerOpen}
        theme={isDark ? 'dark' : 'light'}
        date={customDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setIsDatePickerOpen(false);
          setCustomDate(date);
          setActiveFilter('custom');
        }}
        onCancel={() => {
          setIsDatePickerOpen(false);
          if (!customDate) setActiveFilter('all');
        }}
      />

      {/* Flat Maroon/White Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsFilterModalVisible(false)}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: dividerCol }]}
            >
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.modalIconBox, { backgroundColor: roseBg }]}>
                  <Icon name="sliders" size={14} color={accentColor} />
                </View>
                <Text style={[styles.modalTitle, { color: accentColor }]}>
                  {isHi
                    ? 'अवधि के अनुसार फ़िल्टर'
                    : t('accountHistory.filterBy', 'Filter by Date')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                style={[
                  styles.modalCloseBtn,
                  { backgroundColor: subtleBg, borderColor: borderCol },
                ]}
              >
                <Icon name="x" size={14} color={textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptionsList}>
              {FILTERS.map((item, index) => {
                const isSelected = activeFilter === item.id;
                const isLast = index === FILTERS.length - 1;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.modalOption,
                      !isLast && {
                        borderBottomWidth: 1,
                        borderBottomColor: dividerCol,
                      },
                      isSelected && { backgroundColor: roseBg },
                    ]}
                    onPress={() => {
                      setIsFilterModalVisible(false);
                      handleFilterPress(item.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        {
                          color: isSelected ? accentColor : textPrimary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {isHi ? item.labelHi : item.labelEn}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size={15} color={accentColor} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
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
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 10.5,
    marginTop: 1,
  },
  shareHeaderBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
  },
  shareHeaderText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  summaryRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  ribbonCol: {
    flex: 1,
    alignItems: 'center',
  },
  ribbonLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  ribbonVal: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  ribbonDivider: {
    width: 1,
    height: 24,
  },
  controlsWrap: {
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    gap: 7,
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
    height: 38,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderWidth: 1,
    gap: 5,
  },
  filterBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  typePillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  typePillText: {
    fontSize: 11.5,
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardCenter: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 10,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  typeTag: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  emptyCard: {
    marginTop: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 11.5,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionsList: {
    paddingVertical: 2,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  modalOptionText: {
    fontSize: 12,
  },
});

export default AccountHistoryScreen;
