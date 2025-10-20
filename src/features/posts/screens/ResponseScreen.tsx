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

type ResponseScreenProps = NativeStackScreenProps<RootStackParamList, 'Response'>;

// Responsive scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Tier color schemes - Cosmic/Space themed
const getTierColors = (tier: string) => {
  if (!tier) {
    return {
      primary: '#a78bfa',    // Default cosmic violet
      secondary: '#c4b5fd',
      gradient: ['#a78bfa', '#c4b5fd'],
      glow: '#a78bfa',
      background: 'rgba(167, 139, 250, 0.1)',
      backgroundGradient: '#2d1b4e',
    };
  }
  switch (tier.toLowerCase()) {
    case 'elite':
      return {
        primary: '#a78bfa',    // Cosmic Violet
        secondary: '#c4b5fd',
        gradient: ['#a78bfa', '#c4b5fd'],
        glow: '#a78bfa',
        background: 'rgba(167, 139, 250, 0.1)',
        backgroundGradient: '#2d1b4e', // Deep cosmic purple
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
        primary: '#a78bfa',    // Default cosmic violet
        secondary: '#c4b5fd',
        gradient: ['#a78bfa', '#c4b5fd'],
        glow: '#a78bfa',
        background: 'rgba(167, 139, 250, 0.1)',
        backgroundGradient: '#2d1b4e',
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
      primary: '#a855f7',    // Purple
      secondary: '#c084fc',
      badge: '📅',
    };
  }
};

// Floating star component
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
  // Get real data from route params
  const { content, scope, percentile, postId, matchCount, displayText, tier, temporal } = route.params;
  
  // Debug logging
  console.log('🔍 ResponseScreen route params:', {
    content,
    scope,
    percentile,
    postId,
    matchCount,
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

  // Create response data from real API response
  const responseData = {
    content: content || 'Sample content',
    scope: scope || 'world',
    inputType: 'action' as const,
    percentile: {
      tier: tier || 'elite',
      value: percentile?.value || percentile || 1,
      message: percentile?.message || displayText || 'Top 1%',
      color: percentile?.color || '#8b5cf6',
      displayText: percentile?.displayText || displayText || 'Top 1%',
      comparison: percentile?.comparison || generateComparisonText(matchCount || 0, percentile?.displayText || displayText || 'Top 1%'),
      badge: percentile?.emoji || percentile?.badge || '⭐'
    },
    matchCount: matchCount || 0,
    vibe: 'Unique',
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
  
  // Non-native animations (for SVG strokeDashoffset)
  const ringProgressValue = useRef(new Animated.Value(0)).current;
  
  // Get tier-specific icon
  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'elite':
        return (
          <Path 
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
            fill={tierColors.primary} 
            stroke={tierColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'rare':
        return (
          <Path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
            fill={tierColors.primary} 
            stroke={tierColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'unique':
        return (
          <Path 
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
            fill={tierColors.primary} 
            stroke={tierColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'notable':
        return (
          <Path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" 
            fill={tierColors.primary} 
            stroke={tierColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'beloved':
        return (
          <Path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            fill={tierColors.primary} 
            stroke={tierColors.primary}
            strokeWidth={1.5}
          />
        );
      case 'popular':
        return (
          <Path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" 
            fill={tierColors.primary} 
            stroke={tierColors.primary}
            strokeWidth={1.5}
          />
        );
      default:
        return (
          <Path 
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
            fill={tierColors.primary} 
            stroke={tierColors.primary}
            strokeWidth={1.5}
          />
        );
    }
  };

  // Share card state
  const [showShareCard, setShowShareCard] = useState(false);

  const isTopTier = ['elite', 'rare', 'unique', 'notable'].includes(responseData.percentile.tier);
  const isEliteTier = responseData.percentile.tier === 'elite';
  const isVeryLowPercentile = responseData.percentile.value <= 5; // For percentiles 5% and below
  const radius = 85;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;

  // Get dynamic colors based on tier and input type
  const tierColors = getTierColors(responseData.percentile.tier);
  const inputTypeColors = getInputTypeColors(responseData.inputType);

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

    // Ring (non-native driver for SVG) - Show actual percentile as filled portion
    setTimeout(() => {
      Animated.timing(ringProgressValue, {
        toValue: responseData.percentile.value / 100, // Direct percentile representation
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

  // Create dynamic background gradient based on tier - Cosmic theme
  const backgroundGradient = [
    '#0a0a1a',              // Deep space black (top)
    '#1a1a2e',              // Mid space (middle)
    tierColors.backgroundGradient, // Tier-specific cosmic color (bottom)
  ] as const;

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={backgroundGradient} style={styles.gradient} pointerEvents="box-none">
        {/* Floating Stars Background */}
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
                  shadowColor: tierColors.glow,
                  borderColor: `${tierColors.primary}33`,
                }
              ]}
            >
              
              {/* Hero Section */}
              <LinearGradient
                colors={[tierColors.background, 'transparent', tierColors.background]}
                style={styles.heroSection}
              >
                {/* Badges Row */}
                <View style={styles.badgesRow}>
                  {responseData.vibe && (
                    <View style={[
                      styles.vibeBadge,
                      {
                        backgroundColor: `${tierColors.primary}30`,
                        borderColor: `${tierColors.primary}80`,
                      }
                    ]}>
                      <Text style={styles.vibeBadgeText}>{responseData.vibe}</Text>
                    </View>
                  )}
                  <View style={[
                    styles.scopeBadge,
                    {
                      backgroundColor: `${tierColors.primary}30`,
                      borderColor: `${tierColors.primary}80`,
                    }
                  ]}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke={tierColors.primary} strokeWidth={2} />
                      <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={tierColors.primary} strokeWidth={2} />
                    </Svg>
                    <Text style={styles.scopeText}>{responseData.scope}</Text>
                  </View>
                </View>

                {/* Ring - Subtle and Elegant */}
                <View style={styles.ringContainer}>
                  {/* Subtle static glow (no pulse) - Dynamic color */}
                  <View style={[styles.ringGlowStatic, { backgroundColor: tierColors.glow }]} />
                  
                  <Svg width={scale(208)} height={scale(208)}>
                    <Defs>
                      <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={tierColors.primary} stopOpacity="0.8" />
                        <Stop offset="50%" stopColor={tierColors.secondary} stopOpacity="0.9" />
                        <Stop offset="100%" stopColor={tierColors.primary} stopOpacity="0.8" />
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
                    {isVeryLowPercentile ? (
                      // For very low percentiles, show a "burst" effect instead of progress
                      <Circle
                        cx={scale(104)}
                        cy={scale(104)}
                        r={scale(radius)}
                        stroke="url(#grad)"
                        strokeWidth={scale(strokeWidth)}
                        fill="transparent"
                        strokeDasharray={`${circumference * 0.1} ${circumference * 0.9}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${scale(104)}, ${scale(104)}`}
                      />
                    ) : (
                      // Normal progress ring for higher percentiles
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
                    )}
                  </Svg>
                  
                  {/* Center Content */}
                  <View style={styles.ringCenter}>
                    <View style={styles.tierIconContainer}>
                      <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                        {getTierIcon(responseData.percentile.tier)}
                      </Svg>
                    </View>
                    <Text style={styles.displayText}>{responseData.percentile.displayText || `${responseData.percentile.value}%`}</Text>
                    <View style={[
                      styles.tierPill,
                      {
                        backgroundColor: `${tierColors.primary}40`,
                        borderColor: `${tierColors.primary}80`,
                      }
                    ]}>
                      <Text style={styles.tierText}>{responseData.percentile.tier?.toUpperCase() || 'UNKNOWN'}</Text>
                    </View>
                  </View>
                </View>

                {/* Content */}
                <View style={styles.contentSection}>
                  <Text style={styles.contentLabel}>YOUR ACTION</Text>
                  <Text style={styles.contentText}>"{responseData.content}"</Text>
                  
                  {/* Comparison Text - Below Content */}
                  <View style={styles.comparisonContainer}>
                    <Text style={styles.comparisonText}>
                      {responseData.percentile.comparison || 
                       (temporal?.allTime ? `${temporal.allTime.matches} of ${temporal.allTime.total}` : 
                        generateComparisonText(matchCount || 0, responseData.percentile.displayText || 'Top 1%'))}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Message */}
              <View style={styles.messageSection}>
                <Text style={styles.messageText}>"{responseData.percentile.message}"</Text>
              </View>

              {/* Temporal Stats - Compact */}
              <View style={styles.temporalSection}>
                <View style={styles.temporalHeader}>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.temporalTitle}>ACROSS TIME</Text>
                </View>

                <View style={styles.temporalGrid}>
                  {[
                    { label: 'This Week', data: responseData.temporal.week },
                    { label: 'This Month', data: responseData.temporal.month },
                    { label: 'This Year', data: responseData.temporal.year },
                    { label: 'All Time', data: responseData.temporal.allTime },
                  ].map((item, idx) => (
                    <View key={idx} style={styles.temporalCard}>
                      <Text style={styles.temporalLabel}>{item.label}</Text>
                      <View style={styles.temporalValueContainer}>
                        <Text style={styles.temporalValue}>{item.data.comparison || 'N/A'}</Text>
                      </View>
                      <Text style={styles.temporalSubtext}>
                        {item.data.matches <= 1 ? 'Only you!' : `${item.data.matches - 1} others`}
                      </Text>
                    </View>
                  ))}
                </View>

                {responseData.temporal.insight && (
                  <Text style={styles.insightText}>{responseData.temporal.insight}</Text>
                )}
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>

      {/* Share Card Modal */}
      <ShareCard
        visible={showShareCard}
        onClose={() => setShowShareCard(false)}
        data={responseData}
        tierColors={tierColors}
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
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
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
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 16,
  },
  
  heroSection: { padding: scale(20), alignItems: 'center' },
  
  badgesRow: { flexDirection: 'row', gap: scale(8), marginBottom: scale(12) },
  vibeBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    borderWidth: 1,
  },
  vibeBadgeText: { fontSize: moderateScale(11, 0.2), color: '#ffffff', fontWeight: '600' },
  scopeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    borderWidth: 1,
  },
  scopeText: { fontSize: moderateScale(11, 0.2), color: '#ffffff', fontWeight: '500' },
  
  ringContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: scale(12), position: 'relative' },
  ringGlowStatic: {
    position: 'absolute',
    width: scale(220),
    height: scale(220),
    borderRadius: scale(110),
    opacity: 0.08,
  },
  ringCenter: { position: 'absolute', alignItems: 'center' },
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
  
  contentSection: { width: '100%', marginBottom: scale(4), alignItems: 'center' },
  contentLabel: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(6),
    textAlign: 'center',
  },
  contentText: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: moderateScale(24, 0.3),
    textAlign: 'center',
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
    paddingVertical: scale(14),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  temporalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: scale(10),
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
