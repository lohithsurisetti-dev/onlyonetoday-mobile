/**
 * Skeleton Loader Components
 * Beautiful animated skeleton loaders for various card types
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// ============================================================================
// POST CARD SKELETON
// ============================================================================

interface PostCardSkeletonProps {
  index?: number;
}

export function PostCardSkeleton({ index = 0 }: PostCardSkeletonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    // Shimmer animation
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
    <Animated.View style={[styles.skeletonCard, { opacity: fadeAnim }]}>
      <BlurView intensity={25} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.cardGradient}
        >
          {/* Header */}
          <View style={styles.skeletonHeader}>
            <Animated.View style={[styles.skeletonUsername, { opacity: shimmerOpacity }]} />
            <View style={{ flex: 1 }} />
            <Animated.View style={[styles.skeletonTime, { opacity: shimmerOpacity }]} />
          </View>

          {/* Content */}
          <View style={styles.skeletonContent}>
            <Animated.View style={[styles.skeletonLine, styles.skeletonLineFull, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonLine, styles.skeletonLineFull, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonLine, styles.skeletonLinePartial, { opacity: shimmerOpacity }]} />
          </View>

          {/* Footer */}
          <View style={styles.skeletonFooter}>
            <Animated.View style={[styles.skeletonTag, { opacity: shimmerOpacity }]} />
            <View style={{ flex: 1 }} />
            <View style={styles.skeletonReactions}>
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

// ============================================================================
// DAY SUMMARY CARD SKELETON
// ============================================================================

export function DaySummaryCardSkeleton({ index = 0 }: PostCardSkeletonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    // Shimmer animation
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
    <Animated.View style={[styles.skeletonCard, { opacity: fadeAnim }]}>
      <BlurView intensity={25} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.cardGradient}
        >
          {/* Day Badge */}
          <View style={styles.skeletonDayBadge}>
            <Animated.View style={[styles.skeletonDayIcon, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonDayText, { opacity: shimmerOpacity }]} />
          </View>

          {/* Header */}
          <View style={styles.skeletonHeader}>
            <Animated.View style={[styles.skeletonUsername, { opacity: shimmerOpacity }]} />
            <View style={{ flex: 1 }} />
            <Animated.View style={[styles.skeletonTime, { opacity: shimmerOpacity }]} />
          </View>

          {/* Content */}
          <View style={styles.skeletonContent}>
            <Animated.View style={[styles.skeletonLine, styles.skeletonLineFull, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonLine, styles.skeletonLineFull, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonLine, styles.skeletonLineHalf, { opacity: shimmerOpacity }]} />
          </View>

          {/* Footer */}
          <View style={styles.skeletonFooter}>
            <Animated.View style={[styles.skeletonTag, { opacity: shimmerOpacity }]} />
            <View style={{ flex: 1 }} />
            <View style={styles.skeletonReactions}>
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

// ============================================================================
// DAY POST CARD SKELETON (for DayFeedScreen)
// ============================================================================

export function DayPostCardSkeleton({ index = 0 }: PostCardSkeletonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    // Shimmer animation
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
    <Animated.View style={[styles.skeletonCard, { opacity: fadeAnim }]}>
      <BlurView intensity={25} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.cardGradient}
        >
          {/* Header */}
          <View style={styles.skeletonHeader}>
            <Animated.View style={[styles.skeletonUsername, { opacity: shimmerOpacity }]} />
            <View style={{ flex: 1 }} />
            <Animated.View style={[styles.skeletonTime, { opacity: shimmerOpacity }]} />
          </View>

          {/* Content */}
          <View style={styles.skeletonContent}>
            <Animated.View style={[styles.skeletonLine, styles.skeletonLineFull, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonLine, styles.skeletonLineFull, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonLine, styles.skeletonLinePartial, { opacity: shimmerOpacity }]} />
          </View>

          {/* Footer */}
          <View style={styles.skeletonFooter}>
            <Animated.View style={[styles.skeletonTag, { opacity: shimmerOpacity }]} />
            <View style={{ flex: 1 }} />
            <View style={styles.skeletonReactions}>
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.skeletonReaction, { opacity: shimmerOpacity }]} />
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  skeletonCard: {
    marginBottom: scale(12),
  },
  cardBlur: {
    borderRadius: scale(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardGradient: {
    padding: scale(14),
  },

  // Header
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  skeletonUsername: {
    width: scale(80),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skeletonTime: {
    width: scale(40),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Day Badge
  skeletonDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(12),
  },
  skeletonDayIcon: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skeletonDayText: {
    width: scale(60),
    height: scale(14),
    borderRadius: scale(7),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Content
  skeletonContent: {
    marginBottom: scale(12),
    gap: scale(8),
  },
  skeletonLine: {
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skeletonLineFull: {
    width: '100%',
  },
  skeletonLinePartial: {
    width: '70%',
  },
  skeletonLineHalf: {
    width: '50%',
  },

  // Footer
  skeletonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonTag: {
    width: scale(60),
    height: scale(22),
    borderRadius: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skeletonReactions: {
    flexDirection: 'row',
    gap: scale(6),
  },
  skeletonReaction: {
    width: scale(44),
    height: scale(28),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

