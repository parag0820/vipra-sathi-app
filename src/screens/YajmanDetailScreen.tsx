import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useYajmans } from '../hooks/useYajmans';

type DetailRouteProp = RouteProp<RootStackParamList, 'YajmanDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const YajmanDetailScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const insets = useSafeAreaInsets();
  const { yajmans, deleteYajman } = useYajmans();

  // Get the most up-to-date yajman from the hook in case it was edited
  const yajmanId = route.params.yajman.id;
  const yajman = yajmans.find(y => y.id === yajmanId) || route.params.yajman;

  const handleDelete = () => {
    Alert.alert(
      "Delete Yajman",
      "Are you sure you want to remove this yajman? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteYajman(yajman.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleCall = () => {
    if (yajman.callingMobile) {
      Linking.openURL(`tel:${yajman.callingMobile}`);
    }
  };

  const handleWhatsApp = () => {
    if (yajman.whatsappMobile || yajman.callingMobile) {
      const num = yajman.whatsappMobile || yajman.callingMobile;
      // Remove non-numeric chars
      const cleanNum = num.replace(/\D/g, '');
      Linking.openURL(`whatsapp://send?phone=91${cleanNum}`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Astrology': return '#8b5cf6';
      case 'Karmkand': return '#D97706';
      case 'Vaastu': return '#059669';
      case 'Hastrekha': return '#2563EB';
      case 'Puja Path': return '#B5451B';
      case 'Jyotish': return '#7C3AED';
      case 'Vastu Consulting': return '#0D9488';
      case 'Hastarekha': return '#2563EB';
      case 'Numerology': return '#DC2626';
      case 'Tarot': return '#9333EA';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const InfoRow = ({ icon, label, value }: { icon: string, label: string, value?: string }) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <View style={[styles.infoIconContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Icon name={icon as any} size={18} color={colors.primary} />
        </View>
        <View style={styles.infoContent}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>{label}</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={true} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary, borderBottomColor: colors.primary, paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
        </View>
      </View>
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarBig, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.avatarBigText, { color: colors.primary }]}>
              {yajman.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileHeaderTextContainer}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{yajman.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(yajman.category) + '15' }]}>
                <Text style={[styles.categoryText, { color: getCategoryColor(yajman.category) }]}>{yajman.category}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={handleCall}>
            <Icon name="phone" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.success }]} onPress={handleWhatsApp}>
            <Icon name="message-circle" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Contact Info</Text>
            <InfoRow icon="phone" label="Calling Number" value={yajman.callingMobile} />
            <InfoRow icon="message-circle" label="WhatsApp" value={yajman.whatsappMobile || 'Same as calling'} />
            <InfoRow icon="mail" label="Email Address" value={yajman.email} />
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Important Dates</Text>
            <InfoRow icon="gift" label="Birthday" value={formatDate(yajman.birthday)} />
            <InfoRow icon="heart" label="Anniversary" value={formatDate(yajman.anniversary)} />
            <InfoRow
              icon="calendar"
              label={yajman.yearlyProgramName || 'Yearly Program'}
              value={formatDate(yajman.yearlyProgramDate)}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Address</Text>
            <InfoRow icon="map-pin" label="City" value={yajman.city} />
            <InfoRow icon="map" label="State" value={yajman.state} />
            <InfoRow icon="home" label="Full Address" value={yajman.address} />
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Other</Text>
            <InfoRow icon="file-text" label="KYC Date" value={formatDate(yajman.kycDate)} />
            {yajman.remark && (
              <View style={styles.remarkContainer}>
                <Text style={[styles.infoLabel, { color: colors.textLight, marginBottom: 4 }]}>Remarks / Notes</Text>
                <Text style={[styles.remarkText, { color: colors.text }]}>{yajman.remark}</Text>
              </View>
            )}
          </View>

        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarBig: {
    width: 60,
    height: 60,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBigText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileHeaderTextContainer: {
    marginLeft: 16,
    justifyContent: 'center',
    flexShrink: 1, // Ensures long names wrap or truncate properly without breaking layout
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 25,
    flex: 1,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsCard: {
    margin: 16,
    marginBottom: 40,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 8,
  },
  remarkContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  remarkText: {
    fontSize: 14,
    lineHeight: 22,
  }
});

export default YajmanDetailScreen;
