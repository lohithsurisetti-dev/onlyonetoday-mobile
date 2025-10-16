/**
 * Response Screen - Percentile Display
 * Shows user's uniqueness score with animated ring and stats
 * Premium design with smooth animations
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Circle } from 'react-native-svg';

// Responsive scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Sample data for preview
const SAMPLE_DATA = {
  percentile: 96,
  tier: 'elite',
  tierName: 'Elite',
  peopleWhoDidThis: 1,
  totalPostsInScope: 234,
  scope: 'world',
  content: 'Started learning to juggle while riding a unicycle',
  message: "You're a unicorn! Only you did this!",
};

const TIER_COLORS = {
  elite: '#FFD700',
  rare: '#8b5cf6',
  unique: '#3b82f6',
  notable: '#ec4899',
  common: '#9ca3af',
  popular: '#6b7280',
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ResponseScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const ringProgress = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const tierColor = TIER_COLORS[SAMPLE_DATA.tier as keyof typeof TIER_COLORS];
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Staggered entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 12,
        stiffness: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate ring after entrance
    setTimeout(() => {
      Animated.timing(ringProgress, {
        toValue: SAMPLE_DATA.percentile,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }, 400);
  }, []);

  const strokeDashoffset = ringProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => {}}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>YOUR RESULT</Text>
            <TouchableOpacity style={styles.shareButton} onPress={() => {}}>
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Animated Percentile Ring */}
          <Animated.View
            style={[
              styles.ringContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <BlurView intensity={20} tint="dark" style={styles.ringBlur}>
              <Svg width={scale(220)} height={scale(220)}>
                {/* Background circle */}
                <Circle
                  cx={scale(110)}
                  cy={scale(110)}
                  r={scale(radius)}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth={scale(12)}
                  fill="transparent"
                />
                {/* Animated progress circle */}
                <AnimatedCircle
                  cx={scale(110)}
                  cy={scale(110)}
                  r={scale(radius)}
                  stroke={tierColor}
                  strokeWidth={scale(12)}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${scale(110)}, ${scale(110)}`}
                />
              </Svg>

              {/* Center content */}
              <View style={styles.ringCenter}>
                <Text style={[styles.percentileText, { color: tierColor }]}>
                  Top {SAMPLE_DATA.percentile}%
                </Text>
                <Text style={[styles.tierBadge, { color: tierColor }]}>
                  {SAMPLE_DATA.tierName.toUpperCase()}
                </Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* Message Card */}
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <BlurView intensity={30} tint="dark" style={[styles.messageCard, { borderColor: `${tierColor}40` }]}>
              <Text style={styles.messageText}>{SAMPLE_DATA.message}</Text>
              <View style={styles.scopePill}>
                <Text style={styles.scopeText}>🌍 Worldwide</Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* Content Quote */}
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <BlurView intensity={25} tint="dark" style={styles.quoteCard}>
              <Text style={styles.quoteIcon}>"</Text>
              <Text style={styles.quoteText}>{SAMPLE_DATA.content}</Text>
            </BlurView>
          </Animated.View>

          {/* Stats Grid */}
          <Animated.View
            style={[
              styles.statsGrid,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <BlurView intensity={30} tint="dark" style={styles.statCard}>
              <LinearGradient
                colors={[`${tierColor}20`, 'transparent']}
                style={styles.statGradient}
              >
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statLabel}>RANKING</Text>
                <Text style={[styles.statValue, { color: tierColor }]}>
                  Top {SAMPLE_DATA.percentile}%
                </Text>
                <View style={styles.statBar}>
                  <View style={[styles.statBarFill, { width: '96%', backgroundColor: tierColor }]} />
                </View>
              </LinearGradient>
            </BlurView>

            <BlurView intensity={30} tint="dark" style={styles.statCard}>
              <LinearGradient
                colors={[`${tierColor}20`, 'transparent']}
                style={styles.statGradient}
              >
                <Text style={styles.statIcon}>👥</Text>
                <Text style={styles.statLabel}>PEOPLE</Text>
                <Text style={[styles.statValue, { color: tierColor }]}>
                  {SAMPLE_DATA.peopleWhoDidThis} of {SAMPLE_DATA.totalPostsInScope}
                </Text>
                <View style={styles.statBar}>
                  <View
                    style={[
                      styles.statBarFill,
                      {
                        width: `${(SAMPLE_DATA.peopleWhoDidThis / SAMPLE_DATA.totalPostsInScope) * 100}%`,
                        backgroundColor: tierColor,
                      },
                    ]}
                  />
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionButtons,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#8b5cf6', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Share My Uniqueness ✨</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
              <BlurView intensity={20} tint="dark" style={styles.secondaryButtonBlur}>
                <Text style={styles.secondaryButtonText}>View Feed 🌍</Text>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    padding: scale(24),
    paddingBottom: scale(40),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(32),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(24, 0.2),
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: moderateScale(12, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(2),
    fontWeight: '600',
  },
  shareButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
  },
  shareButtonText: {
    color: '#8b5cf6',
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: scale(32),
  },
  ringBlur: {
    width: scale(240),
    height: scale(240),
    borderRadius: scale(120),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentileText: {
    fontSize: moderateScale(42, 0.4),
    fontWeight: '200',
    letterSpacing: -1,
  },
  tierBadge: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    letterSpacing: scale(2),
    marginTop: scale(4),
  },
  messageCard: {
    borderRadius: scale(20),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    borderWidth: 1,
    padding: scale(24),
    marginBottom: scale(20),
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  messageText: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: moderateScale(28, 0.3),
    marginBottom: scale(16),
  },
  scopePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    alignSelf: 'center',
  },
  scopeText: {
    fontSize: moderateScale(12, 0.2),
    color: '#9ca3af',
    fontWeight: '500',
  },
  quoteCard: {
    borderRadius: scale(18),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: scale(24),
    marginBottom: scale(20),
  },
  quoteIcon: {
    fontSize: moderateScale(48, 0.4),
    color: 'rgba(139, 92, 246, 0.3)',
    fontWeight: '700',
    position: 'absolute',
    top: scale(12),
    left: scale(16),
  },
  quoteText: {
    fontSize: moderateScale(17, 0.2),
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    lineHeight: moderateScale(26, 0.2),
    paddingTop: scale(12),
  },
  statsGrid: {
    flexDirection: 'row',
    gap: scale(16),
    marginBottom: scale(32),
  },
  statCard: {
    flex: 1,
    borderRadius: scale(18),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: scale(20),
    alignItems: 'center',
  },
  statIcon: {
    fontSize: moderateScale(28, 0.3),
    marginBottom: scale(8),
  },
  statLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(8),
  },
  statValue: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '300',
    marginBottom: scale(12),
  },
  statBar: {
    width: '100%',
    height: scale(3),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(2),
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: scale(2),
  },
  actionButtons: {
    gap: scale(12),
  },
  primaryButton: {
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(16, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderRadius: scale(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  secondaryButtonBlur: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8b5cf6',
    fontSize: moderateScale(16, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

