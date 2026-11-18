import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_ROSE_BG = '#FFF0ED';
const CARD_BORDER = '#EFECE8';
const DARK_TEXT = '#1F2937';
const MUTED_TEXT = '#6B7280';

const SubscriptionReminderModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const hasSubscription = false;

  useEffect(() => {
    if (hasSubscription) return;
    const interval = setInterval(() => {
      setIsVisible(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 200000);
    return () => clearInterval(interval);
  }, [hasSubscription, scaleAnim]);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  const handleSubscribe = () => {
    handleClose();
    navigation.navigate('Subscription');
  };

  if (!isVisible) return null;

  const features = [
    t('subscription_modal.feature_poojas', 'सभी प्रामाणिक पूजा विधियाँ'),
    t('subscription_modal.feature_kundali', 'विस्तृत जन्म कुंडली एवं मिलान'),
    t('subscription_modal.feature_panchang', 'उन्नत पंचांग एवं मुहूर्त'),
  ];

  const surfaceBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const borderDynamic = isDark ? '#2D2D2D' : CARD_BORDER;
  const accentColor = isDark ? '#FCA5A5' : PRIMARY_MAROON;
  const roseTintBg = isDark ? '#2B1B1B' : SOFT_ROSE_BG;
  const textPrimary = isDark ? '#F8E6CE' : DARK_TEXT;
  const textSecondary = isDark ? '#9CA3AF' : MUTED_TEXT;

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: surfaceBg,
                  borderColor: borderDynamic,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Subtle Maroon Top Strip */}
              <View style={styles.accentBar} />

              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <View style={[styles.closeBtnBg, { backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6' }]}>
                  <Icon name="x" size={16} color={textSecondary} />
                </View>
              </TouchableOpacity>

              {/* Icon */}
              <View style={[styles.iconBox, { backgroundColor: roseTintBg }]}>
                <Icon name="award" size={26} color={accentColor} />
              </View>

              <Text style={[styles.title, { color: accentColor }]}>
                {t('subscription_modal.title', 'प्रीमियम सदस्यता')}
              </Text>
              <Text style={[styles.subtitle, { color: textSecondary }]}>
                {t(
                  'subscription_modal.subtitle',
                  'सभी पूजा विधियाँ, कुंडली मिलान और उन्नत पंचांग सुविधाओं का लाभ उठाएँ।'
                )}
              </Text>

              {/* Feature bullets */}
              <View style={[styles.featureList, { backgroundColor: isDark ? '#181818' : '#FAF7F3', borderColor: borderDynamic }]}>
                {features.map((feat, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Icon name="check-circle" size={14} color={accentColor} />
                    <Text style={[styles.featureText, { color: textPrimary }]}>{feat}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleSubscribe}
                activeOpacity={0.8}
              >
                <Text style={styles.subscribeText}>
                  {t('subscription_modal.subscribe_now', 'सदस्यता देखें')}
                </Text>
                <Icon name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
  },
  accentBar: {
    height: 3,
    width: '100%',
    backgroundColor: PRIMARY_MAROON,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  closeBtnBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 18,
  },
  featureList: {
    width: '88%',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
  },
  subscribeButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '88%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default SubscriptionReminderModal;
