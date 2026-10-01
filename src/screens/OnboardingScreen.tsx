import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const BG_COLOR = '#F8E6CE';
const PRIMARY_COLOR = '#800000'; // Maroon matching the icon

const OnboardingScreen = () => {
  const { continueAsGuest, completeOnboardingFlow } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language_preference', lang);
  };

  const isHi = i18n.language === 'hi';

  const SLIDES = [
    {
      id: '0',
      brand: isHi ? 'विप्र सारथी' : 'Vipra Saarthi',
      // title: isHi ? 'आपका डिजिटल साथी' : 'Aapka Digital Saathi',
      description: isHi
        ? 'पंडितों के लिए विशेष रूप से \nबना एक डिजिटल साथी'
        : 'A digital companion \nspecially made for Pandits',
      isSplash: true,
      image: require('../../assets/icon.png'),
    },
    {
      id: '1',
      title: isHi ? 'पंचांग से कुंडली तक' : 'Panchang to Kundali',
      description: '',
      isSplash: false,
      image: require('../assets/images/onboarding_1.jpeg'),
    },
    {
      id: '2',
      title: isHi ? 'संपूर्ण पूजा और वैदिक संग्रह' : 'Complete Pooja\n& Vedic Library',
      description: '',
      isSplash: false,
      image: require('../assets/images/onboarding_2.jpeg'),
    },
    {
      id: '3',
      title: isHi ? 'हर कार्य, सरल और व्यवस्थित' : 'Smart Yajman\n& Ledger Manager',
      description: '',
      isSplash: false,
      image: require('../assets/images/onboarding_3.jpeg'),
    },
  ];

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboardingFlow();
    }
  };

  const renderSlide = ({ item }: { item: (typeof SLIDES)[0] }) => {
    if (item.isSplash) {
      return (
        <ImageBackground
          source={require('../assets/images/splash_bg.png')}
          style={[styles.slide, { width, height: '100%', justifyContent: 'center' }]}
          resizeMode="cover"
        >
          <Image
            source={item.image}
            style={styles.slideLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>{item.brand}</Text>
          <Text style={styles.splashSubtitle}>{item.title}</Text>

          <Text style={styles.splashDescription}>{item.description}</Text>

          <View style={styles.languageToggleContainer}>
            <TouchableOpacity
              style={[styles.languageButton, isHi && styles.languageButtonActive]}
              onPress={() => changeLanguage('hi')}
              activeOpacity={0.8}
            >
              <Text style={[styles.languageText, isHi && styles.languageTextActive]}>हिंदी</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, !isHi && styles.languageButtonActive]}
              onPress={() => changeLanguage('en')}
              activeOpacity={0.8}
            >
              <Text style={[styles.languageText, !isHi && styles.languageTextActive]}>English</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      );
    }

    return (
      <View style={[
        styles.slide,
        { width, justifyContent: 'center', paddingHorizontal: 0, backgroundColor: BG_COLOR }
      ]}>
        <Image
          source={item.image}
          style={{ width: width, height: '100%', }}
          resizeMode='cover'
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        extraData={isHi}
      />

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            position: 'absolute',
            bottom: insets.bottom + 5,
            left: 0,
            right: 0,
            paddingHorizontal: 24,
            justifyContent: currentIndex === 0 ? 'center' : 'space-between',
          }
        ]}
      >
        {currentIndex > 0 && (
          <>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              {currentIndex > 1 ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => flatListRef.current?.scrollToIndex({ index: currentIndex - 1 })}
                >
                  <Icon name="chevron-left" size={24} color={PRIMARY_COLOR} />
                </TouchableOpacity>
              ) : <View style={styles.backButtonPlaceholder} />}
            </View>

            <View style={[styles.pagination, { flex: 1, justifyContent: 'center' }]}>
              {SLIDES.slice(1).map((_, index) => (
                <View
                  key={index.toString()}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        currentIndex - 1 === index ? PRIMARY_COLOR : '#E5D5C3',
                    },
                    currentIndex - 1 === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextText}>
                  {currentIndex === SLIDES.length - 1
                    ? (isHi ? 'शुरू करें ->' : 'Start ->')
                    : (isHi ? 'आगे बढ़ें ->' : 'Next ->')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {currentIndex === 0 && (
          <TouchableOpacity
            style={[styles.nextButton, styles.startButton]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextText}>
              {isHi ? 'शुरू करें ->' : 'Get Started ->'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  skipButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  slideLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  slideLogoOther: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 4,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 18,
    color: '#333',
    // marginBottom: 40,
    textAlign: 'center',
  },
  splashDescription: {
    fontSize: 16,
    // fontWeight: '500',
    textAlign: 'center',
    color: '#333',
    lineHeight: 26,
    marginBottom: 10,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 20,
  },
  languageToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  languageButton: {
    paddingVertical: 12,
    minWidth: 130,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8DDD4',
    backgroundColor: '#FFF',
  },
  languageButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5D5C3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
  },
  backButtonPlaceholder: {
    width: 44,
    height: 44,
  },
});

export default OnboardingScreen;
