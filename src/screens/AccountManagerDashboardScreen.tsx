import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../components/CustomHeader';
import DatePicker from 'react-native-date-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountManagerDashboardScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // Formatting date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const [dashboardData] = useState({
    monthlyTotal: {
      aaya: 45000,
      kharcha: 12000,
      balance: 33000,
    },
    sourceWise: [
      { id: '1', source: 'Karmkand', amount: 30000, type: 'income', time: '10:30 AM' },
      { id: '2', source: 'Astrology', amount: 15000, type: 'income', time: '11:45 AM' },
      { id: '3', source: 'Travel', amount: 5000, type: 'expense', time: '01:15 PM' },
      { id: '4', source: 'Samagri', amount: 7000, type: 'expense', time: '03:00 PM' },
    ]
  });

  const navigateToEntry = (type: 'earning' | 'expense', defaultCategory?: string) => {
    if (type === 'earning') {
      navigation.navigate('EarningEntry', { defaultCategory });
    } else {
      navigation.navigate('ExpenseEntry', { defaultCategory });
    }
  };

  const quickEntries = [
    { title: 'Dakshina', icon: 'dollar-sign', color: colors.earning, type: 'earning', category: 'Dakshina' },
    { title: 'Other Income', icon: 'plus-circle', color: colors.primary, type: 'earning', category: 'Other Income' },
    { title: 'Travel', icon: 'navigation', color: colors.expense, type: 'expense', category: 'Travel' },
    { title: 'Samagri Expense', icon: 'shopping-cart', color: colors.secondary, type: 'expense', category: 'Samagri' },
  ];

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader title={t('accountManager.title', 'Account Manager')} icon="pie-chart" headerBgColor={colors.primary} headerTextColor="#FFF" />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.container}>

          {/* Date Selector */}
          <TouchableOpacity
            style={[styles.dateSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setOpenDatePicker(true)}
          >
            <Icon name="calendar" size={18} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.primaryDark }]}>{formatDate(selectedDate)}</Text>
            <Icon name="chevron-down" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <DatePicker
            modal
            open={openDatePicker}
            date={selectedDate}
            mode="date"
            onConfirm={(date) => {
              setOpenDatePicker(false);
              setSelectedDate(date);
            }}
            onCancel={() => {
              setOpenDatePicker(false);
            }}
          />

          {/* Summary Card */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.summaryTopRow}>
              <View style={styles.summaryBox}>
                <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Total Income</Text>
                <Text style={[styles.summaryValue, { color: colors.earning }]}>+₹{dashboardData.monthlyTotal.aaya.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryBox}>
                <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Total Expense</Text>
                <Text style={[styles.summaryValue, { color: colors.expense }]}>-₹{dashboardData.monthlyTotal.kharcha.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.balanceContainer}>
              <Text style={[styles.balanceLabel, { color: colors.textLight }]}>Total Balance</Text>
              <Text style={[styles.balanceAmount, { color: colors.primary }]}>₹{dashboardData.monthlyTotal.balance.toLocaleString()}</Text>
            </View>
          </View>

          {/* Quick Entry Buttons */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>{t('accountManager.quickEntry', 'Quick Entry')}</Text>
            <View style={styles.quickEntryGrid}>
              {quickEntries.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickEntryCard, { backgroundColor: colors.surface }]}
                  onPress={() => navigateToEntry(item.type as any, item.category)}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: item.color + '20' }]}>
                    <Icon name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.quickEntryTitle, { color: colors.text, textAlign: 'center' }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* View History Button */}
          <TouchableOpacity
            style={[styles.historyBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('AccountHistory')}
          >
            <Icon name="clock" size={18} color={colors.primary} />
            <Text style={[styles.historyBtnText, { color: colors.primary }]}>{t('accountManager.viewHistory', 'View Full History')}</Text>
            <Icon name="chevron-right" size={18} color={colors.primary} />
          </TouchableOpacity>
          {/* List of Income/Expense */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Income & Expenses</Text>
            <View style={[styles.sourceList, { backgroundColor: colors.surface }]}>
              {dashboardData.sourceWise.map((item, index) => (
                <View key={item.id} style={[styles.sourceItem, index < dashboardData.sourceWise.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                  <View style={styles.sourceInfo}>
                    <Text style={[styles.sourceName, { color: colors.text }]}>{item.source}</Text>
                    <Text style={[styles.sourceTime, { color: colors.textLight }]}>{item.time}</Text>
                  </View>
                  <Text style={[styles.sourceAmount, { color: item.type === 'income' ? colors.earning : colors.expense }]}>
                    {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View style={[styles.bottomActions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.earning }]}
            onPress={() => navigateToEntry('earning')}
          >
            <Icon name="arrow-down-left" size={16} color="#FFF" style={styles.actionIcon} />
            <Text style={styles.actionBtnText}>{t('accountManager.addEarning', 'Add Earning')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.expense }]}
            onPress={() => navigateToEntry('expense')}
          >
            <Icon name="arrow-up-right" size={16} color="#FFF" style={styles.actionIcon} />
            <Text style={styles.actionBtnText}>{t('accountManager.addExpense', 'Add Expense')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 5,
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  balanceContainer: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickEntryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickEntryCard: {
    width: '48%',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickEntryTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  sourceList: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sourceTime: {
    fontSize: 10,
  },
  sourceAmount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    // marginTop: 4,
    marginBottom: 10,
    gap: 8,
  },
  historyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default AccountManagerDashboardScreen;
