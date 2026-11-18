import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useYajmans } from '../hooks/useYajmans';

type DetailRouteProp = RouteProp<RootStackParamList, 'YajmanDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_PINK = '#FFF0ED';
const BADGE_PINK = '#FEE2E2';
const TEXT_MAROON = '#991B1B';
const BORDER_COLOR = '#E5E7EB';

const formatHindiDisplayDate = (dateString?: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const monthsHindi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];
  return `${date.getDate()} ${monthsHindi[date.getMonth()]} ${date.getFullYear()}`;
};

const getAvatarChar = (name: string): string => {
  if (!name) return 'य';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1 && parts[parts.length - 1].length > 0) {
    return parts[parts.length - 1].charAt(0);
  }
  return name.charAt(0);
};

const YajmanDetailScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const insets = useSafeAreaInsets();
  const { yajmans, deleteYajman } = useYajmans();

  // Get the most up-to-date yajman from the hook in case it was edited
  const yajmanId = route.params.yajman.id;
  const yajman = yajmans.find(y => y.id === yajmanId) || route.params.yajman;

  const handleDelete = () => {
    Alert.alert(
      'यजमान हटाएँ',
      'क्या आप इस यजमान को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'हटाएँ',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteYajman(yajman.id);
              Toast.show({
                type: 'info',
                text1: 'यजमान हटाया गया',
                text2: `${yajman.name} को सूची से हटा दिया गया है।`,
              });
              navigation.goBack();
            } catch (err) {
              console.error('Failed to delete yajman:', err);
              Toast.show({
                type: 'error',
                text1: 'त्रुटि',
                text2: 'यजमान हटाने में समस्या आई।',
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCall = () => {
    if (yajman.callingMobile) {
      const clean = yajman.callingMobile.replace(/[^\d+]/g, '');
      Linking.openURL(`tel:${clean}`).catch(() => {
        Toast.show({ type: 'error', text1: 'कॉल शुरू नहीं हो सकी' });
      });
    } else {
      Toast.show({ type: 'info', text1: 'कॉलिंग नंबर उपलब्ध नहीं है' });
    }
  };

  const handleWhatsApp = () => {
    const num = yajman.whatsappMobile || yajman.callingMobile;
    if (num) {
      const cleanNum = num.replace(/\D/g, '');
      const fullNum = cleanNum.startsWith('91') ? cleanNum : `91${cleanNum}`;
      Linking.openURL(`whatsapp://send?phone=${fullNum}`).catch(() => {
        Toast.show({ type: 'error', text1: 'व्हाट्सएप नहीं खुल सका' });
      });
    } else {
      Toast.show({ type: 'info', text1: 'व्हाट्सएप नंबर उपलब्ध नहीं है' });
    }
  };

  const handleEdit = () => {
    navigation.navigate('YajmanForm', { yajman });
  };

  const categoryLabel = (yajman.category || 'व्यक्तिगत').includes('परिवार')
    ? 'परिवार'
    : (yajman.category || '').includes('संस्था')
    ? 'संस्था'
    : 'व्यक्तिगत';

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <View
          style={[
            styles.infoIconBox,
            { backgroundColor: isDark ? '#2B1B1B' : SOFT_PINK },
          ]}
        >
          <Icon name={icon as any} size={16} color={isDark ? '#FCA5A5' : PRIMARY_MAROON} />
        </View>
        <View style={styles.infoContent}>
          <Text style={[styles.infoLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{label}</Text>
          <Text style={[styles.infoValue, { color: isDark ? '#F8E6CE' : '#111827' }]}>{value}</Text>
        </View>
      </View>
    );
  };

  const birthdayFormatted = formatHindiDisplayDate(yajman.birthday);
  const anniversaryFormatted = formatHindiDisplayDate(yajman.anniversary);
  const yearlyProgramFormatted = formatHindiDisplayDate(yajman.yearlyProgramDate);
  const kycFormatted = formatHindiDisplayDate(yajman.kycDate);

  const hasDates = Boolean(birthdayFormatted || anniversaryFormatted || yearlyProgramFormatted);
  const hasAddress = Boolean(yajman.city || yajman.state || yajman.address);
  const hasOther = Boolean(kycFormatted || yajman.remark);

  return (
    <View style={[styles.screenContainer, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1E1E1E' : '#FFFFFF'}
      />

      {/* Top Header */}
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, 10),
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderBottomColor: isDark ? '#2D2D2D' : BORDER_COLOR,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={26} color={PRIMARY_MAROON} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#FCA5A5' : PRIMARY_MAROON }]}>
            यजमान विवरण
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleEdit}
            style={styles.headerActionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Icon name="edit-2" size={18} color={isDark ? '#FCA5A5' : PRIMARY_MAROON} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={styles.headerActionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Icon name="trash-2" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View
          style={[
            styles.profileHeroCard,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderColor: isDark ? '#2D2D2D' : '#FEE2E2',
            },
          ]}
        >
          {/* Avatar Circle */}
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: isDark ? '#2B1B1B' : SOFT_PINK },
            ]}
          >
            <Text style={[styles.avatarText, { color: isDark ? '#FCA5A5' : PRIMARY_MAROON }]}>
              {getAvatarChar(yajman.name)}
            </Text>
          </View>

          {/* Name */}
          <Text style={[styles.yajmanName, { color: isDark ? '#F8E6CE' : '#111827' }]}>
            {yajman.name}
          </Text>

          {/* Category Badge */}
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: isDark ? '#2B1B1B' : SOFT_PINK },
            ]}
          >
            <Text style={[styles.categoryBadgeText, { color: isDark ? '#FCA5A5' : TEXT_MAROON }]}>
              {categoryLabel}
            </Text>
          </View>

          {/* Call & WhatsApp Quick Buttons */}
          <View style={styles.actionButtonGroup}>
            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: PRIMARY_MAROON }]}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Icon name="phone" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>कॉल करें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.whatsAppBtn, { backgroundColor: '#16A34A' }]}
              onPress={handleWhatsApp}
              activeOpacity={0.8}
            >
              <Icon name="message-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>व्हाट्सएप</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 1: संपर्क विवरण (Contact Details) */}
        <View
          style={[
            styles.detailSectionCard,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderColor: isDark ? '#2D2D2D' : '#F3F4F6',
            },
          ]}
        >
          <Text style={[styles.sectionHeading, { color: isDark ? '#FCA5A5' : PRIMARY_MAROON }]}>
            संपर्क विवरण
          </Text>
          <InfoRow icon="phone" label="कॉलिंग नंबर" value={yajman.callingMobile} />
          <InfoRow
            icon="message-circle"
            label="व्हाट्सएप नंबर"
            value={yajman.whatsappMobile || yajman.callingMobile}
          />
          <InfoRow icon="mail" label="ईमेल पता" value={yajman.email} />
        </View>

        {/* Section 2: महत्वपूर्ण तिथियाँ (Important Dates) */}
        {hasDates && (
          <View
            style={[
              styles.detailSectionCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#2D2D2D' : '#F3F4F6',
              },
            ]}
          >
            <Text style={[styles.sectionHeading, { color: isDark ? '#FCA5A5' : PRIMARY_MAROON }]}>
              महत्वपूर्ण तिथियाँ
            </Text>
            <InfoRow icon="gift" label="जन्मदिन" value={birthdayFormatted} />
            <InfoRow icon="heart" label="विवाह वर्षगांठ" value={anniversaryFormatted} />
            <InfoRow
              icon="calendar"
              label={yajman.yearlyProgramName || 'वार्षिक कार्यक्रम'}
              value={yearlyProgramFormatted}
            />
          </View>
        )}

        {/* Section 3: निवास एवं पता (Address) */}
        {hasAddress && (
          <View
            style={[
              styles.detailSectionCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#2D2D2D' : '#F3F4F6',
              },
            ]}
          >
            <Text style={[styles.sectionHeading, { color: isDark ? '#FCA5A5' : PRIMARY_MAROON }]}>
              निवास एवं पता
            </Text>
            <InfoRow icon="map-pin" label="शहर" value={yajman.city} />
            <InfoRow icon="map" label="राज्य" value={yajman.state} />
            <InfoRow icon="home" label="पूरा पता" value={yajman.address} />
          </View>
        )}

        {/* Section 4: अन्य विवरण एवं टिप्पणी (Other & Notes) */}
        {hasOther && (
          <View
            style={[
              styles.detailSectionCard,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#2D2D2D' : '#F3F4F6',
              },
            ]}
          >
            <Text style={[styles.sectionHeading, { color: isDark ? '#FCA5A5' : PRIMARY_MAROON }]}>
              अन्य विवरण एवं टिप्पणी
            </Text>
            <InfoRow icon="file-text" label="पंजीकरण तिथि" value={kycFormatted} />
            {yajman.remark ? (
              <View
                style={[
                  styles.remarkBox,
                  {
                    backgroundColor: isDark ? '#2B1B1B' : '#FFFDF9',
                    borderColor: isDark ? '#3D2626' : '#FEE2E2',
                  },
                ]}
              >
                <Text style={[styles.remarkLabel, { color: isDark ? '#FCA5A5' : TEXT_MAROON }]}>
                  विशेष टिप्पणी / नोट:
                </Text>
                <Text style={[styles.remarkBody, { color: isDark ? '#E5E7EB' : '#374151' }]}>
                  {yajman.remark}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Bottom Actions Row */}
        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            style={[
              styles.bottomEditBtn,
              {
                borderColor: PRIMARY_MAROON,
                backgroundColor: isDark ? 'rgba(139,29,29,0.15)' : '#FFF6F6',
              },
            ]}
            onPress={handleEdit}
            activeOpacity={0.8}
          >
            <Icon name="edit-2" size={16} color={PRIMARY_MAROON} style={{ marginRight: 6 }} />
            <Text style={[styles.bottomEditBtnText, { color: PRIMARY_MAROON }]}>
              यजमान विवरण संपादित करें
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomDeleteBtn}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Icon name="trash-2" size={15} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.bottomDeleteBtnText}>यजमान सूची से हटाएँ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
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
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionBtn: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  profileHeroCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
  },
  yajmanName: {
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    maxWidth: 160,
  },
  whatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    maxWidth: 160,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  detailSectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  remarkBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  remarkLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  remarkBody: {
    fontSize: 11.5,
    lineHeight: 18,
  },
  bottomActionsRow: {
    marginTop: 8,
    gap: 10,
    alignItems: 'center',
  },
  bottomEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 11,
    width: '100%',
  },
  bottomEditBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bottomDeleteBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default YajmanDetailScreen;
