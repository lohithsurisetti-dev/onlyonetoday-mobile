/**
 * Feed Screen
 * Premium feed with filters, post cards, reactions, and smooth animations
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
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
// SAMPLE DATA (will be replaced with API)
// ============================================================================

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    content: 'Meditated for 20 minutes this morning while watching the sunrise',
    time: '2 hrs ago',
    scope: 'world',
    input_type: 'action',
    percentile: {
      percentile: 2.5,
      tier: 'elite',
      displayText: 'Top 3%',
      comparison: 'More unique than 97% of posts',
    },
    funny_count: 12,
    creative_count: 24,
    must_try_count: 45,
  },
  {
    id: '2',
    content: 'Learned a new coding language today - Rust is amazing!',
    time: '5 hrs ago',
    scope: 'country',
    location_country: 'United States',
    input_type: 'action',
    percentile: {
      percentile: 15,
      tier: 'unique',
      displayText: 'Top 15%',
      comparison: 'More unique than 85% of posts',
    },
    funny_count: 5,
    creative_count: 18,
    must_try_count: 32,
  },
  {
    id: '3',
    content: 'Went to the gym and did cardio',
    time: '1 day ago',
    scope: 'world',
    input_type: 'action',
    percentile: {
      percentile: 65,
      tier: 'common',
      displayText: 'Top 65%',
      comparison: 'Similar to many others',
    },
    funny_count: 2,
    creative_count: 3,
    must_try_count: 8,
  },
];

// ============================================================================
// FEED SCREEN COMPONENT
// ============================================================================

export default function FeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  // Filter State
  const [filter, setFilter] = useState<FilterType>('all');
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('world');
  const [reactionFilter, setReactionFilter] = useState<ReactionFilter>('all');
  const [inputTypeFilter, setInputTypeFilter] = useState<InputTypeFilter>('all');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  
  // Data State
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Reactions State
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  
  // Animation Values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HANDLERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
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
    
    // Update post reaction count
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
  
  const handleCreatePost = useCallback(() => {
    navigation.navigate('Create');
  }, [navigation]);
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FILTERED POSTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const filteredPosts = posts.filter(post => {
    // Type filter
    if (filter === 'unique' && post.percentile && !['elite', 'rare', 'unique', 'notable'].includes(post.percentile.tier)) {
      return false;
    }
    if (filter === 'common' && post.percentile && !['common', 'popular'].includes(post.percentile.tier)) {
      return false;
    }
    if (filter === 'trending' && !post.isGhost) {
      return false;
    }
    
    // Input type filter
    if (inputTypeFilter === 'action' && post.input_type !== 'action') return false;
    if (inputTypeFilter === 'day' && post.input_type !== 'day') return false;
    
    // Scope filter
    if (scopeFilter !== 'world' && post.scope !== scopeFilter) return false;
    
    // Reaction filter
    if (reactionFilter !== 'all') {
      const count = post[`${reactionFilter}_count`];
      if (!count || count === 0) return false;
    }
    
    return true;
  });
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a1a', '#1a1a2e', '#2a1a3e']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header with Filter Bar */}
      <View style={styles.header}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>OnlyOne Today</Text>
            
            {/* Active Filters */}
            <View style={styles.activeFilters}>
              {filter !== 'all' && (
                <TouchableOpacity
                  style={[styles.filterPill, getFilterPillStyle(filter)]}
                  onPress={() => setFilter('all')}
                >
                  <Text style={styles.filterPillText}>
                    {filter === 'trending' ? '🔥 Trending' : filter === 'unique' ? '✨ Unique' : '👥 Common'}
                  </Text>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setFilterSheetVisible(true)}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
      
      {/* Feed Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8b5cf6"
            colors={['#8b5cf6']}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌌</Text>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'trending' 
                ? 'Check back soon for trending content!'
                : 'Be the first to share what you did today!'}
            </Text>
          </View>
        ) : (
          <View style={styles.postsGrid}>
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                onReact={handleReaction}
                userReactions={userReactions}
                index={index}
              />
            ))}
          </View>
        )}
      </Animated.ScrollView>
      
      {/* Floating Action Button */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreatePost}
          activeOpacity={0.9}
          onPressIn={() => {
            Animated.spring(fabScale, {
              toValue: 0.9,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(fabScale, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }).start();
          }}
        >
          <LinearGradient
            colors={['#8b5cf6', '#a78bfa', '#c4b5fd']}
            style={styles.fabGradient}
          >
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M12 4v16m8-8H4" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ============================================================================
// POST CARD COMPONENT
// ============================================================================

interface PostCardProps {
  post: Post;
  onReact: (postId: string, reactionType: 'funny' | 'creative' | 'must_try') => void;
  userReactions: Set<string>;
  index: number;
}

function PostCard({ post, onReact, userReactions, index }: PostCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: index * 80,
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
      <LinearGradient
        colors={isTopTier ? ['#2d1b4e30', '#4c1d9550'] : ['#1a2e4e30', '#2a3e5e50']}
        style={styles.postCardGradient}
      >
        {/* Content */}
        <Text style={styles.postContent}>{post.content}</Text>
        
        {/* Percentile Badge */}
        {post.percentile && (
          <View style={styles.percentileBadge}>
            <LinearGradient
              colors={isTopTier ? ['#8b5cf620', '#a78bfa30'] : ['#3b82f620', '#60a5fa30']}
              style={styles.percentileBadgeGradient}
            >
              <Svg width={14} height={14} viewBox="0 0 20 20" fill="none">
                <Path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="#fbbf24" />
              </Svg>
              <Text style={styles.percentileText}>{post.percentile.displayText}</Text>
              <Text style={styles.percentileComparison}>{post.percentile.comparison}</Text>
            </LinearGradient>
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.postFooter}>
          <Text style={styles.postTime}>{post.time}</Text>
          
          {/* Reactions */}
          <View style={styles.reactions}>
            {(['funny', 'creative', 'must_try'] as const).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.reactionButton,
                  userReactions.has(`${post.id}-${type}`) && styles.reactionButtonActive,
                ]}
                onPress={() => onReact(post.id, type)}
              >
                <Text style={styles.reactionEmoji}>
                  {type === 'funny' ? '😂' : type === 'creative' ? '🎨' : '🔥'}
                </Text>
                {post[`${type}_count`] > 0 && (
                  <Text style={styles.reactionCount}>{post[`${type}_count`]}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getFilterPillStyle(filter: FilterType) {
  switch (filter) {
    case 'trending':
      return { backgroundColor: 'rgba(251, 146, 60, 0.2)', borderColor: 'rgba(251, 146, 60, 0.4)' };
    case 'unique':
      return { backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.4)' };
    case 'common':
      return { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.4)' };
    default:
      return { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' };
  }
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerBlur: {
    paddingTop: scale(50),
    paddingBottom: scale(12),
  },
  headerContent: {
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    color: '#ffffff',
  },
  filterButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: scale(16),
    paddingBottom: scale(100),
  },
  postsGrid: {
    padding: scale(16),
    gap: scale(16),
  },
  postCard: {
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  postCardGradient: {
    padding: scale(16),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  postContent: {
    fontSize: moderateScale(15, 0.2),
    lineHeight: moderateScale(22, 0.2),
    color: '#ffffff',
    marginBottom: scale(12),
  },
  percentileBadge: {
    marginBottom: scale(12),
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  percentileBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    padding: scale(10),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  percentileText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    color: '#ffffff',
  },
  percentileComparison: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    flex: 1,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTime: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
  },
  reactions: {
    flexDirection: 'row',
    gap: scale(6),
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  reactionButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  reactionEmoji: {
    fontSize: moderateScale(14, 0.2),
  },
  reactionCount: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: scale(24),
    right: scale(24),
  },
  fab: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  fabGradient: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(60),
    gap: scale(16),
  },
  loadingText: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(60),
    paddingHorizontal: scale(32),
    gap: scale(12),
  },
  emptyEmoji: {
    fontSize: moderateScale(64, 0.3),
    marginBottom: scale(8),
  },
  emptyTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: moderateScale(20, 0.2),
  },
});

