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
        {/* Hero - Ultra Minimal */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Trending</Text>
          <Text style={styles.heroSubtitle}>What the world is doing now</Text>
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
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.cardGradient}
        >
          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(post)} activeOpacity={0.6}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="rgba(255, 255, 255, 0.6)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          
          {/* Content */}
          <Text style={styles.cardContent}>{post.content}</Text>
          
          {/* Footer - Minimal */}
          <View style={styles.cardFooter}>
            <Text style={styles.sourceText}>{post.source}</Text>
            <View style={styles.dot} />
            <Text style={styles.countText}>{formatCount(post.count)}</Text>
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
    paddingBottom: scale(24),
    gap: scale(4),
  },
  heroTitle: {
    fontSize: moderateScale(32, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.3,
  },
  postsContainer: {
    paddingHorizontal: scale(20),
    gap: scale(12),
  },
  card: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  cardBlur: {
    borderRadius: scale(16),
  },
  cardGradient: {
    padding: scale(20),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: scale(12),
    position: 'relative',
  },
  shareButton: {
    position: 'absolute',
    top: scale(16),
    right: scale(16),
    zIndex: 10,
    padding: scale(4),
  },
  cardContent: {
    fontSize: moderateScale(15, 0.2),
    lineHeight: moderateScale(23, 0.2),
    color: '#ffffff',
    fontWeight: '500',
    paddingRight: scale(32),
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  sourceText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
  dot: {
    width: scale(3),
    height: scale(3),
    borderRadius: scale(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  countText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
});
