import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { AajKaKaam } from '../data/mockDashboard';

interface Props {
  data: AajKaKaam;
  onPressAction: (action: string) => void;
}

const AnimatedButton = ({ onPress, style, children }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const AajKaKaamCard: React.FC<Props> = ({ data, onPressAction }) => {
  const { colors, isDark } = useTheme();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const timeRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial 360 rotation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Rotate 360 horizontally every minute
    const interval = setInterval(() => {
      timeRotateAnim.setValue(0);
      Animated.timing(timeRotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 6000);

    return () => clearInterval(interval);
  }, [rotateAnim, timeRotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const timeSpin = timeRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.primary, transform: [{ rotateY: spin }] }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Icon name="sun" size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Aaj Ka Kaam</Text>
        </View>
        <Animated.View style={[styles.timeBadge, { backgroundColor: colors.primary, transform: [{ rotateY: timeSpin }] }]}>
          <Icon name="clock" size={14} color="#FFF" />
          <Text style={[styles.timeText, { color: '#FFF' }]}>{data.time}</Text>
        </Animated.View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={[styles.poojaName, { color: colors.text }]}>{data.poojaName}</Text>
        <Text style={[styles.separator, { color: colors.textLight }]}>•</Text>
        <Text style={[styles.yajmanName, { color: colors.text }]}>{data.yajmanName}</Text>
      </View>

      <View style={[styles.metaData, { backgroundColor: colors.primary + '15' }]}>
        <View style={styles.metaRow}>
          <Icon name="map-pin" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text }]} numberOfLines={1}>{data.address}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="credit-card" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text }]}>
            Dakshina: {data.dakshinaAmount} ({data.dakshinaStatus})
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="info" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text }]} numberOfLines={2}>
            Note: {data.notes}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsScroll}>
        <AnimatedButton style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => onPressAction('call')}>
          <Icon name="phone" size={16} color="#FFF" />
          <Text style={[styles.actionText, { color: '#FFF' }]}>Call</Text>
        </AnimatedButton>

        <AnimatedButton style={[styles.actionBtn, { backgroundColor: colors.success }]} onPress={() => onPressAction('whatsapp')}>
          <Icon name="message-circle" size={16} color="#FFF" />
          <Text style={[styles.actionText, { color: '#FFF' }]}>WhatsApp</Text>
        </AnimatedButton>

        <AnimatedButton style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => onPressAction('directions')}>
          <Icon name="navigation" size={16} color="#FFF" />
          <Text style={[styles.actionText, { color: '#FFF' }]}>Map</Text>
        </AnimatedButton>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  poojaName: {
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  separator: {
    marginHorizontal: 8,
    fontSize: 15,
  },
  yajmanName: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  metaData: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 11.5,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  actionsScroll: {
    flexDirection: 'row',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
  },
  actionText: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
});

export default AajKaKaamCard;
