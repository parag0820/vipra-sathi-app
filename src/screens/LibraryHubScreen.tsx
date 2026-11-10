import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SpiritualCategoryItem {
  id: string;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  badgeText: string;
  route: keyof RootStackParamList;
  themeColor: string;
  tintBg: string;
  borderColor: string;
  imageSource?: any;
  iconName?: string;
  vectorFamily?: 'feather' | 'material';
}

const CATEGORIES: SpiritualCategoryItem[] = [
  {
    id: 'pooja',
    titleKey: 'spiritual_hub.pooja_title',
    defaultTitle: 'पूजा विधि एवं संकलन',
    descKey: 'spiritual_hub.pooja_desc',
    defaultDesc: 'विस्तृत विधि, षोडशोपचार, संकल्प एवं चरणबद्ध पूजन मार्गदर्शन।',
    badgeText: '15+ देवता',
    route: 'PoojaLibrary',
    themeColor: '#8B1D1D', // Sacred Maroon
    tintBg: '#FFF0ED',
    borderColor: '#FEE2E2',
    imageSource: require('../assets/images/lotus_pooja.png'),
  },
  {
    id: 'stotram',
    titleKey: 'spiritual_hub.stotram_title',
    defaultTitle: 'स्तोत्रम् संग्रह',
    descKey: 'spiritual_hub.stotram_desc',
    defaultDesc: 'सर्व बाधा निवारक पावन स्तोत्र, कवच, अष्टक एवं वैदिक पाठ।',
    badgeText: 'कवच व अष्टक',
    route: 'StotramLibrary',
    themeColor: '#B45309', // Vedic Amber
    tintBg: '#FFFBEB',
    borderColor: '#FEF3C7',
    imageSource: require('../assets/images/stotram.png'),
  },
  {
    id: 'aarti',
    titleKey: 'spiritual_hub.aarti_title',
    defaultTitle: 'आरती संकलन',
    descKey: 'spiritual_hub.aarti_desc',
    defaultDesc: 'समस्त देवी-देवताओं की नित्य मंगल आरती, स्तुति व पुष्पांजलि।',
    badgeText: 'दैनिक आरती',
    route: 'AartiLibrary',
    themeColor: '#C2410C', // Sacred Vermilion
    tintBg: '#FFF7ED',
    borderColor: '#FFEDD5',
    imageSource: require('../assets/images/icn_12.png'),
  },
  {
    id: 'samagri',
    titleKey: 'spiritual_hub.samagri_title',
    defaultTitle: 'पूजन सामग्री सूची',
    descKey: 'spiritual_hub.samagri_desc',
    defaultDesc: 'प्रत्येक पूजा एवं हवन के लिए आवश्यक वस्तुओं की संपूर्ण चेकलिस्ट।',
    badgeText: 'सामग्री चेकलिस्ट',
    route: 'Samagri',
    themeColor: '#047857', // Sacred Basil Green
    tintBg: '#ECFDF5',
    borderColor: '#D1FAE5',
    iconName: 'basket-outline',
    vectorFamily: 'material',
  },
  {
    id: 'hawan',
    titleKey: 'spiritual_hub.hawan_title',
    defaultTitle: 'हवन एवं यज्ञ विधि',
    descKey: 'spiritual_hub.hawan_desc',
    defaultDesc: 'यज्ञ विधि, समिधा, आहुति मंत्र एवं पूर्णाहूति के विस्तृत निर्देश।',
    badgeText: 'यज्ञ विधान',
    route: 'Hawan',
    themeColor: '#DC2626', // Agni Fire Red
    tintBg: '#FEF2F2',
    borderColor: '#FEE2E2',
    imageSource: require('../assets/images/hawan.png'),
  },
];

const LibraryHubScreen: React.FC = () => {
  const { isDark, setTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F9FAFB' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1E1E1E' : '#FFFFFF'}
      />

      {/* Top Header Bar (Flat, No Shadow, No Elevation) */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            paddingTop: Math.max(insets.top, 12),
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name="book-open-page-variant" size={20} color="#8B1D1D" />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerTitle}>
              {t('spiritual_hub.title', 'पूजा एवं ग्रंथ संग्रह')}
            </Text>
            <Text style={styles.headerSubtitle}>
              पूजा विधि, स्तोत्र, आरती, सामग्री एवं हवन
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.themeBtn, { backgroundColor: isDark ? '#2D2D2D' : '#FFF0ED' }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name={isDark ? 'sun' : 'moon'} size={16} color="#8B1D1D" />
        </TouchableOpacity>
      </View>

      {/* Main List Content */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtle Top Welcome / Vedic Note */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#FFF5F3',
              borderColor: isDark ? '#333333' : '#FEE2E2',
            },
          ]}
        >
          <View style={styles.infoIconWrapper}>
            <Text style={styles.omSymbol}>ॐ</Text>
          </View>
          <Text style={[styles.infoText, { color: isDark ? '#E5E7EB' : '#7F1D1D' }]}>
            वैदिक परंपरा अनुसार प्रामाणिक पूजा विधि, स्तोत्र एवं नित्य पाठ संग्रह।
          </Text>
        </View>

        {/* 5 Spiritual Category Cards (Flat, No Shadow, No Elevation) */}
        {CATEGORIES.map((item) => {
          const title = t(item.titleKey, item.defaultTitle);
          const desc = t(item.descKey, item.defaultDesc);

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(item.route as any)}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                  borderColor: isDark ? '#2D2D2D' : item.borderColor,
                },
              ]}
            >
              {/* Left Color Accent Stripe */}
              <View
                style={[
                  styles.cardAccentBar,
                  { backgroundColor: item.themeColor },
                ]}
              />

              {/* Icon / Image Container */}
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isDark ? '#262626' : item.tintBg,
                    borderColor: isDark ? '#383838' : item.borderColor,
                  },
                ]}
              >
                {item.imageSource ? (
                  <Image
                    source={item.imageSource}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                ) : item.vectorFamily === 'material' ? (
                  <MaterialCommunityIcons
                    name={item.iconName as any}
                    size={22}
                    color={item.themeColor}
                  />
                ) : (
                  <Icon
                    name={item.iconName as any}
                    size={20}
                    color={item.themeColor}
                  />
                )}
              </View>

              {/* Details Column */}
              <View style={styles.cardDetailsCol}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: isDark ? '#F8E6CE' : '#111827' },
                    ]}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                  <View
                    style={[
                      styles.badgePill,
                      {
                        backgroundColor: isDark ? '#2A2A2A' : item.tintBg,
                        borderColor: isDark ? '#3D3D3D' : item.borderColor,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: item.themeColor }]}>
                      {item.badgeText}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.cardDesc,
                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                  ]}
                  numberOfLines={2}
                >
                  {desc}
                </Text>
              </View>

              {/* Right Chevron Button */}
              <View
                style={[
                  styles.arrowBtn,
                  {
                    backgroundColor: isDark ? '#262626' : item.tintBg,
                    borderColor: isDark ? '#383838' : item.borderColor,
                  },
                ]}
              >
                <Icon name="chevron-right" size={16} color={item.themeColor} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#8B1D1D',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  themeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  content: {
    padding: 14,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  infoIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  omSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B1D1D',
  },
  infoText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '500',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.2,
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 11,
    position: 'relative',
    overflow: 'hidden',
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3.5,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 12,
  },
  categoryImage: {
    width: 25,
    height: 25,
  },
  cardDetailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingRight: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  arrowBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default LibraryHubScreen;
