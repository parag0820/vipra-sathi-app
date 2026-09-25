import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { MOCK_AARTIS } from '../data/mockLibrary';
import AudioPlayerUI from '../components/AudioPlayerUI';
import { Feather as Icon } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

type AartiDetailRouteProp = {
  key: string;
  name: 'AartiDetail';
  params: { aartiId: string };
};

const MusicEqualizer = ({ color, isPlaying }: { color: string, isPlaying: boolean }) => {
  const bars = [1, 2, 3, 4, 5, 6, 7];
  
  return (
    <View style={styles.equalizerContainer}>
      {bars.map((_, i) => {
        const anim = useRef(new Animated.Value(20)).current;
        
        useEffect(() => {
          let isMounted = true;
          const animate = () => {
            if (!isPlaying || !isMounted) return;
            Animated.sequence([
              Animated.timing(anim, {
                toValue: Math.random() * 80 + 20,
                duration: Math.random() * 400 + 300,
                useNativeDriver: false,
              }),
              Animated.timing(anim, {
                toValue: 20,
                duration: Math.random() * 400 + 300,
                useNativeDriver: false,
              })
            ]).start(({ finished }) => {
              if (finished && isPlaying && isMounted) animate();
            });
          };
          
          if (isPlaying) {
            animate();
          } else {
            anim.stopAnimation();
            Animated.timing(anim, {
              toValue: 20,
              duration: 150, // fast collapse
              useNativeDriver: false,
            }).start();
          }

          return () => { isMounted = false; anim.stopAnimation(); };
        }, [anim, isPlaying]);
        
        return (
          <Animated.View 
            key={i}
            style={[
              styles.bar,
              {
                height: anim,
                backgroundColor: color,
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const AartiDetailScreen = () => {
  const route = useRoute<AartiDetailRouteProp>();
  const { aartiId } = route.params;
  const { colors, isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const aarti = MOCK_AARTIS.find(a => a.id === aartiId);

  if (!aarti) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Aarti not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <CustomHeader title={aarti.title} showBack={true} />
      
      {/* Fixed top visualizer instead of scrollable */}
      <View style={[styles.musicVisualizerContainer, { backgroundColor: colors.primary + '10' }]}>
        <MusicEqualizer color={colors.primary} isPlaying={isPlaying} />
        <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: colors.surface }]}>
          <Icon name="heart" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textHeader}>
          <Text style={[styles.category, { color: colors.secondary }]}>{aarti.category}</Text>
        </View>
        
        <View style={[styles.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.hindiText, { color: colors.text }]}>
            {aarti.content}
          </Text>
        </View>
      </ScrollView>
      
      {/* Sticky Audio Player */}
      <AudioPlayerUI 
        title={aarti.title} 
        audioUrl={aarti.audioUrl} 
        onPlaybackStatusUpdate={setIsPlaying}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    paddingBottom: 40,
  },
  musicVisualizerContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  equalizerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    justifyContent: 'center',
  },
  bar: {
    width: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textHeader: {
    padding: 20,
    alignItems: 'center',
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  hindiText: {
    fontSize: 18,
    lineHeight: 34,
    fontWeight: '500',
    textAlign: 'center',
  }
});

export default AartiDetailScreen;
