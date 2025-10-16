/**
 * All Posts Screen - Complete Redesign
 * Actions/Summaries toggle, premium card styling matching Feed screen
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
import { getTierColors } from '@/shared/constants/tierColors';

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
  input_type: 'action' | 'day';
  scope: 'world' | 'city' | 'state' | 'country';
  location?: string;
  username: string;
}

export default function AllPostsScreen({ navigation }: AllPostsScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showDaySummaries, setShowDaySummaries] = useState(false);
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

  // Mock posts - Mix of actions and day summaries
  const allPosts: Post[] = [
    { id: '1', content: 'Discovered a hidden rooftop garden with 360° city views', date: '2h', tier: 'elite', percentile: 99.8, timestamp: Date.now(), input_type: 'action', scope: 'world', username: 'cosmic_wanderer' },
    { id: '2', content: 'Had breakfast underwater at an aquarium restaurant', date: '5h', tier: 'rare', percentile: 95.2, timestamp: Date.now(), input_type: 'action', scope: 'city', location: 'Phoenix', username: 'cosmic_wanderer' },
    { id: '3', content: 'Today was incredibly productive. Started with a morning meditation session that helped clear my mind, then tackled my most challenging project at work. Had a great lunch with an old friend I hadn\'t seen in years, and ended the day with a peaceful walk in nature. Feeling grateful for these meaningful moments.', date: '1d', tier: 'unique', percentile: 87.5, timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, input_type: 'day', scope: 'country', location: 'United States', username: 'cosmic_wanderer' },
    { id: '4', content: 'Learned to juggle with my eyes closed', date: '3d', tier: 'elite', percentile: 98.1, timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, input_type: 'action', scope: 'state', location: 'California', username: 'cosmic_wanderer' },
    { id: '5', content: 'An eventful day filled with surprises. Morning started slow, but picked up when I received unexpected good news about a project I\'d been working on for months. Spent the afternoon celebrating with family, sharing stories and laughter. The evening was quiet, reflecting on how far I\'ve come. Days like these remind me to appreciate the journey.', date: '4d', tier: 'rare', percentile: 93.7, timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, input_type: 'day', scope: 'world', username: 'cosmic_wanderer' },
    { id: '6', content: 'Created a time-lapse of clouds for 12 hours straight', date: '5d', tier: 'elite', percentile: 96.3, timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, input_type: 'action', scope: 'world', username: 'cosmic_wanderer' },
  ];

  const filteredPosts = showDaySummaries 
    ? allPosts.filter(p => p.input_type === 'day')
    : allPosts.filter(p => p.input_type === 'action');

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleToggleChange = (showSummaries: boolean) => {
    Animated.spring(tabIndicatorPosition, {
      toValue: showSummaries ? 1 : 0,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
      stiffness: 120,
      overshootClamping: false,
    }).start();
    setShowDaySummaries(showSummaries);
  };

  const handleShare = async (post: Post) => {
    try {
      await Share.share({
        message: `Check out my ${post.input_type === 'day' ? 'day summary' : 'action'} on OnlyOne: "${post.content}" - Top ${(100 - post.percentile).toFixed(1)}% uniqueness!`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
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

          {/* Actions / Summaries Toggle */}
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
                            outputRange: [0, (tabContainerWidth / 2) - scale(3)],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.5)', 'rgba(124, 58, 237, 0.3)'] as const}
                    style={styles.tabIndicatorGradient}
                  />
                </Animated.View>
              </View>
              
              <View style={styles.tabButtons}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleToggleChange(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, !showDaySummaries && styles.tabTextActive]}>
                    Actions
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleToggleChange(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, showDaySummaries && styles.tabTextActive]}>
                    Summaries
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
            {filteredPosts.map((post) => {
              const tierColors = getTierColors(post.tier);
              return (
              <View key={post.id} style={styles.postCard}>
                <BlurView intensity={25} tint="dark" style={styles.postBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)'] as const}
                    style={styles.postContent}
                  >
                    {/* Header - Username & Percentile/Tier */}
                    <View style={styles.postHeader}>
                      {post.input_type === 'day' ? (
                        <>
                          <Text style={styles.postUsername}>@{post.username}</Text>
                          <Text style={styles.summaryLabel}>'s summary</Text>
                        </>
                      ) : (
                        <Text style={styles.postUsername}>@{post.username}</Text>
                      )}
                      
                      <View style={{ flex: 1 }} />
                      
                      <View style={[styles.percentilePill, { borderColor: tierColors.primary }]}>
                        <Text style={[styles.percentileText, { color: tierColors.primary }]}>
                          {post.input_type === 'day' ? post.tier.toUpperCase() : `Top ${(100 - post.percentile).toFixed(1)}%`}
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.shareIconBtn} 
                        onPress={() => handleShare(post)}
                        activeOpacity={0.6}
                      >
                        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                          <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <Text 
                      style={styles.postText} 
                      numberOfLines={post.input_type === 'day' ? 3 : undefined}
                    >
                      {post.content}
                    </Text>
                    {post.input_type === 'day' && post.content.length > 150 && (
                      <Text style={styles.readMore}>Tap to read more</Text>
                    )}

                    {/* Footer - Time & Location */}
                    <View style={styles.postFooter}>
                      <Text style={styles.postTime}>{post.date}</Text>
                      <View style={styles.footerDot} />
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
                    </View>
                  </LinearGradient>
                </BlurView>
              </View>
              );
            })}

            {filteredPosts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No {showDaySummaries ? 'summaries' : 'actions'} yet</Text>
                <Text style={styles.emptySubtext}>
                  {showDaySummaries ? 'Start writing day summaries!' : 'Create your first action!'}
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
    width: '50%',
    marginRight: scale(3),
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  tabIndicatorGradient: {
    flex: 1,
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
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

  // Posts - Match Feed Style
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(100),
  },
  postCard: {
    marginBottom: scale(14),
  },
  postBlur: {
    borderRadius: scale(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  postContent: {
    padding: scale(14),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(10),
  },
  postUsername: {
    fontSize: moderateScale(11, 0.2),
    color: '#8b5cf6',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  summaryLabel: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  percentilePill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: scale(8), 
    paddingVertical: scale(4), 
    borderRadius: scale(10), 
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  percentileText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  shareIconBtn: {
    padding: scale(4),
  },
  postText: {
    fontSize: moderateScale(13, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(19, 0.2),
    marginBottom: scale(12),
    fontWeight: '400',
  },
  readMore: {
    fontSize: moderateScale(11, 0.2),
    color: '#8b5cf6',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: scale(12),
    textAlign: 'right',
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  postTime: {
    fontSize: moderateScale(9, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },
  footerDot: {
    width: scale(3),
    height: scale(3),
    borderRadius: scale(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scopeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    backgroundColor: 'rgba(107, 114, 128, 0.12)',
    flex: 0,
  },
  scopeText: {
    fontSize: moderateScale(9, 0.2),
    color: '#9ca3af',
    fontWeight: '500',
    maxWidth: scale(100),
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
