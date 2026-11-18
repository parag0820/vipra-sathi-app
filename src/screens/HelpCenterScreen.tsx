import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useTickets } from '../hooks/useTickets';
import { Ticket } from '../types/ticket';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY_MAROON = '#8B1D1D';

const RESOURCES = [
  {
    id: 'faq',
    titleHi: 'सामान्य प्रश्न (FAQ)',
    titleEn: 'Frequently Asked Questions',
    subHi: 'ऐप उपयोग से जुड़े प्रमुख उत्तर',
    subEn: 'Quick answers to common queries',
    icon: 'help-circle' as const,
  },
  {
    id: 'video_kundali',
    titleHi: 'वीडियो गाइड (कुंडली कैसे बनाएँ)',
    titleEn: 'Video Guides (How to Generate Kundali)',
    subHi: 'कुंडली, मिलान और पंचांग मार्गदर्शिका',
    subEn: 'Step-by-step walkthroughs for features',
    icon: 'video' as const,
  },
  {
    id: 'video_payment',
    titleHi: 'भुगतान एवं सदस्यता सहायता',
    titleEn: 'Payment & Subscription Help',
    subHi: 'प्लान अपग्रेड, रिन्यूअल व बिलिंग',
    subEn: 'Plan upgrades, renewal & billing support',
    icon: 'credit-card' as const,
  },
  {
    id: 'contact',
    titleHi: 'सपोर्ट से संपर्क करें',
    titleEn: 'Contact Support',
    subHi: 'सीधे नया सहायता टिकट दर्ज करें',
    subEn: 'Raise a support ticket for direct help',
    icon: 'phone-call' as const,
  },
];

const QUICK_FAQS = [
  {
    qHi: 'ब्रांडेड PDF कैसे डाउनलोड करें?',
    qEn: 'How do I export a branded PDF?',
    aHi: 'व्यक्तिगत ब्रांडिंग सेटिंग में अपना नाम और लोगो सहेजें, फिर सामग्री या कैलकुलेटर से एक्सपोर्ट करें।',
    aEn: 'Save your name and logo in Personal Branding settings, then tap Export from Samagri or Calculator.',
  },
  {
    qHi: 'सपोर्ट टिकट का उत्तर कितने समय में मिलता है?',
    qEn: 'How fast does support reply to a ticket?',
    aHi: 'हमारी टीम सामान्यतः 24 कार्य घंटों के भीतर आपके टिकट की समीक्षा कर उत्तर देती है।',
    aEn: 'Our team typically reviews and responds to support tickets within 24 business hours.',
  },
];

const HelpCenterScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');
  const { tickets, isLoading, refreshTickets } = useTickets();
  const [showFaqs, setShowFaqs] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshTickets();
    }, [refreshTickets]),
  );

  // Flat Maroon/White theme tokens
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : '#FAF7F3';
  const roseBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return {
          color: isDark ? '#34D399' : '#047857',
          bg: isDark ? '#122920' : '#ECFDF5',
          border: isDark ? '#1F4A38' : '#A7F3D0',
        };
      case 'Admin Review':
        return {
          color: isDark ? '#FBBF24' : '#B45309',
          bg: isDark ? '#2D2312' : '#FEF3C7',
          border: isDark ? '#4F3B19' : '#FDE68A',
        };
      case 'Pending':
      default:
        return {
          color: accentColor,
          bg: roseBg,
          border: isDark ? '#5C2424' : '#F2D8D5',
        };
    }
  };

  const handleResourcePress = (id: string) => {
    if (id === 'faq') {
      setShowFaqs((prev) => !prev);
    } else if (id === 'video_payment') {
      navigation.navigate('Subscription' as any);
    } else if (id === 'contact') {
      navigation.navigate('CreateTicket' as any);
    } else if (id === 'video_kundali') {
      navigation.navigate('Kundali' as any);
    }
  };

  const renderTicket = ({ item }: { item: Ticket }) => {
    const statusStyle = getStatusStyle(item.status);
    const categoryLabel =
      typeof item.categoryId === 'object' && item.categoryId !== null
        ? (item.categoryId as any).categoryName
        : item.categoryId;

    return (
      <View
        style={[
          styles.ticketCard,
          { backgroundColor: cardBg, borderColor: borderCol },
        ]}
      >
        <View style={styles.ticketHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: subtleBg, borderColor: borderCol },
            ]}
          >
            <Text style={[styles.ticketCategory, { color: textMuted }]}>
              {categoryLabel || (isHi ? 'सामान्य' : 'General')}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.bg,
                borderColor: statusStyle.border,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.ticketSubject, { color: textPrimary }]}
          numberOfLines={2}
        >
          {item.subject}
        </Text>

        <View style={styles.ticketFooter}>
          <Icon name="calendar" size={12} color={textMuted} />
          <Text style={[styles.ticketDate, { color: textMuted }]}>
            {new Date(item.createdAt).toLocaleDateString(
              isHi ? 'hi-IN' : 'en-IN',
              { day: 'numeric', month: 'short', year: 'numeric' },
            )}
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
              {isHi ? 'सहायता केंद्र' : 'Help Center'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {isHi ? 'मार्गदर्शिका और सपोर्ट टिकट' : 'Guides, FAQs & support tickets'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.78}
          onPress={() => navigation.navigate('CreateTicket' as any)}
          style={[
            styles.newTicketBtn,
            {
              backgroundColor: roseBg,
              borderColor: isDark ? '#5C2424' : '#F2D8D5',
            },
          ]}
        >
          <Icon name="plus" size={14} color={accentColor} />
          <Text style={[styles.newTicketBtnText, { color: accentColor }]}>
            {isHi ? 'नया टिकट' : 'New Ticket'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom, 20) + 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTickets}
            tintColor={accentColor}
            colors={[PRIMARY_MAROON]}
          />
        }
      >
        {/* Support Resources Grouped List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            {isHi ? 'सहायता संसाधन' : 'Support Resources'}
          </Text>

          <View
            style={[
              styles.groupedCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            {RESOURCES.map((item, idx) => {
              const isLast = idx === RESOURCES.length - 1 && !showFaqs;
              return (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleResourcePress(item.id)}
                    style={[
                      styles.resourceRow,
                      !isLast && {
                        borderBottomWidth: 1,
                        borderBottomColor: dividerCol,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.resourceIconBox,
                        { backgroundColor: roseBg },
                      ]}
                    >
                      <Icon name={item.icon} size={17} color={accentColor} />
                    </View>
                    <View style={styles.resourceTextCol}>
                      <Text
                        style={[styles.resourceTitle, { color: textPrimary }]}
                      >
                        {isHi ? item.titleHi : item.titleEn}
                      </Text>
                      <Text
                        style={[styles.resourceSub, { color: textMuted }]}
                        numberOfLines={1}
                      >
                        {isHi ? item.subHi : item.subEn}
                      </Text>
                    </View>
                    <Icon
                      name={
                        item.id === 'faq' && showFaqs
                          ? 'chevron-down'
                          : 'chevron-right'
                      }
                      size={18}
                      color={textMuted}
                    />
                  </TouchableOpacity>

                  {item.id === 'faq' && showFaqs && (
                    <View
                      style={[
                        styles.faqExpandBox,
                        {
                          backgroundColor: subtleBg,
                          borderBottomWidth: 1,
                          borderBottomColor: dividerCol,
                        },
                      ]}
                    >
                      {QUICK_FAQS.map((faq, fIdx) => (
                        <View
                          key={fIdx}
                          style={[
                            styles.faqItem,
                            fIdx < QUICK_FAQS.length - 1 && {
                              borderBottomWidth: 1,
                              borderBottomColor: dividerCol,
                              paddingBottom: 10,
                              marginBottom: 10,
                            },
                          ]}
                        >
                          <Text
                            style={[styles.faqQuestion, { color: accentColor }]}
                          >
                            {isHi ? faq.qHi : faq.qEn}
                          </Text>
                          <Text style={[styles.faqAnswer, { color: textMuted }]}>
                            {isHi ? faq.aHi : faq.aEn}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Support Tickets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary, marginBottom: 0 }]}>
              {isHi ? 'आपके सपोर्ट टिकट' : 'Your Support Tickets'}
            </Text>
            <View
              style={[
                styles.countPill,
                { backgroundColor: subtleBg, borderColor: borderCol },
              ]}
            >
              <Text style={[styles.countPillText, { color: textMuted }]}>
                {tickets.length}
              </Text>
            </View>
          </View>

          {tickets.length === 0 && !isLoading ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              <View
                style={[styles.emptyIconBox, { backgroundColor: roseBg }]}
              >
                <Icon name="message-square" size={24} color={accentColor} />
              </View>
              <Text style={[styles.emptyTitle, { color: textPrimary }]}>
                {isHi ? 'अभी कोई टिकट नहीं है' : 'No Tickets Yet'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: textMuted }]}>
                {isHi
                  ? 'यदि आपका कोई सुझाव, प्रश्न या तकनीकी समस्या है, तो कृपया नया सपोर्ट टिकट दर्ज करें।'
                  : 'If you have any suggestions, issues, or queries, feel free to raise a support ticket.'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.emptyButton}
                onPress={() => navigation.navigate('CreateTicket' as any)}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
                <Text style={styles.emptyButtonText}>
                  {isHi ? 'नया टिकट बनाएँ' : 'Raise a New Ticket'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item._id}
              renderItem={renderTicket}
              scrollEnabled={false}
              contentContainerStyle={styles.ticketsList}
            />
          )}
        </View>
      </ScrollView>
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
  newTicketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
  },
  newTicketBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  countPill: {
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  countPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  groupedCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  resourceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceTextCol: {
    flex: 1,
    marginRight: 8,
  },
  resourceTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  resourceSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  faqExpandBox: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  faqItem: {},
  faqQuestion: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
  },
  ticketsList: {
    gap: 10,
  },
  ticketCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  ticketCategory: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  ticketSubject: {
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 8,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ticketDate: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
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
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PRIMARY_MAROON,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HelpCenterScreen;
