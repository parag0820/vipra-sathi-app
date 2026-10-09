import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { NotificationItem, NotificationType } from '../types/notifications';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import CustomHeader from '../components/CustomHeader';

const NotificationsScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  
  // Use state so we can 'mark all as read'
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    // Depending on the notification type, we could navigate here.
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'festival': return { name: 'star', color: '#F59E0B' }; // Orange
      case 'panchang': return { name: 'sun', color: '#EAB308' }; // Yellow
      case 'subscription': return { name: 'dollar-sign', color: '#DC2626' }; // Red
      case 'community': return { name: 'message-circle', color: '#16A34A' }; // Green
      case 'update': return { name: 'download-cloud', color: '#2563EB' }; // Blue
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const iconConfig = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          { 
            backgroundColor: item.isRead ? colors.background : (isDark ? colors.surface : '#EFF6FF'),
            borderColor: colors.border 
          }
        ]}
        onPress={() => handleNotificationPress(item.id)}
      >
        <View style={styles.contentRow}>
          <View style={[styles.iconContainer, { backgroundColor: iconConfig.color + '15' }]}>
            <Icon name={iconConfig.name as any} size={24} color={iconConfig.color} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.message, { color: colors.textLight }]}>
              {item.message}
            </Text>
            <Text style={[styles.time, { color: colors.textLight }]}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
          
          {!item.isRead && (
            <View style={styles.unreadDot} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader title="Notifications" showBack={true} headerBgColor={colors.primary} headerTextColor="#FFF" />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
      {notifications.some(n => !n.isRead) && (
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.markReadBtn}>
          <Text style={[styles.markReadText, { color: colors.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={48} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>You have no notifications right now.</Text>
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
  markReadBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  markReadText: { fontSize: 14, fontWeight: '600' },
  
  listContainer: { paddingBottom: 40 },
  
  card: {
    padding: 16,
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    marginTop: 6,
  },
  
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  }
});

export default NotificationsScreen;
