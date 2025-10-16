/**
 * Trending Screen - Premium Cosmic Theme
 * Live trending content from Spotify, Reddit, YouTube, Sports & more
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// ============================================================================
// TYPES
// ============================================================================

type TrendingSource = 'spotify' | 'reddit' | 'youtube' | 'sports' | 'curated';

interface TrendingPost {
  id: string;
  content: string;
  source: TrendingSource;
  count: number;
  time: string;
}

// ============================================================================
// SAMPLE TRENDING DATA
// ============================================================================

const SAMPLE_TRENDING: TrendingPost[] = [
  {
    id: 't1',
    content: 'Listening to "Cruel Summer" by Taylor Swift',
    source: 'spotify',
    count: 12500000,
    time: 'Live',
  },
  {
    id: 't2',
    content: 'Reading about "AI breaks new barrier in medicine" on Reddit',
    source: 'reddit',
    count: 45000,
    time: 'Live',
  },
  {
    id: 't3',
    content: 'Watching "The most satisfying video ever" on YouTube',
    source: 'youtube',
    count: 2800000,
    time: 'Live',
  },
  {
    id: 't4',
    content: 'Following Lakers vs Warriors game',
    source: 'sports',
    count: 156000,
    time: 'Live',
  },
  {
    id: 't5',
    content: 'Listening to "Paint The Town Red" by Doja Cat',
    source: 'spotify',
    count: 9200000,
    time: 'Live',
  },
  {
    id: 't6',
    content: 'Reading about "SpaceX launches new satellite" on Reddit',
    source: 'reddit',
    count: 38000,
    time: 'Live',
  },
];

// ============================================================================
// SOURCE ICONS & COLORS
// ============================================================================

function getSourceInfo(source: TrendingSource) {
  switch (source) {
    case 'spotify':
      return {
        name: 'Spotify',
        color: '#1DB954',
        gradient: ['rgba(29, 185, 84, 0.3)', 'rgba(29, 185, 84, 0.15)'],
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#1DB954" strokeWidth={2} />
            <Path d="M8 10c2 0 4 1 6 1s4-1 6-1M8 13c2 0 4 1 6 1s4-1 6-1M8 16c2 0 4 1 6 1s4-1 6-1" stroke="#1DB954" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        ),
      };
    case 'reddit':
      return {
        name: 'Reddit',
        color: '#FF4500',
        gradient: ['rgba(255, 69, 0, 0.3)', 'rgba(255, 69, 0, 0.15)'],
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#FF4500" strokeWidth={2} />
            <Circle cx={9} cy={11} r={1.5} fill="#FF4500" />
            <Circle cx={15} cy={11} r={1.5} fill="#FF4500" />
            <Path d="M9 15s1 2 3 2 3-2 3-2" stroke="#FF4500" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        ),
      };
    case 'youtube':
      return {
        name: 'YouTube',
        color: '#FF0000',
        gradient: ['rgba(255, 0, 0, 0.3)', 'rgba(255, 0, 0, 0.15)'],
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M22 8s0-4-4-4H6S2 4 2 8v8s0 4 4 4h12s4 0 4-4V8z" stroke="#FF0000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10 9l5 3-5 3V9z" fill="#FF0000" />
          </Svg>
        ),
      };
    case 'sports':
      return {
        name: 'Sports',
        color: '#10b981',
        gradient: ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0.15)'],
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#10b981" strokeWidth={2} />
            <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM12 4c1.93 0 3.68.69 5.05 1.83L13 10l-2-3-2.92 4.37L6 9.28A7.94 7.94 0 0112 4zm0 16c-4.41 0-8-3.59-8-8 0-.05.01-.1.01-.15l2.74 2.09L9 10.5l2 3 4-6 2.23 3.34c.5 1.1.77 2.32.77 3.61 0 4.41-3.59 8-8 8z" fill="#10b981" opacity={0.3} />
          </Svg>
        ),
      };
    default:
      return {
        name: 'Curated',
        color: '#8b5cf6',
        gradient: ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.15)'],
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ),
      };
  }
}

// ============================================================================
// FLOATING STAR
// ============================================================================

const FloatingStar = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -15,
            duration: 2000 + Math.random() * 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

// ============================================================================
// TRENDING SCREEN
// ============================================================================

export default function TrendingScreen() {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>(SAMPLE_TRENDING);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']}
        style={StyleSheet.absoluteFill}
      />
      
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
            <FloatingStar delay={i * 150} />
          </View>
        ))}
      </View>
      
      {/* Sticky Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <LinearGradient
            colors={['rgba(26, 26, 46, 0.95)', 'rgba(10, 10, 26, 0.95)']}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Trending</Text>
          </LinearGradient>
        </BlurView>
      </Animated.View>
      
      {/* Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fb923c"
            colors={['#fb923c']}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <LinearGradient
              colors={['#fb923c', '#f97316']}
              style={styles.heroIconGradient}
            >
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Trending Now</Text>
          <Text style={styles.heroSubtitle}>Live from Spotify, Reddit, YouTube & more</Text>
        </View>
        
        {/* Trending Posts */}
        <View style={styles.postsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fb923c" />
              <Text style={styles.loadingText}>Loading trending...</Text>
            </View>
          ) : (
            trendingPosts.map((post, index) => (
              <TrendingCard key={post.id} post={post} index={index} />
            ))
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ============================================================================
// TRENDING CARD
// ============================================================================

interface TrendingCardProps {
  post: TrendingPost;
  index: number;
}

function TrendingCard({ post, index }: TrendingCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const sourceInfo = getSourceInfo(post.source);
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };
  
  return (
    <Animated.View
      style={[
        styles.trendingCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={sourceInfo.gradient}
          style={styles.cardGradient}
        >
          {/* Source Badge */}
          <View style={styles.sourceBadge}>
            <BlurView intensity={40} tint="dark" style={styles.sourceBadgeBlur}>
              <View style={styles.sourceBadgeContent}>
                {sourceInfo.icon}
                <Text style={[styles.sourceName, { color: sourceInfo.color }]}>
                  {sourceInfo.name}
                </Text>
              </View>
            </BlurView>
          </View>
          
          {/* Trending Indicator */}
          <View style={styles.trendingBadge}>
            <View style={[styles.liveDot, { backgroundColor: sourceInfo.color }]} />
            <Text style={styles.liveText}>{post.time}</Text>
          </View>
          
          {/* Content */}
          <Text style={styles.cardContent}>{post.content}</Text>
          
          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.countBadge}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" stroke={sourceInfo.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={[styles.countText, { color: sourceInfo.color }]}>
                {formatCount(post.count)}
              </Text>
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
  container: {
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
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerBlur: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: scale(50),
    paddingBottom: scale(16),
    paddingHorizontal: scale(20),
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(100),
  },
  hero: {
    paddingHorizontal: scale(20),
    paddingTop: scale(60),
    paddingBottom: scale(20),
    alignItems: 'center',
    gap: scale(12),
  },
  heroIcon: {
    borderRadius: scale(20),
    overflow: 'hidden',
    shadowColor: '#fb923c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  heroIconGradient: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroTitle: {
    fontSize: moderateScale(32, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(251, 146, 60, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  heroSubtitle: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  postsContainer: {
    padding: scale(20),
    gap: scale(14),
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: scale(60),
    gap: scale(16),
  },
  loadingText: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  trendingCard: {
    borderRadius: scale(18),
    overflow: 'hidden',
  },
  cardBlur: {
    borderRadius: scale(18),
  },
  cardGradient: {
    padding: scale(18),
    borderRadius: scale(18),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: scale(12),
    position: 'relative',
  },
  sourceBadge: {
    position: 'absolute',
    top: scale(14),
    left: scale(14),
    borderRadius: scale(10),
    overflow: 'hidden',
    zIndex: 10,
  },
  sourceBadgeBlur: {
    borderRadius: scale(10),
  },
  sourceBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sourceName: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendingBadge: {
    position: 'absolute',
    top: scale(14),
    right: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(10),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  liveDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  liveText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  cardContent: {
    fontSize: moderateScale(15, 0.2),
    lineHeight: moderateScale(23, 0.2),
    color: '#ffffff',
    fontWeight: '500',
    marginTop: scale(32),
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(10),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  countText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

