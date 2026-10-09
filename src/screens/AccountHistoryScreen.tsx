import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Modal, Pressable, Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../components/CustomHeader';

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

  // Today's data
  data.push({ id: '1', type: 'income', category: 'Dakshina', source: 'Ramesh Sharma', amount: 5100, date: now.toISOString(), remark: 'Satyanarayan Katha' });
  data.push({ id: '2', type: 'expense', category: 'Travel', source: 'Uber', amount: 350, date: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), remark: 'Travel to client' });

  // This Month's data (2 days ago)
  const twoDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2);
  data.push({ id: '3', type: 'income', category: 'Astrology', source: 'Kiran Patel', amount: 2100, date: twoDaysAgo.toISOString() });
  data.push({ id: '4', type: 'expense', category: 'Samagri', source: 'Pooja Store', amount: 1500, date: twoDaysAgo.toISOString() });

  // This Year's data (2 months ago)
  const twoMonthsAgo = new Date(now.setMonth(now.getMonth() - 2));
  data.push({ id: '5', type: 'income', category: 'Karmkand', source: 'Joshi Family', amount: 11000, date: twoMonthsAgo.toISOString() });
  data.push({ id: '6', type: 'income', category: 'Jyotish Consultation', source: 'Sunil Verma', amount: 5000, date: twoMonthsAgo.toISOString() });

  // Last Year's data
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  data.push({ id: '7', type: 'income', category: 'Dakshina', source: 'Annual Pooja', amount: 25000, date: lastYear.toISOString() });

  return data;
};

const MOCK_TRANSACTIONS = generateMockData();

const FILTERS = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
  { id: 'custom', label: 'Custom Date' }
];

const AccountHistoryScreen = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [activeFilter, setActiveFilter] = useState('all');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const tDate = new Date(t.date);
      const now = new Date();

      if (activeFilter === 'today') {
        return tDate.toDateString() === now.toDateString();
      }
      if (activeFilter === 'month') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }
      if (activeFilter === 'year') {
        return tDate.getFullYear() === now.getFullYear();
      }
      if (activeFilter === 'custom' && customDate) {
        return tDate.toDateString() === customDate.toDateString();
      }
      return true; // 'all' or 'custom' with no date
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeFilter, customDate]);

  const handleFilterPress = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === 'custom') {
      setIsDatePickerOpen(true);
    }
  };

  const handleShare = async () => {
    try {
      if (filteredTransactions.length === 0) {
        Alert.alert(t('accountHistory.noDataTitle', 'No Data'), t('accountHistory.noDataMsg', 'There are no transactions to share.'));
        return;
      }

      let message = `${t('accountHistory.reportTitle', 'Account History Report')}\n`;
      message += `Period: ${FILTERS.find(f => f.id === activeFilter)?.label}\n\n`;

      let totalIncome = 0;
      let totalExpense = 0;

      filteredTransactions.forEach((t) => {
        if (t.type === 'income') totalIncome += t.amount;
        else totalExpense += t.amount;

        const dateObj = new Date(t.date);
        const dateStr = dateObj.toLocaleDateString();

        message += `[${dateStr}] ${t.type === 'income' ? '+' : '-'}₹${t.amount} - ${t.category} (${t.source})\n`;
        if (t.remark) message += `   Note: ${t.remark}\n`;
      });

      message += `\nSummary:\n`;
      message += `Total Income: ₹${totalIncome}\n`;
      message += `Total Expense: ₹${totalExpense}\n`;
      message += `Net Balance: ₹${totalIncome - totalExpense}\n`;

      await Share.share({
        message,
        title: 'Account History',
      });
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    const amountColor = isIncome ? colors.earning : colors.expense;
    const iconName = isIncome ? 'arrow-down-left' : 'arrow-up-right';
    const dateObj = new Date(item.date);

    return (
      <View style={[styles.transactionCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.iconWrapper, { backgroundColor: amountColor + '15' }]}>
          <Icon name={iconName} size={18} color={amountColor} />
        </View>
        <View style={styles.cardCenter}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.category}</Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]} numberOfLines={1}>{item.source}</Text>
          <Text style={[styles.dateText, { color: colors.textLight }]}>
            {dateObj.toLocaleDateString()} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {isIncome ? '+' : '-'}₹{item.amount.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkHeader || colors.primary} />
      <CustomHeader title={t('accountHistory.title', 'Transaction History')} showBack={true} />

      {/* Filter Header */}
      <View style={styles.filterHeader}>
        <View style={styles.activeFilterBox}>
          <Icon name="calendar" size={16} color={colors.textLight} />
          <Text style={[styles.activeFilterText, { color: colors.text }]}>
            {FILTERS.find(f => f.id === activeFilter)?.label}
            {activeFilter === 'custom' && customDate ? ` (${customDate.toLocaleDateString()})` : ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.primary + '15' }]}
            onPress={handleShare}
          >
            <Icon name="share-2" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, { backgroundColor: colors.primary + '15' }]}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Icon name="sliders" size={16} color={colors.primary} />
            <Text style={[styles.filterBtnText, { color: colors.primary }]}>{t('accountHistory.filter', 'Filter')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={[styles.listContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-text" size={48} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              {t('accountHistory.noData', 'No transactions found for this period.')}
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

      {/* Filter Modal */}
      <Modal visible={isFilterModalVisible} transparent animationType="slide">
        <SafeAreaView style={styles.modalOverlay} edges={['bottom']}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsFilterModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('accountHistory.filterBy', 'Filter by Date')}</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Icon name="x" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            {FILTERS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.modalOption, activeFilter === item.id && { backgroundColor: colors.primary + '15' }]}
                onPress={() => {
                  setIsFilterModalVisible(false);
                  handleFilterPress(item.id);
                }}
              >
                <Text style={[styles.modalOptionText, { color: activeFilter === item.id ? colors.primary : colors.text }]}>
                  {item.label}
                </Text>
                {activeFilter === item.id && <Icon name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activeFilterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  iconBtn: {
    width: 26,
    height: 26,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardCenter: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 11,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
  }
});

export default AccountHistoryScreen;
