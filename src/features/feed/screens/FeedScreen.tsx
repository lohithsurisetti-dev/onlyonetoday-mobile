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
import DaySummaryCard from '../components/DaySummaryCard';
import DaySummaryModal from '../components/DaySummaryModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// ============================================================================
// TYPES
// ============================================================================

export type FilterType = 'all' | 'unique' | 'common';
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
    id: 'day1',
    content: 'Started my day with a 5AM workout, followed by a healthy breakfast. Spent the morning working on a new coding project - finally fixed that bug I\'ve been struggling with! Had lunch with an old friend I haven\'t seen in years. Afternoon was productive with meetings and planning. Evening walk in the park helped me decompress. Ended the day reading a great book about minimalism.',
    time: '6h ago',
    scope: 'city',
    location_city: 'Phoenix',
    input_type: 'day',
    percentile: { percentile: 5.2, tier: 'rare', displayText: 'Top 5%', comparison: 'More unique than 95%' },
    funny_count: 8,
    creative_count: 18,
    must_try_count: 32,
  },
  {
    id: 'day2',
    content: 'Woke up feeling grateful. Tried a new coffee recipe that turned out amazing. Deep work session on my passion project - made significant progress. Lunch was a spontaneous picnic. Attended a virtual workshop on design thinking. Cooked a new recipe for dinner that everyone loved. Quality time with family playing board games. Reflected on personal growth before bed.',
    time: '1d ago',
    scope: 'state',
    location_state: 'California',
    input_type: 'day',
    percentile: { percentile: 12.8, tier: 'unique', displayText: 'Top 13%', comparison: 'More unique than 87%' },
    funny_count: 15,
    creative_count: 22,
    must_try_count: 19,
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
    percentile: { percentile: 65, tier: 'common', displayText: 'Top 65%', comparison: 'Popular choice' },
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
    percentile: { percentile: 78, tier: 'popular', displayText: 'Top 78%', comparison: 'Well loved activity' },
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
  const [showDaySummaries, setShowDaySummaries] = useState(false);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [summaryModalPost, setSummaryModalPost] = useState<Post | null>(null);
  const [toggleContainerWidth, setToggleContainerWidth] = useState(0);
  
  // Toggle animation
  const togglePosition = useRef(new Animated.Value(0)).current;
  
  const handleToggleChange = (showSummaries: boolean) => {
    Animated.spring(togglePosition, {
      toValue: showSummaries ? 1 : 0,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
      stiffness: 120,
      overshootClamping: false,
    }).start();
    setShowDaySummaries(showSummaries);
  };
  
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
    // Filter out ghost/trending posts
    if (post.isGhost) return false;
    
    // Filter by post type (action vs day summary)
    if (showDaySummaries && post.input_type !== 'day') return false;
    if (!showDaySummaries && post.input_type !== 'action') return false;
    
    // Apply other filters
    if (filter === 'unique' && post.percentile && !['elite', 'rare', 'unique', 'notable'].includes(post.percentile.tier)) return false;
    if (filter === 'common' && post.percentile && !['common', 'popular'].includes(post.percentile.tier)) return false;
    if (scopeFilter !== 'world' && post.scope !== scopeFilter) return false;
    if (reactionFilter !== 'all' && (!post[`${reactionFilter}_count`] || post[`${reactionFilter}_count`] === 0)) return false;
    return true;
  });
  
  const hasActiveFilters = filter !== 'all' || scopeFilter !== 'world' || reactionFilter !== 'all';
  
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
              <Text style={styles.heroSubtitle}>{filteredPosts.length} {showDaySummaries ? 'summaries' : 'actions'}</Text>
            </View>
            
            {/* Filter Button */}
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
        </View>

        {/* Toggle Row - Actions / Summaries */}
        <View style={styles.toggleRow}>
          <View 
            style={styles.toggleContainer}
            onLayout={(e) => setToggleContainerWidth(e.nativeEvent.layout.width)}
          >
            <View style={styles.toggleBackground}>
              <Animated.View
                style={[
                  styles.toggleIndicator,
                  {
                    transform: [
                      {
                        translateX: togglePosition.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            0,
                            (toggleContainerWidth / 2) - scale(3),
                          ],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.5)', 'rgba(124, 58, 237, 0.3)']}
                  style={styles.toggleIndicatorGradient}
                />
              </Animated.View>
            </View>
            
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => handleToggleChange(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleBtnText, !showDaySummaries && styles.toggleBtnTextActive]}>
                  Actions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => handleToggleChange(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleBtnText, showDaySummaries && styles.toggleBtnTextActive]}>
                  Summaries
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
                        {filter === 'unique' ? 'Unique' : 'Common'}
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
              post.input_type === 'day' ? (
                <DaySummaryCard
                  key={post.id}
                  post={post}
                  index={index}
                  onReact={handleReaction}
                  onShare={setSharePost}
                  onPress={setSummaryModalPost}
                  userReactions={userReactions}
                  tierColors={getTierColors(post.percentile?.tier)}
                />
              ) : (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onReact={handleReaction}
                  onShare={setSharePost}
                  userReactions={userReactions}
                />
              )
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

      {/* Day Summary Modal */}
      {summaryModalPost && (
        <DaySummaryModal
          visible={!!summaryModalPost}
          onClose={() => setSummaryModalPost(null)}
          post={summaryModalPost}
          tierColors={getTierColors(summaryModalPost.percentile?.tier)}
          onShare={() => {
            setSharePost(summaryModalPost);
            setSummaryModalPost(null);
          }}
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
      <BlurView intensity={25} tint="dark" style={styles.postCardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.postCardGradient}
        >
          {/* Header Row - Percentile pill left, Share right */}
          <View style={styles.compactHeader}>
            {post.percentile && (
              <View style={[styles.percentilePill, { backgroundColor: `${tierColors.primary}20`, borderColor: `${tierColors.primary}40` }]}>
                <View style={[styles.tierDot, { backgroundColor: tierColors.primary }]} />
                <Text style={[styles.percentilePillText, { color: tierColors.primary }]}>
                  {post.percentile.displayText}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.shareButtonCompact}
              onPress={() => onShare(post)}
              activeOpacity={0.6}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
          
          {/* Footer Row - Time, Location, Reactions */}
          <View style={styles.compactFooter}>
            <Text style={styles.postTime}>{post.time}</Text>
            <View style={styles.dotSeparator} />
            <View style={styles.scopeCompact}>
              <Svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                {post.scope === 'world' ? (
                  <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth={2.5} />
                ) : (
                  <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#6b7280" strokeWidth={2.5} />
                )}
              </Svg>
              <Text style={styles.scopeCompactText} numberOfLines={1}>
                {post.scope === 'world' ? 'World' : 
                 post.scope === 'city' ? post.location_city :
                 post.scope === 'state' ? post.location_state :
                 post.location_country}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
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
    flex: 1,
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
  toggleRow: {
    paddingHorizontal: scale(20),
    marginBottom: scale(16),
  },
  toggleContainer: {
    position: 'relative',
    height: scale(40),
  },
  toggleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(14),
    padding: scale(3),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleIndicator: {
    position: 'absolute',
    left: scale(3),
    top: scale(3),
    bottom: scale(3),
    right: '50%',
    borderRadius: scale(12),
    overflow: 'hidden',
    marginRight: scale(3),
  },
  toggleIndicatorGradient: {
    flex: 1,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  toggleButtons: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 1,
    height: '100%',
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.3,
  },
  toggleBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  postCardGradient: {
    padding: scale(14),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(10),
  },
  tierDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  percentilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    borderWidth: 1,
  },
  percentilePillText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dotSeparator: {
    width: scale(2),
    height: scale(2),
    borderRadius: scale(1),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scopeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3),
  },
  scopeCompactText: {
    fontSize: moderateScale(9, 0.2),
    color: '#9ca3af',
    fontWeight: '500',
    maxWidth: scale(80),
  },
  shareButtonCompact: {
    padding: scale(4),
  },
  postContent: {
    fontSize: moderateScale(14, 0.2),
    lineHeight: moderateScale(20, 0.2),
    color: '#ffffff',
    fontWeight: '400',
    marginBottom: scale(10),
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flexWrap: 'wrap',
  },
  percentileCompact: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
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
  postTime: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },
  reactions: {
    flexDirection: 'row',
    gap: scale(6),
    alignItems: 'center',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3),
    paddingHorizontal: scale(6),
    paddingVertical: scale(4),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reactionButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  reactionEmoji: {
    fontSize: moderateScale(11, 0.2),
  },
  reactionCount: {
    fontSize: moderateScale(10, 0.2),
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
