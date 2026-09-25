import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, AppState, AppStateStatus } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

interface AudioPlayerUIProps {
  title: string;
  audioUrl?: string;
  onPlaybackStatusUpdate?: (isPlaying: boolean) => void;
}

const AudioPlayerUI: React.FC<AudioPlayerUIProps> = ({ title, audioUrl, onPlaybackStatusUpdate }) => {
  const { colors, isDark } = useTheme();

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

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}>

      {/* Gradient-like top accent */}
      <View style={[styles.topAccent, { backgroundColor: colors.primary }]} />

      <View style={styles.mainContent}>
        {/* Album Art with pulse */}
        <Animated.View style={[
          styles.albumArt,
          {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary + '30',
            transform: [{ scale: pulseAnim }],
          },
        ]}>
          <View style={[styles.albumArtInner, { backgroundColor: colors.primary + '25' }]}>
            <Icon name={isPlaying ? 'headphones' : 'music'} size={26} color={colors.primary} />
          </View>
          {isPlaying && (
            <View style={[styles.playingDot, { backgroundColor: colors.accent || '#16A34A' }]} />
          )}
        </Animated.View>

        <View style={styles.infoContainer}>
          <Text style={[styles.nowPlaying, { color: colors.textLight }]}>
            {isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : 'Paused'}
          </Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.timeText, { color: colors.textLight }]}>
            {formatTime(elapsed)} / {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
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
          style={[styles.controlBtn, isSlowMode && { backgroundColor: colors.primary + '15' }]}
          onPress={() => setIsSlowMode(!isSlowMode)}
          disabled={isLoading}
        >
          <Text style={[styles.slowText, {
            color: isSlowMode ? colors.primary : colors.textLight,
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

        {/* Play / Pause - big circle */}
        <TouchableOpacity
          style={[
            styles.playBtn,
            {
              backgroundColor: isLoading ? colors.border : colors.primary,
              shadowColor: colors.primary,
            },
          ]}
          onPress={togglePlay}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            size={26}
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
          style={[styles.controlBtn, isRepeat && { backgroundColor: colors.primary + '15' }]}
          onPress={() => setIsRepeat(!isRepeat)}
          disabled={isLoading}
        >
          <Icon
            name="repeat"
            size={18}
            color={isRepeat ? colors.primary : colors.textLight}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  topAccent: {
    height: 3,
    width: '100%',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressTrack: {
    height: 3,
    marginHorizontal: 16,
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
    paddingVertical: 8,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});

export default AudioPlayerUI;
