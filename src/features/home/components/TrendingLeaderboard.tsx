/**
 * Trending Leaderboard Component
 * Shows top trending items from Spotify, Reddit, YouTube, Sports
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface TrendingItem {
  content: string;
  source: string;
  count: number;
  rank: number;
}

// Sample data - replace with API call
const SAMPLE_TRENDING: TrendingItem[] = [
  { content: 'Listening to "Cruel Summer" by Taylor Swift', source: 'Spotify', count: 12500000, rank: 1 },
  { content: 'Watching "The most satisfying video ever"', source: 'YouTube', count: 2800000, rank: 2 },
  { content: 'Following Lakers vs Warriors game', source: 'Sports', count: 156000, rank: 3 },
  { content: 'Reading about "AI breaks new barrier in medicine"', source: 'Reddit', count: 45000, rank: 4 },
  { content: 'Listening to "Paint The Town Red" by Doja Cat', source: 'Spotify', count: 9200000, rank: 5 },
  { content: 'Watching "MrBeast new challenge"', source: 'YouTube', count: 1900000, rank: 6 },
  { content: 'Following NFL Sunday Night Football', source: 'Sports', count: 234000, rank: 7 },
  { content: 'Reading about "SpaceX launches new satellite"', source: 'Reddit', count: 38000, rank: 8 },
  { content: 'Listening to "Flowers" by Miley Cyrus', source: 'Spotify', count: 8700000, rank: 9 },
  { content: 'Watching "Cooking tutorial gone wrong"', source: 'YouTube', count: 1200000, rank: 10 },
];

export default function TrendingLeaderboard() {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getRankDisplay = (rank: number) => {
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#a78bfa'; // Purple
    if (rank === 2) return '#8b5cf6';
    if (rank === 3) return '#7c3aed';
    return 'rgba(255, 255, 255, 0.5)';
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.cardGradient}
        >
          <Text style={styles.sectionTitle}>Trending Now</Text>
          
          {/* Trending List */}
          <View style={styles.trendingList}>
            {SAMPLE_TRENDING.slice(0, 5).map((item) => ( {/* Show top 5 */}
              <View key={item.rank} style={styles.trendingRow}>
                <Text style={[styles.rankText, { color: getRankColor(item.rank) }]}>
                  {getRankDisplay(item.rank)}
                </Text>
                <View style={styles.contentContainer}>
                  <Text style={styles.contentText} numberOfLines={1}>{item.content}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.sourceText}>{item.source}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.countText}>{formatCount(item.count)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(16),
    overflow: 'hidden',
    marginBottom: scale(16),
  },
  cardBlur: {
    borderRadius: scale(16),
  },
  cardGradient: {
    padding: scale(20),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: scale(16),
    letterSpacing: 0.5,
  },
  trendingList: {
    gap: scale(12),
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  rankText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '700',
    width: scale(32),
    marginTop: scale(2),
  },
  contentContainer: {
    flex: 1,
    gap: scale(4),
  },
  contentText: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: moderateScale(20, 0.2),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  sourceText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
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
  },
});

