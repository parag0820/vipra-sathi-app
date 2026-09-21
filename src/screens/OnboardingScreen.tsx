import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const BG_COLOR = '#FDF0E6';
const PRIMARY_COLOR = '#800000'; // Maroon matching the icon

const SLIDES = [
  {
    id: '1',
    brand: 'Vipra Saarthi',
    title: 'Panchang, Kundali\n& Shubh Muhurat',
    description:
      'Generate precise Vedic kundalis, check accurate daily panchang, and find auspicious timings in seconds.',
    isFirst: true,
  },
  {
    id: '2',
    title: 'Complete Pooja\n& Vedic Library',
    description:
      'Step-by-step vidhis for every ritual alongside authentic aartis, stotras, and sacred mantras at your fingertips.',
    isFirst: false,
  },
  {
    id: '3',
    title: 'Smart Yajman\n& Ledger Manager',
    description:
      'Organize your yajman records, calculate fair dakshina, and track your ritual finances effortlessly.',
    isFirst: false,
  },
];

const OnboardingScreen = () => {
  const { continueAsGuest, completeOnboardingFlow } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

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
    if (item.isFirst) {
      return (
        <View style={[styles.slide, { width, justifyContent: 'center' }]}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.slideLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>{item.title}</Text>
          {/* <Text style={styles.brandName}>{item.brand}</Text> */}
          <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.slide, { width, justifyContent: 'center' }]}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.slideLogoOther}
          resizeMode="contain"
        />
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Skip Button */}
      <TouchableOpacity
        onPress={continueAsGuest}
        style={[styles.skipButton, { top: insets.top + 12 }]}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

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
      />

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    currentIndex === index ? PRIMARY_COLOR : '#E5D5C3',
                },
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? 'Login / Signup' : 'Next'}
          </Text>
          <Icon
            name={
              currentIndex === SLIDES.length - 1 ? 'log-in' : 'arrow-right'
            }
            size={16}
            color="#FFF"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
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
    marginBottom: 40,
  },
  slideLogoOther: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  welcomeLabel: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 25,
    fontWeight: '500',
    color: PRIMARY_COLOR,
    marginBottom: 20,
    textAlign: 'center',
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
    lineHeight: 40,
  },
  footer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  nextText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default OnboardingScreen;
