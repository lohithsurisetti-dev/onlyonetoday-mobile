/**
 * All Posts Screen
 * Displays all user posts with filters and sorting
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
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuthStore } from '@/lib/stores/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Floating star component
const FloatingStar = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const starScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -30,
              duration: 3000 + Math.random() * 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 20,
              duration: 2500 + Math.random() * 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -20,
              duration: 2500 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 2500 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.15,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(starScale, {
              toValue: 1,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(starScale, {
              toValue: 0.5,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(starScale, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          transform: [{ translateY }, { translateX }, { scale: starScale }],
          opacity,
        },
      ]}
    />
  );
};

type AllPostsScreenProps = {
  navigation: any;
};

type FilterType = 'all' | 'elite' | 'rare' | 'unique';
type SortType = 'recent' | 'percentile' | 'oldest';

export default function AllPostsScreen({ navigation }: AllPostsScreenProps) {
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('recent');

  // Mock posts data - replace with real API
  const allPosts = [
    { id: '1', content: 'Discovered a hidden rooftop garden in the city', date: '2 hours ago', tier: 'elite', percentile: 99.8, timestamp: Date.now() - 2 * 60 * 60 * 1000 },
    { id: '2', content: 'Had breakfast underwater at a submarine restaurant', date: '1 day ago', tier: 'rare', percentile: 95.2, timestamp: Date.now() - 24 * 60 * 60 * 1000 },
    { id: '3', content: 'Wrote a poem entirely in binary code', date: '2 days ago', tier: 'unique', percentile: 87.5, timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 },
    { id: '4', content: 'Learned to juggle with my eyes closed', date: '3 days ago', tier: 'elite', percentile: 98.1, timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { id: '5', content: 'Created a time-lapse of clouds for 12 hours', date: '4 days ago', tier: 'rare', percentile: 93.7, timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    { id: '6', content: 'Built a miniature city out of recycled materials', date: '5 days ago', tier: 'unique', percentile: 89.2, timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    { id: '7', content: 'Practiced calligraphy with natural ink', date: '6 days ago', tier: 'elite', percentile: 97.5, timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000 },
    { id: '8', content: 'Organized a spontaneous street concert', date: '1 week ago', tier: 'rare', percentile: 94.8, timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return '#8b5cf6';
      case 'rare': return '#ec4899';
      case 'unique': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getFilteredAndSortedPosts = () => {
    let filtered = allPosts;
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(post => post.tier === filter);
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'recent':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'percentile':
          return b.percentile - a.percentile;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const posts = getFilteredAndSortedPosts();

  const renderPost = ({ item, index }: { item: typeof allPosts[0], index: number }) => (
    <Animated.View
      style={[
        { opacity: fadeAnim }
      ]}
    >
      <BlurView intensity={30} tint="dark" style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={[styles.tierBadge, { backgroundColor: `${getTierColor(item.tier)}20` }]}>
            <Text style={[styles.tierText, { color: getTierColor(item.tier) }]}>
              {item.tier.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
        
        <Text style={styles.postContent}>{item.content}</Text>
        
        <View style={styles.postFooter}>
          <View style={styles.percentileContainer}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="10" stroke="#8b5cf6" strokeWidth={2} />
              <Path d="M12 6v6l4 2" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.percentileText}>{item.percentile}th percentile</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M9 5l7 7-7 7" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
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
              <FloatingStar delay={i * 200} />
            </View>
          ))}
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M15 18l-6-6 6-6" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>ALL POSTS</Text>
            <View style={styles.backButton} />
          </View>

          {/* Stats Summary */}
          <BlurView intensity={30} tint="dark" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{posts.length}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{allPosts.filter(p => p.tier === 'elite').length}</Text>
                <Text style={styles.summaryLabel}>Elite</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{allPosts.filter(p => p.tier === 'rare').length}</Text>
                <Text style={styles.summaryLabel}>Rare</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{allPosts.filter(p => p.tier === 'unique').length}</Text>
                <Text style={styles.summaryLabel}>Unique</Text>
              </View>
            </View>
          </BlurView>

          {/* Filters & Sort */}
          <View style={styles.controlsContainer}>
            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              {(['all', 'elite', 'rare', 'unique'] as FilterType[]).map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterChip, filter === f && styles.filterChipActive]}
                  onPress={() => setFilter(f)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Sort Dropdown */}
            <View style={styles.sortContainer}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M3 4h18M3 12h12M3 20h6" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => {
                  // Cycle through sort options
                  const sorts: SortType[] = ['recent', 'percentile', 'oldest'];
                  const currentIndex = sorts.indexOf(sort);
                  const nextSort = sorts[(currentIndex + 1) % sorts.length];
                  setSort(nextSort);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.sortText}>
                  {sort === 'recent' ? 'Recent' : sort === 'percentile' ? 'Top Rated' : 'Oldest'}
                </Text>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M19 9l-7 7-7-7" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          {/* Posts List */}
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#6b7280" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.emptyText}>No posts found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
              </View>
            }
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradient: {
    flex: 1,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingTop: scale(60),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  backButton: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: scale(2),
  },
  summaryCard: {
    marginHorizontal: scale(20),
    borderRadius: scale(16),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: scale(16),
    marginBottom: scale(20),
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: -1,
  },
  summaryLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    marginTop: scale(4),
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  summaryDivider: {
    width: 1,
    height: scale(32),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(16),
    gap: scale(12),
  },
  filtersScroll: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: scale(8),
  },
  filterChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  filterChipText: {
    fontSize: moderateScale(12, 0.2),
    color: '#9ca3af',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    gap: scale(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  sortText: {
    fontSize: moderateScale(12, 0.2),
    color: '#9ca3af',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
  },
  postCard: {
    borderRadius: scale(16),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: scale(16),
    marginBottom: scale(12),
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  tierBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(8),
  },
  tierText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '700',
    letterSpacing: 1,
  },
  postDate: {
    fontSize: moderateScale(11, 0.2),
    color: '#6b7280',
    fontWeight: '500',
  },
  postContent: {
    fontSize: moderateScale(15, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(22, 0.2),
    marginBottom: scale(12),
    fontWeight: '300',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  percentileText: {
    fontSize: moderateScale(12, 0.2),
    color: '#8b5cf6',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(60),
  },
  emptyText: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    marginTop: scale(16),
    letterSpacing: 0.5,
  },
  emptySubtext: {
    fontSize: moderateScale(13, 0.2),
    color: '#6b7280',
    marginTop: scale(8),
  },
});


