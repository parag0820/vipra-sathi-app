import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Share,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY_MAROON = '#8B1D1D';

interface AccountTxn {
  id: string;
  title: string;
  party: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  dateLabel: string;
  createdAt: string;
}

const INITIAL_TRANSACTIONS: AccountTxn[] = [
  {
    id: '1',
    title: 'गृह प्रवेश पूजा',
    party: 'शर्मा परिवार',
    category: 'दक्षिणा',
    amount: 8000,
    type: 'income',
    dateLabel: '05 नव',
    createdAt: '2026-11-05T09:30:00Z',
  },
  {
    id: '2',
    title: 'पूजा सामग्री',
    party: '',
    category: 'सामग्री',
    amount: 2500,
    type: 'expense',
    dateLabel: '05 नव',
    createdAt: '2026-11-05T08:15:00Z',
  },
  {
    id: '3',
    title: 'सत्यनारायण पूजा',
    party: 'वर्मा परिवार',
    category: 'दक्षिणा',
    amount: 5000,
    type: 'income',
    dateLabel: '04 नव',
    createdAt: '2026-11-04T11:00:00Z',
  },
  {
    id: '4',
    title: 'यात्रा खर्च',
    party: '',
    category: 'यात्रा',
    amount: 800,
    type: 'expense',
    dateLabel: '04 नव',
    createdAt: '2026-11-04T09:00:00Z',
  },
  {
    id: '5',
    title: 'ज्योतिष परामर्श',
    party: 'अमित गुप्ता',
    category: 'परामर्श',
    amount: 1500,
    type: 'income',
    dateLabel: '03 नव',
    createdAt: '2026-11-03T16:30:00Z',
  },
  {
    id: '6',
    title: 'सहायक की दक्षिणा',
    party: '',
    category: 'सहयोगी भुगतान',
    amount: 2000,
    type: 'expense',
    dateLabel: '03 नव',
    createdAt: '2026-11-03T14:00:00Z',
  },
];

const HI_MONTHS = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
];

const AccountManagerDashboardScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const [periodMode, setPeriodMode] = useState<'this_month' | 'last_month' | 'custom'>('this_month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const [transactions] = useState<AccountTxn[]>(INITIAL_TRANSACTIONS);

  // Derived categories for filter modal
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tr) => set.add(tr.category));
    return ['all', ...Array.from(set)];
  }, [transactions]);

  // Period display label (e.g., 1–30 नवंबर 2026)
  const periodDisplayDate = useMemo(() => {
    const d = new Date(selectedDate);
    if (periodMode === 'last_month') {
      d.setMonth(d.getMonth() - 1);
    }
    return d;
  }, [selectedDate, periodMode]);

  const periodRangeLabel = useMemo(() => {
    if (periodMode === 'custom') {
      return periodDisplayDate.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    const y = periodDisplayDate.getFullYear();
    const m = periodDisplayDate.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    if (isHi) {
      return `1–${lastDay} ${HI_MONTHS[m]} ${y}`;
    }
    const mName = periodDisplayDate.toLocaleDateString('en-IN', { month: 'short' });
    return `1–${lastDay} ${mName} ${y}`;
  }, [periodDisplayDate, periodMode, isHi]);

  const shiftMonth = (delta: number) => {
    const next = new Date(selectedDate);
    next.setMonth(next.getMonth() + delta);
    setSelectedDate(next);
    if (periodMode === 'custom') setPeriodMode('this_month');
  };

  // Totals
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tr) => {
      if (tr.type === 'income') income += tr.amount;
      else expense += tr.amount;
    });
    return { income, expense, net: income - expense };
  }, [transactions]);

  // Filtered & sorted list
  const visibleTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions
      .filter((tr) => {
        const matchesType = typeFilter === 'all' || tr.type === typeFilter;
        const matchesCat = categoryFilter === 'all' || tr.category === categoryFilter;
        const matchesQuery =
          !q ||
          tr.title.toLowerCase().includes(q) ||
          tr.party.toLowerCase().includes(q) ||
          tr.category.toLowerCase().includes(q);
        return matchesType && matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortNewest ? diff : -diff;
      });
  }, [transactions, typeFilter, categoryFilter, searchQuery, sortNewest]);

  const navigateToEntry = (type: 'earning' | 'expense', defaultCategory?: string) => {
    if (type === 'earning') {
      navigation.navigate('EarningEntry', { defaultCategory });
    } else {
      navigation.navigate('ExpenseEntry', { defaultCategory });
    }
  };

  const handleExport = async () => {
    const lines = [
      `${isHi ? 'आय-व्यय विवरण' : 'Income & Expense Summary'} (${periodRangeLabel})`,
      `${isHi ? 'कुल आय' : 'Total Income'}: ₹${totals.income.toLocaleString('en-IN')}`,
      `${isHi ? 'कुल खर्च' : 'Total Expense'}: ₹${totals.expense.toLocaleString('en-IN')}`,
      `${isHi ? 'शुद्ध बचत' : 'Net Balance'}: ₹${totals.net.toLocaleString('en-IN')}`,
      '',
      ...visibleTransactions.map(
        (tr) =>
          `${tr.dateLabel} | ${tr.type === 'income' ? '+' : '-'}₹${tr.amount.toLocaleString('en-IN')} | ${tr.title} (${tr.category})`,
      ),
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      // Ignore user cancel
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

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* Top Header matching reference screenshot */}
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
              {isHi ? 'आय-व्यय' : t('accountManager.title', 'Account Manager')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {isHi ? 'हर आय और खर्च का हिसाब' : 'Track every income and expense'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleExport}
          style={styles.exportBtn}
        >
          <Icon name="download" size={16} color={accentColor} />
          <Text style={[styles.exportBtnText, { color: accentColor }]}>
            {isHi ? 'निर्यात' : 'Export'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Filter Card */}
        <View
          style={[
            styles.periodCard,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          <View style={styles.periodPillsRow}>
            {(
              [
                { key: 'this_month', labelHi: 'इस माह', labelEn: 'This Month' },
                { key: 'last_month', labelHi: 'पिछला माह', labelEn: 'Last Month' },
                { key: 'custom', labelHi: 'तारीख चुनें', labelEn: 'Pick Date' },
              ] as const
            ).map((p) => {
              const active = periodMode === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  activeOpacity={0.75}
                  onPress={() => {
                    setPeriodMode(p.key);
                    if (p.key === 'custom') {
                      setOpenDatePicker(true);
                    }
                  }}
                  style={[
                    styles.periodPill,
                    {
                      backgroundColor: active ? roseBg : 'transparent',
                      borderColor: active ? roseBorder : borderCol,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.periodPillText,
                      {
                        color: active ? accentColor : textPrimary,
                        fontWeight: active ? '700' : '500',
                      },
                    ]}
                  >
                    {isHi ? p.labelHi : p.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.monthNavRow}>
            <TouchableOpacity
              onPress={() => shiftMonth(-1)}
              style={styles.monthArrowBtn}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            >
              <Icon name="chevron-left" size={16} color={accentColor} />
            </TouchableOpacity>
            <Text style={[styles.monthRangeText, { color: textPrimary }]}>
              {periodRangeLabel}
            </Text>
            <TouchableOpacity
              onPress={() => shiftMonth(1)}
              style={styles.monthArrowBtn}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            >
              <Icon name="chevron-right" size={16} color={accentColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Income & Expense 2-Column Metric Cards */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View style={[styles.statCircle, { backgroundColor: greenBg }]}>
              <Icon name="arrow-down" size={15} color={greenText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statLabel, { color: textMuted }]}>
                {isHi ? 'कुल आय' : 'Total Income'}
              </Text>
              <Text
                style={[styles.statValue, { color: greenText }]}
                numberOfLines={1}
              >
                ₹{totals.income.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View style={[styles.statCircle, { backgroundColor: roseBg }]}>
              <Icon name="arrow-up" size={15} color={accentColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statLabel, { color: textMuted }]}>
                {isHi ? 'कुल खर्च' : 'Total Expense'}
              </Text>
              <Text
                style={[styles.statValue, { color: accentColor }]}
                numberOfLines={1}
              >
                ₹{totals.expense.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Net Savings Strip */}
        <View
          style={[
            styles.netStrip,
            { backgroundColor: subtleBg, borderColor: borderCol },
          ]}
        >
          <View>
            <Text style={[styles.netTitle, { color: textPrimary }]}>
              {isHi ? 'शुद्ध बचत' : 'Net Savings'}
            </Text>
            <Text style={[styles.netSubtitle, { color: textMuted }]}>
              {isHi ? 'आय - खर्च' : 'Income - Expense'}
            </Text>
          </View>
          <Text style={[styles.netAmount, { color: accentColor }]}>
            ₹{totals.net.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Primary Add Income / Add Expense Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => navigateToEntry('earning')}
            style={styles.addIncomeBtn}
          >
            <Icon name="plus" size={13} color="#FFFFFF" />
            <Text style={styles.addIncomeBtnText}>
              {isHi ? 'आय जोड़ें' : t('accountManager.addEarning', 'Add Earning')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.78}
            onPress={() => navigateToEntry('expense')}
            style={[
              styles.addExpenseBtn,
              { backgroundColor: cardBg, borderColor: accentColor },
            ]}
          >
            <Icon name="minus" size={13} color={accentColor} />
            <Text style={[styles.addExpenseBtnText, { color: accentColor }]}>
              {isHi ? 'खर्च जोड़ें' : t('accountManager.addExpense', 'Add Expense')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search + Category Filter Row */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          <Icon name="search" size={15} color={textMuted} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              isHi
                ? 'विवरण, यजमान या श्रेणी खोजें'
                : 'Search details, yajman or category'
            }
            placeholderTextColor={textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={14} color={textMuted} />
            </TouchableOpacity>
          )}
          <View style={[styles.searchDivider, { backgroundColor: dividerCol }]} />
          <TouchableOpacity
            onPress={() => setIsCatModalOpen(true)}
            style={styles.searchFilterBtn}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Icon
              name="sliders"
              size={15}
              color={categoryFilter !== 'all' ? accentColor : textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Transactions Section Card */}
        <View
          style={[
            styles.txnCard,
            { backgroundColor: cardBg, borderColor: borderCol },
          ]}
        >
          {/* Card Header */}
          <View style={styles.txnHeaderRow}>
            <Text style={[styles.txnHeading, { color: textPrimary }]}>
              {isHi ? 'लेन-देन' : 'Transactions'}
            </Text>
            <TouchableOpacity
              onPress={() => setSortNewest((prev) => !prev)}
              style={styles.sortToggle}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortText, { color: accentColor }]}>
                {sortNewest
                  ? isHi
                    ? 'नया पहले ↓'
                    : 'Newest ↓'
                  : isHi
                  ? 'पुराना पहले ↑'
                  : 'Oldest ↑'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* All / Income / Expense Filter Pills */}
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
                      backgroundColor: active ? roseBg : 'transparent',
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

          <View style={styles.listSubHeaderRow}>
            <Text style={[styles.countHint, { color: textMuted }]}>
              {isHi
                ? `हाल के ${visibleTransactions.length} लेन-देन`
                : `Recent ${visibleTransactions.length} transactions`}
            </Text>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => navigation.navigate('AccountHistory')}
              style={styles.viewHistoryTopBtn}
              hitSlop={{ top: 6, bottom: 6, left: 8, right: 8 }}
            >
              <Text style={[styles.viewHistoryTopText, { color: accentColor }]}>
                {isHi
                  ? 'सभी लेन-देन देखें →'
                  : `${t('accountManager.viewHistory', 'View History')} →`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Transaction Rows */}
          {visibleTransactions.length === 0 ? (
            <View style={styles.emptyInline}>
              <Text style={[styles.emptyInlineText, { color: textMuted }]}>
                {isHi ? 'कोई लेन-देन नहीं मिला।' : 'No matching transactions found.'}
              </Text>
            </View>
          ) : (
            visibleTransactions.map((item, idx) => {
              const isInc = item.type === 'income';
              const metaText = [item.dateLabel, item.party, item.category]
                .filter(Boolean)
                .join(' • ');

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.72}
                  onPress={() => navigation.navigate('AccountHistory')}
                  style={[
                    styles.txnRow,
                    { borderTopColor: dividerCol },
                    idx === 0 && { borderTopWidth: 1 },
                    idx > 0 && { borderTopWidth: 1 },
                  ]}
                >
                  <View
                    style={[
                      styles.txnCircle,
                      { backgroundColor: isInc ? greenBg : roseBg },
                    ]}
                  >
                    <Icon
                      name={isInc ? 'arrow-down' : 'arrow-up'}
                      size={14}
                      color={isInc ? greenText : accentColor}
                    />
                  </View>

                  <View style={styles.txnInfo}>
                    <Text
                      style={[styles.txnTitle, { color: textPrimary }]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[styles.txnMeta, { color: textMuted }]}
                      numberOfLines={1}
                    >
                      {metaText}
                    </Text>
                  </View>

                  <View style={styles.txnAmountCol}>
                    <Text
                      style={[
                        styles.txnAmount,
                        { color: isInc ? greenText : accentColor },
                      ]}
                    >
                      {isInc ? '+' : '−'}₹{item.amount.toLocaleString('en-IN')}
                    </Text>
                    <Text
                      style={[
                        styles.txnTypeLabel,
                        { color: isInc ? greenText : accentColor },
                      ]}
                    >
                      {isInc ? (isHi ? 'आय' : 'Income') : isHi ? 'खर्च' : 'Expense'}
                    </Text>
                  </View>

                  <Icon
                    name="chevron-right"
                    size={15}
                    color={textMuted}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <DatePicker
        modal
        open={openDatePicker}
        date={selectedDate}
        mode="date"
        theme={isDark ? 'dark' : 'light'}
        onConfirm={(date) => {
          setOpenDatePicker(false);
          setSelectedDate(date);
          setPeriodMode('custom');
        }}
        onCancel={() => setOpenDatePicker(false)}
      />

      {/* Category Filter Modal */}
      <Modal
        visible={isCatModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCatModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsCatModalOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: dividerCol }]}>
              <Text style={[styles.modalTitle, { color: accentColor }]}>
                {isHi ? 'श्रेणी के अनुसार फ़िल्टर' : 'Filter by Category'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsCatModalOpen(false)}
                style={[
                  styles.modalCloseBtn,
                  { backgroundColor: subtleBg, borderColor: borderCol },
                ]}
              >
                <Icon name="x" size={14} color={textMuted} />
              </TouchableOpacity>
            </View>

            {categories.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setCategoryFilter(cat);
                    setIsCatModalOpen(false);
                  }}
                  style={[
                    styles.modalOption,
                    active && { backgroundColor: roseBg, borderColor: roseBorder },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color: active ? accentColor : textPrimary,
                        fontWeight: active ? '700' : '500',
                      },
                    ]}
                  >
                    {cat === 'all' ? (isHi ? 'सभी श्रेणियाँ' : 'All Categories') : cat}
                  </Text>
                  {active && <Icon name="check" size={15} color={accentColor} />}
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
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 10.5,
    marginTop: 1,
  },
  exportBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
  },
  exportBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 10,
  },
  periodCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  periodPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  periodPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodPillText: {
    fontSize: 11.5,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  monthArrowBtn: {
    padding: 4,
  },
  monthRangeText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  statCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15.5,
    fontWeight: '800',
  },
  netStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  netTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  netSubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
  netAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addIncomeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_MAROON,
    height: 34,
    borderRadius: 8,
    gap: 5,
  },
  addIncomeBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  addExpenseBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  addExpenseBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  searchBar: {
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
  searchDivider: {
    width: 1,
    height: 18,
  },
  searchFilterBtn: {
    padding: 4,
  },
  txnCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  txnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  txnHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  sortToggle: {
    paddingVertical: 2,
  },
  sortText: {
    fontSize: 11,
    fontWeight: '600',
  },
  typePillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 8,
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  typePillText: {
    fontSize: 11.5,
  },
  listSubHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  countHint: {
    fontSize: 10.5,
  },
  viewHistoryTopBtn: {
    paddingVertical: 2,
  },
  viewHistoryTopText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  txnCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  txnInfo: {
    flex: 1,
    marginRight: 8,
  },
  txnTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  txnMeta: {
    fontSize: 10.5,
  },
  txnAmountCol: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  txnTypeLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  emptyInline: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyInlineText: {
    fontSize: 11.5,
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
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
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
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  modalOptionText: {
    fontSize: 12,
  },
});

export default AccountManagerDashboardScreen;
