/**
 * Response Screen - Complete Percentile Display
 * Matches web design exactly - all stats and sections
 * Purple/pink theme with smooth animations
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
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type ResponseScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Response'>;
};

// Responsive scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Sample data matching web exactly
const SAMPLE_DATA = {
  percentile: {
    value: 4,
    tier: 'elite',
    displayText: 'Top 4%',
    comparison: '1 of 234',
    badge: '🦄',
    message: "You're a unicorn! Only you did this!",
  },
  vibe: 'Adventurous',
  scope: 'Worldwide',
  inputType: 'action',
  content: 'Started learning to juggle while riding a unicycle',
  isDaySummary: false,
  activities: [], // Empty for single action
  temporal: {
    week: { matches: 0, total: 45, comparison: '1 of 45' },
    month: { matches: 2, total: 189, comparison: '3 of 189' },
    year: { matches: 5, total: 1234, comparison: '6 of 1234' },
    allTime: { matches: 12, total: 5678, comparison: '13 of 5678' },
    insight: 'First time this week!',
  },
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ResponseScreen({ navigation }: ResponseScreenProps) {
  // Native driver animations (transform, opacity)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(40)).current;
  const glowPulse = useRef(new Animated.Value(0.6)).current;
  
  // Non-native animations (for SVG strokeDashoffset)
  const ringProgressValue = useRef(new Animated.Value(0)).current;

  const isTopTier = ['elite', 'rare', 'unique', 'notable'].includes(SAMPLE_DATA.percentile.tier);
  const radius = 85;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        damping: 18,
        stiffness: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Ring (non-native driver for SVG)
    setTimeout(() => {
      Animated.timing(ringProgressValue, {
        toValue: 1 - SAMPLE_DATA.percentile.value / 100,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, 400);

    // No pulsing glow - keep it static and subtle
  }, []);

  const strokeDashoffset = ringProgressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Minimal Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M15 18l-6-6 6-6" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.headerCenter} />
            <TouchableOpacity 
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </Animated.View>

          {/* Single Unified Card */}
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
            <BlurView intensity={40} tint="dark" style={styles.mainCard}>
              
              {/* Hero Section */}
              <LinearGradient
                colors={isTopTier ? ['rgba(139, 92, 246, 0.1)', 'transparent', 'rgba(236, 72, 153, 0.1)'] : ['rgba(59, 130, 246, 0.1)', 'transparent', 'rgba(6, 182, 212, 0.1)']}
                style={styles.heroSection}
              >
                {/* Badges Row */}
                <View style={styles.badgesRow}>
                  {SAMPLE_DATA.vibe && (
                    <View style={styles.vibeBadge}>
                      <Text style={styles.vibeBadgeText}>{SAMPLE_DATA.vibe}</Text>
                    </View>
                  )}
                  <View style={styles.scopeBadge}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth={2} />
                      <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="#ffffff" strokeWidth={2} />
                    </Svg>
                    <Text style={styles.scopeText}>{SAMPLE_DATA.scope}</Text>
                  </View>
                </View>

                {/* Ring - Subtle and Elegant */}
                <View style={styles.ringContainer}>
                  {/* Subtle static glow (no pulse) */}
                  <View style={styles.ringGlowStatic} />
                  
                  <Svg width={scale(208)} height={scale(208)}>
                    <Defs>
                      <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <Stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                        <Stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
                      </SvgLinearGradient>
                    </Defs>
                    {/* Background circle - very subtle */}
                    <Circle
                      cx={scale(104)}
                      cy={scale(104)}
                      r={scale(radius)}
                      stroke="rgba(255, 255, 255, 0.03)"
                      strokeWidth={scale(strokeWidth)}
                      fill="transparent"
                    />
                    {/* Progress circle - thinner, elegant */}
                    <AnimatedCircle
                      cx={scale(104)}
                      cy={scale(104)}
                      r={scale(radius)}
                      stroke="url(#grad)"
                      strokeWidth={scale(strokeWidth)}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      rotation="-90"
                      origin={`${scale(104)}, ${scale(104)}`}
                    />
                  </Svg>
                  
                  {/* Center Content */}
                  <View style={styles.ringCenter}>
                    <Text style={styles.tierEmoji}>{SAMPLE_DATA.percentile.badge}</Text>
                    <Text style={styles.displayText}>{SAMPLE_DATA.percentile.displayText}</Text>
                    <View style={styles.comparisonPill}>
                      <Text style={styles.comparisonText}>{SAMPLE_DATA.percentile.comparison}</Text>
                    </View>
                    <View style={styles.tierPill}>
                      <Text style={styles.tierText}>{SAMPLE_DATA.percentile.tier.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>

                {/* Content */}
                <View style={styles.contentSection}>
                  <Text style={styles.contentLabel}>{SAMPLE_DATA.inputType === 'day' ? 'YOUR DAY SUMMARY' : 'YOUR ACTION'}</Text>
                  <Text style={styles.contentText}>"{SAMPLE_DATA.content}"</Text>
                </View>
              </LinearGradient>

              {/* Message */}
              <View style={styles.messageSection}>
                <Text style={styles.messageText}>"{SAMPLE_DATA.percentile.message}"</Text>
              </View>

              {/* Temporal Stats */}
              <View style={styles.temporalSection}>
                <View style={styles.temporalHeader}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.temporalTitle}>ACROSS TIME</Text>
                </View>

                <View style={styles.temporalGrid}>
                  {[
                    { label: 'This Week', data: SAMPLE_DATA.temporal.week },
                    { label: 'This Month', data: SAMPLE_DATA.temporal.month },
                    { label: 'This Year', data: SAMPLE_DATA.temporal.year },
                    { label: 'All Time', data: SAMPLE_DATA.temporal.allTime },
                  ].map((item, idx) => (
                    <View key={idx} style={styles.temporalCard}>
                      <Text style={styles.temporalLabel}>{item.label}</Text>
                      <Text style={styles.temporalValue}>{item.data.comparison}</Text>
                      <Text style={styles.temporalSubtext}>
                        {item.data.matches === 0 ? 'Only you!' : `${item.data.matches} others`}
                      </Text>
                    </View>
                  ))}
                </View>

                {SAMPLE_DATA.temporal.insight && (
                  <Text style={styles.insightText}>{SAMPLE_DATA.temporal.insight}</Text>
                )}
              </View>

              {/* Action Buttons - 3 buttons like web */}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
                  <LinearGradient colors={['#8b5cf6', '#ec4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryGradient}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={styles.primaryText}>Share</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.secondaryText}>Feed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M12 4v16m8-8H4" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.secondaryText}>Post</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a1a' },
  gradient: { flex: 1 },
  scrollContent: { padding: scale(16), paddingBottom: scale(40) },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
    paddingHorizontal: scale(4),
  },
  headerButton: { width: scale(44), height: scale(44), alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  
  mainCard: {
    borderRadius: scale(24),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 16,
  },
  
  heroSection: { padding: scale(24), alignItems: 'center' },
  
  badgesRow: { flexDirection: 'row', gap: scale(8), marginBottom: scale(16) },
  vibeBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  vibeBadgeText: { fontSize: moderateScale(11, 0.2), color: '#ffffff', fontWeight: '600' },
  scopeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scopeText: { fontSize: moderateScale(11, 0.2), color: '#ffffff', fontWeight: '500' },
  
  ringContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: scale(16), position: 'relative' },
  ringGlowStatic: {
    position: 'absolute',
    width: scale(220),
    height: scale(220),
    borderRadius: scale(110),
    backgroundColor: '#8b5cf6',
    opacity: 0.08,
  },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  tierEmoji: { fontSize: moderateScale(30, 0.4), marginBottom: scale(6) },
  displayText: {
    fontSize: moderateScale(26, 0.4),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: '#8b5cf6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  comparisonPill: {
    marginTop: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  comparisonText: { fontSize: moderateScale(9, 0.2), color: '#ffffff', fontWeight: '700' },
  tierPill: {
    marginTop: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  tierText: { fontSize: moderateScale(8, 0.2), color: '#ffffff', fontWeight: '800', letterSpacing: scale(1) },
  
  contentSection: { width: '100%', marginBottom: scale(4) },
  contentLabel: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(6),
  },
  contentText: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: moderateScale(24, 0.3),
  },
  
  messageSection: {
    paddingHorizontal: scale(24),
    paddingVertical: scale(20),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: moderateScale(15, 0.2),
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    fontWeight: '300',
    lineHeight: moderateScale(22, 0.2),
    textAlign: 'center',
  },
  
  temporalSection: {
    paddingHorizontal: scale(24),
    paddingVertical: scale(20),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  temporalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(12),
  },
  temporalTitle: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: scale(1.5),
    fontWeight: '600',
  },
  temporalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
    marginBottom: scale(12),
  },
  temporalCard: {
    width: `${(SCREEN_WIDTH - scale(48) - scale(48) - scale(10)) / 2}px`,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: scale(10),
  },
  temporalLabel: { fontSize: moderateScale(11, 0.2), color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500', marginBottom: scale(4) },
  temporalValue: { fontSize: moderateScale(14, 0.2), color: '#ffffff', fontWeight: '700', marginBottom: scale(2) },
  temporalSubtext: { fontSize: moderateScale(9, 0.2), color: 'rgba(255, 255, 255, 0.5)' },
  insightText: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    lineHeight: moderateScale(16, 0.2),
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  actions: {
    flexDirection: 'row',
    gap: scale(10),
    paddingHorizontal: scale(24),
    paddingVertical: scale(20),
  },
  primaryButton: {
    flex: 1,
    borderRadius: scale(14),
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryGradient: {
    paddingVertical: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
  },
  primaryText: { color: '#ffffff', fontSize: moderateScale(13, 0.2), fontWeight: '600' },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingVertical: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(14),
  },
  secondaryText: { color: '#ffffff', fontSize: moderateScale(13, 0.2), fontWeight: '600' },
});
