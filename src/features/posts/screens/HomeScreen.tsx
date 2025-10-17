/**
 * Home Screen - Main Feed
 * Browse posts and discover what others are doing
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { usePlatformStats } from '@/lib/hooks/useStats';
import { useLocation } from '@/lib/hooks/useLocation';
import LocationLeaderboard from '@/features/home/components/LocationLeaderboard';
import TrendingLeaderboard from '@/features/home/components/TrendingLeaderboard';
import { getCurrentDay, getDayTheme } from '@/features/days/types';
import DayIcon from '@/features/days/components/DayIcon';

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

// ============================================================================
// TODAY'S VIBE CARD COMPONENT
// ============================================================================

function TodaysVibeCard({ navigation }: { navigation: any }) {
  const currentDay = getCurrentDay();
  const dayTheme = getDayTheme(currentDay);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.vibeCardContainer}>
      <BlurView intensity={30} tint="dark" style={styles.vibeCardBlur}>
        <LinearGradient
          colors={[`${dayTheme.color}18`, `${dayTheme.color}08`, 'rgba(255, 255, 255, 0.04)']}
          style={styles.vibeCardGradient}
        >
          {/* Accent Border */}
          <View style={[styles.vibeCardBorder, { borderColor: dayTheme.color }]} />

          {/* Content - Tappable to go to today's feed */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DayFeed', { day: currentDay })}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <View style={styles.vibeCardContent}>
                <View style={styles.vibeCardLeft}>
                  <DayIcon icon={dayTheme.icon} size={scale(36)} color={dayTheme.color} />
                  <View style={styles.vibeCardInfo}>
                    <View style={styles.vibeCardTitleRow}>
                      <Text style={styles.vibeCardLabel}>Today's Vibe</Text>
                      <View style={styles.vibeLiveDot} />
                    </View>
                    <Text style={styles.vibeCardTitle}>{dayTheme.name}</Text>
                    <Text style={styles.vibeCardDesc}>{dayTheme.shortDesc}</Text>
                  </View>
                </View>

                <View style={styles.vibeCardRight}>
                  <View style={[styles.vibeCardArrow, { backgroundColor: `${dayTheme.color}20`, borderColor: `${dayTheme.color}40` }]}>
                    <Text style={[styles.vibeCardArrowText, { color: dayTheme.color }]}>→</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* CTA - Subtle button to explore all days */}
          <TouchableOpacity
            style={styles.vibeCardCTA}
            onPress={() => navigation.navigate('DaysHub')}
            activeOpacity={0.7}
          >
            <Text style={styles.vibeCardCTAText}>Explore all 7 days</Text>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

type HomeScreenProps = {
  navigation: any;
  onTabChange?: (tab: 'trending') => void;
};

export default function HomeScreen({ navigation, onTabChange }: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // const { stats } = usePlatformStats();
  const stats: any = null;
  const { location } = useLocation();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true); // Mock unread state

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
              {/* Notifications Bell */}
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Notifications')}
                activeOpacity={0.7}
              >
                <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                    stroke="#c4b5fd"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                    stroke="#c4b5fd"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                {hasUnreadNotifications && <View style={styles.notificationDot} />}
              </TouchableOpacity>
              
              <Text style={styles.title}>ONLYONE</Text>
              <Text style={styles.subtitle}>TODAY'S COLLECTIVE</Text>
            </View>

            {/* Today's Vibe Card */}
            <TodaysVibeCard navigation={navigation} />

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
    position: 'relative',
  },
  notificationButton: {
    position: 'absolute',
    top: scale(12),
    right: 0,
    padding: scale(8),
    zIndex: 10,
  },
  notificationDot: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#ec4899',
    borderWidth: 2,
    borderColor: '#0a0a1a',
  },
  title: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: scale(3),
    textShadowColor: 'rgba(139, 92, 246, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: moderateScale(9, 0.2),
    color: '#c4b5fd',
    marginTop: scale(4),
    letterSpacing: scale(2),
    fontWeight: '400',
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
    color: '#c4b5fd',
    letterSpacing: scale(1.5),
    fontWeight: '700',
    marginBottom: scale(6),
  },
  statValue: {
    fontSize: moderateScale(28, 0.4),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: -1,
    textShadowColor: 'rgba(139, 92, 246, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  statSubtext: {
    fontSize: moderateScale(11, 0.2),
    color: '#a78bfa',
    marginTop: scale(4),
    fontWeight: '400',
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

  // Today's Vibe Card
  vibeCardContainer: {
    marginBottom: scale(20),
  },
  vibeCardBlur: {
    borderRadius: scale(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vibeCardGradient: {
    padding: scale(18),
    position: 'relative',
  },
  vibeCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(20),
    borderWidth: 1.5,
    opacity: 0.3,
    pointerEvents: 'none',
  },
  vibeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(14),
  },
  vibeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  vibeCardInfo: {
    flex: 1,
    gap: scale(2),
  },
  vibeCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  vibeCardLabel: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  vibeLiveDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
    backgroundColor: '#22c55e',
  },
  vibeCardTitle: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  vibeCardDesc: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  vibeCardRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vibeCardArrow: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  vibeCardArrowText: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '600',
  },
  vibeCardCTA: {
    alignItems: 'center',
    paddingTop: scale(14),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  vibeCardCTAText: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
