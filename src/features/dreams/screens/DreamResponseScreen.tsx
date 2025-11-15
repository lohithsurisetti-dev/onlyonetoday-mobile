/**
 * Dream Response Screen
 * Compact liquid glass design with efficient layout
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { DreamPost, DreamInterpretation, fetchDreamById, isDefaultInterpretation as checkIsDefaultInterpretation } from '@/lib/api/dreams';
import DreamIcon from '../components/DreamIcon';
import { colors } from '@/config/theme.config';

type DreamResponseScreenProps = NativeStackScreenProps<RootStackParamList, 'DreamResponse'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
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

// Compact SVG Icon Components
const InsightIcon = ({ type, size, color }: { type: string; size: number; color: string }) => {
  switch (type) {
    case 'meaning':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
          <Path
            d="M12 6v6M12 16h.01"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'guidance':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}15`}
          />
        </Svg>
      );
    case 'comfort':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}15`}
          />
        </Svg>
      );
    case 'advice':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}15`}
          />
        </Svg>
      );
    case 'hope':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}20`}
          />
        </Svg>
      );
    case 'connection':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="9" cy="12" r="3" stroke={color} strokeWidth={2} />
          <Circle cx="15" cy="12" r="3" stroke={color} strokeWidth={2} />
          <Path d="M12 12h0" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'people':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={2} />
          <Path
            d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    default:
      return null;
  }
};

// Helper function to get dream type color
const getDreamTypeColor = (type: string): string => {
  switch (type) {
    case 'night_dream':
      return '#6366f1'; // Indigo
    case 'daydream':
      return '#fbbf24'; // Amber
    case 'lucid_dream':
      return '#a855f7'; // Purple
    case 'nightmare':
      return '#ef4444'; // Red
    default:
      return colors.primary;
  }
};

export default function DreamResponseScreen({ navigation, route }: DreamResponseScreenProps) {
  const { dream: initialDream, content } = route.params;
  const [dream, setDream] = useState<DreamPost>(initialDream);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const interpretation = dream.interpretation as DreamInterpretation | undefined;
  // Check if it's a real AI-generated interpretation (not default placeholder)
  const isDefault = checkIsDefaultInterpretation(interpretation);
  const hasInterpretation = interpretation && !isDefault && interpretation.meaning && interpretation.meaning.length > 50;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Poll for interpretation if not ready (async generation)
  useEffect(() => {
    if (hasInterpretation) {
      return; // Already has interpretation, no need to poll
    }

    let pollCount = 0;
    const maxPolls = 20; // Poll for up to 60 seconds (3s intervals) - increased for async generation
    setIsPolling(true);
    setPollingTimedOut(false);

    const pollInterval = setInterval(async () => {
      pollCount++;
      
      if (pollCount > maxPolls) {
        console.log('⏰ Polling timed out after 60 seconds');
        clearInterval(pollInterval);
        setIsPolling(false);
        setPollingTimedOut(true);
        return;
      }

      try {
        console.log(`🔍 Polling for interpretation (attempt ${pollCount}/${maxPolls})...`);
        const result = await fetchDreamById(dream.id);
        
        if (result.success && result.post) {
          console.log('📥 Fetched dream:', {
            hasInterpretation: !!result.post.interpretation,
            interpretationType: typeof result.post.interpretation,
            interpretationPreview: result.post.interpretation ? JSON.stringify(result.post.interpretation).substring(0, 100) : 'null'
          });
          
          if (result.post.interpretation) {
            const newInterpretation = result.post.interpretation;
            // Check if it's a real AI-generated interpretation (not default placeholder)
            const isDefault = checkIsDefaultInterpretation(newInterpretation);
            
            console.log('🔍 Interpretation check:', {
              hasMeaning: !!newInterpretation?.meaning,
              meaningLength: newInterpretation?.meaning?.length,
              meaningPreview: newInterpretation?.meaning?.substring(0, 50),
              title: newInterpretation?.title,
              isDefault,
              willAccept: !isDefault && newInterpretation?.meaning && newInterpretation.meaning.length > 50
            });
            
            if (newInterpretation && newInterpretation.meaning && !isDefault && newInterpretation.meaning.length > 50) {
              console.log('✅ Real interpretation received, updating UI');
              // Ensure all fields are properly typed before updating state
              // Only include fields that are part of DreamPost interface
              // IMPORTANT: Preserve totalInScope from original dream if fetched result doesn't have it
              const preservedTotalInScope = (result.post?.totalInScope && typeof result.post.totalInScope === 'number' && result.post.totalInScope > 0) 
                ? result.post.totalInScope 
                : (dream.totalInScope && typeof dream.totalInScope === 'number' && dream.totalInScope > 0 ? dream.totalInScope : 0);
              
              const updatedDream: DreamPost = {
                id: result.post?.id || dream.id,
                content: result.post?.content || dream.content,
                dream_type: result.post?.dream_type || dream.dream_type,
                symbols: result.post?.symbols || dream.symbols || [],
                emotions: result.post?.emotions || dream.emotions || [],
                clarity: result.post?.clarity ?? dream.clarity ?? 0,
                interpretation: newInterpretation,
                scope: result.post?.scope || dream.scope,
                location_city: result.post?.location_city || dream.location_city,
                location_state: result.post?.location_state || dream.location_state,
                location_country: result.post?.location_country || dream.location_country,
                matchCount: result.post?.matchCount ?? dream.matchCount ?? 0,
                totalInScope: preservedTotalInScope, // Preserve from original if not in fetched result
                tier: result.post?.tier || dream.tier || '',
                percentile: result.post?.percentile ?? dream.percentile ?? 0,
                created_at: result.post?.created_at || dream.created_at,
              };
              setDream(updatedDream);
              clearInterval(pollInterval);
              setIsPolling(false);
              setPollingTimedOut(false);
            } else {
              console.log('⏳ Still waiting for interpretation...', {
                hasMeaning: !!newInterpretation?.meaning,
                meaningLength: newInterpretation?.meaning?.length,
                isDefault,
                reason: isDefault ? 'default placeholder detected' : (newInterpretation?.meaning?.length <= 50 ? 'meaning too short' : 'unknown')
              });
            }
          } else {
            console.log('⏳ No interpretation in database yet...');
          }
        } else {
          console.log('⚠️ Failed to fetch dream:', result.error);
        }
      } catch (error) {
        console.error('❌ Error polling for interpretation:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [dream.id, hasInterpretation]);

  const formatLocation = () => {
    const parts: string[] = [];
    if (dream.location_city) parts.push(dream.location_city);
    if (dream.location_state) parts.push(dream.location_state);
    if (dream.location_country) parts.push(dream.location_country);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const locationDisplay = formatLocation();
  const dreamTypeColor = getDreamTypeColor(dream.dream_type);

  // Ensure matchCount, totalInScope, and clarity are always numbers (prevent rendering errors)
  const matchCount = typeof dream.matchCount === 'number' ? dream.matchCount : (dream.matchCount ? Number(dream.matchCount) : 0);
  const totalInScope = typeof dream.totalInScope === 'number' ? dream.totalInScope : (dream.totalInScope ? Number(dream.totalInScope) : 0);
  const clarity = typeof dream.clarity === 'number' ? dream.clarity : (dream.clarity ? Number(dream.clarity) : 0);

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#0a0a1a', '#1a1a2e', '#2d1b4e', '#1a1a2e']}
        style={styles.gradient}
        pointerEvents="box-none"
      >
        {/* Floating Stars */}
        <View style={styles.starsContainer} pointerEvents="none">
          {[...Array(30)].map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <FloatingStar delay={i * 150} />
            </View>
          ))}
        </View>

        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }}
        >
          {/* Compact Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <View style={styles.backButtonCircle}>
                <Text style={styles.backArrow}>←</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Dream Insights</Text>
              <Text style={styles.headerSubtitle}>Your subconscious revealed</Text>
            </View>
            <View style={styles.backButton} />
          </View>

          {/* Connections Card - Premium Styled */}
          <LiquidGlassCard style={styles.connectionsCard}>
            <View style={styles.connectionsContent}>
              <View style={styles.connectionsIconContainer}>
                <InsightIcon type="people" size={20} color={colors.primary} />
              </View>
              <View style={styles.connectionsTextContainer}>
                <Text style={styles.connectionsText}>
                  {matchCount <= 1
                    ? "You're the first to share this dream!"
                    : `${matchCount - 1} others have similar dreams`}
                </Text>
                {totalInScope > 1 && (
                  <Text style={styles.connectionsSubtext}>
                    {String(totalInScope)} total in your scope
                  </Text>
                )}
              </View>
            </View>
          </LiquidGlassCard>

          {/* Interpretation Card - Liquid Glass with Skeleton */}
          {!hasInterpretation && (
            <LiquidGlassCard style={styles.interpretationCard}>
              <View style={styles.titleRowSkeleton}>
                <SkeletonText width={scale(250)} height={scale(28)} style={styles.skeletonTitle} />
              </View>
              
              {/* Dream Info Below Title */}
              <View style={styles.dreamInfoInline}>
                <View style={styles.dreamTypeCompact}>
                  <DreamIcon type={dream.dream_type} size={14} color={dreamTypeColor} />
                  <Text style={[styles.dreamTypeText, { color: dreamTypeColor }]}>
                    {dream.dream_type === 'night_dream' ? 'Night' :
                     dream.dream_type === 'daydream' ? 'Day' :
                     dream.dream_type === 'lucid_dream' ? 'Lucid' :
                     'Nightmare'}
                  </Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.clarityText}>
                  Clarity: <Text style={[styles.clarityValue, { color: dreamTypeColor }]}>{clarity}/10</Text>
                </Text>
                {locationDisplay && typeof locationDisplay === 'string' && locationDisplay.length > 0 && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.locationText} numberOfLines={1}>{locationDisplay}</Text>
                  </>
                )}
              </View>

              <View style={styles.insightsList}>
                <SkeletonInsightMessage icon="meaning" label="Meaning" color="#a78bfa" />
                <SkeletonInsightMessage icon="guidance" label="Emotional Guidance" color="#f472b6" />
                <SkeletonInsightMessage icon="comfort" label="Comfort" color="#60a5fa" />
                <SkeletonInsightMessage icon="advice" label="Advice" color="#34d399" />
                <SkeletonInsightMessage icon="hope" label="Hope" color="#fbbf24" />
              </View>

              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceLabel}>Confidence: </Text>
                <SkeletonText width={scale(40)} height={scale(16)} />
              </View>

              {pollingTimedOut && (
                <View style={styles.timeoutMessage}>
                  <Text style={styles.timeoutText}>
                    ⏰ Interpretation is taking longer than expected. It will appear here once ready.
                  </Text>
                </View>
              )}
            </LiquidGlassCard>
          )}
          {interpretation && hasInterpretation && (
            <LiquidGlassCard style={styles.interpretationCard}>
              <View style={styles.titleRow}>
                <Text style={styles.interpretationTitle}>{interpretation.title || 'Your Dream'}</Text>
                {isPolling && !hasInterpretation && (
                  <ActivityIndicator size="small" color={dreamTypeColor} style={styles.pollingIndicator} />
                )}
              </View>
              
              {/* Dream Info Below Title */}
              <View style={styles.dreamInfoInline}>
                <View style={styles.dreamTypeCompact}>
                  <DreamIcon type={dream.dream_type} size={14} color={dreamTypeColor} />
                  <Text style={[styles.dreamTypeText, { color: dreamTypeColor }]}>
                    {dream.dream_type === 'night_dream' ? 'Night' :
                     dream.dream_type === 'daydream' ? 'Day' :
                     dream.dream_type === 'lucid_dream' ? 'Lucid' :
                     'Nightmare'}
                  </Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.clarityText}>
                  Clarity: <Text style={[styles.clarityValue, { color: dreamTypeColor }]}>{clarity}/10</Text>
                </Text>
                {locationDisplay && typeof locationDisplay === 'string' && locationDisplay.length > 0 && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.locationText} numberOfLines={1}>{locationDisplay}</Text>
                  </>
                )}
              </View>

              <View style={styles.insightsList}>
                {interpretation.meaning && (
                  <InsightMessage
                    icon="meaning"
                    label="Meaning"
                    text={interpretation.meaning || ''}
                    color="#a78bfa"
                  />
                )}
                {interpretation.emotionalGuidance && (
                  <InsightMessage
                    icon="guidance"
                    label="Emotional Guidance"
                    text={interpretation.emotionalGuidance || ''}
                    color="#f472b6"
                  />
                )}
                {interpretation.comfortMessage && (
                  <InsightMessage
                    icon="comfort"
                    label="Comfort"
                    text={interpretation.comfortMessage || ''}
                    color="#60a5fa"
                  />
                )}
                {interpretation.actionAdvice && (
                  <InsightMessage
                    icon="advice"
                    label="Advice"
                    text={interpretation.actionAdvice || ''}
                    color="#34d399"
                  />
                )}
                {interpretation.hopeMessage && (
                  <InsightMessage
                    icon="hope"
                    label="Hope"
                    text={interpretation.hopeMessage || ''}
                    color="#fbbf24"
                  />
                )}
              </View>

              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceLabel}>Confidence: </Text>
                <Text style={styles.confidenceValue}>
                  {Math.round((interpretation.confidence || 0) * 100)}%
                </Text>
              </View>
            </LiquidGlassCard>
          )}
        </Animated.ScrollView>
      </LinearGradient>
    </View>
  );
}

// Skeleton Text Component with Shimmer
function SkeletonText({ width, height, style }: { width: number; height: number; style?: any }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: scale(4),
        },
        style,
        { opacity: shimmerOpacity },
      ]}
    />
  );
}

// Skeleton Insight Message Component
function SkeletonInsightMessage({ icon, label, color }: { icon: string; label: string; color: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View style={[styles.insightMessage, { opacity: fadeAnim }]}>
      <View style={[styles.insightIconSmall, { backgroundColor: `${color}15` }]}>
        <InsightIcon type={icon} size={14} color={color} />
      </View>
      <View style={styles.insightContent}>
        <Text style={[styles.insightLabel, { color }]}>{label}</Text>
        <View style={styles.skeletonTextContainer}>
          <Animated.View style={[styles.skeletonLine, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.skeletonLine, styles.skeletonLinePartial, { opacity: shimmerOpacity }]} />
        </View>
      </View>
    </Animated.View>
  );
}

// Liquid Glass Card Component
function LiquidGlassCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.liquidGlassWrapper, style]}>
      <BlurView intensity={80} tint="dark" style={styles.liquidGlassBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.liquidGlassGradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

// Insight Message Component - Compact with icon on left
interface InsightMessageProps {
  icon: string;
  label: string;
  text: string;
  color: string;
}

function InsightMessage({ icon, label, text, color }: InsightMessageProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.insightMessage, { opacity: fadeAnim }]}>
      <View style={[styles.insightIconSmall, { backgroundColor: `${color}15` }]}>
        <InsightIcon type={icon} size={14} color={color} />
      </View>
      <View style={styles.insightContent}>
        <Text style={[styles.insightLabel, { color }]}>{label || ''}</Text>
        <Text style={styles.insightText}>{text || ''}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
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
  },
  star: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    padding: scale(20),
    paddingTop: scale(60),
    paddingBottom: scale(100),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
    marginTop: scale(0),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: moderateScale(24, 0.3),
    color: '#ffffff',
    fontWeight: '300',
  },
  headerCenter: {
    alignItems: 'center',
    gap: scale(3),
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Dream Info Inline Below Title (Inside Card)
  dreamInfoInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(-4),
    marginBottom: scale(20),
    gap: scale(8),
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  dreamTypeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
  },
  dreamTypeText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: scale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  clarityText: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  clarityValue: {
    fontWeight: '800',
  },
  locationText: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    flex: 1,
  },
  // Liquid Glass Card Styles
  liquidGlassWrapper: {
    marginBottom: scale(16),
    borderRadius: scale(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  liquidGlassBlur: {
    borderRadius: scale(24),
    overflow: 'hidden',
  },
  liquidGlassGradient: {
    borderRadius: scale(24),
    padding: scale(16),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  // Interpretation Card
  interpretationCard: {
    marginBottom: scale(16),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  titleRowSkeleton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: scale(8),
  },
  interpretationTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: moderateScale(28, 0.3),
    marginBottom: scale(8),
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  pollingIndicator: {
    marginLeft: scale(8),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(40),
    gap: scale(12),
  },
  loadingText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  skeletonTitle: {
    borderRadius: scale(6),
    alignSelf: 'center',
    marginBottom: scale(8),
  },
  skeletonTextContainer: {
    gap: scale(8),
    marginTop: scale(4),
  },
  skeletonLine: {
    height: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(4),
    width: '100%',
  },
  skeletonLinePartial: {
    width: '75%',
  },
  insightsList: {
    gap: scale(20),
    marginBottom: scale(20),
    position: 'relative',
    zIndex: 1,
  },
  insightMessage: {
    flexDirection: 'row',
    gap: scale(14),
    alignItems: 'flex-start',
  },
  insightIconSmall: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(1),
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    marginBottom: scale(8),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  insightText: {
    fontSize: moderateScale(15, 0.2),
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: moderateScale(24, 0.2),
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
  },
  confidenceLabel: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  confidenceValue: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '800',
    color: colors.primary,
  },
  // Connections Card - Premium Styled
  connectionsCard: {
    marginBottom: scale(12),
    padding: scale(18),
  },
  connectionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
  },
  connectionsIconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  connectionsTextContainer: {
    flex: 1,
    gap: scale(4),
  },
  connectionsText: {
    fontSize: moderateScale(15, 0.2),
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.3,
    lineHeight: scale(20),
  },
  connectionsSubtext: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: scale(2),
  },
  timeoutMessage: {
    marginTop: scale(20),
    padding: scale(16),
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  timeoutText: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: scale(20),
  },
});


