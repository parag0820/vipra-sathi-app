import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { welcomeApi, WelcomeScreenItem } from '../api/welcome';

const PRIMARY_MAROON = '#8B1D1D';
const CACHE_KEY = '@cached_welcome_screens';

export interface SlideData {
  id: string;
  screenNumber: number;
  subtitle: string;
  title: string;
  description: string;
  image: any;
}

const DEFAULT_SLIDES: SlideData[] = [
  {
    id: '1',
    screenNumber: 1,
    subtitle: 'पूजा और पाठ',
    title: 'पूजा का हर पाठ, एक जगह',
    description: 'पूजा विधि, स्तोत्र, हवन और आरती।\nजो चाहिए, आसानी से खोजें और पढ़ें।',
    image: require('../assets/images/welcome_screen1.png'),
  },
  {
    id: '2',
    screenNumber: 2,
    subtitle: 'पंचांग और ज्योतिष',
    title: 'तारीख से मुहूर्त तक, आसानी से',
    description: 'पंचांग देखें, कुंडली बनाएँ और मिलान करें।\nयजमान के लिए मुहूर्त भी खोजें।',
    image: require('../assets/images/welcome_screen2.png'),
  },
  {
    id: '3',
    screenNumber: 3,
    subtitle: 'आपका रोज़ का काम',
    title: 'हर दिन का काम, व्यवस्थित',
    description: 'यजमान, बुकिंग, सामग्री और आय–व्यय।\nसब संभालें, अपने तरीके से।',
    image: require('../assets/images/welcome_screen3.png'),
  },
];

const FALLBACK_IMAGES = [
  require('../assets/images/welcome_screen1.png'),
  require('../assets/images/welcome_screen2.png'),
  require('../assets/images/welcome_screen3.png'),
];

const OnboardingScreen = () => {
  const { completeOnboardingFlow } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 600;
  const isHi = i18n.language === 'hi';

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [slides, setSlides] = useState<SlideData[]>(DEFAULT_SLIDES);

  // Helper to map dynamic API items into SlideData
  const mapApiScreensToSlides = (apiItems: WelcomeScreenItem[]): SlideData[] => {
    return apiItems.map((item, idx) => {
      let imgSource: any = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
      if (item.image && typeof item.image === 'string' && item.image.trim().length > 0) {
        imgSource = item.image.startsWith('data:') || item.image.startsWith('http')
          ? { uri: item.image }
          : { uri: `data:image/jpeg;base64,${item.image}` };
      }

      return {
        id: item._id || item.id || `${idx + 1}`,
        screenNumber: item.screenNumber || idx + 1,
        subtitle: item.subtitle || '',
        title: item.title || '',
        description: item.description || '',
        image: imgSource,
      };
    });
  };

  // Fetch dynamic welcome content from API /welcome/admin/get-all
  useEffect(() => {
    let isMounted = true;

    const loadScreens = async () => {
      // 1. Read from cache first
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached && isMounted) {
          const parsed: WelcomeScreenItem[] = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(mapApiScreensToSlides(parsed));
          }
        }
      } catch (e) {
        // ignore cache read error
      }

      // 2. Fetch live dynamic data from /welcome/admin/get-all
      try {
        const apiData = await welcomeApi.getWelcomeScreens();
        if (isMounted && apiData && apiData.length > 0) {
          setSlides(mapApiScreensToSlides(apiData));
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(apiData));
        }
      } catch (err) {
        console.warn('Failed to load dynamic welcome screens:', err);
      }
    };

    loadScreens();

    return () => {
      isMounted = false;
    };
  }, []);

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language_preference', lang);
    setIsLangModalOpen(false);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      completeOnboardingFlow();
    }
  };

  const renderSlide = ({ item }: { item: SlideData }) => {
    const illustrationHeight = Math.min(height * 0.28, isTablet ? 320 : 250);
    const illustrationWidth = Math.min(width * 0.86, isTablet ? 480 : 330);

    return (
      <View style={[styles.slideContainer, { width }]}>
        <View style={[styles.contentCard, { maxWidth: isTablet ? 560 : '100%' }]}>
          {/* Top flexible spacer to place illustration vertically in the center of the screen */}
          <View style={styles.topSpacer} />

          {/* Responsive & Vertically Centered Image Container */}
          <View style={[styles.illustrationContainer, { width: illustrationWidth, height: illustrationHeight }]}>
            <Image
              source={item.image}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          {/* Middle flexible spacer */}
          <View style={styles.midSpacer} />

          {/* Text Block shifted correctly with breathing space before the bottom button */}
          <View style={styles.textBlock}>
            {/* Dynamic Subtitle */}
            {item.subtitle ? (
              <Text style={styles.categoryText}>
                {item.subtitle}
              </Text>
            ) : null}

            {/* Dynamic Title */}
            {item.title ? (
              <Text style={styles.mainTitle}>
                {item.title}
              </Text>
            ) : null}

            {/* Dynamic Description */}
            {item.description ? (
              <Text style={styles.descriptionText}>
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top notch status bar matching screen background */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header: Logo on Left, Skip & Language on Right */}
      <View style={styles.topHeader}>
        {/* Brand Logo Image (instead of plain text) */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Right Actions: Skip & Language Selector */}
        <View style={styles.headerRightCol}>
          {/* Skip Button */}
          <TouchableOpacity
            onPress={completeOnboardingFlow}
            style={styles.skipButton}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>
              Skip →
            </Text>
          </TouchableOpacity>

          {/* Language Selector Dropdown */}
          <TouchableOpacity
            style={styles.langSelectorBtn}
            onPress={() => setIsLangModalOpen(true)}
            hitSlop={{ top: 6, bottom: 6, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Text style={styles.langSelectorText}>
              {isHi ? 'हिंदी' : 'English'}
            </Text>
            <Icon name="chevron-down" size={13} color="#4B5563" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dynamic Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
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

      {/* Bottom Bar: Dots on Left, Action Button on Right */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: 20,
          },
        ]}
      >
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    currentIndex === index ? PRIMARY_MAROON : '#E5E7EB',
                },
              ]}
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.actionButtonText}>
            {currentIndex === slides.length - 1
              ? (isHi ? 'शुरू करें →' : 'Start →')
              : (isHi ? 'आगे →' : 'Next →')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Language Selector Modal */}
      <Modal
        visible={isLangModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLangModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsLangModalOpen(false)}
        >
          <View style={styles.langModalCard}>
            <Text style={styles.langModalTitle}>भाषा चुनें / Select Language</Text>

            <TouchableOpacity
              style={[styles.langModalOption, isHi && styles.langModalOptionActive]}
              onPress={() => changeLanguage('hi')}
            >
              <Text style={[styles.langOptionLabel, isHi && styles.langOptionLabelActive]}>
                हिंदी (Hindi)
              </Text>
              {isHi && <Icon name="check" size={16} color={PRIMARY_MAROON} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langModalOption, !isHi && styles.langModalOptionActive]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[styles.langOptionLabel, !isHi && styles.langOptionLabelActive]}>
                English
              </Text>
              {!isHi && <Icon name="check" size={16} color={PRIMARY_MAROON} />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 6,
    zIndex: 10,
  },
  logoImage: {
    width: 140,
    height: 40,
  },
  headerRightCol: {
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  langSelectorText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#4B5563',
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentCard: {
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  topSpacer: {
    flex: 1.1,
    minHeight: 12,
  },
  illustrationContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  midSpacer: {
    flex: 0.9,
    minHeight: 12,
  },
  textBlock: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: PRIMARY_MAROON,
    marginBottom: 6,
    textAlign: 'left',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    // lineHeight: 32,
    marginBottom: 8,
    textAlign: 'left',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
    textAlign: 'justify',
    marginBottom: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 7,
  },
  actionButton: {
    backgroundColor: PRIMARY_MAROON,
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  langModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },
  langModalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 14,
  },
  langModalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  langModalOptionActive: {
    backgroundColor: '#FFF5F5',
  },
  langOptionLabel: {
    fontSize: 14,
    color: '#374151',
  },
  langOptionLabelActive: {
    color: PRIMARY_MAROON,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
