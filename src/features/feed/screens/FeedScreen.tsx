/**
 * Feed Screen - Premium Cosmic Theme
 * Discover what others are doing with beautiful animations and filtering
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FilterSheet from '../components/FilterSheet';
import FeedPostShareCard from '../components/FeedPostShareCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// ============================================================================
// TYPES
// ============================================================================

export type FilterType = 'all' | 'unique' | 'common' | 'trending';
export type ScopeFilter = 'world' | 'city' | 'state' | 'country';
export type ReactionFilter = 'all' | 'funny' | 'creative' | 'must_try';
export type InputTypeFilter = 'all' | 'action' | 'day';

interface Post {
  id: string;
  content: string;
  time: string;
  scope: ScopeFilter;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  input_type?: 'action' | 'day';
  percentile?: {
    percentile: number;
    tier: 'elite' | 'rare' | 'unique' | 'notable' | 'common' | 'popular';
    displayText: string;
    comparison: string;
  };
  funny_count: number;
  creative_count: number;
  must_try_count: number;
  isGhost?: boolean;
  source?: string;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    content: 'Meditated for 20 minutes this morning while watching the sunrise from my rooftop',
    time: '2h ago',
    scope: 'world',
    input_type: 'action',
    percentile: { percentile: 2.5, tier: 'elite', displayText: 'Top 3%', comparison: 'More unique than 97%' },
    funny_count: 12,
    creative_count: 24,
    must_try_count: 45,
  },
  {
    id: '2',
    content: 'Learned a new coding language today - Rust is amazing!',
    time: '5h ago',
    scope: 'country',
    location_country: 'United States',
    input_type: 'action',
    percentile: { percentile: 15, tier: 'unique', displayText: 'Top 15%', comparison: 'More unique than 85%' },
    funny_count: 5,
    creative_count: 18,
    must_try_count: 32,
  },
  {
    id: '3',
    content: 'Built a treehouse with my kids in the backyard - took all weekend!',
    time: '3h ago',
    scope: 'world',
    input_type: 'action',
    percentile: { percentile: 8, tier: 'rare', displayText: 'Top 8%', comparison: 'More unique than 92%' },
    funny_count: 18,
    creative_count: 42,
    must_try_count: 28,
  },
  {
    id: '4',
    content: 'Tried making sushi at home for the first time. It was a delicious mess!',
    time: '7h ago',
    scope: 'world',
    input_type: 'action',
    percentile: { percentile: 22, tier: 'notable', displayText: 'Top 22%', comparison: 'More unique than 78%' },
    funny_count: 28,
    creative_count: 15,
    must_try_count: 62,
  },
  {
    id: '5',
    content: 'Went to the gym and did cardio for 45 minutes',
    time: '1d ago',
    scope: 'world',
    input_type: 'action',
    percentile: { percentile: 65, tier: 'common', displayText: 'Top 65%', comparison: 'Similar to many' },
    funny_count: 2,
    creative_count: 3,
    must_try_count: 8,
  },
  {
    id: '6',
    content: 'Had coffee with friends at the usual spot',
    time: '2d ago',
    scope: 'world',
    input_type: 'action',
    percentile: { percentile: 78, tier: 'popular', displayText: 'Top 78%', comparison: 'Common activity' },
    funny_count: 4,
    creative_count: 1,
    must_try_count: 3,
  },
];

// ============================================================================
// TIER COLORS (matching our cosmic theme)
// ============================================================================

function getTierColors(tier?: string) {
  switch (tier?.toLowerCase()) {
    case 'elite':
    case 'rare':
      return { primary: '#a78bfa', secondary: '#c4b5fd', glow: '#a78bfa' };
    case 'unique':
    case 'notable':
      return { primary: '#f97316', secondary: '#fb923c', glow: '#f97316' };
    case 'common':
    case 'popular':
      return { primary: '#3b82f6', secondary: '#60a5fa', glow: '#3b82f6' };
    default:
      return { primary: '#8b5cf6', secondary: '#a78bfa', glow: '#8b5cf6' };
  }
}

function getFilterPillColors(filter: FilterType): [string, string] {
  switch (filter) {
    case 'trending':
      return ['rgba(251, 146, 60, 0.5)', 'rgba(251, 146, 60, 0.25)'];
    case 'unique':
      return ['rgba(139, 92, 246, 0.5)', 'rgba(139, 92, 246, 0.25)'];
    case 'common':
      return ['rgba(59, 130, 246, 0.5)', 'rgba(59, 130, 246, 0.25)'];
    default:
      return ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'];
  }
}

function getReactionPillColors(reaction: ReactionFilter): [string, string] {
  switch (reaction) {
    case 'funny':
      return ['rgba(234, 179, 8, 0.5)', 'rgba(234, 179, 8, 0.25)'];
    case 'creative':
      return ['rgba(168, 85, 247, 0.5)', 'rgba(168, 85, 247, 0.25)'];
    case 'must_try':
      return ['rgba(34, 197, 94, 0.5)', 'rgba(34, 197, 94, 0.25)'];
    default:
      return ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'];
  }
}

// ============================================================================
// FLOATING STAR COMPONENT
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
// FEED SCREEN
// ============================================================================

export default function FeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  // State
  const [filter, setFilter] = useState<FilterType>('all');
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('world');
  const [reactionFilter, setReactionFilter] = useState<ReactionFilter>('all');
  const [inputTypeFilter, setInputTypeFilter] = useState<InputTypeFilter>('all');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [sharePost, setSharePost] = useState<Post | null>(null);
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);
  
  const handleReaction = useCallback((postId: string, reactionType: 'funny' | 'creative' | 'must_try') => {
    const reactionKey = `${postId}-${reactionType}`;
    setUserReactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reactionKey)) {
        newSet.delete(reactionKey);
      } else {
        newSet.add(reactionKey);
      }
      return newSet;
    });
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isRemoving = userReactions.has(reactionKey);
        return {
          ...post,
          [`${reactionType}_count`]: Math.max(0, post[`${reactionType}_count`] + (isRemoving ? -1 : 1)),
        };
      }
      return post;
    }));
  }, [userReactions]);
  
  // Filtered posts
  const filteredPosts = posts.filter(post => {
    if (filter === 'unique' && post.percentile && !['elite', 'rare', 'unique', 'notable'].includes(post.percentile.tier)) return false;
    if (filter === 'common' && post.percentile && !['common', 'popular'].includes(post.percentile.tier)) return false;
    if (filter === 'trending' && !post.isGhost) return false;
    if (inputTypeFilter === 'action' && post.input_type !== 'action') return false;
    if (inputTypeFilter === 'day' && post.input_type !== 'day') return false;
    if (scopeFilter !== 'world' && post.scope !== scopeFilter) return false;
    if (reactionFilter !== 'all' && (!post[`${reactionFilter}_count`] || post[`${reactionFilter}_count`] === 0)) return false;
    return true;
  });
  
  const hasActiveFilters = filter !== 'all' || scopeFilter !== 'world' || reactionFilter !== 'all' || inputTypeFilter !== 'all';
  
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
            <Text style={styles.headerTitle}>Discover</Text>
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
            tintColor="#a78bfa"
            colors={['#a78bfa']}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section - Compact */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>Discover</Text>
              <Text style={styles.heroSubtitle}>{filteredPosts.length} posts nearby</Text>
            </View>
            
            {/* Compact Filter Button */}
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterSheetVisible(true)}
              activeOpacity={0.8}
            >
              <BlurView intensity={40} tint="dark" style={styles.filterButtonBlur}>
                <LinearGradient
                  colors={hasActiveFilters ? ['#8b5cf6', '#a78bfa'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.filterButtonGradient}
                >
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  {hasActiveFilters && <View style={styles.filterDot} />}
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>
          
          {/* Active Filters Pills */}
          {hasActiveFilters && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.activeFiltersScroll}
              contentContainerStyle={styles.activeFiltersContent}
            >
              {filter !== 'all' && (
                <TouchableOpacity
                  style={styles.activePill}
                  onPress={() => setFilter('all')}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={30} tint="dark" style={styles.activePillBlur}>
                    <LinearGradient
                      colors={getFilterPillColors(filter)}
                      style={styles.activePillGradient}
                    >
                      <Text style={styles.activePillText}>
                        {filter === 'trending' ? 'Trending' : filter === 'unique' ? 'Unique' : 'Common'}
                      </Text>
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}
              
              {inputTypeFilter !== 'all' && (
                <TouchableOpacity
                  style={styles.activePill}
                  onPress={() => setInputTypeFilter('all')}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={30} tint="dark" style={styles.activePillBlur}>
                    <LinearGradient
                      colors={['rgba(99, 102, 241, 0.4)', 'rgba(99, 102, 241, 0.2)']}
                      style={styles.activePillGradient}
                    >
                      <Text style={styles.activePillText}>
                        {inputTypeFilter === 'action' ? 'Actions' : 'Days'}
                      </Text>
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}
              
              {scopeFilter !== 'world' && (
                <TouchableOpacity
                  style={styles.activePill}
                  onPress={() => setScopeFilter('world')}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={30} tint="dark" style={styles.activePillBlur}>
                    <LinearGradient
                      colors={['rgba(6, 182, 212, 0.4)', 'rgba(6, 182, 212, 0.2)']}
                      style={styles.activePillGradient}
                    >
                      <Text style={styles.activePillText}>
                        {scopeFilter === 'city' ? 'City' : scopeFilter === 'state' ? 'State' : 'Country'}
                      </Text>
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}
              
              {reactionFilter !== 'all' && (
                <TouchableOpacity
                  style={styles.activePill}
                  onPress={() => setReactionFilter('all')}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={30} tint="dark" style={styles.activePillBlur}>
                    <LinearGradient
                      colors={getReactionPillColors(reactionFilter)}
                      style={styles.activePillGradient}
                    >
                      <Text style={styles.activePillText}>
                        {reactionFilter === 'funny' ? 'Funny' : reactionFilter === 'creative' ? 'Creative' : 'Must Try'}
                      </Text>
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
        
        {/* Posts */}
        <View style={styles.postsContainer}>
          {filteredPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌌</Text>
              <Text style={styles.emptyTitle}>No posts found</Text>
              <Text style={styles.emptySubtitle}>
                {hasActiveFilters ? 'Try adjusting your filters' : 'Be the first to share!'}
              </Text>
            </View>
          ) : (
            filteredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                onReact={handleReaction}
                onShare={setSharePost}
                userReactions={userReactions}
              />
            ))
          )}
        </View>
      </Animated.ScrollView>
      
      {/* Filter Sheet */}
      <FilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        filter={filter}
        onFilterChange={setFilter}
        scopeFilter={scopeFilter}
        onScopeFilterChange={setScopeFilter}
        reactionFilter={reactionFilter}
        onReactionFilterChange={setReactionFilter}
        inputTypeFilter={inputTypeFilter}
        onInputTypeFilterChange={setInputTypeFilter}
      />
      
      {/* Share Card */}
      {sharePost && (
        <FeedPostShareCard
          visible={!!sharePost}
          onClose={() => setSharePost(null)}
          post={sharePost}
          tierColors={getTierColors(sharePost.percentile?.tier)}
        />
      )}
    </View>
  );
}

// ============================================================================
// POST CARD COMPONENT
// ============================================================================

interface PostCardProps {
  post: Post;
  index: number;
  onReact: (postId: string, reactionType: 'funny' | 'creative' | 'must_try') => void;
  onShare: (post: Post) => void;
  userReactions: Set<string>;
}

function PostCard({ post, index, onReact, onShare, userReactions }: PostCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tierColors = getTierColors(post.percentile?.tier);
  
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
  
  const isTopTier = post.percentile && ['elite', 'rare', 'unique', 'notable'].includes(post.percentile.tier);
  
  return (
    <Animated.View
      style={[
        styles.postCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={20} tint="dark" style={styles.postCardBlur}>
        <LinearGradient
          colors={isTopTier ? ['rgba(139, 92, 246, 0.15)', 'rgba(45, 27, 78, 0.3)'] : ['rgba(59, 130, 246, 0.1)', 'rgba(26, 26, 46, 0.2)']}
          style={styles.postCardGradient}
        >
          {/* Share Button - Top Right */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => onShare(post)}
            activeOpacity={0.7}
          >
            <BlurView intensity={40} tint="dark" style={styles.shareButtonBlur}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </BlurView>
          </TouchableOpacity>
          
          {/* Content */}
          <Text style={styles.postContent}>{post.content}</Text>
          
          {/* Percentile Badge */}
          {post.percentile && (
            <View style={styles.badge}>
              <LinearGradient
                colors={[`${tierColors.primary}40`, `${tierColors.secondary}20`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badgeGradient}
              >
                <Svg width={12} height={12} viewBox="0 0 20 20" fill="none">
                  <Path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill={tierColors.primary} />
                </Svg>
                <Text style={[styles.badgeText, { color: tierColors.primary }]}>
                  {post.percentile.displayText}
                </Text>
              </LinearGradient>
            </View>
          )}
          
          {/* Footer */}
          <View style={styles.postFooter}>
            <Text style={styles.postTime}>{post.time}</Text>
            
            {/* Reactions */}
            <View style={styles.reactions}>
              {(['funny', 'creative', 'must_try'] as const).map(type => {
                const isActive = userReactions.has(`${post.id}-${type}`);
                const count = post[`${type}_count`];
                
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.reactionButton, isActive && styles.reactionButtonActive]}
                    onPress={() => onReact(post.id, type)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reactionEmoji}>
                      {type === 'funny' ? '😂' : type === 'creative' ? '🎨' : '🔥'}
                    </Text>
                    {count > 0 && (
                      <Text style={styles.reactionCount}>{count}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
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
    paddingBottom: scale(16),
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: {
    gap: scale(2),
  },
  heroTitle: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(139, 92, 246, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  heroSubtitle: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.3,
  },
  filterButton: {
    borderRadius: scale(14),
    overflow: 'hidden',
  },
  filterButtonBlur: {
    borderRadius: scale(14),
  },
  filterButtonGradient: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  filterDot: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  activeFiltersScroll: {
    marginTop: scale(14),
  },
  activeFiltersContent: {
    gap: scale(8),
    paddingRight: scale(20),
  },
  activePill: {
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  activePillBlur: {
    borderRadius: scale(10),
  },
  activePillGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activePillText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  postsContainer: {
    padding: scale(20),
    gap: scale(16),
  },
  postCard: {
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  postCardBlur: {
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  postCardGradient: {
    padding: scale(20),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: scale(14),
    position: 'relative',
  },
  shareButton: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    borderRadius: scale(10),
    overflow: 'hidden',
    zIndex: 10,
  },
  shareButtonBlur: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  postContent: {
    fontSize: moderateScale(15, 0.2),
    lineHeight: moderateScale(23, 0.2),
    color: '#ffffff',
    fontWeight: '500',
  },
  badge: {
    borderRadius: scale(12),
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTime: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
  },
  reactions: {
    flexDirection: 'row',
    gap: scale(8),
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reactionButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  reactionEmoji: {
    fontSize: moderateScale(14, 0.2),
  },
  reactionCount: {
    fontSize: moderateScale(11, 0.2),
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: scale(60),
    gap: scale(12),
  },
  emptyEmoji: {
    fontSize: moderateScale(64, 0.3),
  },
  emptyTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
  },
  emptySubtitle: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});
