import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';

interface PanchangData {
  tithi: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKaal: string;
  gulikaKaal: string;
  festivals: string[];
  vrat: string[];
  holidays: string[];
}

interface Props {
  data: PanchangData;
}

const PanchangWidget: React.FC<Props> = ({ data }) => {
  const { colors, isDark } = useTheme();

  const renderItem = (iconName: string, label: string, value: string, highlight: boolean = false) => (
    <View style={[styles.gridItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Icon name={iconName as any} size={18} color={highlight ? colors.primary : colors.textLight} />
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemLabel, { color: colors.textLight }]}>{label}</Text>
        <Text style={[styles.itemValue, { color: highlight ? colors.primary : colors.text }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="calendar" size={18} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Today's Panchang</Text>
      </View>

      {/* Horizontal Scroll for primary stats */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        {renderItem('sun', 'Tithi', data.tithi, true)}
        {renderItem('alert-circle', 'Rahu Kaal', data.rahuKaal)}
        {renderItem('clock', 'Gulika Kaal', data.gulikaKaal)}
        {renderItem('sunrise', 'Sunrise', data.sunrise)}
        {renderItem('sunset', 'Sunset', data.sunset)}
        {renderItem('moon', 'Moonrise', data.moonrise)}
        {renderItem('moon', 'Moonset', data.moonset)}
      </ScrollView>

      {/* Vertical list for events */}
      <View style={[styles.eventsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {data.festivals.length > 0 && (
          <View style={styles.eventRow}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.eventText, { color: colors.text }]}>Festival: <Text style={{ fontWeight: 'bold' }}>{data.festivals.join(', ')}</Text></Text>
          </View>
        )}
        {data.vrat.length > 0 && (
          <View style={styles.eventRow}>
            <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.eventText, { color: colors.text }]}>Vrat: <Text style={{ fontWeight: 'bold' }}>{data.vrat.join(', ')}</Text></Text>
          </View>
        )}
        {data.holidays.length > 0 && (
          <View style={styles.eventRow}>
            <View style={[styles.dot, { backgroundColor: colors.error }]} />
            <Text style={[styles.eventText, { color: colors.text }]}>Holiday: <Text style={{ fontWeight: 'bold' }}>{data.holidays.join(', ')}</Text></Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scrollRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    width: 140,
  },
  itemTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  itemLabel: {
    fontSize: 11,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  eventsContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  eventText: {
    fontSize: 14,
  }
});

export default PanchangWidget;
