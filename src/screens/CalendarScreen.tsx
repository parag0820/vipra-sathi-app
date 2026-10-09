import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Feather as Icon } from '@expo/vector-icons';
import { CalendarEvent, EventStatus } from '../types/calendar';
import { generateMockCalendarEvents } from '../data/mockCalendar';
import EventModal from '../components/EventModal';
import CustomHeader from '../components/CustomHeader';

const STATUS_COLORS: Record<EventStatus, string> = {
  upcoming: '#16A34A',
  done: '#2563EB',
  cancelled: '#DC2626',
  festival: '#F59E0B',
};

const CalendarScreen = () => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>(generateMockCalendarEvents());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState<string>(new Date().toISOString().split('T')[0].substring(0, 7));

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const selectedEvents = events.filter(e => e.date === selectedDate);

  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};

    events.forEach(event => {
      if (!marked[event.date]) {
        marked[event.date] = { dots: [] };
      }
      marked[event.date].dots.push({
        key: event.id,
        color: STATUS_COLORS[event.status],
      });
    });

    if (marked[selectedDate]) {
      marked[selectedDate] = { ...marked[selectedDate], selected: true, selectedColor: colors.primary + '30' };
    } else {
      marked[selectedDate] = { selected: true, selectedColor: colors.primary + '30' };
    }

    return marked;
  }, [events, selectedDate, colors]);

  const monthlyStats = useMemo(() => {
    const monthEvents = events.filter(e => e.date.startsWith(currentMonth));
    const totalBookings = monthEvents.length;
    const busyDays = new Set(monthEvents.map(e => e.date)).size;
    const daysInMonth = new Date(parseInt(currentMonth.split('-')[0]), parseInt(currentMonth.split('-')[1]), 0).getDate();
    const freeDays = daysInMonth - busyDays;

    return { totalBookings, busyDays, freeDays };
  }, [events, currentMonth]);

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...eventData } : e));
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setModalVisible(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalVisible(true);
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title={t('tabs.calendar', 'Calendar')}
        icon="calendar"
        showThemeToggle={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Calendar Grid */}
          <View style={[styles.calendarWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Calendar
              key={isDark ? 'dark' : 'light'}
              current={selectedDate}
              onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
              onMonthChange={(month: DateData) => setCurrentMonth(month.dateString.substring(0, 7))}
              markingType={'multi-dot'}
              markedDates={markedDates}
              // @ts-ignore
              theme={{
                calendarBackground: 'transparent',
                textSectionTitleColor: colors.textLight,
                dayTextColor: colors.text,
                todayTextColor: colors.primary,
                selectedDayTextColor: colors.primary,
                monthTextColor: colors.text,
                arrowColor: colors.primary,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 12,
                textMonthFontSize: 15,
                textDayHeaderFontSize: 12,
                'stylesheet.calendar.header': {
                  header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: 4,
                    alignItems: 'center'
                  },
                  monthText: {
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: colors.text,
                    margin: 4,
                  }
                },
                'stylesheet.day.basic': {
                  base: {
                    width: 28,
                    height: 28,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }
              }}
              style={styles.calendar}
            />
          </View>

          {/* Monthly Summary */}
          <View style={styles.summaryContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('calendar.monthly_summary', 'Monthly Summary')}</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="calendar" size={16} color={colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: colors.primary }]}>{monthlyStats.totalBookings}</Text>
                <Text style={[styles.statLabel, { color: colors.textLight }]}>Total Events</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#DC2626' + '15' }]}>
                  <Icon name="alert-circle" size={16} color="#DC2626" />
                </View>
                <Text style={[styles.statValue, { color: '#DC2626' }]}>{monthlyStats.busyDays}</Text>
                <Text style={[styles.statLabel, { color: colors.textLight }]}>Busy Days</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#16A34A' + '15' }]}>
                  <Icon name="check-circle" size={16} color="#16A34A" />
                </View>
                <Text style={[styles.statValue, { color: '#16A34A' }]}>{monthlyStats.freeDays}</Text>
                <Text style={[styles.statLabel, { color: colors.textLight }]}>Free Days</Text>
              </View>
            </View>
          </View>

          {/* Selected Day Summary */}
          <View style={styles.summaryContainer}>
            <View style={[styles.daySummaryCard, { backgroundColor: colors.primary }]}>
              <View style={styles.daySummaryContent}>
                <View style={styles.daySummaryIconContainer}>
                  <Icon name="calendar" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.daySummaryDate}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Text>
                  <Text style={styles.daySummaryText}>
                    {selectedEvents.length === 0
                      ? 'No tasks scheduled for this day'
                      : `You have ${selectedEvents.length} task${selectedEvents.length > 1 ? 's' : ''} today`}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Agenda */}
          <View style={styles.agendaContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('calendar.agenda_for', 'Agenda for')} {selectedDate}
            </Text>

            {selectedEvents.length === 0 ? (
              <View style={[styles.noEventsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Icon name="inbox" size={32} color={colors.textLight} />
                <Text style={[styles.noEventsText, { color: colors.textLight }]}>
                  No events scheduled for this day.
                </Text>
              </View>
            ) : (
              selectedEvents.map(event => (
                <TouchableOpacity
                  key={event.id}
                  style={[styles.eventCard, { backgroundColor: colors.surface, borderLeftColor: STATUS_COLORS[event.status] }]}
                  onPress={() => openEditModal(event)}
                  activeOpacity={0.7}
                >
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                    <Text style={[styles.eventTime, { color: colors.textLight }]}>{event.time}</Text>
                  </View>
                  <View style={styles.eventFooter}>
                    <Text style={[styles.eventType, { color: colors.textLight }]}>
                      {event.type.toUpperCase()}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[event.status] + '20' }]}>
                      <Text style={[styles.statusText, { color: STATUS_COLORS[event.status] }]}>
                        {event.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  {event.yajmanName && (
                    <View style={styles.yajmanRow}>
                      <Icon name="user" size={12} color={colors.primary} />
                      <Text style={[styles.yajmanText, { color: colors.primary }]}>{event.yajmanName}</Text>
                      {event.yajmanPhone && (
                        <Text style={[styles.yajmanPhone, { color: colors.textLight }]}>{event.yajmanPhone}</Text>
                      )}
                    </View>
                  )}
                  {event.description && (
                    <Text style={[styles.eventDesc, { color: colors.textLight }]} numberOfLines={2}>
                      {event.description}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={openAddModal}
          activeOpacity={0.9}
        >
          <Icon name="plus" size={24} color="#FFF" />
        </TouchableOpacity>

      </View>
      <EventModal
        visible={modalVisible}
        selectedDate={selectedDate}
        initialData={editingEvent}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  calendarWrapper: {
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  calendar: {
    marginBottom: 0,
  },
  summaryContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  daySummaryCard: {
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: { elevation: 4 },
    }),
  },
  daySummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daySummaryIconContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
  },
  daySummaryDate: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  daySummaryText: {
    color: '#FFF',
    fontSize: 11,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 25,
    height: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '500',
  },
  agendaContainer: {
    paddingHorizontal: 12,
  },
  noEventsCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  noEventsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventCard: {
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  eventTime: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventType: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  eventDesc: {
    fontSize: 11,
    marginTop: 4,
  },
  yajmanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  yajmanText: {
    fontSize: 10,
    fontWeight: '600',
  },
  yajmanPhone: {
    fontSize: 9,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: { elevation: 8 },
    }),
  },
});

export default CalendarScreen;
