import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { generateMockPanchang, PanchangDetails } from '../data/mockPanchang';
import Toast from 'react-native-toast-message';

const PanchangScreen = () => {
  const { colors, isDark } = useTheme();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [panchangData, setPanchangData] = useState<PanchangDetails | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Generate data for the selected date
    const data = generateMockPanchang(currentDate);
    setPanchangData(data);
  }, [currentDate]);

  const goToPreviousDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleSave = () => {
    Toast.show({ type: 'success', text1: 'Saved', text2: 'Panchang details saved to favorites' });
  };

  const handleGeneratePDF = () => {
    Toast.show({ type: 'info', text1: 'Generating PDF', text2: 'Saving Panchang as PDF...' });
  };

  const handleShare = () => {
    Toast.show({ type: 'info', text1: 'Sharing', text2: 'Preparing image to share...' });
  };

  const renderTimingBox = (label: string, time: string, icon: any, color: string) => (
    <View style={styles.timingBox}>
      <Icon name={icon} size={18} color={color} style={{ marginBottom: 2 }} />
      <Text style={[styles.timingLabel, { color: colors.textLight }]}>{label}</Text>
      <Text style={[styles.timingValue, { color: colors.text }]}>{time}</Text>
    </View>
  );

  const renderDataRow = (label: string, value: string) => (
    <View style={[styles.dataRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.dataLabel, { color: colors.textLight }]}>{label}</Text>
      <Text style={[styles.dataValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  if (!panchangData) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Daily Panchang" showBack={true} />

      {/* Date Navigator */}
      <View style={[styles.dateNav, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.navBtn}>
          <Icon name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday} style={styles.dateSelector}>
          <Text style={[styles.dateText, { color: colors.text }]}>{panchangData.date}</Text>
          <Text style={[styles.locationText, { color: colors.textLight }]}>
            <Icon name="map-pin" size={12} /> {panchangData.location}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextDay} style={styles.navBtn}>
          <Icon name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Timings */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.timingsGrid}>
            {renderTimingBox('Sunrise', panchangData.sunrise, 'sunrise', '#F59E0B')}
            {renderTimingBox('Sunset', panchangData.sunset, 'sunset', '#EF4444')}
            {renderTimingBox('Moonrise', panchangData.moonrise, 'moon', '#6366F1')}
            {renderTimingBox('Moonset', panchangData.moonset, 'moon', '#8B5CF6')}
          </View>
        </View>

        {/* Hindu Calendar Details */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Icon name="calendar" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Calendar Details</Text>
          </View>
          {renderDataRow('Vikram Samvat', panchangData.vikramSamvat)}
          {renderDataRow('Shaka Samvat', panchangData.shakaSamvat)}
          {renderDataRow('Gujarati Samvat', panchangData.gujaratiSamvat)}
          {renderDataRow('Amanta Month', panchangData.amantaMonth)}
          {renderDataRow('Purnimanta Month', panchangData.purnimantaMonth)}
        </View>

        {/* Core Panchang */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Icon name="sun" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Daily Panchang</Text>
          </View>
          {renderDataRow('Tithi', panchangData.tithi)}
          {renderDataRow('Paksha', panchangData.paksha)}
          {renderDataRow('Nakshatra', panchangData.nakshatra)}
          {renderDataRow('Yoga', panchangData.yoga)}
          {renderDataRow('Karana', panchangData.karana)}
        </View>

        {/* Astrological Details */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Icon name="compass" size={16} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Astrological Details</Text>
          </View>
          {renderDataRow('Sun Sign (Lagna)', panchangData.sunSign)}
          {renderDataRow('Sun Nakshatra', panchangData.sunNakshatra)}
          {renderDataRow('Moon Nakshatra', panchangData.moonNakshatra)}
        </View>

        {/* Pada / Charan */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Icon name="list" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Pada / Charan Timings</Text>
          </View>
          {panchangData.padaCharan.map((pada, index) => (
            <View key={index} style={[styles.dataRow, { borderBottomColor: index === panchangData.padaCharan.length - 1 ? 'transparent' : colors.border }]}>
              <Text style={[styles.dataLabel, { color: colors.textLight }]}>Pada {pada.pada}</Text>
              <View style={styles.padaRight}>
                <Text style={[styles.padaName, { color: colors.text }]}>{pada.name}</Text>
                <Text style={[styles.padaTime, { color: colors.primary }]}>{pada.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Muhurats & Kaals */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Icon name="clock" size={16} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Auspicious & Inauspicious</Text>
          </View>
          {renderDataRow('Abhijit Muhurat', panchangData.abhijitMuhurat)}
          {renderDataRow('Choghadiya', panchangData.choghadiya)}
          {renderDataRow('Rahu Kaal', panchangData.rahuKaal)}
          {renderDataRow('Yamaganda', panchangData.yamaganda)}
          {renderDataRow('Gulika Kaal', panchangData.gulikaKaal)}
        </View>

        {/* Festivals (if any) */}
        {panchangData.festivals.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Icon name="star" size={16} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Festivals & Vrats</Text>
            </View>
            {panchangData.festivals.map((fest, index) => (
              <Text key={index} style={[styles.festivalText, { color: colors.primary }]}>• {fest}</Text>
            ))}
          </View>
        )}

        {/* Personal Notes */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Icon name="edit-3" size={16} color={colors.textLight} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Personal Notes</Text>
          </View>
          <TextInput
            style={[styles.notesInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Add any specific notes for today..."
            placeholderTextColor={colors.textLight + '80'}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleSave}>
            <Icon name="bookmark" size={20} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleGeneratePDF}>
            <Icon name="file-text" size={20} color={colors.secondary} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={handleShare}>
            <Icon name="share-2" size={20} color="#FFF" />
            <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  navBtn: {
    padding: 8,
  },
  dateSelector: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  timingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timingBox: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginBottom: 8,
  },
  timingLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  timingValue: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  festivalText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  actionBtnText: {
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 13,
  },
  padaRight: {
    alignItems: 'flex-end',
  },
  padaName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  padaTime: {
    fontSize: 11,
    fontWeight: 'bold',
  }
});

export default PanchangScreen;
