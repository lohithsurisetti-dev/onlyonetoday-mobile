/**
 * Location Leaderboard Component
 * Shows top cities/states/countries by post activity
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface LeaderboardEntry {
  name: string;
  count: number;
  rank: number;
}

interface LocationLeaderboardProps {
  userLocation?: { city?: string; state?: string; country?: string } | null;
}

// Sample data - replace with API call
const SAMPLE_DATA = {
  cities: [
    { name: 'New York', count: 1247, rank: 1 },
    { name: 'Los Angeles', count: 892, rank: 2 },
    { name: 'Chicago', count: 634, rank: 3 },
    { name: 'Houston', count: 521, rank: 4 },
    { name: 'Phoenix', count: 489, rank: 5 },
    { name: 'Philadelphia', count: 456, rank: 6 },
    { name: 'San Antonio', count: 423, rank: 7 },
    { name: 'San Diego', count: 398, rank: 8 },
    { name: 'Dallas', count: 367, rank: 9 },
    { name: 'San Jose', count: 334, rank: 10 },
  ],
  states: [
    { name: 'California', count: 3421, rank: 1 },
    { name: 'New York', count: 2156, rank: 2 },
    { name: 'Texas', count: 1789, rank: 3 },
    { name: 'Florida', count: 1567, rank: 4 },
    { name: 'Illinois', count: 1234, rank: 5 },
    { name: 'Pennsylvania', count: 1098, rank: 6 },
    { name: 'Ohio', count: 987, rank: 7 },
    { name: 'Georgia', count: 876, rank: 8 },
    { name: 'North Carolina', count: 765, rank: 9 },
    { name: 'Michigan', count: 654, rank: 10 },
  ],
  countries: [
    { name: 'United States', count: 12456, rank: 1 },
    { name: 'Canada', count: 3421, rank: 2 },
    { name: 'United Kingdom', count: 2134, rank: 3 },
    { name: 'Australia', count: 1876, rank: 4 },
    { name: 'Germany', count: 1654, rank: 5 },
    { name: 'France', count: 1432, rank: 6 },
    { name: 'Japan', count: 1234, rank: 7 },
    { name: 'Brazil', count: 1098, rank: 8 },
    { name: 'India', count: 987, rank: 9 },
    { name: 'Spain', count: 876, rank: 10 },
  ],
};

export default function LocationLeaderboard({ userLocation }: LocationLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'cities' | 'states' | 'countries'>('cities');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(SAMPLE_DATA);

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#a78bfa'; // Purple
    if (rank === 2) return '#8b5cf6';
    if (rank === 3) return '#7c3aed';
    return 'rgba(255, 255, 255, 0.5)';
  };

  const getRankDisplay = (rank: number) => {
    return `#${rank}`;
  };

  // For V1: Assume user has location (sample data)
  // const hasLocation = userLocation?.city || userLocation?.state || userLocation?.country;
  const hasLocation = true; // Temporarily enabled for demo

  const currentData = data[activeTab].slice(0, 5); // Show top 5

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.cardGradient}
        >
          <Text style={styles.sectionTitle}>Global Leaderboard</Text>
          
          {/* Tabs */}
          <View style={styles.tabs}>
            {(['cities', 'states', 'countries'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Leaderboard */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.5)" />
            </View>
          ) : (
            <View style={styles.leaderboard}>
              {currentData.map((entry) => (
                <View key={entry.rank} style={styles.leaderboardRow}>
                  <Text style={[styles.rankText, { color: getRankColor(entry.rank) }]}>
                    {getRankDisplay(entry.rank)}
                  </Text>
                  <Text style={styles.nameText} numberOfLines={1}>{entry.name}</Text>
                  <Text style={styles.countText}>{entry.count.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}
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
  noLocationContainer: {
    paddingVertical: scale(32),
    alignItems: 'center',
    gap: scale(4),
  },
  noLocationText: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: scale(16),
  },
  tab: {
    flex: 1,
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  tabText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#a78bfa',
  },
  loadingContainer: {
    paddingVertical: scale(32),
    alignItems: 'center',
  },
  leaderboard: {
    gap: scale(12),
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  nameText: {
    flex: 1,
    fontSize: moderateScale(14, 0.2),
    fontWeight: '500',
    color: '#ffffff',
  },
  countText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

