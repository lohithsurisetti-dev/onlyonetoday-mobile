/**
 * Home Screen - Main Feed
 * Browse posts and discover what others are doing
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { usePlatformStats } from '@/lib/hooks/useStats';
import { useLocation } from '@/lib/hooks/useLocation';
import LocationLeaderboard from '@/features/home/components/LocationLeaderboard';
import TrendingLeaderboard from '@/features/home/components/TrendingLeaderboard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Floating star component
const FloatingStar = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const starScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -30,
              duration: 3000 + Math.random() * 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 20,
              duration: 2500 + Math.random() * 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -20,
              duration: 2500 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 2500 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.15,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(starScale, {
              toValue: 1,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(starScale, {
              toValue: 0.5,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(starScale, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          transform: [{ translateY }, { translateX }, { scale: starScale }],
          opacity,
        },
      ]}
    />
  );
};

type HomeScreenProps = {
  navigation: any;
  onTabChange?: (tab: 'trending') => void;
};

export default function HomeScreen({ navigation, onTabChange }: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // const { stats } = usePlatformStats();
  const stats: any = null;
  const { location } = useLocation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
        {/* Floating Stars */}
        <View style={styles.starsContainer} pointerEvents="none">
          {[...Array(15)].map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <FloatingStar delay={i * 200} />
            </View>
          ))}
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Compact Header */}
            <View style={styles.header}>
              <Text style={styles.title}>ONLYONE</Text>
              <Text style={styles.subtitle}>DISCOVER YOUR UNIQUENESS</Text>
            </View>

            {/* Premium Stats Cards */}
            {/* Global Pulse Stats */}
            <View style={styles.statsRow}>
              <BlurView intensity={30} tint="dark" style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.15)', 'transparent']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statLabel}>TODAY</Text>
                  <Text style={styles.statValue}>
                    {stats?.totalPostsToday?.toLocaleString() || '0'}
                  </Text>
                  <Text style={styles.statSubtext}>Posts</Text>
                </LinearGradient>
              </BlurView>

              <BlurView intensity={30} tint="dark" style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(236, 72, 153, 0.15)', 'transparent']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statLabel}>UNIQUE</Text>
                  <Text style={styles.statValue}>
                    {stats?.uniqueActionsToday?.toLocaleString() || '0'}
                  </Text>
                  <Text style={styles.statSubtext}>Actions</Text>
                </LinearGradient>
              </BlurView>
            </View>

            {/* Location Leaderboard */}
            <LocationLeaderboard userLocation={location} />

            {/* Trending Leaderboard */}
            <TrendingLeaderboard onExploreTrending={() => onTabChange?.('trending')} />
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradient: {
    flex: 1,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: scale(12),
    paddingBottom: scale(12),
    marginBottom: scale(8),
  },
  title: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: scale(3),
  },
  subtitle: {
    fontSize: moderateScale(9, 0.2),
    color: '#9ca3af',
    marginTop: scale(4),
    letterSpacing: scale(2),
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: scale(8),
    paddingBottom: scale(120),
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(16),
    marginBottom: scale(28),
  },
  statCard: {
    flex: 1,
    borderRadius: scale(18),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: scale(16),
    alignItems: 'center',
  },
  statLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(6),
  },
  statValue: {
    fontSize: moderateScale(28, 0.4),
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: -1,
  },
  statSubtext: {
    fontSize: moderateScale(11, 0.2),
    color: '#6b7280',
    marginTop: scale(4),
    fontWeight: '300',
  },
  placeholderText: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: scale(8),
    marginTop: scale(20),
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: moderateScale(13, 0.2),
    color: '#9ca3af',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
