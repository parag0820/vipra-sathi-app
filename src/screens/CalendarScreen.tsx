import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Feather as Icon } from '@expo/vector-icons';
import { CalendarEvent, EventStatus } from '../types/calendar';
import { generateMockCalendarEvents } from '../data/mockCalendar';
import EventModal from '../components/EventModal';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const WARM_BG = '#FDFBF8';
const SUBTLE_CREAM = '#FAF7F3';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

const STATUS_COLORS: Record<EventStatus, string> = {
  upcoming: '#8B1D1D',
  done: '#2563EB',
  cancelled: '#DC2626',
  festival: '#D97706',
};

const STATUS_BG_LIGHT: Record<EventStatus, string> = {
  upcoming: '#FFF0ED',
  done: '#EFF6FF',
  cancelled: '#FEF2F2',
  festival: '#FEF3C7',
};

const STATUS_LABELS_HI: Record<EventStatus, string> = {
  upcoming: 'आगामी',
  done: 'पूर्ण',
  cancelled: 'रद्द',
  festival: 'पर्व',
};

const CalendarScreen = () => {
  const { isDark, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const isHi = i18n.language === 'hi';

  const todayStr = new Date().toISOString().split('T')[0];

  const [events, setEvents] = useState<CalendarEvent[]>(generateMockCalendarEvents());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonth, setCurrentMonth] = useState<string>(todayStr.substring(0, 7));

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const selectedEvents = events.filter(e => e.date === selectedDate);

  const bgScreen = isDark ? '#121212' : WARM_BG;
  const surfaceBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : SUBTLE_CREAM;
  const borderDynamic = isDark ? '#2D2D2D' : CARD_BORDER;
  const dividerDynamic = isDark ? '#2A2A2A' : ROW_DIVIDER;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;

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
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: PRIMARY_MAROON,
        selectedTextColor: '#FFFFFF',
      };
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: PRIMARY_MAROON,
        selectedTextColor: '#FFFFFF',
      };
    }

    return marked;
  }, [events, selectedDate]);

  const monthlyStats = useMemo(() => {
    const monthEvents = events.filter(e => e.date.startsWith(currentMonth));
    const totalBookings = monthEvents.length;
    const busyDays = new Set(monthEvents.map(e => e.date)).size;
    const daysInMonth = new Date(
      parseInt(currentMonth.split('-')[0], 10),
      parseInt(currentMonth.split('-')[1], 10),
      0
    ).getDate();
    const freeDays = daysInMonth - busyDays;

    return { totalBookings, busyDays, freeDays };
  }, [events, currentMonth]);

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map(e => (e.id === editingEvent.id ? { ...e, ...eventData } : e)));
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

  const handleGoToToday = () => {
    const now = new Date().toISOString().split('T')[0];
    setSelectedDate(now);
    setCurrentMonth(now.substring(0, 7));
  };

  const formattedSelectedDate = useMemo(() => {
    const d = new Date(selectedDate + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return selectedDate;
    return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [selectedDate, isHi]);

  return (
    <View style={[styles.mainContainer, { backgroundColor: bgScreen }]}>
      {isFocused && (
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={surfaceBg}
        />
      )}

      {/* Clean White Header matching Reference UI */}
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, 10),
            backgroundColor: surfaceBg,
            borderBottomColor: dividerDynamic,
          },
        ]}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleCol}>
            <Text style={[styles.headerTitle, { color: accentColor }]}>
              {t('tabs.calendar', 'कैलेंडर')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
              {isHi ? 'बुकिंग, कार्य और आयोजन' : 'Bookings, tasks & events'}
            </Text>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={[
                styles.themeIconBtn,
                { backgroundColor: isDark ? '#2B1B1B' : SOFT_ROSE_BG },
              ]}
              onPress={() => setTheme(isDark ? 'light' : 'dark')}
              activeOpacity={0.7}
            >
              <Icon name={isDark ? 'sun' : 'moon'} size={15} color={accentColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.todayBtn,
                { backgroundColor: surfaceBg, borderColor: borderDynamic },
              ]}
              onPress={handleGoToToday}
              activeOpacity={0.75}
            >
              <Text style={[styles.todayBtnText, { color: accentColor }]}>
                {isHi ? 'आज' : 'Today'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addTopBtn,
                {
                  borderColor: accentColor,
                  backgroundColor: isDark ? '#2B1B1B' : SOFT_ROSE_BG,
                },
              ]}
              onPress={openAddModal}
              activeOpacity={0.75}
            >
              <Icon name="plus" size={14} color={accentColor} />
              <Text style={[styles.addTopBtnText, { color: accentColor }]}>
                {isHi ? 'जोड़ें' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Flat Calendar Grid Container */}
        <View
          style={[
            styles.calendarWrapper,
            { backgroundColor: surfaceBg, borderColor: borderDynamic },
          ]}
        >
          <Calendar
            key={`${isDark ? 'dark' : 'light'}-${selectedDate.substring(0, 7)}`}
            current={selectedDate}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            onMonthChange={(month: DateData) =>
              setCurrentMonth(month.dateString.substring(0, 7))
            }
            markingType={'multi-dot'}
            markedDates={markedDates}
            theme={
              {
                calendarBackground: 'transparent',
                textSectionTitleColor: textSecondary,
                dayTextColor: textPrimary,
                todayTextColor: accentColor,
                selectedDayBackgroundColor: PRIMARY_MAROON,
                selectedDayTextColor: '#FFFFFF',
                monthTextColor: textPrimary,
                arrowColor: accentColor,
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 12.5,
                textMonthFontSize: 15,
                textDayHeaderFontSize: 11.5,
                'stylesheet.calendar.header': {
                  header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 8,
                    paddingRight: 8,
                    marginTop: 4,
                    marginBottom: 4,
                    alignItems: 'center',
                  },
                  monthText: {
                    fontSize: 15,
                    fontWeight: '700',
                    color: textPrimary,
                    margin: 4,
                  },
                },
                'stylesheet.day.basic': {
                  base: {
                    width: 30,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                  },
                },
              } as any
            }
            style={styles.calendar}
          />

          {/* Compact Legend Row inside Calendar Footer */}
          <View style={[styles.legendRow, { borderTopColor: dividerDynamic }]}>
            {(['upcoming', 'done', 'festival', 'cancelled'] as EventStatus[]).map(status => (
              <View key={status} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[status] }]} />
                <Text style={[styles.legendLabel, { color: textSecondary }]}>
                  {isHi ? STATUS_LABELS_HI[status] : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Summary — Inline Non-Card Ribbon Strip */}
        <View
          style={[
            styles.summaryRibbon,
            {
              backgroundColor: subtleBg,
              borderTopColor: borderDynamic,
              borderBottomColor: borderDynamic,
            },
          ]}
        >
          <View style={styles.ribbonItem}>
            <View style={[styles.ribbonDot, { backgroundColor: accentColor }]} />
            <Text style={[styles.ribbonLabel, { color: textSecondary }]}>
              {isHi ? 'कुल' : 'Total'}:
            </Text>
            <Text style={[styles.ribbonValue, { color: accentColor }]}>
              {monthlyStats.totalBookings}
            </Text>
          </View>

          <View style={[styles.ribbonSep, { backgroundColor: borderDynamic }]} />

          <View style={styles.ribbonItem}>
            <View style={[styles.ribbonDot, { backgroundColor: '#DC2626' }]} />
            <Text style={[styles.ribbonLabel, { color: textSecondary }]}>
              {isHi ? 'व्यस्त' : 'Busy'}:
            </Text>
            <Text style={[styles.ribbonValue, { color: '#DC2626' }]}>
              {monthlyStats.busyDays}
            </Text>
          </View>

          <View style={[styles.ribbonSep, { backgroundColor: borderDynamic }]} />

          <View style={styles.ribbonItem}>
            <View style={[styles.ribbonDot, { backgroundColor: '#16A34A' }]} />
            <Text style={[styles.ribbonLabel, { color: textSecondary }]}>
              {isHi ? 'खाली' : 'Free'}:
            </Text>
            <Text style={[styles.ribbonValue, { color: '#16A34A' }]}>
              {monthlyStats.freeDays}
            </Text>
          </View>
        </View>

        {/* Selected Date Agenda Header & Clean Schedule Rows */}
        <View style={styles.agendaContainer}>
          <View style={styles.agendaHeaderRow}>
            <Text style={[styles.agendaDateTitle, { color: textPrimary }]} numberOfLines={1}>
              {formattedSelectedDate}
            </Text>
            <Text style={[styles.agendaCountText, { color: textSecondary }]}>
              {selectedEvents.length} {isHi ? 'कार्यक्रम' : selectedEvents.length === 1 ? 'event' : 'events'}
            </Text>
          </View>

          {selectedEvents.length === 0 ? (
            <View
              style={[
                styles.noEventsBox,
                { backgroundColor: surfaceBg, borderColor: borderDynamic },
              ]}
            >
              <Icon name="calendar" size={26} color={textSecondary} />
              <Text style={[styles.noEventsText, { color: textSecondary }]}>
                {isHi ? 'इस दिन कोई कार्यक्रम निर्धारित नहीं है।' : 'No events scheduled for this day.'}
              </Text>
            </View>
          ) : (
            selectedEvents.map(event => {
              const statusColor = STATUS_COLORS[event.status];
              const statusBg = isDark ? '#2B1B1B' : STATUS_BG_LIGHT[event.status];
              return (
                <TouchableOpacity
                  key={event.id}
                  style={[
                    styles.eventRowCard,
                    { backgroundColor: surfaceBg, borderColor: borderDynamic },
                  ]}
                  onPress={() => openEditModal(event)}
                  activeOpacity={0.75}
                >
                  {/* Time Column */}
                  <View style={styles.eventTimeCol}>
                    <Text style={[styles.eventTimeText, { color: textPrimary }]}>
                      {event.time || '--:--'}
                    </Text>
                  </View>

                  {/* Status Dot */}
                  <View style={[styles.eventStatusDot, { backgroundColor: statusColor }]} />

                  {/* Main Details Column */}
                  <View style={styles.eventInfoCol}>
                    <Text style={[styles.eventTitle, { color: textPrimary }]} numberOfLines={1}>
                      {event.title}
                    </Text>

                    {event.yajmanName ? (
                      <View style={styles.eventMetaRow}>
                        <Icon name="user" size={11} color={textSecondary} />
                        <Text style={[styles.eventMetaText, { color: textSecondary }]} numberOfLines={1}>
                          {event.yajmanName}
                          {event.yajmanPhone ? ` • ${event.yajmanPhone}` : ''}
                        </Text>
                      </View>
                    ) : null}

                    {event.description ? (
                      <Text style={[styles.eventDesc, { color: textSecondary }]} numberOfLines={1}>
                        {event.description}
                      </Text>
                    ) : null}
                  </View>

                  {/* Right Status Pill + Chevron */}
                  <View style={styles.eventRightCol}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                      <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                        {isHi ? STATUS_LABELS_HI[event.status] : event.status}
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={15} color={textSecondary} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

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
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addTopBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  calendarWrapper: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  calendar: {
    paddingBottom: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  summaryRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  ribbonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ribbonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ribbonLabel: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  ribbonValue: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  ribbonSep: {
    width: 1,
    height: 16,
  },
  agendaContainer: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  agendaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  agendaDateTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  agendaCountText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  noEventsBox: {
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  noEventsText: {
    fontSize: 11.5,
    fontWeight: '500',
    textAlign: 'center',
  },
  eventRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  eventTimeCol: {
    width: 54,
    marginRight: 8,
  },
  eventTimeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  eventStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 9,
  },
  eventInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  eventMetaText: {
    fontSize: 11,
    flex: 1,
  },
  eventDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  eventRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});

export default CalendarScreen;
