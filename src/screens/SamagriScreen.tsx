import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface SamagriItem {
  id: string;
  name_en: string;
  name_hi: string;
  qty: string;
  isHawan?: boolean;
}

const POOJA_OPTIONS = [
  'Satyanarayan Pooja',
  'Griha Pravesh',
  'Vivah (Wedding)',
  'Namakaran',
  'Mundan',
  'Vastu Shanti',
];

const MOCK_SAMAGRI: Record<string, SamagriItem[]> = {
  'Satyanarayan Pooja': [
    { id: '1', name_en: 'Kalash (Copper/Brass)', name_hi: 'कलश (तांबा/पीतल)', qty: '1' },
    { id: '2', name_en: 'Nariyal (Coconut)', name_hi: 'नारियल (श्रीफल)', qty: '2' },
    { id: '3', name_en: 'Supari (Betel Nut)', name_hi: 'सुपारी', qty: '11' },
    { id: '4', name_en: 'Haldi Powder', name_hi: 'हल्दी पाउडर', qty: '50g' },
    { id: '5', name_en: 'Kumkum (Roli)', name_hi: 'कुमकुम (रोली)', qty: '50g' },
    { id: '6', name_en: 'Paan Leaves', name_hi: 'पान के पत्ते', qty: '11' },
    { id: '7', name_en: 'Flowers & Garlands', name_hi: 'फूल एवं माला', qty: '500g' },
    { id: '8', name_en: 'Fruits (5 types)', name_hi: 'पंच फल (5 प्रकार)', qty: '5 each' },
    { id: '9', name_en: 'Panchamrit', name_hi: 'पंचामृत (दूध, दही, घी, शहद, शर्करा)', qty: '1 bowl' },
    { id: '10', name_en: 'Prasad (Sheera/Panjiri)', name_hi: 'प्रसाद (शीरा/पंजीरी)', qty: '1 bowl' },
    { id: '11', name_en: 'Akshat (Whole Rice)', name_hi: 'अक्षत (बिना टूटा चावल)', qty: '250g' },
    { id: '12', name_en: 'Janeu (Sacred Thread)', name_hi: 'जनेऊ (यज्ञोपवीत)', qty: '2 pcs' },
    { id: '13', name_en: 'Dhoop & Agarbatti', name_hi: 'धूप एवं अगरबत्ती', qty: '1 pkt' },
    { id: '14', name_en: 'Deepak & Pure Ghee', name_hi: 'दीपक एवं शुद्ध घी', qty: '250g' },
  ],
  'Griha Pravesh': [
    { id: 'gp1', name_en: 'Kalash (Copper/Brass)', name_hi: 'कलश (तांबे के)', qty: '2 pcs' },
    { id: 'gp2', name_en: 'Coconut with Red Cloth', name_hi: 'नारियल चुनरी सहित', qty: '3 pcs' },
    { id: 'gp3', name_en: 'Mango Leaves (Toran)', name_hi: 'आम के पत्ते (तोरण)', qty: '21 pcs' },
    { id: 'gp4', name_en: 'Fresh Cow Milk', name_hi: 'गाय का कच्चा दूध', qty: '1 Ltr' },
    { id: 'gp5', name_en: 'Jaggery & Pure Ghee', name_hi: 'गुड़ एवं शुद्ध घी', qty: '250g' },
    { id: 'gp6', name_en: 'Ganga Jal', name_hi: 'गंगा जल', qty: '1 bottle' },
    { id: 'gp7', name_en: 'Akshat (Rice)', name_hi: 'अक्षत (चावल)', qty: '1 kg' },
    { id: 'gp8', name_en: 'Haldi & Kumkum', name_hi: 'हल्दी और कुमकुम', qty: '100g' },
    { id: 'gp9', name_en: 'Garlands (Flower)', name_hi: 'फूलों की माला', qty: '4 pcs' },
    { id: 'gp10', name_en: 'Vastu Yantra', name_hi: 'वास्तु यंत्र', qty: '1 pc' },
    { id: 'gp11', name_en: 'Brass Bell & Shankh', name_hi: 'घंटी एवं शंख', qty: '1 set' },
  ],
  'Vivah (Wedding)': [
    { id: 'v1', name_en: 'Madhuparka Bronze Cup', name_hi: 'मधुपर्क पात्र (कांसा)', qty: '2 pcs' },
    { id: 'v2', name_en: 'Jaimala (Special Garlands)', name_hi: 'जयमाला (विशेष)', qty: '2 pcs' },
    { id: 'v3', name_en: 'Kanyadaan Samagri (Silver)', name_hi: 'कन्यादान सामग्री (रजत/स्वर्ण)', qty: '1 set' },
    { id: 'v4', name_en: 'Sindoor Box & Kajal', name_hi: 'सिंदूर डिब्बी व काजल', qty: '1 set' },
    { id: 'v5', name_en: 'Mangalsutra & Ring', name_hi: 'मंगलसूत्र व अंगूठी', qty: '1 set' },
    { id: 'v6', name_en: 'Laja (Puffed Rice)', name_hi: 'लाजा (धान की खील)', qty: '500g' },
    { id: 'v7', name_en: 'Saptapadi Betel Nuts', name_hi: 'सप्तपदी सुपारी', qty: '7 pcs' },
    { id: 'v8', name_en: 'Gathbandhan Cloth', name_hi: 'गठबंधन वस्त्र (दुपट्टा)', qty: '1 pc' },
    { id: 'v9', name_en: 'Janeu Pair', name_hi: 'जनेऊ जोड़ा', qty: '2 sets' },
    { id: 'v10', name_en: 'Dry Fruits & Sweets', name_hi: 'मेवा एवं मिष्ठान', qty: '1 kg' },
  ],
  'Namakaran': [
    { id: 'n1', name_en: 'New Clothes for Baby', name_hi: 'शिशु के नवीन वस्त्र', qty: '1 set' },
    { id: 'n2', name_en: 'Honey & Gold Ring (Chutni)', name_hi: 'शहद एवं स्वर्ण शलाका', qty: '1' },
    { id: 'n3', name_en: 'Kajal & Silver Bangle', name_hi: 'काजल व चांदी की कड़ा', qty: '1 set' },
    { id: 'n4', name_en: 'Bronze Plate (Kansa)', name_hi: 'कांस्य थाली', qty: '1 pc' },
    { id: 'n5', name_en: 'Rice for Writing Name', name_hi: 'नाम लेखन हेतु अक्षत', qty: '500g' },
    { id: 'n6', name_en: 'Ganga Jal & Panchamrit', name_hi: 'गंगाजल व पंचामृत', qty: '1 bowl' },
    { id: 'n7', name_en: 'Flowers & Sweets', name_hi: 'पुष्प एवं मिठाई', qty: '500g' },
  ],
  'Mundan': [
    { id: 'm1', name_en: 'New Clothes for Child', name_hi: 'बालक के नवीन वस्त्र', qty: '1 set' },
    { id: 'm2', name_en: 'Ganga Jal', name_hi: 'गंगा जल', qty: '1 bottle' },
    { id: 'm3', name_en: 'Curd & Turmeric Paste', name_hi: 'दही व हल्दी लेप', qty: '1 bowl' },
    { id: 'm4', name_en: 'Silver Coin (Rajat Mudra)', name_hi: 'चांदी का सिक्का', qty: '1 pc' },
    { id: 'm5', name_en: 'Sweets / Ladoo', name_hi: 'लड्डू / मिठाई', qty: '1 kg' },
    { id: 'm6', name_en: 'Yellow Mustard Seeds', name_hi: 'पीली सरसों', qty: '50g' },
    { id: 'm7', name_en: 'New Towel & Barber Cloth', name_hi: 'तौलिया एवं नवीन वस्त्र', qty: '2 pcs' },
  ],
  'Vastu Shanti': [
    { id: 'vs1', name_en: 'Navratna & Panchadhatu', name_hi: 'नवरत्न एवं पंचधातु', qty: '1 set' },
    { id: 'vs2', name_en: 'Vastu Yantra', name_hi: 'वास्तु यंत्र', qty: '1 pc' },
    { id: 'vs3', name_en: 'Sea Salt', name_hi: 'समुद्री नमक (साबुत)', qty: '1 kg' },
    { id: 'vs4', name_en: 'White Mustard Seeds (Sarson)', name_hi: 'सफेद सरसों', qty: '100g' },
    { id: 'vs5', name_en: 'Cow Dung Cakes (Uple)', name_hi: 'गोबर के उपले / कंडे', qty: '5 pcs' },
    { id: 'vs6', name_en: 'Kalash (Copper)', name_hi: 'तांबे का कलश', qty: '1 pc' },
    { id: 'vs7', name_en: 'Red & Yellow Cloth', name_hi: 'लाल व पीला वस्त्र', qty: '1.25m each' },
  ],
};

const HAWAN_SAMAGRI: SamagriItem[] = [
  { id: 'h1', name_en: 'Havan Kund', name_hi: 'हवन कुंड', qty: '1 pc', isHawan: true },
  { id: 'h2', name_en: 'Mango Wood (Aam ki Samidha)', name_hi: 'आम की सूखी लकड़ी (समिधा)', qty: '2 kg', isHawan: true },
  { id: 'h3', name_en: 'Havan Samagri Mixture', name_hi: 'हवन सामग्री पैकेट', qty: '500g', isHawan: true },
  { id: 'h4', name_en: 'Pure Cow Ghee', name_hi: 'शुद्ध देशी गाय का घी', qty: '500g', isHawan: true },
  { id: 'h5', name_en: 'Navagraha Samidha (9 sticks)', name_hi: 'नवग्रह समिधा (9 प्रकार)', qty: '1 pkt', isHawan: true },
  { id: 'h6', name_en: 'Camphor (Kapur)', name_hi: 'कपूर (भीमसेनी)', qty: '1 pkt', isHawan: true },
  { id: 'h7', name_en: 'Black Sesame Seeds (Kala Til)', name_hi: 'काला तिल', qty: '250g', isHawan: true },
  { id: 'h8', name_en: 'Barley Seeds (Jau)', name_hi: 'जौ (यव)', qty: '250g', isHawan: true },
];

const SamagriScreen = () => {
  const { colors, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [selectedPooja, setSelectedPooja] = useState('Satyanarayan Pooja');
  const [includeHawan, setIncludeHawan] = useState(false);
  const [filter, setFilter] = useState<'all' | 'yajman' | 'pandit'>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Default responsibility: yajman
  const [itemStates, setItemStates] = useState<Record<string, { checked: boolean; responsibility: 'pandit' | 'yajman' }>>({});
  // Editable quantity/mattra state
  const [customQuantities, setCustomQuantities] = useState<Record<string, string>>({});

  const getItemQty = (item: SamagriItem) => {
    return customQuantities[item.id] !== undefined ? customQuantities[item.id] : item.qty;
  };

  const handleQtyChange = (id: string, text: string) => {
    setCustomQuantities(prev => ({ ...prev, [id]: text }));
  };

  const getPoojaLabel = (pooja: string) => {
    switch (pooja) {
      case 'Satyanarayan Pooja': return t('samagri.poojas.satyanarayan', 'Satyanarayan Pooja');
      case 'Griha Pravesh': return t('samagri.poojas.griha_pravesh', 'Griha Pravesh');
      case 'Vivah (Wedding)': return t('samagri.poojas.vivah', 'Vivah (Wedding)');
      case 'Namakaran': return t('samagri.poojas.namakaran', 'Namakaran');
      case 'Mundan': return t('samagri.poojas.mundan', 'Mundan');
      case 'Vastu Shanti': return t('samagri.poojas.vastu_shanti', 'Vastu Shanti');
      default: return pooja;
    }
  };

  const getItemName = (item: SamagriItem) => {
    return i18n.language === 'hi' ? item.name_hi : item.name_en;
  };

  const poojaOptionsWithLabels = POOJA_OPTIONS.map(p => ({
    label: getPoojaLabel(p),
    value: p,
  }));

  const currentSamagri = MOCK_SAMAGRI[selectedPooja] || MOCK_SAMAGRI['Satyanarayan Pooja'];
  const fullList = useMemo(() => {
    return includeHawan ? [...currentSamagri, ...HAWAN_SAMAGRI] : currentSamagri;
  }, [currentSamagri, includeHawan]);

  const filteredList = useMemo(() => {
    if (filter === 'all') return fullList;
    return fullList.filter(item => {
      const resp = itemStates[item.id]?.responsibility || 'yajman';
      return resp === filter;
    });
  }, [fullList, filter, itemStates]);

  const yajmanCount = useMemo(() => {
    return fullList.filter(item => (itemStates[item.id]?.responsibility || 'yajman') === 'yajman').length;
  }, [fullList, itemStates]);

  const panditCount = useMemo(() => {
    return fullList.filter(item => itemStates[item.id]?.responsibility === 'pandit').length;
  }, [fullList, itemStates]);

  const collectedCount = useMemo(() => {
    return fullList.filter(item => itemStates[item.id]?.checked).length;
  }, [fullList, itemStates]);

  const toggleCheck = (id: string) => {
    setItemStates(prev => {
      const existing = prev[id] || { checked: false, responsibility: 'yajman' };
      return { ...prev, [id]: { ...existing, checked: !existing.checked } };
    });
  };

  const setResponsibility = (id: string, resp: 'pandit' | 'yajman') => {
    setItemStates(prev => {
      const existing = prev[id] || { checked: false, responsibility: 'yajman' };
      return { ...prev, [id]: { ...existing, responsibility: resp } };
    });
  };

  const toggleSelectAll = () => {
    const allChecked = fullList.every(item => itemStates[item.id]?.checked);
    setItemStates(prev => {
      const updated = { ...prev };
      fullList.forEach(item => {
        const existing = updated[item.id] || { checked: false, responsibility: 'yajman' };
        updated[item.id] = { ...existing, checked: !allChecked };
      });
      return updated;
    });
  };

  const generateSamagriPdfHtml = () => {
    const poojaTitle = getPoojaLabel(selectedPooja);
    const dateStr = new Date().toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const isHi = i18n.language === 'hi';

    const rowsHtml = fullList.map((item, idx) => {
      const state = itemStates[item.id] || { checked: false, responsibility: 'yajman' };
      const name = getItemName(item);
      const isYajman = state.responsibility === 'yajman';
      return `
        <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FFFDF9'};">
          <td style="text-align: center; font-weight: bold; padding: 10px 8px; border-bottom: 1px solid #EAD8C3; font-size: 13px;">${idx + 1}</td>
          <td style="text-align: center; padding: 10px 8px; border-bottom: 1px solid #EAD8C3; font-size: 14px;">${state.checked ? '☑️' : '⬜'}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EAD8C3; font-size: 14px; font-weight: 600; color: #2C2C2C;">
            ${name}
            ${item.isHawan ? `<span style="font-size: 10px; color: #D35400; background: #FDEED9; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: bold;">${isHi ? 'हवन' : 'Hawan'}</span>` : ''}
          </td>
          <td style="text-align: center; padding: 10px 8px; border-bottom: 1px solid #EAD8C3; font-size: 13px; font-weight: bold; color: #555;">
            ${getItemQty(item)}
          </td>
          <td style="text-align: center; padding: 10px 8px; border-bottom: 1px solid #EAD8C3;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; ${isYajman ? 'background-color: #FDEED9; color: #B3541E; border: 1px solid #FAD7A0;' : 'background-color: #E8F4F8; color: #1B4F72; border: 1px solid #AED6F1;'}">
              ${isYajman ? (isHi ? 'यजमान' : 'Yajman') : (isHi ? 'पंडित जी' : 'Pandit')}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <title>${poojaTitle} - Samagri List</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans Devanagari", sans-serif;
              padding: 24px;
              color: #2D3748;
              background-color: #FFF;
              margin: 0;
            }
            .header-banner {
              text-align: center;
              border-bottom: 3px double #C85A17;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .om-symbol {
              font-size: 28px;
              color: #C85A17;
              font-weight: bold;
              margin-bottom: 2px;
            }
            .shree-ganesh {
              font-size: 13px;
              color: #8D3B03;
              letter-spacing: 2px;
              margin-bottom: 6px;
              font-weight: 600;
            }
            .app-title {
              font-size: 22px;
              font-weight: 800;
              color: #C85A17;
              margin: 0 0 4px 0;
              letter-spacing: 0.5px;
            }
            .doc-title {
              font-size: 18px;
              font-weight: 700;
              color: #2C3E50;
              margin: 4px 0;
            }
            .doc-subtitle {
              font-size: 12px;
              color: #7F8C8D;
              margin: 0;
            }
            .summary-card {
              background-color: #FFFBF5;
              border: 1px solid #F5CBA7;
              border-radius: 8px;
              padding: 12px 16px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-around;
              text-align: center;
            }
            .stat-box {
              flex: 1;
            }
            .stat-num {
              font-size: 18px;
              font-weight: 800;
              color: #C85A17;
            }
            .stat-label {
              font-size: 11px;
              color: #7F8C8D;
              text-transform: uppercase;
              margin-top: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
              border: 1px solid #EAD8C3;
              border-radius: 8px;
              overflow: hidden;
            }
            th {
              background-color: #C85A17;
              color: #FFFFFF;
              padding: 10px 8px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border: none;
            }
            .notes-box {
              background-color: #F8F9FA;
              border-left: 4px solid #C85A17;
              padding: 12px 16px;
              border-radius: 4px;
              font-size: 12px;
              color: #555;
              margin-bottom: 24px;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              color: #95A5A6;
              border-top: 1px solid #EEE;
              padding-top: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div class="om-symbol">ॐ</div>
            <div class="shree-ganesh">॥ श्री गणेशाय नमः ॥</div>
            <h1 class="app-title">विप्र साथी • VIPRA SAARTHI</h1>
            <div class="doc-title">${poojaTitle} — ${isHi ? 'सामग्री सूची' : 'Samagri List'}</div>
            <p class="doc-subtitle">${isHi ? 'दिनांक' : 'Date'}: ${dateStr} ${includeHawan ? ' • ' + (isHi ? 'हवन सामग्री सम्मिलित' : 'Includes Hawan Samagri') : ''}</p>
          </div>

          <div class="summary-card">
            <div class="stat-box">
              <div class="stat-num">${fullList.length}</div>
              <div class="stat-label">${isHi ? 'कुल सामग्री' : 'Total Items'}</div>
            </div>
            <div class="stat-box" style="border-left: 1px solid #EAD8C3; border-right: 1px solid #EAD8C3;">
              <div class="stat-num" style="color: #B3541E;">${yajmanCount}</div>
              <div class="stat-label">${isHi ? 'यजमान व्यवस्था' : 'By Yajman'}</div>
            </div>
            <div class="stat-box" style="border-right: 1px solid #EAD8C3;">
              <div class="stat-num" style="color: #1B4F72;">${panditCount}</div>
              <div class="stat-label">${isHi ? 'पंडित जी लाएंगे' : 'By Panditji'}</div>
            </div>
            <div class="stat-box">
              <div class="stat-num" style="color: #27AE60;">${collectedCount}/${fullList.length}</div>
              <div class="stat-label">${isHi ? 'एकत्रित' : 'Collected'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 8%; text-align: center;">${isHi ? 'क्र.' : 'S.N.'}</th>
                <th style="width: 8%; text-align: center;">${isHi ? 'स्थिति' : 'Done'}</th>
                <th style="width: 48%; text-align: left; padding-left: 12px;">${isHi ? 'सामग्री का नाम' : 'Samagri Item'}</th>
                <th style="width: 16%; text-align: center;">${isHi ? 'मात्रा' : 'Qty'}</th>
                <th style="width: 20%; text-align: center;">${isHi ? 'व्यवस्था' : 'Arranged By'}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="notes-box">
            <strong>${isHi ? 'विशेष निर्देश:' : 'Important Instructions:'}</strong><br/>
            ${isHi
        ? '• कृपया यजमान द्वारा चिह्नित सामग्री एक दिन पूर्व ही व्यवस्थित कर लें।<br/>• ताज़ा फूल, फल एवं पंचामृत पूजा के दिन ही मंगवाएं।'
        : '• Please arrange items marked for Yajman one day prior to the ritual.<br/>• Fresh flowers, fruits, and panchamrit should be arranged on the day of the pooja.'}
          </div>

          <div class="footer">
            विप्र साथी (Vipra Saarthi) — सनातन वैदिक सेवा एवं कर्मकांड डिजिटल सहयोगी
          </div>
        </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const html = generateSamagriPdfHtml();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Failed to generate or share PDF', error);
      Alert.alert('PDF Export Error', 'Could not generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title={t('samagri.header_title', 'Samagri Planner')}
        showBack={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        {/* Configuration Section */}
        <View style={[styles.configSection, { backgroundColor: isDark ? colors.surface : '#FFF', borderBottomColor: colors.border }]}>
          <View style={styles.configRow}>
            {/* Pooja Dropdown */}
            <View style={styles.dropdownCol}>
              <CustomDropdown
                label={t('samagri.select_pooja', 'Select Pooja')}
                value={selectedPooja}
                options={poojaOptionsWithLabels}
                onSelect={setSelectedPooja}
                containerStyle={styles.dropdownContainer}
                triggerStyle={styles.dropdownTrigger}
              />
            </View>

            {/* Hawan Samagri Toggle */}
            <View style={styles.hawanCol}>
              <Text style={[styles.controlLabel, { color: colors.text }]}>{t('samagri.hawan_samagri', 'Hawan Samagri')}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIncludeHawan(prev => !prev)}
                style={[
                  styles.hawanToggleCard,
                  {
                    backgroundColor: includeHawan
                      ? (isDark ? colors.primary + '22' : colors.primary + '12')
                      : (isDark ? 'rgba(255,255,255,0.03)' : colors.background),
                    borderColor: includeHawan ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={styles.hawanCardContent}>
                  <View
                    style={[
                      styles.hawanIconWrap,
                      {
                        backgroundColor: includeHawan ? colors.primary : colors.primary + '18',
                      },
                    ]}
                  >
                    <Icon name="sun" size={13} color={includeHawan ? '#FFF' : colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.hawanStatusText,
                      {
                        color: includeHawan ? colors.primary : colors.text,
                        fontWeight: includeHawan ? '700' : '500',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {includeHawan ? t('samagri.added', 'Added') : t('samagri.include', 'Include')}
                  </Text>
                </View>

                <View pointerEvents="none" style={styles.switchContainer}>
                  <Switch
                    value={includeHawan}
                    onValueChange={setIncludeHawan}
                    trackColor={{ false: colors.border, true: colors.primary + '75' }}
                    thumbColor={includeHawan ? colors.primary : '#f4f3f4'}
                    style={
                      Platform.OS === 'ios'
                        ? { transform: [{ scaleX: 0.68 }, { scaleY: 0.68 }] }
                        : { transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }] }
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Summary Bar */}
          <View style={[styles.summaryBar, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FDFBF7' }]}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryVal, { color: colors.text }]}>{fullList.length}</Text>
              <Text style={[styles.summaryLbl, { color: colors.textLight }]}>{t('samagri.filter_all', 'All')}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryVal, { color: colors.primary }]}>{yajmanCount}</Text>
              <Text style={[styles.summaryLbl, { color: colors.textLight }]}>{t('samagri.yajman', 'Yajman')}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryVal, { color: '#B3541E' }]}>{panditCount}</Text>
              <Text style={[styles.summaryLbl, { color: colors.textLight }]}>{t('samagri.pandit', 'Pandit')}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryVal, { color: '#27AE60' }]}>{collectedCount}</Text>
              <Text style={[styles.summaryLbl, { color: colors.textLight }]}>{t('samagri.collected', 'Done')}</Text>
            </View>
          </View>
        </View>

        {/* Filter and Bulk Action Bar */}
        <View style={[styles.filterBar, { backgroundColor: isDark ? colors.background : '#FAF7F2' }]}>
          {/* Segmented Filter */}
          <View style={styles.filterPills}>
            <TouchableOpacity
              onPress={() => setFilter('all')}
              style={[
                styles.filterPill,
                filter === 'all' && [styles.filterPillActive, { backgroundColor: colors.primary }],
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, filter === 'all' ? styles.filterPillTextActive : { color: colors.textLight }]}>
                {t('samagri.filter_all', 'All')} ({fullList.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('yajman')}
              style={[
                styles.filterPill,
                filter === 'yajman' && [styles.filterPillActive, { backgroundColor: colors.primary }],
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, filter === 'yajman' ? styles.filterPillTextActive : { color: colors.textLight }]}>
                {t('samagri.filter_yajman', 'Yajman')} ({yajmanCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('pandit')}
              style={[
                styles.filterPill,
                filter === 'pandit' && [styles.filterPillActive, { backgroundColor: colors.primary }],
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, filter === 'pandit' ? styles.filterPillTextActive : { color: colors.textLight }]}>
                {t('samagri.filter_pandit', 'Pandit')} ({panditCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Select All Button */}
          <TouchableOpacity
            onPress={toggleSelectAll}
            style={[styles.selectAllBtn, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Icon
              name={fullList.every(i => itemStates[i.id]?.checked) ? 'check-square' : 'square'}
              size={13}
              color={colors.primary}
            />
            <Text style={[styles.selectAllText, { color: colors.primary }]}>
              {fullList.every(i => itemStates[i.id]?.checked)
                ? t('samagri.unselect_all', 'Unselect All')
                : t('samagri.select_all', 'Select All')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Samagri List in Table Format */}
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Table Container Card */}
          <View style={[styles.tableContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Table Header Row */}
            <View style={[styles.tableHeaderRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F5ECE1', borderBottomColor: colors.border }]}>
              <View style={styles.colCheck}>
                <Icon name="check" size={13} color={colors.textLight} />
              </View>
              <View style={styles.colName}>
                <Text style={[styles.tableHeaderText, { color: colors.text }]}>
                  {t('samagri.table_header_name', 'Samagri Name')}
                </Text>
              </View>
              <View style={styles.colQty}>
                <Text style={[styles.tableHeaderText, { color: colors.text }]}>
                  {t('samagri.table_header_qty', 'Qty')}
                </Text>
              </View>
              <View style={styles.colAssigned}>
                <Text style={[styles.tableHeaderText, { color: colors.text }]}>
                  {t('samagri.table_header_assigned', 'Arranged By')}
                </Text>
              </View>
            </View>

            {/* Table Body Rows */}
            {filteredList.map((item, index) => {
              const state = itemStates[item.id] || { checked: false, responsibility: 'yajman' };
              const itemName = getItemName(item);
              const isEven = index % 2 === 0;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.tableRow,
                    {
                      borderBottomColor: colors.border,
                      backgroundColor: isEven
                        ? (isDark ? colors.surface : '#FFFFFF')
                        : (isDark ? 'rgba(255,255,255,0.015)' : '#FCFAF7'),
                    },
                  ]}
                >
                  {/* Col 1: Checkbox */}
                  <TouchableOpacity
                    onPress={() => toggleCheck(item.id)}
                    style={styles.colCheck}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={state.checked ? 'check-square' : 'square'}
                      size={18}
                      color={state.checked ? colors.primary : colors.textLight}
                    />
                  </TouchableOpacity>

                  {/* Col 2: Name */}
                  <TouchableOpacity
                    onPress={() => toggleCheck(item.id)}
                    style={styles.colName}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.itemNameText,
                        {
                          color: state.checked ? colors.textLight : colors.text,
                          textDecorationLine: state.checked ? 'line-through' : 'none',
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {itemName}
                    </Text>
                    {item.isHawan && (
                      <View style={styles.hawanBadge}>
                        <Text style={styles.hawanBadgeText}>
                          {i18n.language === 'hi' ? 'हवन' : 'Hawan'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Col 3: Qty (Editable) */}
                  <View style={styles.colQty}>
                    <TextInput
                      style={[
                        styles.qtyInput,
                        {
                          color: colors.text,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F5EFE6',
                          borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#DFD4C4',
                        },
                      ]}
                      value={getItemQty(item)}
                      onChangeText={(val) => handleQtyChange(item.id, val)}
                      placeholder={t('samagri.qty', 'Qty')}
                      placeholderTextColor={colors.textLight}
                      selectTextOnFocus
                    />
                  </View>

                  {/* Col 4: Yajman / Pandit Toggle */}
                  <View style={styles.colAssigned}>
                    <View style={[styles.toggleWrap, { borderColor: colors.border, backgroundColor: isDark ? '#141414' : '#EFEAE3' }]}>
                      <TouchableOpacity
                        style={[
                          styles.toggleBtn,
                          state.responsibility === 'yajman' && [styles.toggleActiveYajman, { backgroundColor: colors.primary }],
                        ]}
                        onPress={() => setResponsibility(item.id, 'yajman')}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.toggleBtnText,
                            state.responsibility === 'yajman' ? styles.toggleBtnTextActive : { color: colors.textLight },
                          ]}
                          numberOfLines={1}
                        >
                          {t('samagri.yajman', 'Yajman')}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.toggleBtn,
                          state.responsibility === 'pandit' && [styles.toggleActivePandit, { backgroundColor: '#B3541E' }],
                        ]}
                        onPress={() => setResponsibility(item.id, 'pandit')}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.toggleBtnText,
                            state.responsibility === 'pandit' ? styles.toggleBtnTextActive : { color: colors.textLight },
                          ]}
                          numberOfLines={1}
                        >
                          {t('samagri.pandit', 'Pandit')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {filteredList.length === 0 && (
              <View style={styles.emptyContainer}>
                <Icon name="inbox" size={32} color={colors.textLight} />
                <Text style={[styles.emptyText, { color: colors.textLight }]}>
                  {i18n.language === 'hi' ? 'कोई सामग्री नहीं मिली' : 'No items match current filter'}
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* Bottom Bar for Export PDF */}
        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.pdfBtn, { backgroundColor: '#B03A2E' }]}
            onPress={handleExportPDF}
            disabled={isExporting}
            activeOpacity={0.85}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Icon name="file-text" size={18} color="#FFF" />
                <Text style={styles.bottomBtnText}>{t('samagri.export_pdf', 'Export PDF')}</Text>
              </>
            )}
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
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  configSection: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dropdownCol: {
    flex: 1.25,
  },
  dropdownContainer: {
    marginBottom: 0,
  },
  dropdownTrigger: {
    paddingHorizontal: 10,
    height: 42,
  },
  hawanCol: {
    flex: 1,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  hawanToggleCard: {
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  hawanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 4,
  },
  hawanIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  hawanStatusText: {
    fontSize: 11,
    flexShrink: 1,
  },
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryLbl: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  summaryDivider: {
    width: 1,
    height: 20,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectAllText: {
    fontSize: 11,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  tableContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 1.5,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
  },
  colCheck: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colName: {
    flex: 1.4,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colQty: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  qtyInput: {
    width: '100%',
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
  colAssigned: {
    width: 114,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNameText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
  hawanBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDEED9',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
  },
  hawanBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#D35400',
  },
  qtyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 42,
    alignItems: 'center',
  },
  qtyBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  toggleWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    height: 27,
    width: 110,
  },
  toggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  toggleActiveYajman: {
    elevation: 2,
  },
  toggleActivePandit: {
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bottomBar: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
  },
  pdfBtn: {
    width: '100%',
    flexDirection: 'row',
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: 8,
  },
  bottomBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
});

export default SamagriScreen;
