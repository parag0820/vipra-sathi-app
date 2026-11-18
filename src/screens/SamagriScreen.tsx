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
  StatusBar,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import CustomDropdown from '../components/CustomDropdown';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const BADGE_ROSE = '#FEE2E2';
const CARD_BORDER = '#EFECE8';
const ROW_DIVIDER = '#F3EFEA';
const WARM_BG = '#FDFBF8';
const SUBTLE_CREAM = '#FAF7F3';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

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
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isHi = i18n.language === 'hi';

  const [selectedPooja, setSelectedPooja] = useState('Satyanarayan Pooja');
  const [includeHawan, setIncludeHawan] = useState(false);
  const [filter, setFilter] = useState<'all' | 'yajman' | 'pandit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
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
    const q = searchQuery.trim().toLowerCase();
    return fullList.filter(item => {
      if (filter !== 'all') {
        const resp = itemStates[item.id]?.responsibility || 'yajman';
        if (resp !== filter) return false;
      }
      if (q) {
        const matchHi = item.name_hi.toLowerCase().includes(q);
        const matchEn = item.name_en.toLowerCase().includes(q);
        if (!matchHi && !matchEn) return false;
      }
      return true;
    });
  }, [fullList, filter, itemStates, searchQuery]);

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

  const handleShareText = async () => {
    try {
      const poojaTitle = getPoojaLabel(selectedPooja);
      const selectedItems = fullList.filter(i => itemStates[i.id]?.checked);
      const itemsToShare = selectedItems.length > 0 ? selectedItems : fullList;
      const lines = itemsToShare.map((item, idx) => {
        const resp = itemStates[item.id]?.responsibility || 'yajman';
        const who = resp === 'pandit' ? (isHi ? 'पंडित' : 'Pandit') : (isHi ? 'यजमान' : 'Yajman');
        return `${idx + 1}. ${getItemName(item)} (${getItemQty(item)}) — ${who}`;
      });
      await Share.share({
        message: `${poojaTitle} — ${isHi ? 'सामग्री सूची' : 'Samagri List'}\n\n${lines.join('\n')}`,
      });
    } catch (error) {
      console.error('Failed to share samagri list', error);
    }
  };

  const bgScreen = isDark ? '#121212' : WARM_BG;
  const surfaceBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const subtleBg = isDark ? '#252525' : SUBTLE_CREAM;
  const borderDynamic = isDark ? '#2D2D2D' : CARD_BORDER;
  const dividerDynamic = isDark ? '#2A2A2A' : ROW_DIVIDER;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;
  const allSelected = fullList.length > 0 && fullList.every(i => itemStates[i.id]?.checked);

  return (
    <View style={[styles.container, { backgroundColor: bgScreen }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={surfaceBg}
      />

      {/* Clean White Top Header matching Reference Image */}
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={24} color={accentColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: accentColor }]}>
            {t('samagri.header_title', 'सामग्री सूची')}
          </Text>
          <TouchableOpacity
            onPress={handleExportPDF}
            disabled={isExporting}
            style={styles.headerSaveBtn}
            activeOpacity={0.7}
          >
            <Text style={[styles.headerSaveText, { color: accentColor }]}>
              {isHi ? 'सहेजें' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Config Card: Pooja Dropdown + Hawan Toggle */}
        <View style={[styles.configCard, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}>
          <CustomDropdown
            label={t('samagri.select_pooja', 'पूजा का नाम')}
            value={selectedPooja}
            options={poojaOptionsWithLabels}
            onSelect={setSelectedPooja}
            containerStyle={styles.dropdownContainer}
            triggerStyle={styles.dropdownTrigger}
          />

          <View style={[styles.hawanRow, { borderTopColor: dividerDynamic }]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.hawanTitle, { color: textPrimary }]}>
                {t('samagri.hawan_samagri', 'हवन सामग्री शामिल करें')}
              </Text>
              <Text style={[styles.hawanSubtitle, { color: textSecondary }]}>
                {isHi ? 'हवन की वस्तुएँ भी इसी सूची में जोड़ें' : 'Include hawan items in this list'}
              </Text>
            </View>
            <Switch
              value={includeHawan}
              onValueChange={setIncludeHawan}
              trackColor={{ false: isDark ? '#3F3F46' : '#E5E7EB', true: PRIMARY_MAROON }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Search Input */}
        <View style={[styles.searchBox, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}>
          <Icon name="search" size={15} color={textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            placeholder={isHi ? 'सामग्री खोजें' : 'Search samagri item'}
            placeholderTextColor={textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={15} color={textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Underline Tabs (Panchang-style) + Select All Link */}
        <View style={[styles.filterHeaderRow, { borderBottomColor: dividerDynamic }]}>
          <View style={styles.filterTabsRow}>
            {[
              { id: 'all' as const, label: `${t('samagri.filter_all', 'सभी')} (${fullList.length})` },
              { id: 'yajman' as const, label: `${t('samagri.filter_yajman', 'यजमान')} (${yajmanCount})` },
              { id: 'pandit' as const, label: `${t('samagri.filter_pandit', 'पंडित')} (${panditCount})` },
            ].map(tab => {
              const active = filter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.filterTabBtn,
                    active && { borderBottomColor: accentColor },
                  ]}
                  onPress={() => setFilter(tab.id)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      active && styles.filterTabTextActive,
                      { color: active ? accentColor : textSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={toggleSelectAll} activeOpacity={0.7} style={styles.selectAllLink}>
            <Text style={[styles.selectAllLinkText, { color: accentColor }]}>
              {allSelected
                ? t('samagri.unselect_all', 'हटाएँ')
                : t('samagri.select_all', 'सभी चुनें')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clean Flat Table */}
        <View style={[styles.tableContainer, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}>
          {/* Table Header Row */}
          <View style={[styles.tableHeaderRow, { backgroundColor: subtleBg, borderBottomColor: dividerDynamic }]}>
            <TouchableOpacity onPress={toggleSelectAll} style={styles.colCheck} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name={allSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={18}
                color={allSelected ? accentColor : textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.colName}>
              <Text style={[styles.tableHeaderText, { color: textPrimary }]}>
                {t('samagri.table_header_name', 'सामग्री')}
              </Text>
            </View>
            <View style={styles.colQty}>
              <Text style={[styles.tableHeaderText, { color: textPrimary }]}>
                {t('samagri.table_header_qty', 'मात्रा')}
              </Text>
            </View>
            <View style={styles.colAssigned}>
              <Text style={[styles.tableHeaderText, { color: textPrimary }]}>
                {t('samagri.table_header_assigned', 'कौन लाएगा')}
              </Text>
            </View>
          </View>

          {/* Table Rows */}
          {filteredList.map((item, idx) => {
            const state = itemStates[item.id] || { checked: false, responsibility: 'yajman' };
            const itemName = getItemName(item);
            const isLast = idx === filteredList.length - 1;

            return (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: dividerDynamic },
                ]}
              >
                {/* Col 1: Maroon Checkbox */}
                <TouchableOpacity
                  onPress={() => toggleCheck(item.id)}
                  style={styles.colCheck}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={state.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={20}
                    color={state.checked ? PRIMARY_MAROON : textSecondary}
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
                        color: state.checked ? textSecondary : textPrimary,
                        textDecorationLine: state.checked ? 'line-through' : 'none',
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {itemName}
                  </Text>
                  {item.isHawan && (
                    <Text style={[styles.hawanTagText, { color: '#B45309' }]}>
                      {isHi ? 'हवन' : 'Hawan'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Col 3: Qty Input */}
                <View style={styles.colQty}>
                  <TextInput
                    style={[
                      styles.qtyInput,
                      {
                        color: textPrimary,
                        backgroundColor: isDark ? '#181818' : '#FFFFFF',
                        borderColor: borderDynamic,
                      },
                    ]}
                    value={getItemQty(item)}
                    onChangeText={val => handleQtyChange(item.id, val)}
                    placeholder={t('samagri.qty', 'मात्रा')}
                    placeholderTextColor={textSecondary}
                    selectTextOnFocus
                  />
                </View>

                {/* Col 4: Pandit / Yajman Soft-Rose Toggle (Matching Reference Image) */}
                <View style={styles.colAssigned}>
                  <View
                    style={[
                      styles.toggleWrap,
                      {
                        borderColor: borderDynamic,
                        backgroundColor: isDark ? '#181818' : '#F3F4F6',
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.toggleBtn,
                        state.responsibility === 'pandit' && {
                          backgroundColor: isDark ? '#3D1F1F' : BADGE_ROSE,
                        },
                      ]}
                      onPress={() => setResponsibility(item.id, 'pandit')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.toggleBtnText,
                          state.responsibility === 'pandit'
                            ? { color: accentColor, fontWeight: '700' }
                            : { color: textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {t('samagri.pandit', 'पंडित')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.toggleBtn,
                        state.responsibility === 'yajman' && {
                          backgroundColor: isDark ? '#3D1F1F' : BADGE_ROSE,
                        },
                      ]}
                      onPress={() => setResponsibility(item.id, 'yajman')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.toggleBtnText,
                          state.responsibility === 'yajman'
                            ? { color: accentColor, fontWeight: '700' }
                            : { color: textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {t('samagri.yajman', 'यजमान')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}

          {filteredList.length === 0 && (
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={28} color={textSecondary} />
              <Text style={[styles.emptyText, { color: textSecondary }]}>
                {isHi ? 'कोई सामग्री नहीं मिली' : 'No items match current filter'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Summary Line & Flat Export / Share Footer (Matching Reference Image) */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: surfaceBg,
            borderTopColor: borderDynamic,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <Text style={[styles.bottomSummaryLine, { color: textSecondary }]}>
          {isHi
            ? `${collectedCount} चयनित • पंडित: ${panditCount} • यजमान: ${yajmanCount}`
            : `${collectedCount} selected • Pandit: ${panditCount} • Yajman: ${yajmanCount}`}
        </Text>

        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={[styles.exportOutlineBtn, { backgroundColor: surfaceBg, borderColor: borderDynamic }]}
            onPress={handleExportPDF}
            disabled={isExporting}
            activeOpacity={0.75}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color={accentColor} />
            ) : (
              <>
                <Icon name="download" size={15} color={accentColor} />
                <Text style={[styles.exportOutlineText, { color: accentColor }]}>
                  {t('samagri.export_pdf', 'एक्सपोर्ट')}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sharePrimaryBtn, { backgroundColor: PRIMARY_MAROON }]}
            onPress={handleShareText}
            activeOpacity={0.8}
          >
            <Icon name="share-2" size={15} color="#FFFFFF" />
            <Text style={styles.sharePrimaryText}>
              {isHi ? 'शेयर करें' : 'Share'}
            </Text>
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
  headerTitle: {
    flex: 1,
    fontSize: 16.5,
    fontWeight: '800',
  },
  headerSaveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerSaveText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 20,
  },
  configCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownTrigger: {
    paddingHorizontal: 10,
    height: 40,
  },
  hawanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  hawanTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  hawanSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  filterTabsRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
  },
  filterTabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  filterTabTextActive: {
    fontWeight: '700',
  },
  selectAllLink: {
    paddingVertical: 6,
    paddingLeft: 8,
  },
  selectAllLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  tableContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 46,
  },
  colCheck: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colName: {
    flex: 1.35,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colQty: {
    width: 68,
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
    paddingVertical: 0,
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '600',
  },
  colAssigned: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNameText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  hawanTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 1,
  },
  toggleWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 7,
    overflow: 'hidden',
    height: 27,
    width: 106,
  },
  toggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  toggleBtnText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  bottomBar: {
    paddingHorizontal: 14,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  bottomSummaryLine: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  bottomButtonsRow: {
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
    paddingVertical: 10,
    gap: 6,
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
    paddingVertical: 10,
    gap: 6,
  },
  sharePrimaryText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
});

export default SamagriScreen;
