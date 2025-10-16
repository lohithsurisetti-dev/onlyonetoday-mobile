/**
 * Trending Screen - Ultra Premium Design
 * Elegant monochrome with subtle cosmic accents
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
import TrendingShareCard from '../components/TrendingShareCard';

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
  { id: 't1', content: 'Listening to "Cruel Summer" by Taylor Swift', source: 'spotify', count: 12500000, time: 'Live' },
  { id: 't2', content: 'Reading about "AI breaks new barrier in medicine" on Reddit', source: 'reddit', count: 45000, time: 'Live' },
  { id: 't3', content: 'Watching "The most satisfying video ever" on YouTube', source: 'youtube', count: 2800000, time: 'Live' },
  { id: 't4', content: 'Following Lakers vs Warriors game', source: 'sports', count: 156000, time: 'Live' },
  { id: 't5', content: 'Listening to "Paint The Town Red" by Doja Cat', source: 'spotify', count: 9200000, time: 'Live' },
  { id: 't6', content: 'Reading about "SpaceX launches new satellite" on Reddit', source: 'reddit', count: 38000, time: 'Live' },
];

// ============================================================================
// SOURCE INFO
// ============================================================================

function getSourceInfo(source: TrendingSource) {
  switch (source) {
    case 'spotify':
      return { name: 'Spotify', emoji: '🎵' };
    case 'reddit':
      return { name: 'Reddit', emoji: '💬' };
    case 'youtube':
      return { name: 'YouTube', emoji: '📺' };
    case 'sports':
      return { name: 'Sports', emoji: '⚽' };
    default:
      return { name: 'Curated', emoji: '✨' };
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
          Animated.timing(translateY, { toValue: -15, duration: 2000 + Math.random() * 1000, delay, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 2000 + Math.random() * 1000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.6, duration: 1000, delay, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.2, duration: 1000, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.star, { opacity, transform: [{ translateY }] }]} />;
};

// ============================================================================
// TRENDING SCREEN
// ============================================================================

export default function TrendingScreen() {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>(SAMPLE_TRENDING);
  const [refreshing, setRefreshing] = useState(false);
  const [sharePost, setSharePost] = useState<TrendingPost | null>(null);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={StyleSheet.absoluteFill} />
      
      {/* Floating Stars */}
      <View style={styles.starsContainer} pointerEvents="none">
        {[...Array(15)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}>
            <FloatingStar delay={i * 150} />
          </View>
        ))}
      </View>
      
      {/* Sticky Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <LinearGradient colors={['rgba(26, 26, 46, 0.95)', 'rgba(10, 10, 26, 0.95)']} style={styles.headerGradient}>
            <Text style={styles.headerTitle}>Trending</Text>
          </LinearGradient>
        </BlurView>
      </Animated.View>
      
      {/* Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#a78bfa" colors={['#a78bfa']} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero - Minimal */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Trending</Text>
          <Text style={styles.heroSubtitle}>What the world is doing</Text>
        </View>
        
        {/* Trending Posts */}
        <View style={styles.postsContainer}>
          {trendingPosts.map((post, index) => (
            <TrendingCard key={post.id} post={post} index={index} onShare={setSharePost} />
          ))}
        </View>
      </Animated.ScrollView>
      
      {/* Share Card */}
      {sharePost && (
        <TrendingShareCard
          visible={!!sharePost}
          onClose={() => setSharePost(null)}
          post={sharePost}
        />
      )}
    </View>
  );
}

// ============================================================================
// TRENDING CARD
// ============================================================================

interface TrendingCardProps {
  post: TrendingPost;
  index: number;
  onShare: (post: TrendingPost) => void;
}

function TrendingCard({ post, index, onShare }: TrendingCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const sourceInfo = getSourceInfo(post.source);
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);
  
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };
  
  return (
    <Animated.View style={[styles.trendingCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(167, 139, 250, 0.08)', 'rgba(45, 27, 78, 0.12)']}
          style={styles.cardGradient}
        >
          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(post)} activeOpacity={0.6}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          
          {/* Source Badge */}
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceEmoji}>{sourceInfo.emoji}</Text>
            <Text style={styles.sourceName}>{sourceInfo.name}</Text>
          </View>
          
          {/* Content */}
          <Text style={styles.cardContent}>{post.content}</Text>
          
          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{formatCount(post.count)}</Text>
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
    gap: scale(4),
  },
  heroTitle: {
    fontSize: moderateScale(32, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(167, 139, 250, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  heroSubtitle: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.3,
  },
  postsContainer: {
    padding: scale(20),
    gap: scale(14),
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
    borderColor: 'rgba(167, 139, 250, 0.15)',
    gap: scale(14),
    position: 'relative',
  },
  shareButton: {
    position: 'absolute',
    top: scale(14),
    right: scale(14),
    zIndex: 10,
    padding: scale(4),
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    alignSelf: 'flex-start',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sourceEmoji: {
    fontSize: moderateScale(12, 0.2),
  },
  sourceName: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  cardContent: {
    fontSize: moderateScale(15, 0.2),
    lineHeight: moderateScale(23, 0.2),
    color: '#ffffff',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  liveDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: '#a78bfa',
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  liveText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    color: '#a78bfa',
    letterSpacing: 1,
  },
  countBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  countText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
});
