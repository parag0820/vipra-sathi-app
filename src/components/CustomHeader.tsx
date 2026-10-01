import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomHeaderProps {
  title?: string;
  icon?: string;
  isHome?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
  showBack?: boolean;
  showThemeToggle?: boolean;
  headerBgColor?: string;
  headerTextColor?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  icon,
  isHome,
  notificationCount = 0,
  onNotificationPress,
  showBack = false,
  showThemeToggle = false,
  headerBgColor,
  headerTextColor,

}) => {
  const { colors, isDark, setTheme } = useTheme();
  const navigation = useNavigation();

  const iconColor = headerTextColor || (isDark ? '#FFF' : '#1E293B');
  const textColor = headerTextColor || (isDark ? '#FFF' : '#1E293B');
  const bgColor = headerBgColor || colors.background;

  const insets = useSafeAreaInsets();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <View style={{ backgroundColor: bgColor, paddingTop: insets.top }}>
      <StatusBar
        backgroundColor={bgColor}
        barStyle={headerBgColor ? 'light-content' : (isDark ? 'light-content' : 'dark-content')}
        translucent={true}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: bgColor },
        ]}
      >
        {isHome ? (
          <View style={styles.logoContainer}>
            <Image
              source={require('../../logo_ganesh.png')}
              style={styles.logoGanesh}
              resizeMode="contain"
            />
            <Image
              source={require('../../logo_text.png')}
              style={styles.logoText}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.titleContainer}>
            {showBack && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <View style={[styles.backBtnCircle, { backgroundColor: headerBgColor ? 'transparent' : (isDark ? '#334155' : '#F3E8DB') }]}>
                  <Icon name="arrow-left" size={20} color={textColor} />
                </View>
              </TouchableOpacity>
            )}
            {icon && !showBack && (
              <View style={[styles.headerIconCircle, { backgroundColor: colors.primary + '15' }]}>
                <Icon name={icon as any} size={20} color={colors.primary} />
              </View>
            )}
            <Text style={[styles.titleText, { color: textColor }]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          </View>
        )}

        <View style={styles.rightActions}>
          {showThemeToggle && (
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? colors.surface : '#FFFFFF', borderColor: isDark ? colors.border : '#F3E8DB' }]} onPress={toggleTheme}>
              <Icon name={isDark ? 'sun' : 'moon'} size={16} color={iconColor} />
            </TouchableOpacity>
          )}

          {isHome && (
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? colors.surface : '#FFFFFF', borderColor: isDark ? colors.border : '#F3E8DB' }]} onPress={onNotificationPress}>
              <Icon name="bell" size={16} color={iconColor} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    minHeight: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGanesh: {
    width: 50,
    height: 50,
  },
  logoText: {
    width: 75,
    height: 22,
    marginLeft: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  backBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  icon: {
    marginRight: 10,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#DC2626',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
