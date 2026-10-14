import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';

const HAWAN_STEPS = [
  { id: '1', titleKey: 'step_1', descKey: 'step_1_desc', icon: 'droplet' },
  { id: '2', titleKey: 'step_2', descKey: 'step_2_desc', icon: 'compass' },
  { id: '3', titleKey: 'step_3', descKey: 'step_3_desc', icon: 'sun' },
  { id: '4', titleKey: 'step_4', descKey: 'step_4_desc', icon: 'star' },
  { id: '5', titleKey: 'step_5', descKey: 'step_5_desc', icon: 'award' },
  { id: '6', titleKey: 'step_6', descKey: 'step_6_desc', icon: 'bell' },
];

const POPULAR_HAWANS = [
  { id: 'h1', titleKey: 'navgrah', descKey: 'navgrah_desc', tag: 'Navgrah' },
  { id: 'h2', titleKey: 'mahamrityunjaya', descKey: 'mahamrityunjaya_desc', tag: 'Arogya' },
  { id: 'h3', titleKey: 'gayatri', descKey: 'gayatri_desc', tag: 'Gayatri' },
  { id: 'h4', titleKey: 'vastu', descKey: 'vastu_desc', tag: 'Vastu' },
  { id: 'h5', titleKey: 'rudra', descKey: 'rudra_desc', tag: 'Shiva' },
  { id: 'h6', titleKey: 'lakshmi', descKey: 'lakshmi_desc', tag: 'Lakshmi' },
];

const HawanScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'vidhi' | 'hawans'>('vidhi');

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title={t('spiritual_hub.hawan_title', 'Hawan')}
        showBack={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
        showThemeToggle={true}
      />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Banner Card */}
          <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.heroRow}>
              <View style={[styles.heroIconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFF0E6' }]}>
                <Image
                  source={require('../assets/images/hawan.png')}
                  style={styles.heroImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.heroTextContent}>
                <Text style={[styles.heroTitle, { color: colors.text }]}>
                  {t('hawan_screen.title', 'Hawan & Yajna Vidhi')}
                </Text>
                <Text style={[styles.heroSubtitle, { color: colors.textLight }]}>
                  {t('hawan_screen.subtitle', 'Complete Vedic procedures, ahuti mantras, and samagri requirements')}
                </Text>
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Samagri')}
                activeOpacity={0.8}
              >
                <Icon name="shopping-bag" size={15} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.ctaButtonText}>
                  {t('hawan_screen.samagri_cta', 'View Hawan Samagri')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ctaButtonOutline, { borderColor: colors.primary }]}
                onPress={() => navigation.navigate('Muhurt')}
                activeOpacity={0.8}
              >
                <Icon name="clock" size={15} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.ctaButtonOutlineText, { color: colors.primary }]}>
                  {t('hawan_screen.muhurat_cta', 'Check Auspicious Muhurat')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Segmented Tabs */}
          <View style={[styles.tabBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'vidhi' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setActiveTab('vidhi')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'vidhi' ? '#FFF' : colors.textLight },
                ]}
              >
                {t('hawan_screen.hawan_steps', 'Standard Hawan Sequence (Vidhi)')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'hawans' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setActiveTab('hawans')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'hawans' ? '#FFF' : colors.textLight },
                ]}
              >
                {t('hawan_screen.popular_hawans', 'Popular Hawans')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab 1: Hawan Sequence (Vidhi) */}
          {activeTab === 'vidhi' && (
            <View style={styles.stepsSection}>
              {HAWAN_STEPS.map((step, idx) => (
                <View
                  key={step.id}
                  style={[
                    styles.stepCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.stepHeaderRow}>
                    <View style={[styles.stepNumberBadge, { backgroundColor: colors.primary }]}>
                      <Icon name={step.icon as any} size={14} color="#FFF" />
                    </View>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>
                      {t(`hawan_screen.${step.titleKey}`)}
                    </Text>
                  </View>
                  <Text style={[styles.stepDesc, { color: colors.textLight }]}>
                    {t(`hawan_screen.${step.descKey}`)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tab 2: Popular Hawans */}
          {activeTab === 'hawans' && (
            <View style={styles.hawansSection}>
              {POPULAR_HAWANS.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.hawanCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.hawanCardTopRow}>
                    <View style={styles.hawanTitleWithTag}>
                      <Text style={[styles.hawanCardTitle, { color: colors.text }]}>
                        {t(`hawan_screen.${item.titleKey}`)}
                      </Text>
                      <View style={[styles.tagBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#FFF0E6' }]}>
                        <Text style={[styles.tagText, { color: colors.primary }]}>
                          {item.tag}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.hawanCardDesc, { color: colors.textLight }]}>
                    {t(`hawan_screen.${item.descKey}`)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 14,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 36,
    height: 36,
  },
  heroTextContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  ctaButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ctaButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.2,
  },
  ctaButtonOutlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    marginBottom: 14,
    gap: 6,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepsSection: {
    gap: 10,
  },
  stepCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  stepDesc: {
    fontSize: 11,
    lineHeight: 18,
    marginLeft: 36,
  },
  hawansSection: {
    gap: 10,
  },
  hawanCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  hawanCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  hawanTitleWithTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  hawanCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  hawanCardDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default HawanScreen;
