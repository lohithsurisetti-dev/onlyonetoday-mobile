/**
 * All Posts Screen - Complete Redesign
 * Today/All Time tabs, reactions count, share buttons
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
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type AllPostsScreenProps = {
  navigation: any;
};

interface Post {
  id: string;
  content: string;
  date: string;
  tier: 'elite' | 'rare' | 'unique';
  percentile: number;
  timestamp: number;
  isToday: boolean;
  reactions: {
    love: number;
    fire: number;
    wow: number;
  };
}

export default function AllPostsScreen({ navigation }: AllPostsScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

  // Mock posts
  const allPosts: Post[] = [
    { id: '1', content: 'Discovered a hidden rooftop garden', date: '2h', tier: 'elite', percentile: 99.8, timestamp: Date.now(), isToday: true, reactions: { love: 24, fire: 18, wow: 12 } },
    { id: '2', content: 'Had breakfast underwater', date: '5h', tier: 'rare', percentile: 95.2, timestamp: Date.now(), isToday: true, reactions: { love: 15, fire: 22, wow: 8 } },
    { id: '3', content: 'Wrote a poem in binary code', date: '2d', tier: 'unique', percentile: 87.5, timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, isToday: false, reactions: { love: 32, fire: 9, wow: 14 } },
    { id: '4', content: 'Learned to juggle with my eyes closed', date: '3d', tier: 'elite', percentile: 98.1, timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, isToday: false, reactions: { love: 19, fire: 27, wow: 11 } },
    { id: '5', content: 'Created a time-lapse of clouds for 12 hours', date: '4d', tier: 'rare', percentile: 93.7, timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, isToday: false, reactions: { love: 28, fire: 15, wow: 19 } },
  ];

  const filteredPosts = activeTab === 'today' 
    ? allPosts.filter(p => p.isToday)
    : allPosts;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleTabChange = (tab: 'today' | 'all') => {
    const tabIndex = tab === 'today' ? 0 : 1;
    Animated.spring(tabIndicatorPosition, {
      toValue: tabIndex,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
      stiffness: 120,
    }).start();
    setActiveTab(tab);
  };

  const handleShare = async (post: Post) => {
    try {
      await Share.share({
        message: `Check out my post on OnlyOne: "${post.content}" - Top ${(100 - post.percentile).toFixed(1)}% uniqueness!`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return '#a78bfa';
      case 'rare': return '#f9a8d4';
      case 'unique': return '#22d3ee';
      default: return '#6b7280';
    }
  };

  const getTotalReactions = (reactions: Post['reactions']) => {
    return reactions.love + reactions.fire + reactions.wow;
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
                <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Posts</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Today / All Time Tabs */}
          <View style={styles.tabsSection}>
            <View 
              style={styles.tabContainer}
              onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
            >
              <View style={styles.tabBackground}>
                <Animated.View
                  style={[
                    styles.tabIndicator,
                    {
                      transform: [
                        {
                          translateX: tabIndicatorPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, tabContainerWidth / 2],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.4)', 'rgba(168, 85, 247, 0.2)'] as const}
                    style={styles.tabIndicatorGradient}
                  />
                </Animated.View>
              </View>
              
              <View style={styles.tabButtons}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleTabChange('today')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
                    Today
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleTabChange('all')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                    All Time
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Posts List */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <BlurView intensity={10} tint="dark" style={styles.postBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.03)', 'transparent'] as const}
                    style={styles.postContent}
                  >
                    {/* Header */}
                    <View style={styles.postHeader}>
                      <View style={styles.tierContainer}>
                        <View style={[styles.tierDot, { backgroundColor: getTierColor(post.tier) }]} />
                        <Text style={[styles.tierLabel, { color: getTierColor(post.tier) }]}>
                          {post.tier.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.timeAgo}>{post.date}</Text>
                    </View>

                    {/* Content */}
                    <Text style={styles.postText}>{post.content}</Text>

                    {/* Footer with reactions and share */}
                    <View style={styles.postFooter}>
                      <View style={styles.leftFooter}>
                        <View style={styles.percentileBadge}>
                          <Text style={styles.percentileText}>Top {(100 - post.percentile).toFixed(1)}%</Text>
                        </View>
                        
                        {/* Reactions */}
                        <View style={styles.reactionsContainer}>
                          {post.reactions.love > 0 && (
                            <View style={styles.reactionItem}>
                              <Text style={styles.reactionEmoji}>❤️</Text>
                              <Text style={styles.reactionCount}>{post.reactions.love}</Text>
                            </View>
                          )}
                          {post.reactions.fire > 0 && (
                            <View style={styles.reactionItem}>
                              <Text style={styles.reactionEmoji}>🔥</Text>
                              <Text style={styles.reactionCount}>{post.reactions.fire}</Text>
                            </View>
                          )}
                          {post.reactions.wow > 0 && (
                            <View style={styles.reactionItem}>
                              <Text style={styles.reactionEmoji}>😮</Text>
                              <Text style={styles.reactionCount}>{post.reactions.wow}</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Share Button */}
                      <TouchableOpacity
                        style={styles.shareButton}
                        onPress={() => handleShare(post)}
                        activeOpacity={0.7}
                      >
                        <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                          <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </BlurView>
              </View>
            ))}

            {filteredPosts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No posts {activeTab === 'today' ? 'today' : 'yet'}</Text>
                <Text style={styles.emptySubtext}>
                  {activeTab === 'today' ? 'Create your first post today!' : 'Start sharing your uniqueness!'}
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a1a' },
  gradient: { flex: 1 },
  content: { flex: 1, paddingTop: scale(60) },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
  },
  backButton: { padding: scale(8) },
  headerTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSpacer: { width: scale(40) },

  // Tabs
  tabsSection: {
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  tabContainer: {
    position: 'relative',
    height: scale(44),
  },
  tabBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: scale(12),
    padding: scale(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabIndicator: {
    position: 'absolute',
    left: scale(4),
    top: scale(4),
    bottom: scale(4),
    right: '50%',
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  tabIndicatorGradient: {
    flex: 1,
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  tabButtons: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 1,
    height: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // Posts
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(100),
  },
  postCard: {
    marginBottom: scale(12),
  },
  postBlur: {
    borderRadius: scale(18),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  postContent: {
    padding: scale(18),
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  tierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  tierDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  tierLabel: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  timeAgo: {
    fontSize: moderateScale(11, 0.2),
    color: '#6b7280',
    fontWeight: '500',
  },
  postText: {
    fontSize: moderateScale(15, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(22, 0.2),
    marginBottom: scale(14),
    fontWeight: '400',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  percentileBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  percentileText: {
    fontSize: moderateScale(10, 0.2),
    color: '#c4b5fd',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  reactionEmoji: {
    fontSize: moderateScale(12, 0.2),
  },
  reactionCount: {
    fontSize: moderateScale(11, 0.2),
    color: '#9ca3af',
    fontWeight: '600',
  },
  shareButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: scale(80),
  },
  emptyText: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '400',
    color: '#ffffff',
    marginBottom: scale(8),
  },
  emptySubtext: {
    fontSize: moderateScale(13, 0.2),
    color: '#6b7280',
    fontWeight: '400',
  },
});
