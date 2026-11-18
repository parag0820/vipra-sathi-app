import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, AppState, AppStateStatus } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useTranslation } from 'react-i18next';

interface AudioPlayerUIProps {
  title: string;
  audioUrl?: string;
  onPlaybackStatusUpdate?: (isPlaying: boolean) => void;
}

const AudioPlayerUI: React.FC<AudioPlayerUIProps> = ({ title, audioUrl, onPlaybackStatusUpdate }) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const player = useAudioPlayer(audioUrl || null);
  const status = useAudioPlayerStatus(player);

  const [isSlowMode, setIsSlowMode] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const isPlaying = status.playing;
  const isLoading = status.isBuffering || !status.isLoaded;
  const elapsed = status.currentTime;
  const duration = status.duration || 1; // avoid divide by zero

  useEffect(() => {
    player.loop = isRepeat;
  }, [isRepeat, player]);

  useEffect(() => {
    player.setPlaybackRate(isSlowMode ? 0.75 : 1.0);
  }, [isSlowMode, player]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (elapsed / duration) * 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [elapsed, duration]);

  useEffect(() => {
    if (isPlaying) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim]);

  useEffect(() => {
    if (onPlaybackStatusUpdate) {
      onPlaybackStatusUpdate(isPlaying);
    }
  }, [isPlaying, onPlaybackStatusUpdate]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState.match(/inactive|background/) && isPlaying) {
        player.pause();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isPlaying, player]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (isLoading) return;
    if (!isPlaying && elapsed >= duration - 1) {
      player.seekTo(0);
    }
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const progressPercent = duration > 0 ? elapsed / duration : 0;

  const accentColor = isDark ? '#FCA5A5' : '#8B1D1D';
  const accentBg = isDark ? '#2B1B1B' : '#FFF0ED';
  const borderDynamic = isDark ? '#2D2D2D' : '#EFECE8';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: borderDynamic,
        },
      ]}
    >
      {/* Top Maroon Accent */}
      <View style={[styles.topAccent, { backgroundColor: accentColor }]} />

      <View style={styles.mainContent}>
        {/* Album Art with pulse */}
        <Animated.View style={[
          styles.albumArt,
          {
            backgroundColor: accentBg,
            borderColor: borderDynamic,
            transform: [{ scale: pulseAnim }],
          },
        ]}>
          <View style={[styles.albumArtInner, { backgroundColor: accentBg }]}>
            <Icon name={isPlaying ? 'headphones' : 'music'} size={22} color={accentColor} />
          </View>
          {isPlaying && (
            <View style={[styles.playingDot, { backgroundColor: colors.accent || '#16A34A' }]} />
          )}
        </Animated.View>

        <View style={styles.infoContainer}>
          <Text style={[styles.nowPlaying, { color: colors.textLight }]}>
            {isLoading ? t('audio.loading', 'Loading...') : isPlaying ? t('audio.now_playing', 'Now Playing') : t('audio.paused', 'Paused')}
          </Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.timeText, { color: colors.textLight }]}>
            {formatTime(elapsed)} / {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: borderDynamic }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: accentColor,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        {/* Slow mode */}
        <TouchableOpacity
          style={[styles.controlBtn, isSlowMode && { backgroundColor: accentBg }]}
          onPress={() => setIsSlowMode(!isSlowMode)}
          disabled={isLoading}
        >
          <Text style={[styles.slowText, {
            color: isSlowMode ? accentColor : colors.textLight,
            fontWeight: isSlowMode ? '800' : '500',
          }]}>
            0.75x
          </Text>
        </TouchableOpacity>

        {/* Rewind 10s */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            const newPos = Math.max(0, elapsed - 10);
            player.seekTo(newPos);
          }}
          disabled={isLoading}
        >
          <Icon name="rotate-ccw" size={18} color={colors.textLight} />
        </TouchableOpacity>

        {/* Play / Pause - flat circle */}
        <TouchableOpacity
          style={[
            styles.playBtn,
            {
              backgroundColor: isLoading ? borderDynamic : '#8B1D1D',
            },
          ]}
          onPress={togglePlay}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color="#FFF"
            style={!isPlaying && !isLoading ? { marginLeft: 3 } : {}}
          />
        </TouchableOpacity>

        {/* Forward 10s */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            const newPos = Math.min(duration, elapsed + 10);
            player.seekTo(newPos);
          }}
          disabled={isLoading}
        >
          <Icon name="rotate-cw" size={18} color={colors.textLight} />
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity
          style={[styles.controlBtn, isRepeat && { backgroundColor: accentBg }]}
          onPress={() => setIsRepeat(!isRepeat)}
          disabled={isLoading}
        >
          <Icon
            name="repeat"
            size={18}
            color={isRepeat ? accentColor : colors.textLight}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 0,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  topAccent: {
    height: 2,
    width: '100%',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  albumArt: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1.5,
  },
  albumArtInner: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoContainer: {
    flex: 1,
  },
  nowPlaying: {
    fontSize: 9.5,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    marginBottom: 2,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 1,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  progressTrack: {
    height: 3,
    marginHorizontal: 14,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  controlBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slowText: {
    fontSize: 11,
  },
  playBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});

export default AudioPlayerUI;
