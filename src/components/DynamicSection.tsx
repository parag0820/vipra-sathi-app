import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { PoojaSection } from '../types/pooja';
import { useTheme } from '../theme/ThemeContext';

interface DynamicSectionProps {
  section: PoojaSection;
  isFavorite: boolean;
  onToggleFavorite: (sectionId: string) => void;
}

const DynamicSection: React.FC<DynamicSectionProps> = ({ section, isFavorite, onToggleFavorite }) => {
  const { colors, isDark } = useTheme();

  switch (section.sectionType) {
    case 'Heading':
      return (
        <View style={styles.headingContainer}>
          <Text style={[styles.heading, { color: colors.primaryDark }]}>
            {section.content}
          </Text>
        </View>
      );

    case 'Description':
      return (
        <Text style={[styles.description, { color: colors.text }]}>
          {section.content}
        </Text>
      );

    case 'Dhyan':
    case 'Mantra':
      return (
        <View style={[
          styles.mantraCard,
          { backgroundColor: isDark ? colors.surface : '#F4EAE9', borderColor: 'transparent' }
        ]}>
          <View style={styles.mantraContent}>
            <TouchableOpacity style={[styles.mantraPlayBtn, { backgroundColor: colors.primary }]}>
              <Icon name="play" size={16} color="#FFF" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
            <Text style={[styles.sanskritText, { color: colors.primaryDark }]}>
              {section.content}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(section.sectionId)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#E91E63' : colors.textLight}
            />
          </TouchableOpacity>
        </View>
      );

    case 'Vidhi':
      const sentences = section.content.split('. ').filter(s => s.trim().length > 0);
      return (
        <View style={[styles.vidhiContainer, { backgroundColor: isDark ? colors.surface : '#FDF7F5', borderColor: 'transparent' }]}>
          <View style={styles.vidhiHeaderRow}>
            <Icon name="information-circle-outline" size={16} color={colors.primaryDark} />
            <Text style={[styles.vidhiHeader, { color: colors.primaryDark }]}>Vidhi</Text>
          </View>
          {sentences.map((sentence, sIdx) => (
            <View key={sIdx} style={styles.vidhiRow}>
              <View style={[styles.vidhiNumberCircle, { backgroundColor: '#FADEDD' }]}>
                <Text style={[styles.vidhiNumberText, { color: colors.primaryDark }]}>{sIdx + 1}</Text>
              </View>
              <Text style={[styles.vidhiText, { color: colors.text }]}>{sentence.trim()}{!sentence.endsWith('.') ? '.' : ''}</Text>
            </View>
          ))}
        </View>
      );

    case 'Audio':
      return (
        <View style={[styles.audioContainer, { backgroundColor: isDark ? colors.surface : '#F4EAE9', borderColor: 'transparent' }]}>
          <TouchableOpacity style={[styles.audioPlayBtn, { backgroundColor: colors.primary }]}>
            <Icon name="play" size={20} color="#FFF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
          <View style={styles.audioDetails}>
            <Text style={[styles.audioTitle, { color: colors.primaryDark }]}>Audio Track</Text>
            <Text style={[styles.audioSubtitle, { color: colors.primary }]}>{section.content}</Text>
          </View>
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  headingContainer: {
    marginTop: 10,
    marginBottom: 6,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  mantraCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mantraContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mantraPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sanskritText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    fontStyle: 'italic',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  vidhiContainer: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  vidhiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  vidhiHeader: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  vidhiRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  vidhiNumberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 0,
  },
  vidhiNumberText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  vidhiText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  audioPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioDetails: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  audioSubtitle: {
    fontSize: 11,
  },
});

export default DynamicSection;
