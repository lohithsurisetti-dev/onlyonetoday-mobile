/**
 * Day Feed Screen
 * Individual day's feed with posting capability and premium design
 */

import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { getDayTheme, getCurrentDay, DayOfWeek, DayPost } from '../types';
import DayIcon from '../components/DayIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type DayFeedScreenProps = {
  route: {
    params: {
      day: DayOfWeek;
    };
  };
  navigation: any;
};

export default function DayFeedScreen({ route, navigation }: DayFeedScreenProps) {
  const { day } = route.params;
  const dayTheme = getDayTheme(day);
  const currentDay = getCurrentDay();
  const isToday = day === currentDay;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState<DayPost[]>(SAMPLE_POSTS[day] || []);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [userReactions, setUserReactions] = useState<Record<string, 'first' | 'second' | 'third'>>({});

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePost = useCallback(() => {
    if (!postText.trim() || !isToday) return;

    const newPost: DayPost = {
      id: Date.now().toString(),
      content: postText,
      username: 'you',
      day,
      timestamp: Date.now(),
      timeAgo: 'Just now',
      reactionCounts: { first: 0, second: 0, third: 0 },
      weekNumber: Math.ceil(Date.now() / (7 * 24 * 60 * 60 * 1000)),
      scope: 'world',
    };

    setPosts([newPost, ...posts]);
    setPostText('');
  }, [postText, isToday, day, posts]);

  const handleReaction = useCallback((postId: string, reactionType: 'first' | 'second' | 'third') => {
    setUserReactions(prev => {
      const current = { ...prev };
      if (current[postId] === reactionType) {
        delete current[postId];
      } else {
        current[postId] = reactionType;
      }
      return current;
    });
  }, []);

  const toggleExpand = useCallback((postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Hero Header */}
          <LinearGradient
            colors={[`${dayTheme.color}20`, `${dayTheme.color}05`, 'transparent']}
            style={styles.hero}
          >
            <View style={styles.heroContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>

              <View style={styles.heroCenter}>
                <View style={styles.heroTitleRow}>
                  <DayIcon icon={dayTheme.icon} size={scale(24)} color={dayTheme.color} />
                  <Text style={styles.heroTitle}>{dayTheme.name}</Text>
                </View>
                <Text style={styles.heroSubtitle}>{dayTheme.vibe}</Text>
                {isToday && (
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDotPulse} />
                    <Text style={styles.liveText}>LIVE NOW</Text>
                  </View>
                )}
                {!isToday && (
                  <Text style={styles.closedText}>
                    {day === getCurrentDay() ? 'Opens today' : `Opens ${getDaysUntilText(day)}`}
                  </Text>
                )}
              </View>

              <View style={styles.backButton} />
            </View>

            <Text style={styles.heroDescription}>{dayTheme.description}</Text>
          </LinearGradient>

          {/* Post Input (only if today) */}
          {isToday && (
            <View style={styles.postInputContainer}>
              <BlurView intensity={25} tint="dark" style={styles.inputBlur}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
                  style={styles.inputGradient}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder={dayTheme.placeholder}
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={postText}
                    onChangeText={setPostText}
                    multiline
                    maxLength={500}
                  />
                  <View style={styles.inputFooter}>
                    <Text style={styles.charCount}>{postText.length}/500</Text>
                    <TouchableOpacity
                      style={[
                        styles.postButton,
                        { backgroundColor: postText.trim() ? `${dayTheme.color}` : 'rgba(255, 255, 255, 0.1)' }
                      ]}
                      onPress={handlePost}
                      disabled={!postText.trim()}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.postButtonText,
                        { opacity: postText.trim() ? 1 : 0.4 }
                      ]}>
                        Share
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>
          )}

          {/* Feed */}
          <ScrollView
            style={styles.feed}
            contentContainerStyle={styles.feedContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={dayTheme.color}
              />
            }
          >
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isToday ? 'Sharing Today' : 'From This Week'}
              </Text>
              <Text style={styles.sectionCount}>{posts.length} posts</Text>
            </View>

            {/* Posts */}
            {posts.map((post, index) => (
              <MemoizedDayPostCard
                key={post.id}
                post={post}
                dayTheme={dayTheme}
                index={index}
                isExpanded={expandedPosts.has(post.id)}
                userReaction={userReactions[post.id]}
                onToggleExpand={() => toggleExpand(post.id)}
                onReact={handleReaction}
              />
            ))}

            {posts.length === 0 && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <DayIcon icon={dayTheme.icon} size={scale(80)} color={dayTheme.color} />
                </View>
                <Text style={styles.emptyTitle}>No posts yet</Text>
                <Text style={styles.emptySubtitle}>
                  {isToday ? 'Be the first to share!' : 'Check back when this day is live'}
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// DAY POST CARD COMPONENT
// ============================================================================

interface DayPostCardProps {
  post: DayPost;
  dayTheme: any;
  index: number;
  isExpanded: boolean;
  userReaction?: 'first' | 'second' | 'third';
  onToggleExpand: () => void;
  onReact: (postId: string, reactionType: 'first' | 'second' | 'third') => void;
}

function DayPostCard({ post, dayTheme, index, isExpanded, userReaction, onToggleExpand, onReact }: DayPostCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const isLongContent = post.content.length > 200;
  const shouldTruncate = isLongContent && !isExpanded;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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
      <BlurView intensity={25} tint="dark" style={styles.postBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.postGradient}
        >
          {/* Header */}
          <View style={styles.postHeader}>
            <Text style={[styles.postUsername, { color: dayTheme.color }]}>
              @{post.username}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.postTime}>{post.timeAgo}</Text>
          </View>

          {/* Content - Expandable */}
          <TouchableOpacity
            onPress={isLongContent ? onToggleExpand : undefined}
            activeOpacity={isLongContent ? 0.9 : 1}
          >
            <Text
              style={styles.postContent}
              numberOfLines={shouldTruncate ? 4 : undefined}
            >
              {post.content}
            </Text>
            {isLongContent && (
              <Text style={[styles.expandHint, { color: dayTheme.color }]}>
                {isExpanded ? 'Tap to collapse' : 'Tap to read more'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer - Scope & Reactions */}
          <View style={styles.postFooter}>
            <View style={styles.scopeTag}>
              <Svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                {post.scope === 'world' ? (
                  <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth={2.5} />
                ) : (
                  <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#6b7280" strokeWidth={2.5} />
                )}
              </Svg>
              <Text style={styles.scopeText} numberOfLines={1}>
                {post.scope === 'world' ? 'World' : post.location || post.scope}
              </Text>
            </View>

            <View style={{ flex: 1 }} />

            {/* Day-Specific Reactions */}
            <View style={styles.reactions}>
              {Object.entries(dayTheme.reactions).map(([key, reaction]) => {
                const reactionKey = key as 'first' | 'second' | 'third';
                const isActive = userReaction === reactionKey;
                const count = post.reactionCounts[reactionKey];

                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.reactionBtn,
                      isActive && { backgroundColor: `${dayTheme.color}20`, borderColor: `${dayTheme.color}40` }
                    ]}
                    onPress={() => onReact(post.id, reactionKey)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                    {count > 0 && <Text style={styles.reactionCount}>{count}</Text>}
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

// Memoize DayPostCard to prevent unnecessary re-renders
const MemoizedDayPostCard = memo(DayPostCard);

// ============================================================================
// SAMPLE DATA
// ============================================================================

const SAMPLE_POSTS: Record<DayOfWeek, DayPost[]> = {
  monday: [
    {
      id: '1',
      content: 'Coffee is overrated. Tea supremacy ✨',
      username: 'rebel_soul',
      day: 'monday',
      timestamp: Date.now() - 3600000,
      timeAgo: '1h',
      reactionCounts: { first: 24, second: 8, third: 42 },
      weekNumber: 1,
      scope: 'world',
    },
    {
      id: '2',
      content: 'Hot take: Group projects are actually better than solo work. You learn more, meet people, and the pressure is shared. Fight me on this one!',
      username: 'cosmic_wanderer',
      day: 'monday',
      timestamp: Date.now() - 7200000,
      timeAgo: '2h',
      reactionCounts: { first: 15, second: 31, third: 19 },
      weekNumber: 1,
      scope: 'city',
      location: 'Phoenix',
    },
  ],
  tuesday: [
    {
      id: '3',
      content: 'Made my bed for 7 days straight 🛏️',
      username: 'morning_person',
      day: 'tuesday',
      timestamp: Date.now() - 3600000,
      timeAgo: '1h',
      reactionCounts: { first: 32, second: 18, third: 12 },
      weekNumber: 1,
      scope: 'world',
    },
  ],
  wednesday: [
    {
      id: '4',
      content: 'Ordered something random from the menu without reading it. Got octopus. No regrets.',
      username: 'adventure_seeker',
      day: 'wednesday',
      timestamp: Date.now() - 3600000,
      timeAgo: '1h',
      reactionCounts: { first: 45, second: 28, third: 67 },
      weekNumber: 1,
      scope: 'world',
    },
  ],
  thursday: [
    {
      id: '5',
      content: 'Grateful for the friend who texted first. Sometimes that simple "hey" means everything.',
      username: 'grateful_heart',
      day: 'thursday',
      timestamp: Date.now() - 3600000,
      timeAgo: '1h',
      reactionCounts: { first: 89, second: 45, third: 23 },
      weekNumber: 1,
      scope: 'world',
    },
  ],
  friday: [
    {
      id: '6',
      content: 'Sleeping in tomorrow with zero alarms. The weekend officially starts now 😴',
      username: 'weekend_warrior',
      day: 'friday',
      timestamp: Date.now() - 3600000,
      timeAgo: '1h',
      reactionCounts: { first: 156, second: 78, third: 92 },
      weekNumber: 1,
      scope: 'world',
    },
  ],
  saturday: [
    {
      id: '7',
      content: 'Spent 3 hours painting today. Lost track of time completely. These are the moments when I feel most like myself - brush in hand, colors mixing, music playing softly. No phone, no notifications, just pure flow state. This is what weekends are for.',
      username: 'artist_soul',
      day: 'saturday',
      timestamp: Date.now() - 3600000,
      timeAgo: '1h',
      reactionCounts: { first: 67, second: 89, third: 45 },
      weekNumber: 1,
      scope: 'world',
    },
  ],
  sunday: [
    {
      id: '8',
      content: 'Phone on airplane mode since morning. Just sat on the balcony with tea, watched the world go by. No scrolling, no checking, no anxiety. Pure peace.',
      username: 'zen_seeker',
      day: 'sunday',
      timestamp: Date.now() - 3600000,
      timeAgo: '1h',
      reactionCounts: { first: 234, second: 156, third: 98 },
      weekNumber: 1,
      scope: 'world',
    },
  ],
};

function getDaysUntilText(day: DayOfWeek): string {
  const currentDay = getCurrentDay();
  const dayOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentIndex = dayOrder.indexOf(currentDay);
  const dayIndex = dayOrder.indexOf(day);
  
  let daysUntil = 0;
  if (dayIndex > currentIndex) {
    daysUntil = dayIndex - currentIndex;
  } else {
    daysUntil = 7 - currentIndex + dayIndex;
  }

  if (daysUntil === 1) return 'tomorrow';
  if (daysUntil === 2) return 'in 2 days';
  return `in ${daysUntil} days`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },

  // Hero Header
  hero: {
    paddingTop: scale(60),
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: moderateScale(28, 0.3),
    color: '#ffffff',
    fontWeight: '300',
  },
  heroCenter: {
    alignItems: 'center',
    gap: scale(6),
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  heroTitle: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(10),
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    marginTop: scale(4),
  },
  liveDotPulse: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#22c55e',
  },
  liveText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  closedText: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: scale(4),
  },
  heroDescription: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: moderateScale(18, 0.2),
    fontWeight: '400',
  },

  // Post Input
  postInputContainer: {
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  inputBlur: {
    borderRadius: scale(18),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  inputGradient: {
    padding: scale(16),
  },
  textInput: {
    fontSize: moderateScale(14, 0.2),
    color: '#ffffff',
    minHeight: scale(80),
    maxHeight: scale(160),
    textAlignVertical: 'top',
    fontWeight: '400',
    lineHeight: moderateScale(20, 0.2),
    marginBottom: scale(12),
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },
  postButton: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(12),
  },
  postButtonText: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  // Feed
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(100),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },

  // Post Card
  postCard: {
    marginBottom: scale(14),
  },
  postBlur: {
    borderRadius: scale(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  postGradient: {
    padding: scale(16),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(12),
  },
  postUsername: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  postTime: {
    fontSize: moderateScale(9, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },
  postContent: {
    fontSize: moderateScale(14, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(21, 0.2),
    fontWeight: '400',
    marginBottom: scale(8),
  },
  expandHint: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: scale(12),
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  scopeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    backgroundColor: 'rgba(107, 114, 128, 0.12)',
  },
  scopeText: {
    fontSize: moderateScale(9, 0.2),
    color: '#9ca3af',
    fontWeight: '500',
    maxWidth: scale(80),
  },
  reactions: {
    flexDirection: 'row',
    gap: scale(6),
    alignItems: 'center',
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(5),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reactionEmoji: {
    fontSize: moderateScale(12, 0.2),
  },
  reactionCount: {
    fontSize: moderateScale(10, 0.2),
    color: '#ffffff',
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: scale(80),
    gap: scale(16),
  },
  emptyIcon: {
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '700',
    color: '#ffffff',
  },
  emptySubtitle: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

