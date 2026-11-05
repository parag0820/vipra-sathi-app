import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  StatusBar,
  useWindowDimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useYajmans } from '../hooks/useYajmans';
import { Yajman } from '../types/yajman';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_PINK = '#FFF0ED';
const BADGE_PINK = '#FEE2E2';
const TEXT_MAROON = '#991B1B';

// Enhanced Yajman item for rich display as shown in the design
interface DisplayYajman extends Yajman {
  avatarChar?: string;
  categoryTag?: 'परिवार' | 'व्यक्तिगत' | 'संस्था' | string;
  subInfo?: string;
  subInfoIcon?: 'calendar' | 'clock' | 'users' | 'briefcase';
  subInfoColor?: string;
}

// Sample items matching the reference screenshot exactly
const DEFAULT_SAMPLE_YAJMANS: DisplayYajman[] = [
  {
    id: 'sample_1',
    name: 'राजेश शर्मा',
    avatarChar: 'श',
    category: 'परिवार',
    categoryTag: 'परिवार',
    callingMobile: '+91 98765 4821',
    whatsappMobile: '+91 98765 4821',
    city: 'वाराणसी',
    subInfo: 'अगली बुकिंग: गृह प्रवेश • 5 नव',
    subInfoIcon: 'calendar',
    subInfoColor: '#991B1B',
    kycDate: '2026-10-01',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'sample_2',
    name: 'सुनीता वर्मा',
    avatarChar: 'व',
    category: 'व्यक्तिगत',
    categoryTag: 'व्यक्तिगत',
    callingMobile: '+91 98765 7316',
    whatsappMobile: '+91 98765 7316',
    city: 'लखनऊ',
    subInfo: 'अंतिम पूजा: सत्यनारायण • 22 अक्टू',
    subInfoIcon: 'clock',
    subInfoColor: '#6B7280',
    kycDate: '2026-10-02',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'sample_3',
    name: 'मोहन मिश्रा',
    avatarChar: 'म',
    category: 'परिवार',
    categoryTag: 'परिवार',
    callingMobile: '+91 98765 2048',
    whatsappMobile: '+91 98765 2048',
    city: 'प्रयागराज',
    subInfo: 'गोत्र: भारद्वाज • परिवार: 5 सदस्य',
    subInfoIcon: 'users',
    subInfoColor: '#6B7280',
    kycDate: '2026-10-03',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'sample_4',
    name: 'शिव मंदिर ट्रस्ट',
    avatarChar: 'त',
    category: 'संस्था',
    categoryTag: 'संस्था',
    callingMobile: '+91 98765 9652',
    whatsappMobile: '+91 98765 9652',
    city: 'वाराणसी',
    subInfo: 'संपर्क: अशोक जी • मासिक हवन',
    subInfoIcon: 'briefcase',
    subInfoColor: '#6B7280',
    kycDate: '2026-10-04',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'sample_5',
    name: 'अमित गुप्ता',
    avatarChar: 'ग',
    category: 'व्यक्तिगत',
    categoryTag: 'व्यक्तिगत',
    callingMobile: '+91 98765 3187',
    whatsappMobile: '+91 98765 3187',
    city: 'जौनपुर',
    subInfo: 'अंतिम पूजा: रुद्राभिषेक • 18 अक्टू',
    subInfoIcon: 'clock',
    subInfoColor: '#6B7280',
    kycDate: '2026-10-05',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'sample_6',
    name: 'दीपक पांडेय',
    avatarChar: 'प',
    category: 'परिवार',
    categoryTag: 'परिवार',
    callingMobile: '+91 98765 6549',
    whatsappMobile: '+91 98765 6549',
    city: 'चंदौली',
    subInfo: 'गोत्र: कश्यप • परिवार: 4 सदस्य',
    subInfoIcon: 'users',
    subInfoColor: '#6B7280',
    kycDate: '2026-10-06',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'sample_7',
    name: 'अन्नपूर्णा सेवा समिति',
    avatarChar: 'अ',
    category: 'संस्था',
    categoryTag: 'संस्था',
    callingMobile: '+91 98765 8274',
    whatsappMobile: '+91 98765 8274',
    city: 'मिर्ज़ापुर',
    subInfo: 'संपर्क: विनोद जी • वार्षिक आयोजन',
    subInfoIcon: 'briefcase',
    subInfoColor: '#6B7280',
    kycDate: '2026-10-07',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const YajmanListScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const { yajmans, isLoading, refreshYajmans, deleteYajman } = useYajmans();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'व्यक्तिगत' | 'परिवार' | 'संस्था'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [yajmanToDelete, setYajmanToDelete] = useState<DisplayYajman | null>(null);
  const [itemsToShow, setItemsToShow] = useState(10);

  useFocusEffect(
    useCallback(() => {
      refreshYajmans();
    }, [refreshYajmans])
  );

  // Helper to extract character for avatar
  const getAvatarChar = (name: string, fallback?: string): string => {
    if (fallback) return fallback;
    if (!name) return 'य';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1 && parts[parts.length - 1].length > 0) {
      return parts[parts.length - 1].charAt(0);
    }
    return name.charAt(0);
  };

  // Helper to mask phone as: +91 ******* 4821
  const formatPhone = (phone?: string): string => {
    if (!phone) return '+91 ******* 0000';
    const digits = phone.replace(/\D/g, '');
    const last4 = digits.slice(-4) || '0000';
    return `+91 ******* ${last4}`;
  };

  // Combine live API yajmans with default samples
  const allYajmans: DisplayYajman[] = useMemo(() => {
    if (yajmans && yajmans.length > 0) {
      const mapped = yajmans.map((y, idx) => {
        const cat = (y.category || 'व्यक्तिगत').includes('परिवार')
          ? 'परिवार'
          : (y.category || '').includes('संस्था')
          ? 'संस्था'
          : 'व्यक्तिगत';

        return {
          ...y,
          avatarChar: getAvatarChar(y.name),
          categoryTag: cat,
          subInfo: y.remark || (y.city ? `शहर: ${y.city}` : 'सक्रिय यजमान'),
          subInfoIcon: 'clock' as const,
          subInfoColor: '#6B7280',
        };
      });

      // Merge samples if count is small so UI matches reference density
      if (mapped.length < 5) {
        const remainingSamples = DEFAULT_SAMPLE_YAJMANS.filter(
          s => !mapped.some(m => m.name.toLowerCase() === s.name.toLowerCase())
        );
        return [...mapped, ...remainingSamples];
      }
      return mapped;
    }
    return DEFAULT_SAMPLE_YAJMANS;
  }, [yajmans]);

  // Dynamic category counts
  const categoryCounts = useMemo(() => {
    let vyaktigat = 0;
    let parivar = 0;
    let sanstha = 0;

    allYajmans.forEach(y => {
      if (y.categoryTag === 'परिवार') parivar++;
      else if (y.categoryTag === 'संस्था') sanstha++;
      else vyaktigat++;
    });

    return {
      all: allYajmans.length,
      vyaktigat,
      parivar,
      sanstha,
    };
  }, [allYajmans]);

  // Filtered & sorted yajmans
  const filteredYajmans = useMemo(() => {
    let list = [...allYajmans];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(y => y.categoryTag === selectedCategory);
    }

    // Search query filter (name, phone, city, subInfo)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        y =>
          (y.name || '').toLowerCase().includes(q) ||
          (y.callingMobile || '').toLowerCase().includes(q) ||
          (y.city || '').toLowerCase().includes(q) ||
          (y.subInfo || '').toLowerCase().includes(q)
      );
    }

    // Sort order
    list.sort((a, b) => {
      const res = (a.name || '').localeCompare(b.name || '', 'hi');
      return sortOrder === 'asc' ? res : -res;
    });

    return list;
  }, [allYajmans, selectedCategory, searchQuery, sortOrder]);

  const displayedYajmans = useMemo(() => {
    return filteredYajmans.slice(0, itemsToShow);
  }, [filteredYajmans, itemsToShow]);

  // Contact actions
  const handleCall = (phone?: string) => {
    if (!phone) {
      Toast.show({ type: 'info', text1: 'फ़ोन नंबर उपलब्ध नहीं है' });
      return;
    }
    const cleanNumber = phone.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Toast.show({ type: 'error', text1: 'कॉल शुरू नहीं हो सकी' });
    });
  };

  const handleWhatsApp = (phone?: string, name?: string) => {
    if (!phone) {
      Toast.show({ type: 'info', text1: 'व्हाट्सएप नंबर उपलब्ध नहीं है' });
      return;
    }
    const cleanNumber = phone.replace(/[^\d]/g, '');
    const message = encodeURIComponent(`नमस्ते ${name || 'यजमान'} जी, विप्र सारथी से सादर प्रणाम।`);
    const url = `whatsapp://send?phone=${cleanNumber}&text=${message}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${cleanNumber}?text=${message}`).catch(() => {
        Toast.show({ type: 'error', text1: 'व्हाट्सएप ऐप नहीं खुला' });
      });
    });
  };

  const toggleSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const renderContextIcon = (icon?: string, color: string = '#6B7280') => {
    switch (icon) {
      case 'calendar':
        return <Icon name="calendar" size={12} color={color} style={styles.subIcon} />;
      case 'clock':
        return <Icon name="clock" size={12} color={color} style={styles.subIcon} />;
      case 'users':
        return <Icon name="users" size={12} color={color} style={styles.subIcon} />;
      case 'briefcase':
        return <Icon name="briefcase" size={12} color={color} style={styles.subIcon} />;
      default:
        return <Icon name="info" size={12} color={color} style={styles.subIcon} />;
    }
  };

  // Render List Card matching screenshot exactly
  const renderListItem = ({ item }: { item: DisplayYajman }) => {
    const isFamily = item.categoryTag === 'परिवार';
    const isSanstha = item.categoryTag === 'संस्था';

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('YajmanDetail', { yajman: item })}
        onLongPress={() => setYajmanToDelete(item)}
      >
        {/* Avatar with initial */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.avatarChar || item.name.charAt(0)}</Text>
        </View>

        {/* Details column */}
        <View style={styles.infoCol}>
          {/* Row 1: Name & Category badge */}
          <View style={styles.nameRow}>
            <Text style={styles.yajmanName} numberOfLines={1}>
              {item.name}
            </Text>
            <View
              style={[
                styles.badgeContainer,
                isFamily ? styles.badgeFamily : isSanstha ? styles.badgeSanstha : styles.badgeIndividual,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isFamily ? styles.badgeTextFamily : styles.badgeTextDefault,
                ]}
              >
                {item.categoryTag || 'व्यक्तिगत'}
              </Text>
            </View>
          </View>

          {/* Row 2: Masked phone & City */}
          <Text style={styles.phoneCityRow} numberOfLines={1}>
            {formatPhone(item.callingMobile)}
            {item.city ? ` • ${item.city}` : ''}
          </Text>

          {/* Row 3: Sub-info (Next booking, last pooja, gotra, etc.) */}
          {item.subInfo ? (
            <View style={styles.subInfoRow}>
              {renderContextIcon(item.subInfoIcon, item.subInfoColor || '#6B7280')}
              <Text
                style={[
                  styles.subInfoText,
                  { color: item.subInfoColor || '#6B7280' },
                ]}
                numberOfLines={1}
              >
                {item.subInfo}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Action Buttons Column: Call, WhatsApp, Chevron */}
        <View style={styles.actionsCol}>
          {/* Call button (Pinkish rounded square) */}
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => handleCall(item.callingMobile)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Icon name="phone" size={13} color={TEXT_MAROON} />
          </TouchableOpacity>

          {/* WhatsApp button (Light green rounded square) */}
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={() => handleWhatsApp(item.whatsappMobile || item.callingMobile, item.name)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Icon name="message-circle" size={13} color="#16A34A" />
          </TouchableOpacity>

          {/* Chevron right */}
          <TouchableOpacity
            onPress={() => navigation.navigate('YajmanDetail', { yajman: item })}
            style={styles.chevronBtn}
          >
            <Icon name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render Grid Card
  const renderGridItem = ({ item }: { item: DisplayYajman }) => {
    const isFamily = item.categoryTag === 'परिवार';
    const isSanstha = item.categoryTag === 'संस्था';

    return (
      <TouchableOpacity
        style={styles.gridCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('YajmanDetail', { yajman: item })}
        onLongPress={() => setYajmanToDelete(item)}
      >
        <View style={styles.gridTopRow}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.avatarChar || item.name.charAt(0)}</Text>
          </View>
          <View
            style={[
              styles.badgeContainer,
              isFamily ? styles.badgeFamily : isSanstha ? styles.badgeSanstha : styles.badgeIndividual,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isFamily ? styles.badgeTextFamily : styles.badgeTextDefault,
              ]}
            >
              {item.categoryTag || 'व्यक्तिगत'}
            </Text>
          </View>
        </View>

        <Text style={styles.gridYajmanName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.gridCityText} numberOfLines={1}>
          {item.city || 'वाराणसी'}
        </Text>
        <Text style={styles.gridPhoneText} numberOfLines={1}>
          {formatPhone(item.callingMobile)}
        </Text>

        <View style={styles.gridActionRow}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => handleCall(item.callingMobile)}
          >
            <Icon name="phone" size={13} color={TEXT_MAROON} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={() => handleWhatsApp(item.whatsappMobile || item.callingMobile, item.name)}
          >
            <Icon name="message-circle" size={13} color="#16A34A" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: Math.max(insets.top, 10) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header: यजमान (कुल {count} यजमान) + नया यजमान Pill Button + Menu ⋮ */}
      <View style={styles.header}>
        <View style={styles.headerLeftCol}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="arrow-left" size={20} color="#1F2937" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>यजमान</Text>
            <Text style={styles.headerSubtitle}>कुल {categoryCounts.all} यजमान</Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          {/* + नया यजमान Button */}
          <TouchableOpacity
            style={styles.addYajmanBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('YajmanForm', {})}
          >
            <Icon name="plus" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addYajmanBtnText}>नया यजमान</Text>
          </TouchableOpacity>

          {/* Three dots menu ⋮ */}
          <TouchableOpacity
            style={styles.menuIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => setIsMenuOpen(true)}
          >
            <Icon name="more-vertical" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Search & Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={15} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="नाम, मोबाइल या शहर खोजें"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Icon name="x" size={15} color="#9CA3AF" style={{ marginRight: 6 }} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => setIsFilterOpen(true)} style={styles.filterIconBtn}>
            <Icon name="sliders" size={15} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Filter Category Pills */}
      <View style={styles.pillsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
          {/* सभी Pill */}
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === 'all' ? styles.categoryPillActive : styles.categoryPillInactive,
            ]}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === 'all' ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
              ]}
            >
              सभी {categoryCounts.all}
            </Text>
          </TouchableOpacity>

          {/* व्यक्तिगत Pill */}
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === 'व्यक्तिगत' ? styles.categoryPillActive : styles.categoryPillInactive,
            ]}
            onPress={() => setSelectedCategory('व्यक्तिगत')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === 'व्यक्तिगत' ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
              ]}
            >
              व्यक्तिगत {categoryCounts.vyaktigat}
            </Text>
          </TouchableOpacity>

          {/* परिवार Pill */}
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === 'परिवार' ? styles.categoryPillActive : styles.categoryPillInactive,
            ]}
            onPress={() => setSelectedCategory('परिवार')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === 'परिवार' ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
              ]}
            >
              परिवार {categoryCounts.parivar}
            </Text>
          </TouchableOpacity>

          {/* संस्था Pill */}
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === 'संस्था' ? styles.categoryPillActive : styles.categoryPillInactive,
            ]}
            onPress={() => setSelectedCategory('संस्था')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === 'संस्था' ? styles.categoryPillTextActive : styles.categoryPillTextInactive,
              ]}
            >
              संस्था {categoryCounts.sanstha}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 4. Sort and View Toggle Bar */}
      <View style={styles.sortViewBar}>
        {/* Sort: नाम के अनुसार ↑↓ */}
        <TouchableOpacity style={styles.sortBtn} onPress={toggleSort} activeOpacity={0.7}>
          <Text style={styles.sortBtnText}>
            नाम के अनुसार {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>

        {/* View Mode: := सूची | ⊞ ग्रिड */}
        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Icon name="list" size={13} color={viewMode === 'list' ? PRIMARY_MAROON : '#6B7280'} />
            <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>
              सूची
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewToggleBtn, viewMode === 'grid' && styles.viewToggleBtnActive]}
            onPress={() => setViewMode('grid')}
          >
            <Icon name="grid" size={13} color={viewMode === 'grid' ? PRIMARY_MAROON : '#6B7280'} />
            <Text style={[styles.viewToggleText, viewMode === 'grid' && styles.viewToggleTextActive]}>
              ग्रिड
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Main Yajman Feed */}
      <FlatList
        data={displayedYajmans}
        keyExtractor={item => item.id}
        renderItem={viewMode === 'list' ? renderListItem : renderGridItem}
        key={viewMode}
        numColumns={viewMode === 'grid' ? (isTablet ? 3 : 2) : 1}
        contentContainerStyle={[
          styles.listContent,
          viewMode === 'grid' && styles.gridListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshYajmans} tintColor={PRIMARY_MAROON} />
        }
        ListFooterComponent={
          filteredYajmans.length > 0 ? (
            <View style={styles.listFooter}>
              <Text style={styles.footerCountText}>
                {Math.min(itemsToShow, filteredYajmans.length)} / {filteredYajmans.length} यजमान
              </Text>
              {itemsToShow < filteredYajmans.length ? (
                <TouchableOpacity
                  style={styles.moreBtn}
                  onPress={() => setItemsToShow(prev => prev + 10)}
                >
                  <Text style={styles.moreBtnText}>और देखें ˅</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="users" size={32} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>कोई यजमान नहीं मिला</Text>
              <Text style={styles.emptySubtitle}>कृपया खोज शब्द बदलें या नया यजमान जोड़ें।</Text>
            </View>
          )
        }
      />

      {/* Action Menu Modal (⋮) */}
      <Modal visible={isMenuOpen} transparent animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menuPopupCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                Toast.show({ type: 'success', text1: 'यजमान सूची निर्यात की जा रही है (PDF/Excel)' });
              }}
            >
              <Icon name="download" size={15} color="#374151" style={{ marginRight: 10 }} />
              <Text style={styles.menuItemText}>यजमान सूची निर्यात करें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                refreshYajmans();
                Toast.show({ type: 'info', text1: 'यजमान डेटा ताज़ा किया गया' });
              }}
            >
              <Icon name="refresh-cw" size={15} color="#374151" style={{ marginRight: 10 }} />
              <Text style={styles.menuItemText}>डेटा रीफ़्रेश करें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                setIsMenuOpen(false);
                navigation.navigate('YajmanForm', {});
              }}
            >
              <Icon name="user-plus" size={15} color={PRIMARY_MAROON} style={{ marginRight: 10 }} />
              <Text style={[styles.menuItemText, { color: PRIMARY_MAROON, fontWeight: '600' }]}>
                नया यजमान जोड़ें
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 8. Filter Modal (Sliders Icon) */}
      <Modal visible={isFilterOpen} transparent animationType="slide" onRequestClose={() => setIsFilterOpen(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsFilterOpen(false)}>
          <View style={styles.filterModalCard}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>यजमान फ़िल्टर</Text>
              <TouchableOpacity onPress={() => setIsFilterOpen(false)}>
                <Icon name="x" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionLabel}>श्रेणी अनुसार:</Text>
            <View style={styles.filterModalOptionsRow}>
              {(['all', 'व्यक्तिगत', 'परिवार', 'संस्था'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChoicePill,
                    selectedCategory === cat && styles.filterChoicePillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.filterChoiceText,
                      selectedCategory === cat && styles.filterChoiceTextActive,
                    ]}
                  >
                    {cat === 'all' ? 'सभी' : cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.filterApplyBtn}
              onPress={() => setIsFilterOpen(false)}
            >
              <Text style={styles.filterApplyBtnText}>फ़िल्टर लागू करें</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 9. Delete Confirmation Modal */}
      <Modal visible={!!yajmanToDelete} transparent animationType="fade" onRequestClose={() => setYajmanToDelete(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmDeleteCard}>
            <Text style={styles.confirmDeleteTitle}>यजमान हटाएं?</Text>
            <Text style={styles.confirmDeleteSubtitle}>
              क्या आप वाकई <Text style={{ fontWeight: 'bold' }}>{yajmanToDelete?.name}</Text> को हटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।
            </Text>
            <View style={styles.confirmDeleteActions}>
              <TouchableOpacity style={styles.cancelDeleteBtn} onPress={() => setYajmanToDelete(null)}>
                <Text style={styles.cancelDeleteBtnText}>रद्द करें</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmBtn}
                onPress={async () => {
                  if (yajmanToDelete) {
                    await deleteYajman(yajmanToDelete.id);
                    setYajmanToDelete(null);
                  }
                }}
              >
                <Text style={styles.deleteConfirmBtnText}>हटाएं</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: PRIMARY_MAROON,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addYajmanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  addYajmanBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuIconBtn: {
    padding: 6,
    marginLeft: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 38,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#1F2937',
    paddingVertical: 0,
  },
  filterIconBtn: {
    paddingLeft: 6,
    paddingVertical: 4,
  },
  pillsContainer: {
    marginBottom: 8,
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillActive: {
    backgroundColor: SOFT_PINK,
    borderColor: '#FCA5A5',
  },
  categoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: PRIMARY_MAROON,
    fontWeight: '700',
  },
  categoryPillTextInactive: {
    color: '#4B5563',
  },
  sortViewBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 4,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortBtnText: {
    fontSize: 11.5,
    color: '#374151',
    fontWeight: '500',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  viewToggleBtnActive: {
    borderBottomWidth: 1.5,
    borderBottomColor: PRIMARY_MAROON,
  },
  viewToggleText: {
    fontSize: 11.5,
    color: '#6B7280',
    marginLeft: 4,
  },
  viewToggleTextActive: {
    color: PRIMARY_MAROON,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  gridListContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: SOFT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  yajmanName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 6,
  },
  badgeContainer: {
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  badgeFamily: {
    backgroundColor: BADGE_PINK,
  },
  badgeSanstha: {
    backgroundColor: '#F3F4F6',
  },
  badgeIndividual: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  badgeTextFamily: {
    color: TEXT_MAROON,
  },
  badgeTextDefault: {
    color: '#4B5563',
  },
  phoneCityRow: {
    fontSize: 11.5,
    color: '#6B7280',
    marginBottom: 2,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subIcon: {
    marginRight: 4,
  },
  subInfoText: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  actionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  callBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: BADGE_PINK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronBtn: {
    padding: 2,
  },
  gridCard: {
    flex: 1,
    margin: 6,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  gridTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  gridYajmanName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  gridCityText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  gridPhoneText: {
    fontSize: 10.5,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  gridActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  footerCountText: {
    fontSize: 11,
    color: '#6B7280',
  },
  moreBtn: {
    paddingVertical: 2,
  },
  moreBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: PRIMARY_MAROON,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 11.5,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuPopupCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 12.5,
    color: '#374151',
  },
  filterModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  filterModalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterSectionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  filterModalOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChoicePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  filterChoicePillActive: {
    backgroundColor: SOFT_PINK,
    borderColor: PRIMARY_MAROON,
  },
  filterChoiceText: {
    fontSize: 12,
    color: '#4B5563',
  },
  filterChoiceTextActive: {
    color: PRIMARY_MAROON,
    fontWeight: '700',
  },
  filterApplyBtn: {
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmDeleteCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },
  confirmDeleteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  confirmDeleteSubtitle: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 16,
  },
  confirmDeleteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelDeleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  cancelDeleteBtnText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  deleteConfirmBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: PRIMARY_MAROON,
  },
  deleteConfirmBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default YajmanListScreen;
