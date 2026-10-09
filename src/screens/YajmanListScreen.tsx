import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, RefreshControl, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { useYajmans } from '../hooks/useYajmans';
import { Yajman } from '../types/yajman';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const YajmanListScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { yajmans, isLoading, refreshYajmans, upcomingEvents, deleteYajman } = useYajmans();
  const [yajmanToDelete, setYajmanToDelete] = useState<Yajman | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshYajmans();
    }, [refreshYajmans])
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Astrology': return '#8b5cf6';
      case 'Karmkand': return '#D97706';
      case 'Vaastu': return '#059669';
      case 'Hastrekha': return '#2563EB';
      case 'Puja Path': return '#B5451B';
      case 'Jyotish': return '#7C3AED';
      case 'Vastu Consulting': return '#0D9488';
      case 'Hastarekha': return '#2563EB';
      case 'Numerology': return '#DC2626';
      case 'Tarot': return '#9333EA';
      default: return '#6B7280';
    }
  };

  const renderUpcomingEvent = ({ item }: { item: any }) => (
    <View style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.eventIconContainer}>
        <Icon
          name={item.type === 'birthday' ? 'gift' : item.type === 'anniversary' ? 'heart' : 'calendar'}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.eventInfo}>
        <Text style={[styles.eventName, { color: colors.text }]} numberOfLines={1}>{item.yajmanName}</Text>
        <Text style={[styles.eventTitle, { color: colors.textLight }]}>{item.title}</Text>
        <Text style={[styles.eventDays, { color: item.daysRemaining === 0 ? '#ef4444' : colors.primary }]}>
          {item.daysRemaining === 0 ? 'Today!' : `In ${item.daysRemaining} days`}
        </Text>
      </View>
    </View>
  );

  const renderYajmanCard = ({ item }: { item: Yajman }) => (
    <TouchableOpacity
      style={[styles.yajmanCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('YajmanDetail', { yajman: item })}
      onLongPress={() => setYajmanToDelete(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={[styles.yajmanName, { color: colors.text }]}>{item.name}</Text>
            {item.city ? <Text style={[styles.yajmanCity, { color: colors.textLight }]}>{item.city}</Text> : null}
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 6 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('YajmanForm', { yajman: item })}
              style={{ padding: 4 }}
            >
              <Icon name="edit-2" size={18} color={colors.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setYajmanToDelete(item)}
              style={{ padding: 4 }}
            >
              <Icon name="trash-2" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>{item.category}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contactRow}>
        <View style={styles.contactItem}>
          <Icon name="phone" size={14} color={colors.textLight} />
          <Text style={[styles.contactText, { color: colors.textLight }]}>{item.callingMobile}</Text>
        </View>
        {item.whatsappMobile && (
          <View style={styles.contactItem}>
            <Icon name="message-circle" size={14} color="#25D366" />
            <Text style={[styles.contactText, { color: colors.textLight }]}>{item.whatsappMobile}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title="Yajman Manager"
        icon="users"
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />

      <View style={[styles.mainCard, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
        <ScrollView
          style={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshYajmans} tintColor={colors.primary} />}
        >
          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Events ({upcomingEvents.length})</Text>
              <FlatList
                data={upcomingEvents}
                keyExtractor={(item) => item.id}
                renderItem={renderUpcomingEvent}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.eventsList}
              />
            </View>
          )}

          {/* All Yajmans List */}
          <View style={[styles.section, styles.listSection]}>
            <View style={styles.listHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>All Yajmans ({yajmans.length})</Text>
            </View>

            {yajmans.length === 0 && !isLoading ? (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIconContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Icon name="users" size={40} color={colors.textLight} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Yajmans Yet</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>
                  Add your clients to easily manage their details and receive reminders for important dates.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('YajmanForm', {})}
                >
                  <Icon name="plus" size={20} color="#FFF" style={styles.emptyButtonIcon} />
                  <Text style={styles.emptyButtonText}>Add New Yajman</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={yajmans}
                keyExtractor={(item) => item.id}
                renderItem={renderYajmanCard}
                scrollEnabled={false} // Since it's inside a ScrollView
                contentContainerStyle={styles.yajmanList}
              />
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        {yajmans.length > 0 && (
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary, bottom: Math.max(insets.bottom + 24, 24) }]}
            onPress={() => navigation.navigate('YajmanForm', {})}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Modern Delete Modal */}
        <Modal
          visible={!!yajmanToDelete}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setYajmanToDelete(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <View style={[styles.modalIconContainer, { backgroundColor: '#fee2e2' }]}>
                <Icon name="alert-triangle" size={28} color="#ef4444" />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Yajman?</Text>
              <Text style={[styles.modalMessage, { color: colors.textLight }]}>
                Are you sure you want to remove <Text style={{ fontWeight: 'bold', color: colors.text }}>{yajmanToDelete?.name}</Text>? This action cannot be undone.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalCancelBtn, { borderColor: colors.border }]}
                  onPress={() => setYajmanToDelete(null)}
                >
                  <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalDeleteBtn]}
                  onPress={async () => {
                    if (yajmanToDelete) {
                      await deleteYajman(yajmanToDelete.id);
                      setYajmanToDelete(null);
                    }
                  }}
                >
                  <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F8E6CE', // Default fallback
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  listSection: {
    paddingHorizontal: 16,
    paddingBottom: 20, // Reduced from 80 for better bottom spacing
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  eventDays: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  yajmanList: {
    gap: 12,
  },
  yajmanCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  yajmanName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  yajmanCity: {
    fontSize: 13,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 6,
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonIcon: {
    marginRight: 8,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtn: {
    borderWidth: 1,
  },
  modalDeleteBtn: {
    backgroundColor: '#ef4444',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '600',
  }
});

export default YajmanListScreen;
