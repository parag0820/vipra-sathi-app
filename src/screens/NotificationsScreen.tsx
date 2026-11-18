import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { NotificationItem, NotificationType } from '../types/notifications';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';

const PRIMARY_MAROON = '#8B1D1D';

type FilterTab = 'all' | 'unread';

const NotificationsScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi' || i18n.language?.startsWith('hi');

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const formatRelativeTime = (isoDate: string) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMins = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMins < 60) {
      return isHi ? `${diffMins} मिनट पहले` : `${diffMins}m ago`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return isHi ? `${diffHours} घंटे पहले` : `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return isHi ? `${diffDays} दिन पहले` : `${diffDays}d ago`;
    }
    return new Date(isoDate).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getNotificationMeta = (type: NotificationType) => {
    switch (type) {
      case 'festival':
        return {
          icon: 'star' as const,
          color: isDark ? '#FBBF24' : '#B45309',
          bg: isDark ? '#2D2312' : '#FEF3C7',
          label: isHi ? 'पर्व / त्यौहार' : 'Festival',
        };
      case 'panchang':
        return {
          icon: 'sun' as const,
          color: isDark ? '#FCA5A5' : PRIMARY_MAROON,
          bg: isDark ? '#2B1B1B' : '#FFF0ED',
          label: isHi ? 'पंचांग' : 'Panchang',
        };
      case 'subscription':
        return {
          icon: 'award' as const,
          color: isDark ? '#F87171' : '#B91C1C',
          bg: isDark ? '#2E1616' : '#FEE2E2',
          label: isHi ? 'सदस्यता' : 'Plan',
        };
      case 'community':
        return {
          icon: 'message-circle' as const,
          color: isDark ? '#34D399' : '#047857',
          bg: isDark ? '#122920' : '#ECFDF5',
          label: isHi ? 'समुदाय' : 'Community',
        };
      case 'update':
      default:
        return {
          icon: 'download-cloud' as const,
          color: isDark ? '#93C5FD' : '#4B5563',
          bg: isDark ? '#1E2530' : '#F3EFEA',
          label: isHi ? 'अपडेट' : 'Update',
        };
    }
  };

  // Theme tokens matching the flat Maroon/White system
  const screenBg = isDark ? '#121212' : '#FDFBF8';
  const headerBg = isDark ? '#161616' : '#FFFFFF';
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const unreadCardBg = isDark ? '#241717' : '#FFF8F6';
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const borderCol = isDark ? '#2D2D2D' : '#EFECE8';
  const dividerCol = isDark ? '#262626' : '#F3EFEA';
  const textPrimary = isDark ? '#F8E6CE' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const meta = getNotificationMeta(item.type);
    const itemTitle = t(`notifications.${item.id}_title`, item.title);
    const itemMessage = t(`notifications.${item.id}_message`, item.message);
    const isUnread = !item.isRead;

    return (
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={() => handleNotificationPress(item.id)}
        style={[
          styles.itemRow,
          {
            backgroundColor: isUnread ? unreadCardBg : cardBg,
            borderColor: isUnread ? (isDark ? '#4A2525' : '#F2D8D5') : borderCol,
          },
        ]}
      >
        {isUnread && (
          <View style={[styles.unreadBar, { backgroundColor: accentColor }]} />
        )}

        <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
          <Icon name={meta.icon} size={18} color={meta.color} />
        </View>

        <View style={styles.itemBody}>
          <View style={styles.metaTopRow}>
            <View
              style={[
                styles.categoryTag,
                {
                  backgroundColor: isDark ? '#252525' : '#FAF7F3',
                  borderColor: borderCol,
                },
              ]}
            >
              <Text style={[styles.categoryTagText, { color: meta.color }]}>
                {meta.label}
              </Text>
            </View>
            <View style={styles.timeWrap}>
              <Text style={[styles.timeText, { color: textMuted }]}>
                {formatRelativeTime(item.createdAt)}
              </Text>
              {isUnread && (
                <View style={[styles.unreadDot, { backgroundColor: accentColor }]} />
              )}
            </View>
          </View>

          <Text
            style={[
              styles.itemTitle,
              {
                color: textPrimary,
                fontWeight: isUnread ? '800' : '600',
              },
            ]}
            numberOfLines={2}
          >
            {itemTitle}
          </Text>

          <Text style={[styles.itemMessage, { color: textMuted }]}>
            {itemMessage}
          </Text>
        </View>
      </TouchableOpacity>
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
            <View style={styles.titleRow}>
              <Text style={[styles.headerTitle, { color: accentColor }]}>
                {t('notifications.title', isHi ? 'सूचनाएँ' : 'Notifications')}
              </Text>
              {unreadCount > 0 && (
                <View
                  style={[
                    styles.unreadPill,
                    {
                      backgroundColor: isDark ? '#2B1B1B' : '#FFF0ED',
                      borderColor: isDark ? '#5C2424' : '#F2D8D5',
                    },
                  ]}
                >
                  <Text style={[styles.unreadPillText, { color: accentColor }]}>
                    {unreadCount} {isHi ? 'नई' : 'new'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.headerSubtitle, { color: textMuted }]}>
              {isHi
                ? 'पर्व, पंचांग, समुदाय और ऐप अपडेट'
                : 'Festivals, Panchang, community & updates'}
            </Text>
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            activeOpacity={0.75}
            style={[
              styles.markAllBtn,
              {
                backgroundColor: isDark ? '#2B1B1B' : '#FFF0ED',
                borderColor: isDark ? '#5C2424' : '#F2D8D5',
              },
            ]}
          >
            <Icon name="check-circle" size={13} color={accentColor} />
            <Text style={[styles.markAllText, { color: accentColor }]}>
              {t('notifications.mark_all_read', isHi ? 'सभी पढ़ें' : 'Mark all')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Panchang-style Underline Filter Tabs */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: headerBg,
            borderBottomColor: borderCol,
          },
        ]}
      >
        {(
          [
            { key: 'all', label: isHi ? 'सभी' : 'All', count: notifications.length },
            { key: 'unread', label: isHi ? 'अपठित' : 'Unread', count: unreadCount },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.75}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabItem,
                isActive && { borderBottomColor: accentColor, borderBottomWidth: 2 },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? accentColor : textMuted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notification Feed */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: cardBg, borderColor: borderCol },
            ]}
          >
            <View
              style={[
                styles.emptyIconBox,
                { backgroundColor: isDark ? '#2B1B1B' : '#FFF0ED' },
              ]}
            >
              <Icon
                name={activeTab === 'unread' ? 'check-circle' : 'bell-off'}
                size={26}
                color={accentColor}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: textPrimary }]}>
              {activeTab === 'unread'
                ? isHi
                  ? 'सभी सूचनाएँ पढ़ी जा चुकी हैं'
                  : 'All caught up!'
                : isHi
                ? 'कोई सूचना नहीं है'
                : 'No notifications yet'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: textMuted }]}>
              {activeTab === 'unread'
                ? isHi
                  ? 'फिलहाल कोई अपठित सूचना शेष नहीं है।'
                  : 'You have no unread notifications right now.'
                : t(
                    'notifications.empty',
                    isHi
                      ? 'नई सूचनाएँ आने पर यहाँ दिखाई देंगी।'
                      : 'You have no notifications right now.',
                  )}
            </Text>
          </View>
        }
      />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  unreadPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
  },
  unreadPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 10.5,
    marginTop: 1,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
  },
  markAllText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tabItem: {
    paddingVertical: 11,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
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
  itemBody: {
    flex: 1,
  },
  metaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryTagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  itemTitle: {
    fontSize: 12.5,
    lineHeight: 19,
    marginBottom: 3,
  },
  itemMessage: {
    fontSize: 11.5,
    lineHeight: 18,
  },
  emptyCard: {
    marginTop: 32,
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 11,
    lineHeight: 19,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
