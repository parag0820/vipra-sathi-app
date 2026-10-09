import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useWindowDimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '../components/CustomHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LibraryHubScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { height, width } = useWindowDimensions();

  // Calculate dynamic card height so 5 cards take ~75-80% of the screen height 
  // (adjusting for margins and paddings)
  const cardHeight = Math.max((height * 0.76) / 5 - 10, 75);

  const renderFullCard = (
    title: string,
    desc: string,
    bgIcon: string,
    imageSource: any,
    route: keyof RootStackParamList | string,
    gradient: [string, string],
    iconColor: string
  ) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate(route as any)}
      style={[styles.fullCardWrapper, { height: cardHeight, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
    >
      <View style={styles.fullCard}>
        <Icon name={bgIcon as any} size={80} color={colors.border} style={[styles.cardBgIcon, { opacity: 0.3 }]} />
        <View style={styles.cardContentRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            {imageSource ? (
              <Image source={imageSource} style={{ width: 22, height: 22 }} resizeMode="contain" />
            ) : (
              <Icon name={bgIcon as any} size={20} color={iconColor} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.cardDesc, { color: colors.textLight }]} numberOfLines={2}>{desc}</Text>
          </View>
          <View style={[styles.arrowCircle, { backgroundColor: colors.background }]}>
            <Icon name="arrow-right" size={14} color={iconColor} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader
        title="Spiritual Hub"
        icon="book-open"
        showThemeToggle={true}
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {renderFullCard(
            'Samagri',
            'Find complete samagri lists for every pooja and hawan.',
            'shopping-bag',
            null,
            'Samagri',
            ['#4CAF50', '#2E7D32'],
            '#C75B12'
          )}

          {renderFullCard(
            'Pooja Library',
            'Detailed rituals, samagri lists, and dynamic mantras for every auspicious occasion.',
            'book-open',
            require('../assets/images/lotus_pooja.png'),
            'PoojaLibrary',
            [colors.primary, colors.darkHeader || '#7A2E10'],
            colors.primary
          )}

          {renderFullCard(
            'Stotram',
            'A rich collection of powerful stotras with audio support for daily recitation.',
            'music',
            require('../assets/images/stotram.png'),
            'StotramLibrary',
            [colors.primaryDark, colors.notch || '#B5451B'],
            colors.primaryDark
          )}

          {renderFullCard(
            'Aarti',
            'Beautifully organized aartis with high-quality deity images and lyrics.',
            'sun',
            require('../assets/images/icn_12.png'),
            'AartiLibrary',
            ['#C75B12', '#E8944A'],
            '#C75B12'
          )}

          {renderFullCard(
            'Hawan',
            'Detailed procedures, mantras, and guidelines for performing various hawans.',
            'sun',
            require('../assets/images/icn_13.png'),
            'Hawan',
            ['#E53935', '#C62828'],
            '#E53935'
          )}

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
  content: {
    padding: 14,
    paddingBottom: 90,
  },
  fullCardWrapper: {
    marginBottom: 10,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  fullCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  cardBgIcon: {
    position: 'absolute',
    right: -10,
    bottom: -20,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
});

export default LibraryHubScreen;
