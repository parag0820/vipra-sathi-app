import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { MOCK_KUNDALI_RESULT } from '../data/mockKundali';

const { width } = Dimensions.get('window');

const KundaliMatchingResultScreen = () => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const result = MOCK_KUNDALI_RESULT;

  const getScoreColor = (score: number) => {
    if (score >= 28) return '#2E7D32'; // Excellent - Green
    if (score >= 18) return '#F9A825'; // Good - Yellow/Orange
    return '#B71C1C'; // Poor - Red
  };

  const getMatchText = (score: number) => {
    if (score >= 28) return t('kundali_match.excellent', 'Excellent Match');
    if (score >= 18) return t('kundali_match.good', 'Good Match');
    return t('kundali_match.poor', 'Poor Match');
  };

  const scoreColor = getScoreColor(result.totalScore);
  const matchText = getMatchText(result.totalScore);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader title={t('kundali_match.title', 'Kundali Matching')} showBack={true} headerBgColor={colors.primary} headerTextColor="#FFF" />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Couple Profiles */}
          <View style={[styles.coupleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.profileBox}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '15' }]}>
                <Image source={require('../assets/images/groom_avatar.jpg')} style={styles.avatar} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileLabel, { color: isDark ? '#FFF' : colors.primary }]}>{t('kundali_match.groom', 'Groom')}</Text>
                <Text style={[styles.profileName, { color: colors.text }]}>Amit</Text>
                <Text style={[styles.profileDate, { color: colors.textLight }]}>24 Sep 1990</Text>
              </View>
            </View>

            <View style={styles.vsContainer}>
              <View style={[styles.dot, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.profileBox}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '15' }]}>
                <Image source={require('../assets/images/bride_avatar.jpg')} style={styles.avatar} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileLabel, { color: isDark ? '#FFF' : colors.primary }]}>{t('kundali_match.bride', 'Bride')}</Text>
                <Text style={[styles.profileName, { color: colors.text }]}>Priya</Text>
                <Text style={[styles.profileDate, { color: colors.textLight }]}>12 May 1994</Text>
              </View>
            </View>
          </View>

          {/* Semi-Circle Score Gauge */}
          <View style={styles.gaugeSection}>
            <View style={styles.gaugeContainer}>
              {/* Fake Arch for Semi-Circle */}
              <View style={[styles.archOuter, { borderColor: scoreColor }]} />

              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreMainText}>
                  <Text style={[styles.scoreNumberRed, { color: scoreColor }]}>{result.totalScore}</Text>
                  <Text style={[styles.scoreNumberBlack, { color: colors.text }]}> / {result.maxScore}</Text>
                </Text>
                <Text style={[styles.gunaText, { color: colors.text }]}>{t('kundali_match.guna_milan', 'Guna Milan')}</Text>
              </View>
            </View>

            <View style={styles.matchStatusRow}>
              <Icon name="heart" size={16} color={scoreColor} />
              <Text style={[styles.matchStatusText, { color: scoreColor }]}>{matchText}</Text>
            </View>
          </View>

          {/* 8 Kootas Horizontal Scroll */}
          <View style={styles.kootasContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kootasScroll}>
              {result.ashtaKoota.map((koota, index) => (
                <View key={index} style={[styles.kootaBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.kootaScoreText, { color: colors.primary }]}>{koota.obtained}</Text>
                  <Text style={[styles.kootaLabelText, { color: colors.text }]}>{koota.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Special Analysis */}
          <View style={styles.analysisSection}>
            <Text style={[styles.analysisTitle, { color: colors.text }]}>{t('kundali_match.special_analysis', 'Special Analysis')}</Text>

            <View style={[styles.analysisRow, { borderBottomColor: colors.border }]}>
              <View style={styles.analysisLeft}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}><Icon name="arrow-down" size={12} color="#FFF" /></View>
                <Text style={[styles.analysisLabel, { color: colors.text }]}>{t('kundali_match.manglik_groom', 'Manglik Groom')}</Text>
              </View>
              <Text style={[styles.analysisValueGreen, { color: colors.success }]}>{result.manglikGroom}</Text>
            </View>

            <View style={[styles.analysisRow, { borderBottomColor: colors.border }]}>
              <View style={styles.analysisLeft}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}><Icon name="arrow-down" size={12} color="#FFF" /></View>
                <Text style={[styles.analysisLabel, { color: colors.text }]}>{t('kundali_match.manglik_bride', 'Manglik Bride')}</Text>
              </View>
              <Text style={[styles.analysisValueGreen, { color: colors.success }]}>{result.manglikBride}</Text>
            </View>

            <View style={[styles.analysisRow, { borderBottomColor: colors.border }]}>
              <View style={styles.analysisLeft}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}><Icon name="arrow-down" size={12} color="#FFF" /></View>
                <Text style={[styles.analysisLabel, { color: colors.text }]}>{t('kundali_match.for_marriage', 'For Marriage')}</Text>
              </View>
              <Text style={[styles.analysisValueGreen, { color: result.totalScore >= 18 ? colors.success : colors.error }]}>{result.totalScore >= 18 ? t('kundali_match.auspicious', 'Auspicious') : t('kundali_match.inauspicious', 'Inauspicious')}</Text>
            </View>

            {result.observations.map((obs, idx) => (
              <View key={idx} style={[styles.analysisRow, { borderBottomColor: colors.border }, idx === result.observations.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.analysisLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}><Icon name="arrow-down" size={12} color="#FFF" /></View>
                  <Text style={[styles.analysisLabel, { color: colors.text, flex: 1, paddingRight: 10 }]} numberOfLines={2}>{obs}</Text>
                </View>
              </View>
            ))}

          </View>

      </ScrollView>
      </View>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.pdfBtn, { backgroundColor: colors.primary }]}>
          <Icon name="file-text" size={18} color="#FFF" />
          <Text style={styles.pdfBtnText}>{t('kundali_match.detailed_report', 'Detailed Report (PDF)')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.shareBtn, { borderColor: colors.border, backgroundColor: isDark ? colors.surface : '#f0f0f0' }]}>
          <Icon name="share-2" size={18} color={isDark ? '#FFF' : colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for bottom bar
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  coupleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  profileLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginBottom: 2,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  profileDate: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  vsContainer: {
    paddingHorizontal: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  gaugeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 80,
    width: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  archOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#F9A825',
    position: 'absolute',
    top: 0,
  },
  scoreTextContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: -2,
  },
  scoreMainText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumberRed: {
    fontSize: 32,
    fontWeight: '900',
    color: '#B71C1C',
  },
  scoreNumberBlack: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
  },
  gunaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: -4,
  },
  matchStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  matchStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  kootasContainer: {
    marginBottom: 10,
    marginHorizontal: -8,
  },
  kootasScroll: {
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  kootaBox: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 70,
    marginRight: 5,
  },
  kootaScoreText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B71C1C',
    marginBottom: 5,
  },
  kootaLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#424242',
  },
  analysisSection: {
    marginTop: 5,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5d9b4ff',
  },
  analysisLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  analysisLabel: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  analysisValueGreen: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pdfBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#B71C1C',
    paddingVertical: 7,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pdfBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B71C1C',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  }
});

export default KundaliMatchingResultScreen;
