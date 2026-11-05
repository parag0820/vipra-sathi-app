import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather as Icon } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import VedicChart from '../components/VedicChart';

const { width } = Dimensions.get('window');

const PRIMARY_MAROON = '#8B1D1D';
const BORDER_COLOR = '#E5E7EB';
const MUTED_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const ACCENT_GREEN = '#16A34A';
const ACCENT_AMBER = '#D97706';
const HEADER_BG = '#FAF5EE';

interface AshtaKootaRow {
  id: number;
  name: string;
  max: number;
  obtained: number;
  status: 'पूर्ण' | 'आंशिक' | 'शून्य';
  statusColor: string;
}

const KOOTA_DATA: AshtaKootaRow[] = [
  { id: 1, name: 'वर्ण', max: 1, obtained: 1, status: 'पूर्ण', statusColor: ACCENT_GREEN },
  { id: 2, name: 'वश्य', max: 2, obtained: 1, status: 'आंशिक', statusColor: ACCENT_AMBER },
  { id: 3, name: 'तारा', max: 3, obtained: 3, status: 'पूर्ण', statusColor: ACCENT_GREEN },
  { id: 4, name: 'योनि', max: 4, obtained: 3, status: 'आंशिक', statusColor: ACCENT_AMBER },
  { id: 5, name: 'ग्रह मैत्री', max: 5, obtained: 4, status: 'आंशिक', statusColor: ACCENT_AMBER },
  { id: 6, name: 'गण', max: 6, obtained: 1, status: 'आंशिक', statusColor: ACCENT_AMBER },
  { id: 7, name: 'भकूट', max: 7, obtained: 7, status: 'पूर्ण', statusColor: ACCENT_GREEN },
  { id: 8, name: 'नाड़ी', max: 8, obtained: 8, status: 'पूर्ण', statusColor: ACCENT_GREEN },
];

const VADHU_PLANETS = [
  { name: 'Su', house: 6 },
  { name: 'Mo', house: 11 },
  { name: 'Ma', house: 9 },
  { name: 'Me', house: 7 },
  { name: 'Ju', house: 5 },
  { name: 'Ve', house: 8 },
  { name: 'Sa', house: 6 },
  { name: 'Ra', house: 10 },
  { name: 'Ke', house: 4 },
];

const VAR_PLANETS = [
  { name: 'Su', house: 2 },
  { name: 'Mo', house: 2 },
  { name: 'Ma', house: 2 },
  { name: 'Me', house: 1 },
  { name: 'Ju', house: 1 },
  { name: 'Ve', house: 3 },
  { name: 'Sa', house: 4 },
  { name: 'Ra', house: 10 },
  { name: 'Ke', house: 4 },
];

type KundaliMatchingResultRouteProp = RouteProp<RootStackParamList, 'KundaliMatchingResult'>;

const KundaliMatchingResultScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<KundaliMatchingResultRouteProp>();
  const { isDark } = useTheme();

  // Active Tab: 'guna' | 'chart' | 'analysis'
  const [activeTab, setActiveTab] = useState<'guna' | 'chart' | 'analysis'>('guna');

  // Accordion open states
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Chart sub-toggle (Person & Chart Type)
  const [chartPerson, setChartPerson] = useState<'bride' | 'groom'>('groom');
  const [chartType, setChartType] = useState<'lagna' | 'navamsha'>('lagna');

  const [isExporting, setIsExporting] = useState(false);

  // Extracted or fallback details
  const brideDetails = {
    name: route.params?.brideDetails?.name || 'अनन्या शर्मा',
    dob: route.params?.brideDetails?.dob || '12 मई 1998',
    tob: route.params?.brideDetails?.tob || '08:30 AM',
    place: route.params?.brideDetails?.place || 'वाराणसी, उत्तर प्रदेश, भारत',
  };

  const groomDetails = {
    name: route.params?.groomDetails?.name || 'आदित्य मिश्रा',
    dob: route.params?.groomDetails?.dob || '18 जनवरी 1996',
    tob: route.params?.groomDetails?.tob || '06:45 AM',
    place: route.params?.groomDetails?.place || 'प्रयागराज, उत्तर प्रदेश, भारत',
  };

  const toggleAccordion = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  // Share summary as text via WhatsApp / native share
  const handleShare = async () => {
    try {
      const message = `🕉️ *विप्र साथी - कुंडली मिलान परिणाम* 🕉️\n\n` +
        `👰 *वधू:* ${brideDetails.name}\n` +
        `📅 जन्म: ${brideDetails.dob} • ${brideDetails.tob}\n` +
        `📍 स्थान: ${brideDetails.place}\n\n` +
        `🤵 *वर:* ${groomDetails.name}\n` +
        `📅 जन्म: ${groomDetails.dob} • ${groomDetails.tob}\n` +
        `📍 स्थान: ${groomDetails.place}\n\n` +
        `--------------------------------\n` +
        `📊 *कुल गुण:* 28 / 36 (उत्तम मिलान)\n` +
        `💫 *मांगलिक विचार:* परिहार उपरांत अनुकूल\n` +
        `🌿 *नाड़ी मिलान:* 8 / 8 (पूर्ण - उत्तम संतति व स्वास्थ्य)\n` +
        `💖 *भकूट मिलान:* 7 / 7 (पूर्ण - दांपत्य सुख व सामंजस्य)\n` +
        `--------------------------------\n` +
        `✅ *निष्कर्ष:* विवाह हेतु संबंध अत्यंत शुभ एवं प्रशस्त है।\n\n` +
        `_विप्र साथी ऐप द्वारा प्रमाणित_`;

      await Share.share({ message });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  // Export PDF Report with Branding
  const handleExportPdf = async () => {
    try {
      setIsExporting(true);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>कुंडली मिलान परिणाम</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827; padding: 24px; margin: 0; background: #fff; }
            .header { text-align: center; border-bottom: 2px solid #8B1D1D; padding-bottom: 12px; margin-bottom: 16px; }
            .header h1 { color: #8B1D1D; font-size: 22px; margin: 0 0 4px 0; }
            .header p { color: #6B7280; font-size: 12px; margin: 0; }
            .couple-card { display: flex; justify-content: space-between; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; margin-bottom: 16px; background: #FAF5EE; }
            .couple-col { width: 48%; }
            .couple-col h3 { color: #8B1D1D; font-size: 14px; margin: 0 0 4px 0; }
            .couple-col p { font-size: 11px; margin: 2px 0; color: #374151; }
            .score-box { background: #8B1D1D; color: #fff; border-radius: 8px; padding: 14px; text-align: center; margin-bottom: 16px; }
            .score-box h2 { font-size: 28px; margin: 0; }
            .score-box p { font-size: 13px; margin: 4px 0 0 0; opacity: 0.9; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
            th { background: #FAF5EE; color: #4B5563; padding: 8px; text-align: center; border: 1px solid #E5E7EB; }
            th.left { text-align: left; }
            td { padding: 8px; text-align: center; border: 1px solid #E5E7EB; }
            td.left { text-align: left; font-weight: 600; }
            .total-row { background: #FAF5EE; font-weight: bold; }
            .section-title { color: #8B1D1D; font-size: 14px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; margin: 16px 0 8px 0; }
            .obs-item { font-size: 11px; color: #374151; margin-bottom: 6px; line-height: 1.4; }
            .footer { text-align: center; margin-top: 24px; padding-top: 12px; border-top: 1px dashed #D1D5DB; font-size: 10px; color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🕉️ विप्र साथी • कुंडली मिलान विवरण 🕉️</h1>
            <p>पारंपरिक अष्टकूट गुण मिलान एवं ज्योतिषीय विश्लेषण रिपोर्ट</p>
          </div>

          <div class="couple-card">
            <div class="couple-col">
              <h3>वधू: ${brideDetails.name}</h3>
              <p><strong>जन्म:</strong> ${brideDetails.dob} • ${brideDetails.tob}</p>
              <p><strong>स्थान:</strong> ${brideDetails.place}</p>
            </div>
            <div class="couple-col" style="text-align: right;">
              <h3>वर: ${groomDetails.name}</h3>
              <p><strong>जन्म:</strong> ${groomDetails.dob} • ${groomDetails.tob}</p>
              <p><strong>स्थान:</strong> ${groomDetails.place}</p>
            </div>
          </div>

          <div class="score-box">
            <h2>28 / 36</h2>
            <p>कुल अष्टकूट गुण • उत्तम मिलान (77.8%)</p>
          </div>

          <h3 class="section-title">अष्टकूट विवरण (AshtaKoota Details)</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 30px;">#</th>
                <th class="left">कूट का नाम</th>
                <th style="width: 70px;">अधिकतम</th>
                <th style="width: 70px;">प्राप्त</th>
                <th style="width: 80px;">स्थिति</th>
              </tr>
            </thead>
            <tbody>
              ${KOOTA_DATA.map(
                (row) => `
                <tr>
                  <td>${row.id}</td>
                  <td class="left">${row.name}</td>
                  <td>${row.max}</td>
                  <td>${row.obtained}</td>
                  <td style="color: ${row.statusColor}; font-weight: bold;">${row.status}</td>
                </tr>`
              ).join('')}
              <tr class="total-row">
                <td colspan="2" class="left" style="padding-left: 14px;">कुल गुण</td>
                <td>36</td>
                <td style="color: #8B1D1D; font-weight: bold;">28</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>

          <h3 class="section-title">महत्वपूर्ण ज्योतिषीय निष्कर्ष (Astrological Observations)</h3>
          <div class="obs-item">• <strong>नाड़ी मिलान:</strong> 8/8 पूर्ण अंक प्राप्त होने से वंश वृद्धि, संतान सुख एवं स्वास्थ्य उत्तम रहेगा।</div>
          <div class="obs-item">• <strong>भकूट मिलान:</strong> 7/7 पूर्ण अंक प्राप्त होने से दांपत्य जीवन में परस्पर सौहार्द, प्रेम और समृद्धि रहेगी।</div>
          <div class="obs-item">• <strong>मांगलिक दोष विचार:</strong> वर निर्दोष है तथा वधू की कुंडली में आंशिक मंगल दोष का परिहार ग्रहों की शुभ दृष्टि से हो रहा है।</div>
          <div class="obs-item">• <strong>अंतिम अनुशंसा:</strong> कुल 28 गुण प्राप्त होने के कारण यह संबंध विवाह हेतु अत्यंत शुभ एवं मंगलकारी है।</div>

          <div class="footer">
            <p>यह रिपोर्ट विप्र साथी (VipraSathi) ज्योतिषीय प्रणाली द्वारा आपकी प्रामाणिक ब्रांडिंग के साथ उत्पन्न की गई है।</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Failed to generate or share PDF', error);
      Alert.alert('PDF Export', 'पीडीएफ रिपोर्ट तैयार करने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setIsExporting(false);
    }
  };

  const currentPlanets = chartPerson === 'bride' ? VADHU_PLANETS : VAR_PLANETS;
  const chartSize = Math.min(width - 56, 300);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#121212' : '#FFFFFF'} />

      {/* Top Header Bar */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="chevron-left" size={26} color={PRIMARY_MAROON} />
          </TouchableOpacity>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerTitle}>मिलान परिणाम</Text>
            <Text style={styles.headerSubtitle}>डेमो परिणाम • वास्तविक ज्योतिष गणना नहीं</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.changeDetailsBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="edit-2" size={13} color={PRIMARY_MAROON} style={styles.editIcon} />
          <Text style={styles.changeDetailsText}>विवरण बदलें</Text>
        </TouchableOpacity>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stepper Indicator */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepCircleInactive}>
              <Text style={styles.stepNumberInactive}>1</Text>
            </View>
            <Text style={styles.stepLabelInactive}>जन्म विवरण</Text>
          </View>

          <View style={styles.stepDividerLine} />

          <View style={styles.stepItem}>
            <View style={styles.stepCircleActive}>
              <Text style={styles.stepNumberActive}>2</Text>
            </View>
            <Text style={styles.stepLabelActive}>मिलान परिणाम</Text>
          </View>
        </View>

        {/* Couple Profile Card (वधू / वर Details & Images) */}
        <View style={[styles.coupleCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {/* Vadhu Column */}
          <View style={styles.coupleCol}>
            <View style={styles.profileHeaderRow}>
              <Image source={require('../assets/images/bride_avatar.jpg')} style={styles.avatarImg} />
              <View style={styles.profileNameWrap}>
                <Text style={styles.profileLabel}>वधू</Text>
                <Text style={[styles.profileName, { color: isDark ? '#F8E6CE' : DARK_TEXT }]} numberOfLines={1}>
                  {brideDetails.name}
                </Text>
              </View>
            </View>
            <Text style={styles.profileDateText} numberOfLines={1}>
              {brideDetails.dob}  •  {brideDetails.tob}
            </Text>
            <Text style={styles.profilePlaceText} numberOfLines={1}>
              {brideDetails.place}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.coupleColDivider} />

          {/* Var Column */}
          <View style={styles.coupleCol}>
            <View style={styles.profileHeaderRow}>
              <Image source={require('../assets/images/groom_avatar.jpg')} style={styles.avatarImg} />
              <View style={styles.profileNameWrap}>
                <Text style={styles.profileLabel}>वर</Text>
                <Text style={[styles.profileName, { color: isDark ? '#F8E6CE' : DARK_TEXT }]} numberOfLines={1}>
                  {groomDetails.name}
                </Text>
              </View>
            </View>
            <Text style={styles.profileDateText} numberOfLines={1}>
              {groomDetails.dob}  •  {groomDetails.tob}
            </Text>
            <Text style={styles.profilePlaceText} numberOfLines={1}>
              {groomDetails.place}
            </Text>
          </View>
        </View>

        {/* 3 Segmented Tabs */}
        <View style={[styles.segmentedTabsWrap, { backgroundColor: isDark ? '#262626' : '#F9FAFB' }]}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'guna' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('guna')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentBtnText, activeTab === 'guna' && styles.segmentBtnTextActive]}>
              गुण मिलान
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'chart' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('chart')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentBtnText, activeTab === 'chart' && styles.segmentBtnTextActive]}>
              ग्रह एवं कुंडली
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'analysis' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('analysis')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentBtnText, activeTab === 'analysis' && styles.segmentBtnTextActive]}>
              विस्तृत विश्लेषण
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: गुण मिलान */}
        {activeTab === 'guna' && (
          <View>
            {/* Score Box (कुल गुण) */}
            <View style={[styles.scoreCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <View style={styles.scoreRow}>
                <View>
                  <Text style={[styles.scoreTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>कुल गुण</Text>
                  <Text style={styles.scoreSubtitle}>अष्टकूट गुण योग</Text>
                </View>
                <Text style={styles.scoreValue}>28 / 36</Text>
              </View>
              <View style={styles.scoreDisclaimerWrap}>
                <Text style={styles.scoreDisclaimerText}>
                  यह केवल पारंपरिक अष्टकूट मिलान पर आधारित गणना है। यह किसी भी प्रकार का वैवाहिक निर्णय या सफलता का दावा नहीं है।
                </Text>
              </View>
            </View>

            {/* AshtaKoota Table (अष्टकूट विवरण) */}
            <Text style={[styles.sectionHeading, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>अष्टकूट विवरण</Text>
            <View style={[styles.tableCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              {/* Table Header */}
              <View style={[styles.tableHeaderRow, { backgroundColor: isDark ? '#2B1A1A' : HEADER_BG }]}>
                <Text style={[styles.tableHeadCell, { width: 28 }]}>#</Text>
                <Text style={[styles.tableHeadCell, { flex: 1, textAlign: 'left', paddingLeft: 8 }]}>कूट</Text>
                <Text style={[styles.tableHeadCell, { width: 52 }]}>अधिकतम</Text>
                <Text style={[styles.tableHeadCell, { width: 52 }]}>प्राप्त</Text>
                <Text style={[styles.tableHeadCell, { width: 58 }]}>स्थिति</Text>
              </View>

              {/* Table Body Rows */}
              {KOOTA_DATA.map((row) => (
                <View key={row.id} style={styles.tableDataRow}>
                  <Text style={[styles.tableCell, { width: 28, color: MUTED_TEXT }]}>{row.id}</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'left', paddingLeft: 8, fontWeight: '600', color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                    {row.name}
                  </Text>
                  <Text style={[styles.tableCell, { width: 52, color: MUTED_TEXT }]}>{row.max}</Text>
                  <Text style={[styles.tableCell, { width: 52, fontWeight: '700', color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                    {row.obtained}
                  </Text>
                  <View style={[styles.statusPillWrap, { width: 58 }]}>
                    <Text style={[styles.statusText, { color: row.statusColor }]}>{row.status}</Text>
                  </View>
                </View>
              ))}

              {/* Table Total Footer */}
              <View style={[styles.tableFooterRow, { backgroundColor: isDark ? '#2B1A1A' : HEADER_BG }]}>
                <Text style={[styles.tableHeadCell, { width: 28 }]} />
                <Text style={[styles.tableHeadCell, { flex: 1, textAlign: 'left', paddingLeft: 8, fontWeight: '700', color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                  कुल
                </Text>
                <Text style={[styles.tableHeadCell, { width: 52, fontWeight: '700', color: isDark ? '#F8E6CE' : DARK_TEXT }]}>36</Text>
                <Text style={[styles.tableHeadCell, { width: 52, fontWeight: '800', color: PRIMARY_MAROON }]}>28</Text>
                <Text style={[styles.tableHeadCell, { width: 58, color: MUTED_TEXT }]}>—</Text>
              </View>
            </View>

            {/* Other Matching Details Accordions (अन्य मिलान विवरण) */}
            <Text style={[styles.sectionHeading, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>अन्य मिलान विवरण</Text>

            {/* Accordion 1: मंगल दोष एवं परिहार */}
            <View style={[styles.accordionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('manglik')}
                activeOpacity={0.7}
              >
                <View style={styles.accordionTitleCol}>
                  <Text style={[styles.accordionTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                    मंगल दोष एवं परिहार
                  </Text>
                  <Text style={styles.accordionSubtitle}>वर-वधू की स्थिति और परिहार का विवरण</Text>
                </View>
                <Icon
                  name={expandedSection === 'manglik' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={MUTED_TEXT}
                />
              </TouchableOpacity>

              {expandedSection === 'manglik' && (
                <View style={styles.accordionBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailBullet}>•</Text>
                    <Text style={styles.detailLabel}>वर की स्थिति:</Text>
                    <Text style={[styles.detailValue, { color: ACCENT_GREEN }]}>निर्दोष (मंगल दोष अनुपस्थित)</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailBullet}>•</Text>
                    <Text style={styles.detailLabel}>वधू की स्थिति:</Text>
                    <Text style={[styles.detailValue, { color: ACCENT_AMBER }]}>आंशिक मंगल दोष (प्रथम भाव में स्थिति)</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailBoxTitle}>परिहार विश्लेषण व निष्कर्ष:</Text>
                    <Text style={styles.detailBoxText}>
                      वर की कुंडली में शनि एवं गुरु का अनुकूल प्रभाव होने तथा गुण मिलान 28 होने से मंगल दोष का शमन हो जाता है। विवाह पूर्व साधारण मंगल शांति अथवा कुंभ विवाह का विधान पूर्णतः शुभकारी रहेगा।
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Accordion 2: राशि, नक्षत्र एवं चरण */}
            <View style={[styles.accordionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('rashi')}
                activeOpacity={0.7}
              >
                <View style={styles.accordionTitleCol}>
                  <Text style={[styles.accordionTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                    राशि, नक्षत्र एवं चरण
                  </Text>
                  <Text style={styles.accordionSubtitle}>दोनों की जन्म राशि, नक्षत्र और चरण</Text>
                </View>
                <Icon
                  name={expandedSection === 'rashi' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={MUTED_TEXT}
                />
              </TouchableOpacity>

              {expandedSection === 'rashi' && (
                <View style={styles.accordionBody}>
                  <View style={styles.compareGrid}>
                    <View style={styles.compareCol}>
                      <Text style={styles.compareHead}>वधू (Bride)</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>राशि:</Text> कन्या (बुध)</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>नक्षत्र:</Text> हस्त</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>चरण:</Text> तृतीय (3)</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>वर्ण / गण:</Text> वैश्य / देव</Text>
                    </View>
                    <View style={styles.compareDivider} />
                    <View style={styles.compareCol}>
                      <Text style={styles.compareHead}>वर (Groom)</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>राशि:</Text> मकर (शनि)</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>नक्षत्र:</Text> उत्तराषाढ़ा</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>चरण:</Text> द्वितीय (2)</Text>
                      <Text style={styles.compareItem}><Text style={styles.boldLabel}>वर्ण / गण:</Text> वैश्य / मनुष्य</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Accordion 3: लग्न, ग्रह स्थिति एवं दशा */}
            <View style={[styles.accordionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('lagna')}
                activeOpacity={0.7}
              >
                <View style={styles.accordionTitleCol}>
                  <Text style={[styles.accordionTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                    लग्न, ग्रह स्थिति एवं दशा
                  </Text>
                  <Text style={styles.accordionSubtitle}>कुंडली, ग्रह और दशा का तुलनात्मक विवरण</Text>
                </View>
                <Icon
                  name={expandedSection === 'lagna' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={MUTED_TEXT}
                />
              </TouchableOpacity>

              {expandedSection === 'lagna' && (
                <View style={styles.accordionBody}>
                  <Text style={styles.detailBoxText}>
                    • <Text style={styles.boldLabel}>वधू लग्न:</Text> वृश्चिक लग्न (स्वामी: मंगल), वर्तमान में चंद्र महादशा प्रभावी।{'\n'}
                    • <Text style={styles.boldLabel}>वर लग्न:</Text> धनु लग्न (स्वामी: गुरु), वर्तमान में गुरु महादशा प्रभावी।{'\n'}
                    • <Text style={styles.boldLabel}>दशा सामंजस्य:</Text> दोनों की वर्तमान दशाएं परस्पर मित्र भाव रखती हैं और गृहस्थ सुख व प्रगति हेतु अनुकूल मानी गई हैं।
                  </Text>
                </View>
              )}
            </View>

            {/* Accordion 4: विश्लेषण एवं विशेष टिप्पणियाँ */}
            <View style={[styles.accordionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('tips')}
                activeOpacity={0.7}
              >
                <View style={styles.accordionTitleCol}>
                  <Text style={[styles.accordionTitle, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
                    विश्लेषण एवं विशेष टिप्पणियाँ
                  </Text>
                  <Text style={styles.accordionSubtitle}>अनुकूलताएँ, विचारणीय बिंदु और अपवाद</Text>
                </View>
                <Icon
                  name={expandedSection === 'tips' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={MUTED_TEXT}
                />
              </TouchableOpacity>

              {expandedSection === 'tips' && (
                <View style={styles.accordionBody}>
                  <Text style={styles.bulletItem}>
                    1. <Text style={styles.boldLabel}>नाड़ी मिलान (8/8):</Text> नाड़ी दोष नहीं है, यह स्वास्थ्य, दीर्घायु और उत्तम संतति का द्योतक है।
                  </Text>
                  <Text style={styles.bulletItem}>
                    2. <Text style={styles.boldLabel}>भकूट मिलान (7/7):</Text> भकूट दोष अनुपस्थित होने से दांपत्य प्रेम और आर्थिक समृद्धि बनी रहेगी।
                  </Text>
                  <Text style={styles.bulletItem}>
                    3. <Text style={styles.boldLabel}>कुल निष्कर्ष:</Text> 36 में से 28 गुण प्राप्त होना 'उत्तम मिलान' की श्रेणी में आता है (18 से अधिक गुण शुभ माने जाते हैं)।
                  </Text>
                </View>
              )}
            </View>

            {/* Disclaimer Footer Note */}
            <Text style={styles.disclaimerNote}>पूर्ण विवरण निर्यात रिपोर्ट में शामिल रहेगा।</Text>
          </View>
        )}

        {/* TAB 2: ग्रह एवं कुंडली (Preserving Vedic Charts & Planetary Data) */}
        {activeTab === 'chart' && (
          <View style={styles.tabSectionWrap}>
            {/* Person Selector */}
            <View style={styles.chartPersonToggle}>
              <TouchableOpacity
                style={[styles.chartPersonBtn, chartPerson === 'groom' && styles.chartPersonBtnActive]}
                onPress={() => setChartPerson('groom')}
              >
                <Text style={[styles.chartPersonText, chartPerson === 'groom' && styles.chartPersonTextActive]}>
                  वर कुंडली ({groomDetails.name})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartPersonBtn, chartPerson === 'bride' && styles.chartPersonBtnActive]}
                onPress={() => setChartPerson('bride')}
              >
                <Text style={[styles.chartPersonText, chartPerson === 'bride' && styles.chartPersonTextActive]}>
                  वधू कुंडली ({brideDetails.name})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Chart Type Toggle */}
            <View style={styles.chartTypeToggle}>
              <TouchableOpacity
                style={[styles.chartTypeBtn, chartType === 'lagna' && styles.chartTypeBtnActive]}
                onPress={() => setChartType('lagna')}
              >
                <Text style={[styles.chartTypeText, chartType === 'lagna' && styles.chartTypeTextActive]}>
                  लग्न कुंडली
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartTypeBtn, chartType === 'navamsha' && styles.chartTypeBtnActive]}
                onPress={() => setChartType('navamsha')}
              >
                <Text style={[styles.chartTypeText, chartType === 'navamsha' && styles.chartTypeTextActive]}>
                  नवांश कुंडली (D9)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Vedic Chart Canvas */}
            <View style={[styles.chartContainerCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <VedicChart planets={currentPlanets} size={chartSize} showAsc={true} />
            </View>

            {/* Planetary Positions Table */}
            <Text style={[styles.sectionHeading, { color: isDark ? '#F8E6CE' : DARK_TEXT }]}>
              {chartPerson === 'groom' ? 'वर' : 'वधू'} ग्रह स्थिति (Planetary Positions)
            </Text>
            <View style={[styles.tableCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <View style={[styles.tableHeaderRow, { backgroundColor: isDark ? '#2B1A1A' : HEADER_BG }]}>
                <Text style={[styles.tableHeadCell, { flex: 1.2, textAlign: 'left', paddingLeft: 8 }]}>ग्रह</Text>
                <Text style={[styles.tableHeadCell, { flex: 1 }]}>राशि</Text>
                <Text style={[styles.tableHeadCell, { flex: 1 }]}>भाव</Text>
                <Text style={[styles.tableHeadCell, { flex: 1.2 }]}>नक्षत्र</Text>
                <Text style={[styles.tableHeadCell, { flex: 1 }]}>अंश</Text>
              </View>

              {[
                { planet: 'सूर्य (Sun)', rashi: chartPerson === 'groom' ? 'मकर' : 'मेष', house: chartPerson === 'groom' ? '2' : '6', nak: 'उत्तराषाढ़ा', deg: "14° 22'" },
                { planet: 'चंद्र (Moon)', rashi: chartPerson === 'groom' ? 'मकर' : 'कन्या', house: chartPerson === 'groom' ? '2' : '11', nak: 'हस्त', deg: "18° 45'" },
                { planet: 'मंगल (Mars)', rashi: chartPerson === 'groom' ? 'मकर' : 'कर्क', house: chartPerson === 'groom' ? '2' : '9', nak: 'श्रवण', deg: "04° 10'" },
                { planet: 'बुध (Mercury)', rashi: chartPerson === 'groom' ? 'धनु' : 'वृषभ', house: chartPerson === 'groom' ? '1' : '7', nak: 'मूला', deg: "26° 18'" },
                { planet: 'गुरु (Jupiter)', rashi: chartPerson === 'groom' ? 'धनु' : 'मीन', house: chartPerson === 'groom' ? '1' : '5', nak: 'पूर्वाषाढ़ा', deg: "09° 33'" },
                { planet: 'शुक्र (Venus)', rashi: chartPerson === 'groom' ? 'कुंभ' : 'मिथुन', house: chartPerson === 'groom' ? '3' : '8', nak: 'शतभिषा', deg: "12° 50'" },
                { planet: 'शनि (Saturn)', rashi: chartPerson === 'groom' ? 'मीन' : 'मेष', house: chartPerson === 'groom' ? '4' : '6', nak: 'रेवती', deg: "21° 05'" },
                { planet: 'राहु (Rahu)', rashi: 'कन्या', house: '10', nak: 'चित्रा', deg: "11° 14'" },
                { planet: 'केतु (Ketu)', rashi: 'मीन', house: '4', nak: 'रेवती', deg: "11° 14'" },
              ].map((item, idx) => (
                <View key={idx} style={styles.tableDataRow}>
                  <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'left', paddingLeft: 8, fontWeight: '600' }]}>
                    {item.planet}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.rashi}</Text>
                  <Text style={[styles.tableCell, { flex: 1, fontWeight: '700' }]}>{item.house}</Text>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>{item.nak}</Text>
                  <Text style={[styles.tableCell, { flex: 1, color: MUTED_TEXT }]}>{item.deg}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: विस्तृत विश्लेषण */}
        {activeTab === 'analysis' && (
          <View style={styles.tabSectionWrap}>
            {/* Card 1: Koota Breakdown */}
            <View style={[styles.analysisCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={styles.analysisCardTitle}>अष्टकूट फलादेश एवं विवेचना</Text>
              <Text style={styles.analysisText}>
                • <Text style={styles.boldLabel}>वर्ण (1/1):</Text> दोनों का वर्ण वैश्य होने से कार्य क्षेत्र, सामाजिक प्रतिष्ठा व आत्मसम्मान में पूर्ण तालमेल रहेगा।{'\n'}
                • <Text style={styles.boldLabel}>वश्य (1/2):</Text> परस्पर आकर्षण व सौहार्द संतुलित है। दोनों एक-दूसरे के विचारों का आदर करेंगे।{'\n'}
                • <Text style={styles.boldLabel}>तारा (3/3):</Text> जन्म तारा अति मित्र है, जिससे दीर्घायु, भाग्य एवं आरोग्य में वृद्धि होगी।{'\n'}
                • <Text style={styles.boldLabel}>योनि (3/4):</Text> शारीरिक एवं मनोवैज्ञानिक सामंजस्य अनुकूल है।{'\n'}
                • <Text style={styles.boldLabel}>ग्रह मैत्री (4/5):</Text> राशि स्वामियों (बुध व शनि) में नैसर्गिक मित्रता होने से वैचारिक एकरूपता रहेगी।{'\n'}
                • <Text style={styles.boldLabel}>गण (1/6):</Text> देव व मनुष्य गण का मध्यम योग है। धैर्य व विवेक से गृहस्थ जीवन आनंदमय रहेगा।{'\n'}
                • <Text style={styles.boldLabel}>भकूट (7/7):</Text> पूर्ण 7 अंक। भकूट दोष का अभाव परिवार में शांति व आर्थिक समृद्धि का प्रतीक है।{'\n'}
                • <Text style={styles.boldLabel}>नाड़ी (8/8):</Text> नाड़ी दोष न होना संतति सुख, आनुवंशिक स्वास्थ्य व वैवाहिक दीर्घायु की पुष्टि करता है।
              </Text>
            </View>

            {/* Card 2: Manglik Deep Dive */}
            <View style={[styles.analysisCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={styles.analysisCardTitle}>मांगलिक विचार एवं शास्त्र सम्मत परिहार</Text>
              <Text style={styles.analysisText}>
                शास्त्रीय नियमों के अनुसार, यदि एक कुंडली में मंगल दोष हो और दूसरी कुंडली में शुभ ग्रहों की दृष्टि अथवा गुण मिलान 28 से अधिक हो, तो मंगल दोष निष्प्रभावी हो जाता है।{'\n\n'}
                <Text style={styles.boldLabel}>अनुशंसित पूजा विधान:</Text>{'\n'}
                1. विवाह पूर्व कन्या के लिए 'कुंभ विवाह' अथवा 'शालिग्राम विवाह' कराना श्रेयस्कर होगा।{'\n'}
                2. दांपत्य जीवन के शुभारंभ पर रुद्राभिषेक एवं नवग्रह शांति हवन संपन्न कराएं।
              </Text>
            </View>

            {/* Card 3: Final Astrological Verdict */}
            <View style={[styles.analysisCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={styles.analysisCardTitle}>ज्योतिषीय निष्कर्ष एवं आशीर्वाद</Text>
              <Text style={[styles.analysisText, { color: PRIMARY_MAROON, fontWeight: '600' }]}>
                कुल प्राप्तांक 28/36 (77.8%) उत्तम श्रेणी में आता है। दोनों जातकों की ग्रह दशाएं परस्पर पूरक हैं। यह विवाह संबंध वर-वधू एवं दोनों परिवारों के लिए मंगलमय एवं सुख-समृद्धिदायक रहेगा।
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <Text style={styles.bottomBarLeftText}>आपकी ब्रांडिंग के साथ रिपोर्ट</Text>

        <View style={styles.bottomBarBtnGroup}>
          {/* Export PDF Button */}
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={handleExportPdf}
            activeOpacity={0.8}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color={PRIMARY_MAROON} />
            ) : (
              <>
                <Icon name="download" size={13} color={PRIMARY_MAROON} style={styles.btnIcon} />
                <Text style={styles.exportBtnText}>एक्सपोर्ट</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Icon name="share-2" size={13} color="#FFFFFF" style={styles.btnIcon} />
            <Text style={styles.shareBtnText}>शेयर करें</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 2,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  headerSubtitle: {
    fontSize: 11,
    color: MUTED_TEXT,
    marginTop: 1,
  },
  changeDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FFF0ED',
  },
  editIcon: {
    marginRight: 4,
  },
  changeDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_MAROON,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 6,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberInactive: {
    fontSize: 11,
    color: MUTED_TEXT,
    fontWeight: '600',
  },
  stepLabelInactive: {
    fontSize: 12,
    color: MUTED_TEXT,
    marginLeft: 6,
  },
  stepDividerLine: {
    width: 45,
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  stepCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PRIMARY_MAROON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLabelActive: {
    fontSize: 12,
    color: PRIMARY_MAROON,
    fontWeight: '700',
    marginLeft: 6,
  },
  coupleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 12,
    marginBottom: 12,
  },
  coupleCol: {
    flex: 1,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F3D899',
  },
  profileNameWrap: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  profileDateText: {
    fontSize: 10,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  profilePlaceText: {
    fontSize: 9.5,
    color: MUTED_TEXT,
    marginTop: 1,
  },
  coupleColDivider: {
    width: 1,
    height: '85%',
    backgroundColor: BORDER_COLOR,
    marginHorizontal: 8,
  },
  segmentedTabsWrap: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 3,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: PRIMARY_MAROON,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scoreCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 12,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreSubtitle: {
    fontSize: 11.5,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  scoreValue: {
    fontSize: 26,
    fontWeight: '800',
    color: PRIMARY_MAROON,
  },
  scoreDisclaimerWrap: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  scoreDisclaimerText: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  tableCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    overflow: 'hidden',
    marginBottom: 14,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  tableHeadCell: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    fontSize: 11,
    textAlign: 'center',
    color: DARK_TEXT,
  },
  statusPillWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  accordionCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginBottom: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  accordionTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  accordionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  accordionSubtitle: {
    fontSize: 10.5,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  accordionBody: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailBullet: {
    fontSize: 14,
    color: PRIMARY_MAROON,
    marginRight: 6,
  },
  detailLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: DARK_TEXT,
    marginRight: 6,
  },
  detailValue: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  detailBox: {
    marginTop: 8,
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_MAROON,
  },
  detailBoxTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: PRIMARY_MAROON,
    marginBottom: 4,
  },
  detailBoxText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 16,
  },
  compareGrid: {
    flexDirection: 'row',
  },
  compareCol: {
    flex: 1,
  },
  compareHead: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_MAROON,
    marginBottom: 6,
  },
  compareItem: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 3,
  },
  boldLabel: {
    fontWeight: '700',
    color: DARK_TEXT,
  },
  compareDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  bulletItem: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 17,
    marginBottom: 6,
  },
  disclaimerNote: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  tabSectionWrap: {
    marginTop: 4,
  },
  chartPersonToggle: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  chartPersonBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  chartPersonBtnActive: {
    backgroundColor: '#FFF0ED',
    borderColor: PRIMARY_MAROON,
  },
  chartPersonText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4B5563',
  },
  chartPersonTextActive: {
    color: PRIMARY_MAROON,
    fontWeight: '700',
  },
  chartTypeToggle: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  chartTypeBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  chartTypeBtnActive: {
    backgroundColor: PRIMARY_MAROON,
  },
  chartTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  chartTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chartContainerCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  analysisCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 12,
    marginBottom: 12,
  },
  analysisCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY_MAROON,
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 11.5,
    color: '#374151',
    lineHeight: 18,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
  },
  bottomBarLeftText: {
    fontSize: 11.5,
    color: MUTED_TEXT,
  },
  bottomBarBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_MAROON,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_MAROON,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnIcon: {
    marginRight: 4,
  },
});

export default KundaliMatchingResultScreen;
