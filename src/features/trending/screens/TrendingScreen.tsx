/**
 * Trending Screen - Minimalist Premium Design
 * Clean, elegant, and sophisticated
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import TrendingShareCard from '../components/TrendingShareCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// ============================================================================
// TYPES
// ============================================================================

interface TrendingPost {
  id: string;
  content: string;
  source: string;
  count: number;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const SAMPLE_TRENDING: TrendingPost[] = [
  { id: 't1', content: 'Listening to "Cruel Summer" by Taylor Swift', source: 'Spotify', count: 12500000 },
  { id: 't2', content: 'Reading about "AI breaks new barrier in medicine"', source: 'Reddit', count: 45000 },
  { id: 't3', content: 'Watching "The most satisfying video ever"', source: 'YouTube', count: 2800000 },
  { id: 't4', content: 'Following Lakers vs Warriors game', source: 'Sports', count: 156000 },
  { id: 't5', content: 'Listening to "Paint The Town Red" by Doja Cat', source: 'Spotify', count: 9200000 },
  { id: 't6', content: 'Reading about "SpaceX launches new satellite"', source: 'Reddit', count: 38000 },
];

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
  
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };
  
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
      
      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#a78bfa" colors={['#a78bfa']} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero - Engaging & Dynamic */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.livePulse} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Trending Now</Text>
          <Text style={styles.heroSubtitle}>Happening right now around the world</Text>
          
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trendingPosts.length}</Text>
              <Text style={styles.statLabel}>Hot Topics</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatCount(trendingPosts.reduce((sum, p) => sum + p.count, 0))}
              </Text>
              <Text style={styles.statLabel}>Active Now</Text>
            </View>
          </View>
        </View>
        
        {/* Trending Posts */}
        <View style={styles.postsContainer}>
          {trendingPosts.map((post, index) => (
            <TrendingCard key={post.id} post={post} index={index} onShare={setSharePost} />
          ))}
        </View>
      </ScrollView>
      
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
// TRENDING CARD - Minimal & Elegant
// ============================================================================

interface TrendingCardProps {
  post: TrendingPost;
  index: number;
  onShare: (post: TrendingPost) => void;
}

function TrendingCard({ post, index, onShare }: TrendingCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, delay: index * 100, useNativeDriver: true }),
    ]).start();
    
    // Subtle pulse animation for engagement
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };
  
  const getSourceEmoji = (source: string) => {
    switch (source) {
      case 'Spotify': return '🎵';
      case 'Reddit': return '💬';
      case 'YouTube': return '📺';
      case 'Sports': return '⚽';
      default: return '🔥';
    }
  };
  
  const getRankColor = (index: number) => {
    if (index === 0) return '#f59e0b'; // Gold
    if (index === 1) return '#a78bfa'; // Purple
    if (index === 2) return '#ec4899'; // Pink
    return '#8b5cf6'; // Default purple
  };
  
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: pulseAnim }] }]}>
      <BlurView intensity={30} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
          style={styles.cardGradient}
        >
          {/* Rank Badge */}
          <View style={[styles.rankBadge, { backgroundColor: `${getRankColor(index)}25` }]}>
            <Text style={[styles.rankText, { color: getRankColor(index) }]}>#{index + 1}</Text>
          </View>
          
          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(post)} activeOpacity={0.6}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          
          {/* Source Badge with Emoji */}
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceEmoji}>{getSourceEmoji(post.source)}</Text>
            <Text style={styles.sourceName}>{post.source}</Text>
          </View>
          
          {/* Content - Bold & Prominent */}
          <Text style={styles.cardContent}>{post.content}</Text>
          
          {/* Fire Count - Exciting */}
          <View style={styles.fireCount}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.countText}>{formatCount(post.count)}</Text>
            <Text style={styles.countLabel}>people</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(100),
  },
  hero: {
    paddingHorizontal: scale(20),
    paddingTop: scale(60),
    paddingBottom: scale(28),
  },
  heroHeader: {
    marginBottom: scale(16),
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    alignSelf: 'flex-start',
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  livePulse: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#ef4444',
  },
  liveText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: moderateScale(36, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.8,
    marginBottom: scale(6),
    textShadowColor: 'rgba(139, 92, 246, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  heroSubtitle: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.3,
    marginBottom: scale(20),
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '800',
    color: '#a78bfa',
    marginBottom: scale(2),
  },
  statLabel: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: scale(1),
    height: scale(30),
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  postsContainer: {
    paddingHorizontal: scale(20),
    gap: scale(12),
  },
  card: {
    borderRadius: scale(24),
    overflow: 'hidden',
  },
  cardBlur: {
    borderRadius: scale(24),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  cardGradient: {
    padding: scale(20),
    borderRadius: scale(24),
    position: 'relative',
  },
  rankBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(10),
  },
  rankText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  shareButton: {
    padding: scale(6),
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: scale(14),
  },
  sourceEmoji: {
    fontSize: moderateScale(16, 0.2),
  },
  sourceName: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardContent: {
    fontSize: moderateScale(16, 0.2),
    lineHeight: moderateScale(26, 0.2),
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: scale(16),
  },
  fireCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  fireEmoji: {
    fontSize: moderateScale(14, 0.2),
  },
  countText: {
    fontSize: moderateScale(13, 0.2),
    color: '#f59e0b',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  countLabel: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '600',
  },
});
