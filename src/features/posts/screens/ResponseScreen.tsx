/**
 * Response Screen - Complete Percentile Display
 * Matches web design exactly - all stats and sections
 * Purple/pink theme with smooth animations
 */

import React, { useRef, useEffect, useState } from 'react';
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
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ShareCard from '../components/ShareCard';
import { getEmotionalToneColors } from '@/shared/constants/emotionalToneColors';
import { TemporalStoryCard } from '../components/TemporalStoryCard';
import { generateTemporalStories } from '../utils/temporalStoryGenerator';
import { getCosmicColors, getElementColor } from '@/shared/constants/cosmicColorPalette';
import { useAuthStore } from '@/lib/stores/authStore';

type ResponseScreenProps = NativeStackScreenProps<RootStackParamList, 'Response'>;

// Responsive scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Tier color schemes - Cosmic/Space themed (no purple)
const getTierColors = (tier: string) => {
  if (!tier) {
    return {
      primary: '#06b6d4',    // Default stellar cyan (no purple)
      secondary: '#22d3ee',
      gradient: ['#06b6d4', '#22d3ee'],
      glow: '#06b6d4',
      background: 'rgba(6, 182, 212, 0.1)',
      backgroundGradient: '#0c1e2a',
    };
  }
  switch (tier.toLowerCase()) {
    case 'elite':
      return {
        primary: '#06b6d4',    // Stellar Cyan (no purple)
        secondary: '#22d3ee',
        gradient: ['#06b6d4', '#22d3ee'],
        glow: '#06b6d4',
        background: 'rgba(6, 182, 212, 0.1)',
        backgroundGradient: '#0c1e2a',
      };
    case 'rare':
      return {
        primary: '#f472b6',    // Nebula Pink
        secondary: '#fb7185',
        gradient: ['#f472b6', '#fb7185'],
        glow: '#f472b6',
        background: 'rgba(244, 114, 182, 0.1)',
        backgroundGradient: '#4a1942', // Deep pink space
      };
    case 'unique':
      return {
        primary: '#22d3ee',    // Stellar Cyan
        secondary: '#67e8f9',
        gradient: ['#22d3ee', '#67e8f9'],
        glow: '#22d3ee',
        background: 'rgba(34, 211, 238, 0.1)',
        backgroundGradient: '#1e3a4e', // Deep ocean space
      };
    case 'notable':
      return {
        primary: '#f97316',    // Cosmic Orange
        secondary: '#fb923c',
        gradient: ['#f97316', '#fb923c'],
        glow: '#f97316',
        background: 'rgba(249, 115, 22, 0.1)',
        backgroundGradient: '#3a2a1e', // Deep amber space
      };
    case 'beloved':
      return {
        primary: '#f472b6',    // Beloved Pink - Warm and cherished
        secondary: '#fb7185',
        gradient: ['#f472b6', '#fb7185'],
        glow: '#f472b6',
        background: 'rgba(244, 114, 182, 0.1)',
        backgroundGradient: '#4a1f2e', // Deep pink space
      };
    case 'popular':
      return {
        primary: '#fbbf24',    // Solar Gold
        secondary: '#fcd34d',
        gradient: ['#fbbf24', '#fcd34d'],
        glow: '#fbbf24',
        background: 'rgba(251, 191, 36, 0.1)',
        backgroundGradient: '#4a3a1e', // Deep golden space
      };
    default:
      return {
        primary: '#06b6d4',    // Default stellar cyan (no purple)
        secondary: '#22d3ee',
        gradient: ['#06b6d4', '#22d3ee'],
        glow: '#06b6d4',
        background: 'rgba(6, 182, 212, 0.1)',
        backgroundGradient: '#0c1e2a',
      };
  }
};

// Input type colors
const getInputTypeColors = (inputType: string) => {
  if (inputType === 'action') {
    return {
      primary: '#3b82f6',    // Blue
      secondary: '#60a5fa',
      badge: '🎯',
    };
  } else {
    return {
      primary: '#06b6d4',    // Stellar Cyan (no purple)
      secondary: '#22d3ee',
      badge: '📅',
    };
  }
};

// Floating star component for subtle background animation
const FloatingStar = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

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
              toValue: 0.3,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
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
          transform: [{ translateY }, { translateX }, { scale }],
          opacity,
        },
      ]}
    />
  );
};

// Sample data matching web exactly
const SAMPLE_DATA = {
  percentile: {
    value: 4,
    tier: 'rare',
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

export default function ResponseScreen({ navigation, route }: ResponseScreenProps) {
  // Get current user for username display
  const { user } = useAuthStore();
  
  // V2: Get narrative-based data from route params
  const { 
    content, 
    scope, 
    postId,
    // Location data
    locationCity,
    locationState,
    locationCountry,
    // V2: Narrative fields
    narrative,
    matchCount: v2MatchCount,
    totalInScope,
    emotionalTone,
    celebration,
    badge,
    // Legacy fields (for backward compatibility)
    percentile, 
    matchCount: legacyMatchCount, 
    displayText, 
    tier, 
    temporal 
  } = route.params;
  
  // Use V2 fields if available, fallback to legacy
  const matchCount = v2MatchCount ?? legacyMatchCount ?? 0;
  
  // Debug logging
  console.log('🔍 ResponseScreen route params:', {
    content,
    scope,
    percentile,
    postId,
    matchCount: v2MatchCount,
    totalInScope,
    legacyMatchCount,
    displayText,
    tier
  });
  
  // Generate comparison text based on matchCount
  const generateComparisonText = (matchCount: number, displayText: string) => {
    if (matchCount <= 1) {
      const firstTimeMessages = [
        "You're the first to share this!",
        "You're a trailblazer!",
        "You're the pioneer!",
        "You're leading the way!",
        "You're the innovator!"
      ];
      return firstTimeMessages[Math.floor(Math.random() * firstTimeMessages.length)];
    } else {
      return `You're connected to ${matchCount - 1} others`;
    }
  };

  // Generate varied temporal messages for first-time posts
  const generateTemporalMessage = (timeframe: string, matchCount: number) => {
    if (matchCount <= 1) {
      const messages = {
        week: ["First this week!", "Week's pioneer", "Leading the week"],
        month: ["First this month!", "Month's trailblazer", "Monthly first"],
        year: ["First this year!", "Year's innovator", "Annual pioneer"],
        allTime: ["First ever!", "Trailblazer", "Pioneer"]
      };
      const options = messages[timeframe as keyof typeof messages] || ["First!"];
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `${matchCount} of ${matchCount}`;
    }
  };

  // Calculate percentage and percentile for numbers display
  const calculateMetrics = (matchCount: number, totalInScope: number | null | undefined) => {
    if (!totalInScope || totalInScope === 0) {
      return {
        percentage: 0,
        percentile: 100,
        ratio: '1 in 1',
        rarityLabel: 'Unique'
      };
    }
    
    const percentage = (matchCount / totalInScope) * 100;
    const percentile = 100 - percentage; // Top X% means X% are above you
    const ratio = totalInScope > 0 ? `1 in ${Math.round(totalInScope / matchCount)}` : '1 in 1';
    
    // Determine rarity label
    let rarityLabel = 'Common';
    if (percentage <= 1) rarityLabel = 'Very Rare';
    else if (percentage <= 5) rarityLabel = 'Rare';
    else if (percentage <= 15) rarityLabel = 'Uncommon';
    else if (percentage <= 30) rarityLabel = 'Notable';
    else rarityLabel = 'Common';
    
    return {
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      percentile: Math.round(percentile * 10) / 10,
      ratio,
      rarityLabel
    };
  };

  const metrics = calculateMetrics(matchCount || 0, totalInScope);

  // Format location display
  const formatLocation = () => {
    const parts: string[] = [];
    if (locationCity) parts.push(locationCity);
    if (locationState) parts.push(locationState);
    if (locationCountry) parts.push(locationCountry);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const locationDisplay = formatLocation();

  // V2: Create response data with narrative fields
  const responseData = {
    content: content || 'Sample content',
    scope: scope || 'world',
    locationCity,
    locationState,
    locationCountry,
    locationDisplay,
    inputType: 'action' as const,
    // V2: Narrative fields
    narrative: narrative || "You're blazing a trail. No one else did this today. Your moment is uniquely yours. 🌟",
    matchCount: matchCount,
    totalInScope: totalInScope,
    emotionalTone: (emotionalTone as 'unique' | 'shared' | 'common') || 'unique',
    celebration: celebration || 'trailblazer',
    badge: badge || '🌟',
    // Numbers for results (makes people feel special)
    percentage: metrics.percentage,
    percentile: metrics.percentile,
    ratio: metrics.ratio,
    rarityLabel: metrics.rarityLabel,
    // Legacy fields (for backward compatibility)
    percentile: percentile ? {
      tier: tier || 'elite',
      value: percentile?.value || percentile || 1,
      message: percentile?.message || displayText || 'Top 1%',
      color: percentile?.color || '#06b6d4', // Stellar cyan instead of purple
      displayText: percentile?.displayText || displayText || 'Top 1%',
      comparison: percentile?.comparison || generateComparisonText(matchCount || 0, percentile?.displayText || displayText || 'Top 1%'),
      badge: percentile?.emoji || percentile?.badge || '⭐'
    } : undefined,
    vibe: undefined, // V2: Removed vibe badge
    postId: postId,
    temporal: temporal ? {
      week: { 
        comparison: temporal.week?.comparison || generateTemporalMessage('week', temporal.week?.matching || 0), 
        matches: temporal.week?.matching || 0, 
        total: temporal.week?.total || 1 
      },
      month: { 
        comparison: temporal.month?.comparison || generateTemporalMessage('month', temporal.month?.matching || 0), 
        matches: temporal.month?.matching || 0, 
        total: temporal.month?.total || 1 
      },
      year: { 
        comparison: temporal.year?.comparison || generateTemporalMessage('year', temporal.year?.matching || 0), 
        matches: temporal.year?.matching || 0, 
        total: temporal.year?.total || 1 
      },
      allTime: { 
        comparison: temporal.allTime?.comparison || generateTemporalMessage('allTime', temporal.allTime?.matching || 0), 
        matches: temporal.allTime?.matching || 0, 
        total: temporal.allTime?.total || 1 
      },
      insight: (matchCount || 0) <= 1 ? 
        ['You are the first to share this!', 'You are a trailblazer!', 'You are the pioneer!', 'You are leading the way!'][Math.floor(Math.random() * 4)] : 
        'You are part of a community!'
    } : {
      week: { comparison: generateTemporalMessage('week', 0), matches: 0, total: 1 },
      month: { comparison: generateTemporalMessage('month', 0), matches: 0, total: 1 },
      year: { comparison: generateTemporalMessage('year', 0), matches: 0, total: 1 },
      allTime: { comparison: generateTemporalMessage('allTime', 0), matches: 0, total: 1 },
      insight: ['You are the first to share this!', 'You are a trailblazer!', 'You are the pioneer!', 'You are leading the way!'][Math.floor(Math.random() * 4)]
    }
  };

  // Native driver animations (transform, opacity)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(40)).current;
  const glowPulse = useRef(new Animated.Value(0.6)).current;
  const progressScaleAnim = useRef(new Animated.Value(0)).current; // For scale transform (native)
  
  // Non-native animations (for SVG strokeDashoffset)
  const progressRingAnim = useRef(new Animated.Value(0)).current; // For strokeDashoffset (non-native)
  
  // V2: Get tier-specific icon (legacy support, uses colors parameter)
  const getTierIcon = (tier: string, iconColors: typeof emotionalColors) => {
    switch (tier?.toLowerCase()) {
      case 'elite':
        return (
          <Path 
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
            fill={iconColors.primary} 
            stroke={iconColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'rare':
        return (
          <Path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
            fill={iconColors.primary} 
            stroke={iconColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'unique':
        return (
          <Path 
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
            fill={iconColors.primary} 
            stroke={iconColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'notable':
        return (
          <Path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" 
            fill={iconColors.primary} 
            stroke={iconColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'beloved':
        return (
          <Path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            fill={iconColors.primary} 
            stroke={iconColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'popular':
        return (
          <Path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" 
            fill={iconColors.primary} 
            stroke={iconColors.primary}
            strokeWidth={1.5}
          />
        );
      default:
        return (
          <Path 
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
            fill={iconColors.primary} 
            stroke={iconColors.primary}
            strokeWidth={1.5}
          />
        );
    }
  };

  // Share card state
  const [showShareCard, setShowShareCard] = useState(false);

  // V2: Get emotional tone colors (theme accent)
  const emotionalColors = getEmotionalToneColors(responseData.emotionalTone);
  
  // Get cosmic color palette (varied, cohesive)
  const cosmicColors = getCosmicColors(emotionalColors);
  
  // Use cosmic colors for varied, cohesive design
  const colors = cosmicColors;

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
      Animated.timing(progressScaleAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true, // For scale transform
      }),
      Animated.timing(progressRingAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: false, // strokeDashoffset doesn't support native driver
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowPulse, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  // V2: Create subtle background gradient with theme accent - from bottom
  const backgroundGradient = [
    '#0a0a1a',              // Deep space black (top)
    '#0a0a1a',              // Deep space black (middle)
    emotionalColors.backgroundGradient || '#0f0f1f',  // Subtle theme gradient (bottom)
  ] as const;

  return (
    <View style={styles.safeArea}>
      <LinearGradient 
        colors={backgroundGradient} 
        style={styles.gradient} 
        start={{ x: 0.5, y: 0 }} 
        end={{ x: 0.5, y: 1 }}
        pointerEvents="box-none"
      >
        {/* Floating Stars Background - Subtle animation */}
        <View style={styles.starsContainer} pointerEvents="none">
          {[...Array(12)].map((_, i) => (
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
              onPress={() => setShowShareCard(true)}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </Animated.View>

          {/* Single Unified Card */}
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
            <BlurView 
              intensity={40} 
              tint="dark" 
              style={[
                styles.mainCard,
                {
                  shadowColor: colors.theme.glow,
                  borderColor: colors.neutral.border,
                }
              ]}
            >
              
              {/* Hero Section - Redesigned */}
              <View style={styles.heroSection}>
                {/* Username Display */}
                {user?.username && (
                  <View style={styles.usernameContainer}>
                    <Text style={[styles.usernameText, { color: colors.neutral.text.secondary }]}>
                      @{user.username}
                    </Text>
                  </View>
                )}
                
                {/* Narrative Story - Prominent */}
                <View style={styles.narrativeContainer}>
                  {/* Narrative Story - Theme color for emotional connection */}
                  {responseData.narrative ? (
                    <Text style={[styles.narrativeStoryText, { color: colors.theme.primary }]}>
                      {responseData.narrative}
                    </Text>
                  ) : null}
                  
                  {/* Creative Visual Indicator - Circular Progress Ring */}
                  <Animated.View 
                    style={[
                      styles.visualIndicatorContainer,
                      {
                        opacity: fadeAnim,
                        transform: [{ scale: progressScaleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }]
                      }
                    ]}
                  >
                    {(() => {
                      console.log('📊 Visual Indicator - Raw Data:', {
                        matchCount: responseData.matchCount,
                        totalInScope: responseData.totalInScope,
                        responseDataKeys: Object.keys(responseData)
                      });
                      
                      // Only truly unique if matchCount is 1 AND totalInScope is exactly 1 (not 0 or null)
                      const isTrulyUnique = (responseData.matchCount === 1 && responseData.totalInScope === 1);
                      const displayMatchCount = responseData.matchCount || 1;
                      // Use actual totalInScope if available, otherwise fallback
                      const displayTotal = isTrulyUnique 
                        ? 1 
                        : (responseData.totalInScope && responseData.totalInScope > 0 
                          ? responseData.totalInScope 
                          : Math.max(displayMatchCount, 1));
                      const percentage = isTrulyUnique 
                        ? 100 // First ever = 100% (you're 1 of 1)
                        : (displayTotal > 0
                          ? ((displayMatchCount / displayTotal) * 100)
                          : 0);
                      
                      console.log('📊 Visual Indicator - Calculated:', {
                        isTrulyUnique,
                        displayMatchCount,
                        displayTotal,
                        percentage: percentage.toFixed(1) + '%'
                      });
                      
                      const radius = 60;
                      const strokeWidth = 6;
                      const circumference = 2 * Math.PI * radius;
                      const progress = percentage / 100;
                      const animatedOffset = progressRingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [circumference, circumference * (1 - progress)]
                      });
                      
                      return (
                        <View style={styles.progressRingContainer}>
                          {/* Glow effect */}
                          <Animated.View 
                            style={[
                              styles.ringGlow, 
                              { 
                                backgroundColor: colors.theme.glow, 
                                opacity: glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.3] })
                              }
                            ]} 
                          />
                          
                          <Svg width={140} height={140} style={styles.progressSvg}>
                            <Defs>
                              <SvgLinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor={colors.theme.primary} stopOpacity="1" />
                                <Stop offset="100%" stopColor={colors.theme.secondary} stopOpacity="1" />
                              </SvgLinearGradient>
                            </Defs>
                            
                            {/* Background circle */}
                            <Circle
                              cx={70}
                              cy={70}
                              r={radius}
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                            />
                            
                            {/* Animated Progress circle */}
                            <AnimatedCircle
                              cx={70}
                              cy={70}
                              r={radius}
                              stroke="url(#progressGrad)"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={animatedOffset}
                              strokeLinecap="round"
                              rotation="-90"
                              origin="70, 70"
                            />
                          </Svg>
                          
                          {/* Center Content - Numbers */}
                          <View style={styles.progressCenterContent}>
                            <Text style={[styles.progressMainNumber, { color: colors.theme.primary }]}>
                              {displayMatchCount.toLocaleString()}
                      </Text>
                            <Text style={[styles.progressSubNumber, { color: colors.neutral.text.secondary }]}>
                              of {displayTotal.toLocaleString()}
                      </Text>
                            <Text style={[styles.progressPercentage, { color: colors.theme.secondary }]}>
                              {isTrulyUnique ? 'First!' : `${percentage.toFixed(1)}%`}
                      </Text>
                    </View>
                    </View>
                      );
                    })()}
                  </Animated.View>
                </View>

                {/* Content Section - Clean with neutral colors */}
                <View style={styles.contentSection}>
                  <View style={styles.contentHeader}>
                    <View style={[styles.contentDivider, { backgroundColor: colors.neutral.border }]} />
                    <Text style={[styles.contentLabel, { color: colors.neutral.text.tertiary }]}>YOUR ACTION</Text>
                    <View style={[styles.contentDivider, { backgroundColor: colors.neutral.border }]} />
                  </View>
                  <Text 
                    style={[styles.contentText, { color: colors.neutral.text.secondary }]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    "{responseData.content}"
                  </Text>
                </View>

                {/* Badges Row - Scope and Location */}
                <View style={styles.badgesRow}>
                    <View style={[
                    styles.scopeBadge,
                      {
                        backgroundColor: `${colors.theme.primary}15`,
                        borderColor: `${colors.theme.primary}30`,
                      }
                    ]}>
                    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke={colors.theme.primary} strokeWidth={1.5} />
                      <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={colors.theme.primary} strokeWidth={1.5} />
                    </Svg>
                    <Text style={[styles.scopeText, { color: colors.theme.primary }]}>
                      {responseData.scope.charAt(0).toUpperCase() + responseData.scope.slice(1)}
                    </Text>
                    </View>
                  {locationDisplay && (
                  <View style={[
                      styles.locationBadge,
                    {
                        backgroundColor: `${colors.theme.primary}15`,
                        borderColor: `${colors.theme.primary}30`,
                    }
                  ]}>
                    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={colors.theme.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        <Circle cx="12" cy="10" r="3" stroke={colors.theme.primary} strokeWidth={1.5} />
                    </Svg>
                      <Text style={[styles.locationText, { color: colors.theme.primary }]} numberOfLines={1}>
                        {locationDisplay}
                      </Text>
                  </View>
                  )}
                </View>
              </View>

              {/* Temporal Stories - V2: Story-Driven */}
              {(() => {
                const temporalStories = generateTemporalStories(
                  {
                    week: responseData.temporal.week,
                    month: responseData.temporal.month,
                    year: responseData.temporal.year,
                    allTime: responseData.temporal.allTime,
                  },
                  responseData.matchCount || 0
                );

                if (temporalStories.length === 0) return null;

                return (
                  <View style={[styles.temporalSection, { borderTopColor: colors.neutral.border }]}>
                    <View style={styles.temporalHeader}>
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                          stroke={colors.accents.gold}
                          strokeWidth={1.5}
                          fill={colors.accents.gold}
                          fillOpacity={0.15}
                        />
                      </Svg>
                      <Text style={[styles.temporalTitle, { color: colors.neutral.text.tertiary }]}>ACROSS TIME</Text>
                    </View>

                    <View style={styles.temporalCardsContainer}>
                      {temporalStories.map((story, idx) => (
                        <TemporalStoryCard 
                          key={`${story.timeframe}-${idx}`} 
                          story={story} 
                          colors={emotionalColors}
                          fullWidth={false}
                        />
                      ))}
                    </View>
                  </View>
                );
              })()}
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>

      {/* Share Card Modal */}
      <ShareCard
        visible={showShareCard}
        onClose={() => setShowShareCard(false)}
        data={{
          // V2: Narrative fields
          narrative: responseData.narrative,
          matchCount: responseData.matchCount,
          totalInScope: responseData.totalInScope,
          emotionalTone: responseData.emotionalTone,
          celebration: responseData.celebration,
          badge: responseData.badge,
          // Legacy fields
          percentile: responseData.percentile,
          content: responseData.content,
          scope: responseData.scope,
          locationCity: responseData.locationCity,
          locationState: responseData.locationState,
          locationCountry: responseData.locationCountry,
          locationDisplay: responseData.locationDisplay,
          inputType: responseData.inputType,
          temporal: responseData.temporal,
        }}
        tierColors={emotionalColors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a1a' },
  gradient: { flex: 1 },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  scrollContent: { padding: scale(16), paddingTop: scale(16), paddingBottom: scale(60) },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
    paddingHorizontal: scale(4),
  },
  headerButton: { width: scale(44), height: scale(44), alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  
  mainCard: {
    borderRadius: scale(24),
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 30, 0.5)', // Neutral dark, no purple tint
    borderWidth: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 16,
  },
  
  heroSection: { 
    padding: scale(24), 
    alignItems: 'center',
    paddingBottom: scale(20),
  },
  usernameContainer: {
    marginBottom: scale(12),
    alignItems: 'center',
  },
  usernameText: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    letterSpacing: scale(0.3),
  },
  
  badgesRow: { 
    flexDirection: 'row', 
    gap: scale(8), 
    marginTop: scale(16),
    justifyContent: 'center',
  },
  vibeBadge: {
    paddingHorizontal: scale(14),
    paddingVertical: scale(7),
    borderRadius: scale(20),
    borderWidth: 1.5,
  },
  vibeBadgeText: { 
    fontSize: moderateScale(10, 0.2), 
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scopeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(7),
    borderRadius: scale(20),
    borderWidth: 1.5,
  },
  scopeText: { 
    fontSize: moderateScale(10, 0.2), 
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(7),
    borderRadius: scale(20),
    borderWidth: 1.5,
    maxWidth: scale(150),
  },
  locationText: { 
    fontSize: moderateScale(9, 0.2), 
    fontWeight: '600',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  
  ringContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: scale(12), position: 'relative' },
  ringGlowStatic: {
    position: 'absolute',
    width: scale(220),
    height: scale(220),
    borderRadius: scale(110),
    opacity: 0.08,
  },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  // V2: Narrative styles - Redesigned
  narrativeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(24),
    paddingHorizontal: scale(16),
    width: '100%',
  },
  narrativeStoryText: {
    fontSize: moderateScale(18, 0.25),
    fontWeight: '600',
    lineHeight: moderateScale(26, 0.25),
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: scale(14),
    paddingHorizontal: scale(8),
  },
  visualIndicatorContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: scale(24),
    marginBottom: scale(8),
  },
  progressRingContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.2,
  },
  progressSvg: {
    position: 'absolute',
  },
  progressCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
  },
  progressMainNumber: {
    fontSize: moderateScale(32, 0.3),
    fontWeight: '900',
    letterSpacing: scale(-0.5),
    lineHeight: moderateScale(36, 0.3),
  },
  progressSubNumber: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.2),
    marginTop: scale(2),
  },
  progressPercentage: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '700',
    letterSpacing: scale(0.3),
    marginTop: scale(4),
  },
  matchCountBadge: {
    paddingHorizontal: scale(18),
    paddingVertical: scale(10),
    borderRadius: scale(14),
    borderWidth: 1.5,
  },
  matchCountText: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  numbersContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: scale(16),
  },
  mainNumberBadge: {
    paddingHorizontal: scale(24),
    paddingVertical: scale(16),
    borderRadius: scale(16),
    borderWidth: 1.5,
    alignItems: 'center',
    minWidth: scale(200),
  },
  mainExclusivityNumber: {
    fontSize: moderateScale(36, 0.4),
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: scale(4),
  },
  mainNumberSubtext: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
  celebrationText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '800',
    letterSpacing: scale(1),
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  tierIconContainer: { 
    marginBottom: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayText: {
    fontSize: moderateScale(26, 0.4),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
   comparisonContainer: {
     marginTop: scale(16),
     alignItems: 'center',
   },
   comparisonText: { 
     fontSize: moderateScale(14, 0.3), 
     color: '#ffffff', 
     fontWeight: '600',
     textAlign: 'center',
     opacity: 0.9,
     lineHeight: moderateScale(20, 0.3),
   },
  tierPill: {
    marginTop: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(10),
    borderWidth: 1,
  },
  tierText: { fontSize: moderateScale(8, 0.2), color: '#ffffff', fontWeight: '800', letterSpacing: scale(1) },
  
  contentSection: { 
    width: '100%', 
    marginBottom: scale(20),
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: scale(12),
    gap: scale(8),
  },
  contentDivider: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  contentLabel: {
    fontSize: moderateScale(9, 0.2),
    letterSpacing: scale(1.8),
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  contentText: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    lineHeight: moderateScale(26, 0.3),
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: scale(12),
    maxHeight: moderateScale(26, 0.3) * 3, // 3 lines max
  },
  
  messageSection: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(14),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    fontWeight: '300',
    lineHeight: moderateScale(20, 0.2),
    textAlign: 'center',
  },
  
  temporalSection: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  temporalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: scale(8),
  },
  temporalCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
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
    gap: scale(8),
    marginBottom: scale(8),
  },
  temporalCard: {
    width: (SCREEN_WIDTH - scale(40) - scale(40) - scale(8)) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: scale(10),
    alignItems: 'center',
  },
  temporalLabel: { 
    fontSize: moderateScale(10, 0.2), 
    color: 'rgba(255, 255, 255, 0.6)', 
    fontWeight: '500', 
    marginBottom: scale(6),
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  temporalValueContainer: {
    marginBottom: scale(4),
  },
  temporalValue: { 
    fontSize: moderateScale(16, 0.3), 
    color: '#ffffff', 
    fontWeight: '800', 
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  temporalSubtext: { 
    fontSize: moderateScale(9, 0.2), 
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontWeight: '400',
  },
  insightText: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    lineHeight: moderateScale(14, 0.2),
    paddingTop: scale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});
