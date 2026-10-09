import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Share, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../components/CustomHeader';
import DatePicker from 'react-native-date-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DakshinaCalculatorScreen = () => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [poojaName, setPoojaName] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'start' | 'end'>('start');

  const [acharyaCount, setAcharyaCount] = useState('1');
  const [acharyaPerDay, setAcharyaPerDay] = useState('2100');
  const [upacharyaCount, setUpacharyaCount] = useState('2');
  const [upacharyaPerDay, setUpacharyaPerDay] = useState('1100');
  const [panditCount, setPanditCount] = useState('3');
  const [panditPerDay, setPanditPerDay] = useState('801');
  const [samagriAmount, setSamagriAmount] = useState('5100');
  const [transportAmount, setTransportAmount] = useState('2100');

  // Calculate days inclusively
  let calculatedDays = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    calculatedDays = diffDays >= 0 ? diffDays + 1 : 0;
  } else if (startDate || endDate) {
    calculatedDays = 1; // At least 1 day if one is selected
  } else {
    calculatedDays = 3; // Default based on mockup if no date selected
  }

  const A = calculatedDays;

  const acharyaCountNum = parseInt(acharyaCount) || 0;
  const acharyaRate = parseFloat(acharyaPerDay) || 0;
  const acharyaTotal = acharyaCountNum * acharyaRate;

  const upacharyaCountNum = parseInt(upacharyaCount) || 0;
  const upacharyaRate = parseFloat(upacharyaPerDay) || 0;
  const upacharyaTotal = upacharyaCountNum * upacharyaRate;

  const panditCountNum = parseInt(panditCount) || 0;
  const panditRate = parseFloat(panditPerDay) || 0;
  const panditTotal = panditCountNum * panditRate;

  const finalAmountPerDay = acharyaTotal + upacharyaTotal + panditTotal;
  const finalAmount = finalAmountPerDay * A;

  const D = parseFloat(samagriAmount) || 0;
  const E = parseFloat(transportAmount) || 0;
  const extrasTotal = D + E;

  const totalAmount = finalAmount + extrasTotal;

  const generateHtml = () => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
          h1 { text-align: center; color: #A93226; margin-bottom: 5px; }
          .subtitle { text-align: center; color: #666; margin-top: 0; margin-bottom: 30px; font-size: 14px; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 16px; }
          .row.border-bottom { border-bottom: 1px solid #eee; padding-bottom: 12px; }
          .section-title { font-weight: bold; color: #A93226; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #A93226; padding-bottom: 5px; display: inline-block; }
          .total-row { font-weight: bold; font-size: 20px; color: #A93226; background-color: #FDEED9; padding: 15px; border-radius: 8px; margin-top: 10px; }
          .muted { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>दक्षिणा कैलकुलेटर</h1>
        <p class="subtitle">सेवा, श्रद्धा और पारदर्शिता</p>
        
        <div class="card">
          <div class="row border-bottom">
            <span><strong>पूजा का नाम:</strong></span>
            <span>${poojaName || '-'}</span>
          </div>
          <div class="row">
            <span><strong>कुल दिन:</strong></span>
            <span>${calculatedDays} दिन (${formatDate(startDate) || '-'} से ${formatDate(endDate) || '-'})</span>
          </div>
        </div>
        
        <div class="section-title">सेवा दल (प्रति दिन)</div>
        <div class="card">
          <div class="row border-bottom">
            <span>आचार्य (${acharyaCountNum} x ₹${acharyaRate})</span>
            <span>₹${acharyaTotal.toFixed(2)}</span>
          </div>
          <div class="row border-bottom">
            <span>उपाचार्य (${upacharyaCountNum} x ₹${upacharyaRate})</span>
            <span>₹${upacharyaTotal.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>पंडित (${panditCountNum} x ₹${panditRate})</span>
            <span>₹${panditTotal.toFixed(2)}</span>
          </div>
          <div class="row" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; font-weight: bold;">
            <span>प्रति दिन कुल</span>
            <span>₹${finalAmountPerDay.toFixed(2)}</span>
          </div>
        </div>

        <div class="section-title">अतिरिक्त राशि</div>
        <div class="card">
          <div class="row border-bottom">
            <span>सामग्री राशि</span>
            <span>₹${D.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>अलाउंस राशि</span>
            <span>₹${E.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="section-title">दक्षिणा का विवरण</div>
        <div class="card" style="border-color: #FDEED9; background-color: #FFFBF0;">
          <div class="row border-bottom">
            <div>
              <strong>कुल दक्षिणा</strong><br>
              <span class="muted">(₹${finalAmountPerDay} x ${calculatedDays} दिन)</span>
            </div>
            <strong>₹${finalAmount.toFixed(2)}</strong>
          </div>
          <div class="row border-bottom">
            <div>
              <strong>सामग्री + अलाउंस</strong><br>
              <span class="muted">(₹${D} + ₹${E})</span>
            </div>
            <strong>₹${extrasTotal.toFixed(2)}</strong>
          </div>
          <div class="row total-row" style="margin-bottom: 0;">
            <span>अंतिम कुल</span>
            <span>₹${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #888; font-size: 12px;">
          Created with Vipra Saarthi
        </div>
      </body>
    </html>
  `;

  const handleExportPDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHtml(),
        base64: false
      });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error("Failed to generate or share PDF", error);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title={t('dakshina_calc.title', 'Dakshina Calculator')}
        showThemeToggle={true}
        showBack={false}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Pooja Name Section */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>{t('dakshina_calc.pooja_name', 'Pooja Name')} <Text style={styles.required}>*</Text></Text>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                  <MaterialCommunityIcons name="flower-tulip-outline" size={20} color={isDark ? '#FFF' : colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={poojaName}
                    onChangeText={setPoojaName}
                    placeholder={t('dakshina_calc.pooja_placeholder', 'Enter Pooja Name')}
                    placeholderTextColor={colors.textLight}
                  />
                </View>
              </View>

              <View style={styles.datesRow}>
                <View style={styles.datePickerContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>{t('dakshina_calc.start_date', 'Start Date')} <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
                    onPress={() => { setCalendarMode('start'); setPickerVisible(true); }}
                  >
                    <Text style={[styles.dateText, { color: startDate ? colors.text : colors.textLight }]} numberOfLines={1}>
                      {formatDate(startDate) || 'DD/MM/YYYY'}
                    </Text>
                    <Feather name="calendar" size={16} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.datePickerContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>{t('dakshina_calc.end_date', 'End Date')} <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
                    onPress={() => { setCalendarMode('end'); setPickerVisible(true); }}
                  >
                    <Text style={[styles.dateText, { color: endDate ? colors.text : colors.textLight }]} numberOfLines={1}>
                      {formatDate(endDate) || 'DD/MM/YYYY'}
                    </Text>
                    <Feather name="calendar" size={16} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Service Team Section */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
                <MaterialCommunityIcons name="account-group-outline" size={24} color={isDark ? '#FFF' : colors.primary} />
                <View style={styles.cardHeaderTexts}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : colors.primary }]}>{t('dakshina_calc.seva_dal', 'Service Team')}</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textLight }]}>{t('dakshina_calc.seva_dal_sub', 'Number of Acharyas and Pandits involved')}</Text>
                </View>
              </View>

              {/* Headers */}
              <View style={styles.teamHeaders}>
                <View style={{ flex: 1.5 }} />
                <Text style={[styles.teamHeaderLabel, { color: colors.textLight }]}>{t('dakshina_calc.count', 'Count')} <Text style={styles.required}>*</Text></Text>
                <Text style={[styles.teamHeaderLabel, { color: colors.textLight }]}>{t('dakshina_calc.per_day', 'Per Day')} <Text style={styles.required}>*</Text></Text>
              </View>

              {/* Acharya Row */}
              <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamIconWrapper}>
                    <MaterialCommunityIcons name="account-tie-outline" size={24} color={isDark ? '#FFF' : colors.primary} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 4 }}>
                    <Text style={[styles.teamRole, { color: colors.text }]} numberOfLines={1}>{t('dakshina_calc.acharya', 'Acharya')}</Text>
                    <Text style={[styles.teamRoleSub, { color: colors.textLight }]}>{t('dakshina_calc.acharya_sub', 'Main Yajman & Veda Path')}</Text>
                  </View>
                </View>
                <TextInput style={[styles.teamInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]} value={acharyaCount} onChangeText={setAcharyaCount} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                <View style={[styles.teamInputWithPrefix, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                  <Text style={[styles.rupeePrefix, { color: colors.textLight }]}>₹</Text>
                  <TextInput style={[styles.prefixInput, { color: colors.text }]} value={acharyaPerDay} onChangeText={setAcharyaPerDay} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                </View>
              </View>

              {/* Upacharya Row */}
              <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamIconWrapper}>
                    <MaterialCommunityIcons name="account-outline" size={24} color={isDark ? '#FFF' : colors.primary} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 4 }}>
                    <Text style={[styles.teamRole, { color: colors.text }]} numberOfLines={1}>{t('dakshina_calc.upacharya', 'Upacharya')}</Text>
                    <Text style={[styles.teamRoleSub, { color: colors.textLight }]}>{t('dakshina_calc.upacharya_sub', 'Assistant Acharya')}</Text>
                  </View>
                </View>
                <TextInput style={[styles.teamInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]} value={upacharyaCount} onChangeText={setUpacharyaCount} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                <View style={[styles.teamInputWithPrefix, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                  <Text style={[styles.rupeePrefix, { color: colors.textLight }]}>₹</Text>
                  <TextInput style={[styles.prefixInput, { color: colors.text }]} value={upacharyaPerDay} onChangeText={setUpacharyaPerDay} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                </View>
              </View>

              {/* Pandit Row */}
              <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamIconWrapper}>
                    <MaterialCommunityIcons name="account" size={24} color={isDark ? '#FFF' : colors.primary} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 4 }}>
                    <Text style={[styles.teamRole, { color: colors.text }]} numberOfLines={1}>{t('dakshina_calc.pandit', 'Pandit')}</Text>
                    <Text style={[styles.teamRoleSub, { color: colors.textLight }]}>{t('dakshina_calc.pandit_sub', 'Mantras & Rituals')}</Text>
                  </View>
                </View>
                <TextInput style={[styles.teamInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg }]} value={panditCount} onChangeText={setPanditCount} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                <View style={[styles.teamInputWithPrefix, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                  <Text style={[styles.rupeePrefix, { color: colors.textLight }]}>₹</Text>
                  <TextInput style={[styles.prefixInput, { color: colors.text }]} value={panditPerDay} onChangeText={setPanditPerDay} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                </View>
              </View>
            </View>

            {/* Additional Amount Section */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
                <MaterialCommunityIcons name="currency-inr" size={20} color={isDark ? '#FFF' : colors.primary} />
                <View style={styles.cardHeaderTexts}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : colors.primary }]}>{t('dakshina_calc.additional_amt', 'Additional Amount')}</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textLight }]}>{t('dakshina_calc.additional_amt_sub', 'Pooja Samagri and other expenses')}</Text>
                </View>
              </View>

              <View style={styles.datesRow}>
                <View style={styles.datePickerContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>{t('dakshina_calc.samagri_amt_label', 'Samagri Amount')} <Text style={styles.required}>*</Text></Text>
                  <View style={[styles.teamInputWithPrefix, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.rupeePrefix, { color: colors.textLight }]}>₹</Text>
                    <TextInput style={[styles.prefixInput, { color: colors.text }]} value={samagriAmount} onChangeText={setSamagriAmount} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                    <Feather name="shopping-cart" size={16} color={colors.textLight} style={{ marginRight: 8 }} />
                  </View>
                  {/* Spacer to match the height of the allowance hint text */}
                  <Text style={{ fontSize: 10, color: colors.textLight, marginTop: 4 }}>{t('dakshina_calc.allowance_hint', 'Spacer')}</Text>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.datePickerContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>{t('dakshina_calc.allowance_amt_label', 'Allowance Amount')} <Text style={styles.required}>*</Text></Text>
                  <View style={[styles.teamInputWithPrefix, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.rupeePrefix, { color: colors.textLight }]}>₹</Text>
                    <TextInput style={[styles.prefixInput, { color: colors.text }]} value={transportAmount} onChangeText={setTransportAmount} keyboardType="numeric" placeholderTextColor={colors.textLight} />
                    <Feather name="briefcase" size={16} color={colors.textLight} style={{ marginRight: 8 }} />
                  </View>
                  <Text style={{ fontSize: 10, color: colors.textLight, marginTop: 4 }}>{t('dakshina_calc.allowance_hint', 'If Acharya buys materials')}</Text>
                </View>
              </View>
            </View>

            {/* Summary Section */}
            <View style={[styles.card, { backgroundColor: colors.aajkaBg, borderColor: colors.border }]}>
              <View style={[styles.cardHeader, { borderBottomWidth: 0, marginBottom: 5 }]}>
                <MaterialCommunityIcons name="calculator" size={24} color={isDark ? '#FFF' : colors.primary} />
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : colors.primary, marginLeft: 10 }]}>{t('dakshina_calc.details', 'Dakshina Details')}</Text>
              </View>

              <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                <View style={styles.summaryLabelRow}>
                  <Feather name="calendar" size={16} color={isDark ? '#FFF' : colors.primary} />
                  <Text style={[styles.summaryLabel, { color: colors.text }]}>{t('dakshina_calc.total_days_label', 'Total Days')}</Text>
                </View>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{calculatedDays} {t('dakshina_calc.days_suffix_label', 'Days')}</Text>
              </View>

              <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                <View style={styles.summaryLabelRow}>
                  <MaterialCommunityIcons name="account-group" size={18} color={isDark ? '#FFF' : colors.primary} />
                  <View>
                    <Text style={[styles.summaryLabel, { color: colors.text }]}>{t('dakshina_calc.total_dakshina_label', 'Total Dakshina')}</Text>
                    <Text style={[styles.summarySubLabel, { color: colors.textLight }]}>({acharyaCountNum}x{acharyaRate} + {upacharyaCountNum}x{upacharyaRate} + {panditCountNum}x{panditRate}) x {calculatedDays} {t('dakshina_calc.days_suffix_label', 'Days')}</Text>
                  </View>
                </View>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹ {finalAmount.toLocaleString('en-IN')}</Text>
              </View>

              <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                <View style={styles.summaryLabelRow}>
                  <MaterialCommunityIcons name="gold" size={18} color={isDark ? '#FFF' : colors.primary} />
                  <View>
                    <Text style={[styles.summaryLabel, { color: colors.text }]}>{t('dakshina_calc.samagri_plus_allowance_label', 'Samagri + Allowance')}</Text>
                    <Text style={[styles.summarySubLabel, { color: colors.textLight }]}>(₹ {D} + ₹ {E})</Text>
                  </View>
                </View>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹ {extrasTotal.toLocaleString('en-IN')}</Text>
              </View>

              <View style={[styles.grandTotalBox, { backgroundColor: isDark ? colors.primary + '20' : '#FDEED9' }]}>
                <View style={styles.summaryLabelRow}>
                  <MaterialCommunityIcons name="sack" size={20} color={isDark ? '#FFF' : '#B58105'} />
                  <Text style={[styles.grandTotalLabel, { color: isDark ? '#FFF' : colors.primary }]}>{t('dakshina_calc.final_total_label', 'Final Total')}</Text>
                </View>
                <Text style={[styles.grandTotalValue, { color: isDark ? '#FFF' : colors.primary }]}>₹ {totalAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Export Button */}
            <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
              <Text style={styles.exportButtonText}>{t('dakshina_calc.export_pdf_btn', 'Calculate Total / Share PDF')}</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#800000' },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  customHeaderContainer: { backgroundColor: '#800000', paddingBottom: 15 },
  headerContentWrapper: { paddingHorizontal: 20 },
  headerTitleText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitleText: { color: '#FFD7D7', fontSize: 12 },

  container: { flex: 1 },
  content: { padding: 16, paddingTop: 10 },

  card: { borderRadius: 12, padding: 10, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1 },
  highlightedCard: {},

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, paddingBottom: 10 },
  cardHeaderTexts: { marginLeft: 10, flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 11, marginTop: 2 },

  label: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  required: { color: '#800000' },

  inputContainer: { marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, height: 44, paddingHorizontal: 10 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 12, color: '#333' },

  datesRow: { flexDirection: 'row' },
  datePickerContainer: { flex: 1 },
  dateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 44, paddingHorizontal: 10, backgroundColor: '#FFF' },
  dateText: { fontSize: 12, color: '#333' },

  teamHeaders: { flexDirection: 'row', marginBottom: 10 },
  teamHeaderLabel: { flex: 1, fontSize: 12, color: '#666', fontWeight: 'bold', textAlign: 'center' },

  teamRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  teamInfo: { flex: 1.5, flexDirection: 'row', alignItems: 'center' },
  teamIconWrapper: { width: 36, alignItems: 'center' },
  teamRole: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  teamRoleSub: { fontSize: 10, color: '#888', marginTop: 2, flexWrap: 'wrap' },

  teamInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, textAlign: 'center', backgroundColor: '#FFF', color: '#333', fontSize: 12, marginHorizontal: 4 },
  teamInputWithPrefix: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: '#FFF', height: 40, marginHorizontal: 4 },
  prefixInput: { flex: 1, height: '100%', textAlign: 'center', color: '#333', fontSize: 12, paddingVertical: 0 },
  rupeePrefix: { fontSize: 12, color: '#666', marginLeft: 8 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#E8DCC4' },
  summaryLabelRow: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  summaryLabel: { fontSize: 12, fontWeight: 'bold', color: '#555', marginLeft: 8 },
  summarySubLabel: { fontSize: 11, color: '#888', marginLeft: 8, marginTop: 2 },
  summaryValue: { fontSize: 12, fontWeight: 'bold', color: '#333', marginTop: 2 },

  grandTotalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FDEED9', borderRadius: 8, padding: 10, marginTop: 10 },
  grandTotalLabel: { fontSize: 14, fontWeight: 'bold', color: '#800000', marginLeft: 8 },
  grandTotalValue: { fontSize: 14, fontWeight: 'bold', color: '#800000' },

  exportButton: { backgroundColor: '#800000', flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 10, borderRadius: 10, shadowColor: '#800000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  exportButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center', flex: 1 },
});

export default DakshinaCalculatorScreen;
