import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Share,
  StatusBar,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const SUMMARY_BG = '#FFF8F6';
const SUMMARY_BORDER = '#F6D7D4';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const WARM_BG = '#FDFBF8';
const SUBTLE_CREAM = '#FAF7F3';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

const DakshinaCalculatorScreen = () => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const isHi = i18n.language === 'hi';

  const [poojaName, setPoojaName] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'start' | 'end'>('start');

  const [acharyaCount, setAcharyaCount] = useState('');
  const [acharyaPerDay, setAcharyaPerDay] = useState('');
  const [upacharyaCount, setUpacharyaCount] = useState('');
  const [upacharyaPerDay, setUpacharyaPerDay] = useState('');
  const [panditCount, setPanditCount] = useState('');
  const [panditPerDay, setPanditPerDay] = useState('');
  const [samagriAmount, setSamagriAmount] = useState('');
  const [transportAmount, setTransportAmount] = useState('');

  const handleReset = () => {
    setPoojaName('');
    setStartDate('');
    setEndDate('');
    setAcharyaCount('');
    setAcharyaPerDay('');
    setUpacharyaCount('');
    setUpacharyaPerDay('');
    setPanditCount('');
    setPanditPerDay('');
    setSamagriAmount('');
    setTransportAmount('');
  };

  // Calculate days inclusively
  let calculatedDays = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    calculatedDays = diffDays >= 0 ? diffDays + 1 : 0;
  } else if (startDate || endDate) {
    calculatedDays = 1;
  } else {
    calculatedDays = 0;
  }

  const A = calculatedDays;

  const acharyaCountNum = parseInt(acharyaCount, 10) || 0;
  const acharyaRate = parseFloat(acharyaPerDay) || 0;
  const acharyaTotal = acharyaCountNum * acharyaRate;

  const upacharyaCountNum = parseInt(upacharyaCount, 10) || 0;
  const upacharyaRate = parseFloat(upacharyaPerDay) || 0;
  const upacharyaTotal = upacharyaCountNum * upacharyaRate;

  const panditCountNum = parseInt(panditCount, 10) || 0;
  const panditRate = parseFloat(panditPerDay) || 0;
  const panditTotal = panditCountNum * panditRate;

  const finalAmountPerDay = acharyaTotal + upacharyaTotal + panditTotal;
  const finalAmount = finalAmountPerDay * A;

  const D = parseFloat(samagriAmount) || 0;
  const E = parseFloat(transportAmount) || 0;
  const extrasTotal = D + E;

  const totalAmount = finalAmount + extrasTotal;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  const generateHtml = () => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #1F2937; }
          h1 { text-align: center; color: #8B1D1D; margin-bottom: 5px; }
          .subtitle { text-align: center; color: #6B7280; margin-top: 0; margin-bottom: 24px; font-size: 13px; }
          .card { border: 1px solid #EFECE8; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
          .row.border-bottom { border-bottom: 1px solid #F3EFEA; padding-bottom: 10px; }
          .section-title { font-weight: bold; color: #8B1D1D; margin-bottom: 10px; font-size: 15px; }
          .total-row { font-weight: bold; font-size: 18px; color: #8B1D1D; background-color: #FFF0ED; padding: 12px; border-radius: 8px; margin-top: 8px; }
          .muted { color: #6B7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>पूजा कैलकुलेटर</h1>
        <p class="subtitle">सेवा, श्रद्धा और पारदर्शिता</p>

        <div class="card">
          <div class="row border-bottom">
            <span><strong>पूजा का नाम:</strong></span>
            <span>${poojaName || '-'}</span>
          </div>
          <div class="row" style="margin-bottom: 0;">
            <span><strong>कुल दिन:</strong></span>
            <span>${calculatedDays} दिन (${formatDate(startDate) || '-'} से ${formatDate(endDate) || '-'})</span>
          </div>
        </div>

        <div class="section-title">दक्षिणा • प्रति दिन</div>
        <div class="card">
          <div class="row border-bottom">
            <span>आचार्य (${acharyaCountNum} × ₹${acharyaRate})</span>
            <span>₹${(acharyaTotal * A).toLocaleString('en-IN')}</span>
          </div>
          <div class="row border-bottom">
            <span>उपाचार्य (${upacharyaCountNum} × ₹${upacharyaRate})</span>
            <span>₹${(upacharyaTotal * A).toLocaleString('en-IN')}</span>
          </div>
          <div class="row border-bottom">
            <span>पंडित (${panditCountNum} × ₹${panditRate})</span>
            <span>₹${(panditTotal * A).toLocaleString('en-IN')}</span>
          </div>
          <div class="row" style="margin-bottom: 0; font-weight: bold;">
            <span>प्रति दिन कुल</span>
            <span>₹${finalAmountPerDay.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="section-title">अतिरिक्त खर्च</div>
        <div class="card">
          <div class="row border-bottom">
            <span>सामग्री</span>
            <span>₹${D.toLocaleString('en-IN')}</span>
          </div>
          <div class="row" style="margin-bottom: 0;">
            <span>भत्ता</span>
            <span>₹${E.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="section-title">खर्च का सारांश</div>
        <div class="card" style="border-color: #F6D7D4; background-color: #FFF8F6;">
          <div class="row border-bottom">
            <span>कुल दक्षिणा <span class="muted">(₹${finalAmountPerDay.toLocaleString('en-IN')} × ${calculatedDays} दिन)</span></span>
            <strong>₹${finalAmount.toLocaleString('en-IN')}</strong>
          </div>
          <div class="row border-bottom">
            <span>अन्य खर्च <span class="muted">(₹${D.toLocaleString('en-IN')} + ₹${E.toLocaleString('en-IN')})</span></span>
            <strong>₹${extrasTotal.toLocaleString('en-IN')}</strong>
          </div>
          <div class="row total-row" style="margin-bottom: 0;">
            <span>कुल राशि</span>
            <span>₹${totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 32px; color: #9CA3AF; font-size: 11px;">
          Created with Vipra Saarthi
        </div>
      </body>
    </html>
  `;

  const handleExportPDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHtml(),
        base64: false,
      });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Failed to generate or share PDF', error);
    }
  };

  const handleShareText = async () => {
    try {
      const textSummary = [
        `पूजा कैलकुलेटर — ${poojaName || 'पूजा'}`,
        `कुल दिन: ${calculatedDays}`,
        `कुल दक्षिणा: ₹${finalAmount.toLocaleString('en-IN')}`,
        `अन्य खर्च (सामग्री + भत्ता): ₹${extrasTotal.toLocaleString('en-IN')}`,
        `कुल राशि: ₹${totalAmount.toLocaleString('en-IN')}`,
      ].join('\n');
      await Share.share({ message: textSummary });
    } catch (error) {
      console.error('Failed to share calculation', error);
    }
  };

  const handleDateConfirm = (date: Date) => {
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (calendarMode === 'start') {
      setStartDate(formattedDate);
      if (endDate && new Date(endDate) < date) {
        setEndDate(formattedDate);
      }
    } else {
      setEndDate(formattedDate);
      if (startDate && new Date(startDate) > date) {
        setStartDate(formattedDate);
      }
    }
    setPickerVisible(false);
  };

  const bgScreen = isDark ? '#121212' : WARM_BG;
  const surfaceBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : SUBTLE_CREAM;
  const inputBg = isDark ? '#181818' : '#FFFFFF';
  const borderDynamic = isDark ? '#2D2D2D' : CARD_BORDER;
  const dividerDynamic = isDark ? '#2A2A2A' : ROW_DIVIDER;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;

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
        <View style={styles.headerRow}>
          {navigation.canGoBack() ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={24} color={accentColor} />
            </TouchableOpacity>
          ) : null}

          <View style={styles.headerTitleCol}>
            <Text style={[styles.headerTitle, { color: accentColor }]}>
              {t('dakshina_calc.title', 'पूजा कैलकुलेटर')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
              {isHi ? 'पूजा का खर्च आसानी से निकालें' : 'Calculate pooja expenses easily'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleReset}
            style={styles.resetBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Text style={[styles.resetBtnText, { color: accentColor }]}>
              {isHi ? 'रीसेट' : 'Reset'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section 1: पूजा का विवरण */}
          <View style={[styles.sectionCard, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}>
            <Text style={[styles.sectionHeading, { color: textPrimary }]}>
              {isHi ? 'पूजा का विवरण' : 'Pooja Details'}
            </Text>

            <View style={styles.inlineFieldRow}>
              <Text style={[styles.inlineFieldLabel, { color: textSecondary }]}>
                {t('dakshina_calc.pooja_name', 'पूजा का नाम')}
              </Text>
              <TextInput
                style={[
                  styles.inlineTextInput,
                  { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg },
                ]}
                value={poojaName}
                onChangeText={setPoojaName}
                placeholder={t('dakshina_calc.pooja_placeholder', 'गृह प्रवेश पूजा')}
                placeholderTextColor={textSecondary}
              />
            </View>

            <View style={styles.datesRow}>
              <View style={styles.dateCol}>
                <Text style={[styles.fieldLabel, { color: textSecondary }]}>
                  {t('dakshina_calc.start_date', 'प्रारंभ तिथि')}
                </Text>
                <TouchableOpacity
                  style={[styles.dateButton, { borderColor: borderDynamic, backgroundColor: inputBg }]}
                  onPress={() => {
                    setCalendarMode('start');
                    setPickerVisible(true);
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[styles.dateText, { color: startDate ? textPrimary : textSecondary }]}
                    numberOfLines={1}
                  >
                    {formatDate(startDate) || 'DD/MM/YYYY'}
                  </Text>
                  <Feather name="calendar" size={14} color={accentColor} />
                </TouchableOpacity>
              </View>

              <View style={{ width: 10 }} />

              <View style={styles.dateCol}>
                <Text style={[styles.fieldLabel, { color: textSecondary }]}>
                  {t('dakshina_calc.end_date', 'समाप्ति तिथि')}
                </Text>
                <TouchableOpacity
                  style={[styles.dateButton, { borderColor: borderDynamic, backgroundColor: inputBg }]}
                  onPress={() => {
                    setCalendarMode('end');
                    setPickerVisible(true);
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[styles.dateText, { color: endDate ? textPrimary : textSecondary }]}
                    numberOfLines={1}
                  >
                    {formatDate(endDate) || 'DD/MM/YYYY'}
                  </Text>
                  <Feather name="calendar" size={14} color={accentColor} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.daysHintText, { color: textSecondary }]}>
              {calculatedDays > 0
                ? isHi
                  ? `दोनों तिथियाँ शामिल • कुल ${calculatedDays} दिन`
                  : `Both dates included • Total ${calculatedDays} days`
                : isHi
                ? 'कुल दिन जानने के लिए प्रारंभ और समाप्ति तिथि चुनें'
                : 'Select start and end dates to calculate total days'}
            </Text>
          </View>

          {/* Section 2: दक्षिणा • प्रति दिन (Clean Table matching Reference Image) */}
          <View style={[styles.sectionCard, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeading, { color: textPrimary, marginBottom: 0 }]}>
                {isHi ? 'दक्षिणा • प्रति दिन' : t('dakshina_calc.seva_dal', 'Dakshina • Per Day')}
              </Text>
              <Text style={[styles.sectionRightHint, { color: textSecondary }]}>
                {isHi ? 'प्रति व्यक्ति दर × संख्या × दिन' : 'Rate × Count × Days'}
              </Text>
            </View>

            {/* Table Column Headers */}
            <View style={[styles.tableHeaderBar, { backgroundColor: subtleBg, borderColor: dividerDynamic }]}>
              <Text style={[styles.thText, { flex: 1.15, color: textSecondary }]}>
                {isHi ? 'भूमिका' : 'Role'}
              </Text>
              <Text style={[styles.thText, { width: 54, textAlign: 'center', color: textSecondary }]}>
                {t('dakshina_calc.count', 'संख्या')}
              </Text>
              <Text style={[styles.thText, { flex: 1.15, textAlign: 'center', color: textSecondary }]}>
                {t('dakshina_calc.per_day', 'राशि / दिन')}
              </Text>
              <Text style={[styles.thText, { width: 72, textAlign: 'right', color: textSecondary }]}>
                {isHi ? 'कुल' : 'Total'}
              </Text>
            </View>

            {/* Acharya Row */}
            <View style={[styles.roleRow, { borderBottomColor: dividerDynamic }]}>
              <Text style={[styles.roleName, { flex: 1.15, color: textPrimary }]}>
                {t('dakshina_calc.acharya', 'आचार्य')}
              </Text>
              <TextInput
                style={[styles.countInput, { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg }]}
                value={acharyaCount}
                onChangeText={setAcharyaCount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={textSecondary}
              />
              <View style={[styles.rateInputWrap, { borderColor: borderDynamic, backgroundColor: inputBg }]}>
                <Text style={[styles.rupeePrefix, { color: textSecondary }]}>₹</Text>
                <TextInput
                  style={[styles.rateInput, { color: textPrimary }]}
                  value={acharyaPerDay}
                  onChangeText={setAcharyaPerDay}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={textSecondary}
                />
              </View>
              <Text style={[styles.rowTotalText, { color: textPrimary }]} numberOfLines={1}>
                ₹{(acharyaTotal * A).toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Upacharya Row */}
            <View style={[styles.roleRow, { borderBottomColor: dividerDynamic }]}>
              <Text style={[styles.roleName, { flex: 1.15, color: textPrimary }]}>
                {t('dakshina_calc.upacharya', 'उपाचार्य')}
              </Text>
              <TextInput
                style={[styles.countInput, { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg }]}
                value={upacharyaCount}
                onChangeText={setUpacharyaCount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={textSecondary}
              />
              <View style={[styles.rateInputWrap, { borderColor: borderDynamic, backgroundColor: inputBg }]}>
                <Text style={[styles.rupeePrefix, { color: textSecondary }]}>₹</Text>
                <TextInput
                  style={[styles.rateInput, { color: textPrimary }]}
                  value={upacharyaPerDay}
                  onChangeText={setUpacharyaPerDay}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={textSecondary}
                />
              </View>
              <Text style={[styles.rowTotalText, { color: textPrimary }]} numberOfLines={1}>
                ₹{(upacharyaTotal * A).toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Pandit Row */}
            <View style={[styles.roleRow, { borderBottomWidth: 0, paddingBottom: 2 }]}>
              <Text style={[styles.roleName, { flex: 1.15, color: textPrimary }]}>
                {t('dakshina_calc.pandit', 'पंडित')}
              </Text>
              <TextInput
                style={[styles.countInput, { color: textPrimary, borderColor: borderDynamic, backgroundColor: inputBg }]}
                value={panditCount}
                onChangeText={setPanditCount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={textSecondary}
              />
              <View style={[styles.rateInputWrap, { borderColor: borderDynamic, backgroundColor: inputBg }]}>
                <Text style={[styles.rupeePrefix, { color: textSecondary }]}>₹</Text>
                <TextInput
                  style={[styles.rateInput, { color: textPrimary }]}
                  value={panditPerDay}
                  onChangeText={setPanditPerDay}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={textSecondary}
                />
              </View>
              <Text style={[styles.rowTotalText, { color: textPrimary }]} numberOfLines={1}>
                ₹{(panditTotal * A).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Section 3: अतिरिक्त खर्च */}
          <View style={[styles.sectionCard, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeading, { color: textPrimary, marginBottom: 0 }]}>
                {t('dakshina_calc.additional_amt', 'अतिरिक्त खर्च')}
              </Text>
              <Text style={[styles.sectionRightHint, { color: textSecondary }]}>
                {isHi ? 'पूरे आयोजन के लिए' : 'For entire event'}
              </Text>
            </View>

            <View style={styles.extraRow}>
              <Text style={[styles.extraLabel, { color: textSecondary }]}>
                {t('dakshina_calc.samagri_amt_label', 'सामग्री')}
              </Text>
              <View style={[styles.extraInputWrap, { borderColor: borderDynamic, backgroundColor: inputBg }]}>
                <Text style={[styles.rupeePrefix, { color: textSecondary }]}>₹</Text>
                <TextInput
                  style={[styles.extraInput, { color: textPrimary }]}
                  value={samagriAmount}
                  onChangeText={setSamagriAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={textSecondary}
                />
              </View>
            </View>

            <View style={[styles.extraRow, { marginBottom: 0 }]}>
              <Text style={[styles.extraLabel, { color: textSecondary }]}>
                {t('dakshina_calc.allowance_amt_label', 'भत्ता')}
              </Text>
              <View style={[styles.extraInputWrap, { borderColor: borderDynamic, backgroundColor: inputBg }]}>
                <Text style={[styles.rupeePrefix, { color: textSecondary }]}>₹</Text>
                <TextInput
                  style={[styles.extraInput, { color: textPrimary }]}
                  value={transportAmount}
                  onChangeText={setTransportAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={textSecondary}
                />
              </View>
            </View>
          </View>

          {/* Section 4: खर्च का सारांश (Clean Flat Summary Box matching Reference Image) */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: isDark ? '#241919' : SUMMARY_BG,
                borderColor: isDark ? '#4A2525' : SUMMARY_BORDER,
              },
            ]}
          >
            <Text style={[styles.summaryTitle, { color: textPrimary }]}>
              {t('dakshina_calc.details', 'खर्च का सारांश')}
            </Text>

            <View style={[styles.summaryLineRow, { borderBottomColor: isDark ? '#382222' : '#F3E3E1' }]}>
              <Text style={[styles.summaryKey, { color: textSecondary }]}>
                {t('dakshina_calc.total_days_label', 'कुल दिन')}
              </Text>
              <Text style={[styles.summaryVal, { color: textPrimary }]}>{calculatedDays}</Text>
            </View>

            <View style={[styles.summaryLineRow, { borderBottomColor: isDark ? '#382222' : '#F3E3E1' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.summaryKey, { color: textSecondary }]}>
                  {t('dakshina_calc.total_dakshina_label', 'कुल दक्षिणा')}
                </Text>
                <Text style={[styles.summarySubKey, { color: textSecondary }]}>
                  ₹{finalAmountPerDay.toLocaleString('en-IN')} × {calculatedDays} {isHi ? 'दिन' : 'days'}
                </Text>
              </View>
              <Text style={[styles.summaryVal, { color: textPrimary }]}>
                ₹{finalAmount.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={[styles.summaryLineRow, { borderBottomColor: isDark ? '#382222' : '#F3E3E1' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.summaryKey, { color: textSecondary }]}>
                  {t('dakshina_calc.samagri_plus_allowance_label', 'अन्य खर्च')}
                </Text>
                <Text style={[styles.summarySubKey, { color: textSecondary }]}>
                  {isHi ? 'सामग्री + भत्ता' : 'Samagri + Allowance'}
                </Text>
              </View>
              <Text style={[styles.summaryVal, { color: textPrimary }]}>
                ₹{extrasTotal.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={[styles.grandTotalLabel, { color: accentColor }]}>
                {t('dakshina_calc.final_total_label', 'कुल राशि')}
              </Text>
              <Text style={[styles.grandTotalValue, { color: accentColor }]}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Bottom Export & Share Action Row (Matching Reference Image) */}
          <View style={styles.bottomActionsRow}>
            <TouchableOpacity
              style={[
                styles.exportOutlineBtn,
                { backgroundColor: surfaceBg, borderColor: borderDynamic },
              ]}
              onPress={handleExportPDF}
              activeOpacity={0.75}
            >
              <Feather name="download" size={15} color={accentColor} style={{ marginRight: 6 }} />
              <Text style={[styles.exportOutlineText, { color: accentColor }]}>
                {isHi ? 'एक्सपोर्ट PDF' : 'Export PDF'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sharePrimaryBtn, { backgroundColor: PRIMARY_MAROON }]}
              onPress={handleShareText}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.sharePrimaryText}>
                {isHi ? 'शेयर करें' : 'Share'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePicker
        modal
        open={pickerVisible}
        theme={isDark ? 'dark' : 'light'}
        date={
          calendarMode === 'start' && startDate
            ? new Date(startDate)
            : calendarMode === 'end' && endDate
              ? new Date(endDate)
              : new Date()
        }
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setPickerVisible(false)}
        minimumDate={calendarMode === 'end' && startDate ? new Date(startDate) : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 6,
    padding: 2,
  },
  headerTitleCol: {
    flex: 1,
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
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionRightHint: {
    fontSize: 10,
    fontWeight: '500',
  },
  inlineFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  inlineFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 82,
  },
  inlineTextInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  datesRow: {
    flexDirection: 'row',
  },
  dateCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  daysHintText: {
    fontSize: 10.5,
    marginTop: 7,
  },
  tableHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 6,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    gap: 6,
  },
  roleName: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  countInput: {
    width: 54,
    height: 34,
    borderWidth: 1,
    borderRadius: 7,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 0,
  },
  rateInputWrap: {
    flex: 1.15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 7,
    height: 34,
    paddingHorizontal: 7,
  },
  rupeePrefix: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 3,
  },
  rateInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 0,
  },
  rowTotalText: {
    width: 72,
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'right',
  },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
    gap: 10,
  },
  extraLabel: {
    width: 82,
    fontSize: 12,
    fontWeight: '600',
  },
  extraInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
  },
  extraInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 0,
  },
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 13,
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  summaryKey: {
    fontSize: 12,
    fontWeight: '600',
  },
  summarySubKey: {
    fontSize: 10,
    marginTop: 1,
  },
  summaryVal: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  grandTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  grandTotalLabel: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exportOutlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
  },
  exportOutlineText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  sharePrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 11,
  },
  sharePrimaryText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
});

export default DakshinaCalculatorScreen;
