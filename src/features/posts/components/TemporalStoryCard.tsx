/**
 * Temporal Story Card Component
 * V2: Story-driven, emotionally engaging temporal cards
 */

import React, { type ReactElement } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Responsive scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export interface TemporalStory {
  timeframe: 'week' | 'month' | 'year' | 'allTime';
  type: 'pioneer' | 'growth' | 'rare' | 'stable' | 'milestone' | 'community';
  title: string;
  story: string;
  matches: number;
  total: number;
  trend?: 'up' | 'down' | 'stable';
  milestone?: number;
}

interface TemporalStoryCardProps {
  story: TemporalStory;
  colors: {
    primary: string;
    secondary: string;
    glow: string;
  };
  fullWidth?: boolean;
}

const getTimeframeLabel = (timeframe: string): string => {
  switch (timeframe) {
    case 'week': return 'This Week';
    case 'month': return 'This Month';
    case 'year': return 'This Year';
    case 'allTime': return 'All Time';
    default: return timeframe;
  }
};

const getStoryIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'pioneer':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </Svg>
      );
    case 'growth':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'rare':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </Svg>
      );
    case 'community':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'milestone':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </Svg>
      );
    default:
      return null;
  }
};

export function TemporalStoryCard({ story, colors, fullWidth = false }: TemporalStoryCardProps) {
  const matches = story.matches || 0;
  const total = story.total || 1;
  
  // Calculate percentage - simple format: "16% this week"
  const percentage = total > 0 ? Math.round((matches / total) * 100) : 0;
  
  // Get timeframe label - clean and minimal
  const getTimeframeDisplay = (timeframe: string): string => {
    switch (timeframe) {
      case 'week': return 'this week';
      case 'month': return 'this month';
      case 'year': return 'this year';
      case 'allTime': return 'all time';
      default: return timeframe;
    }
  };

  return (
    <View
      style={[
        styles.card,
        fullWidth ? styles.cardFullWidth : styles.cardHalfWidth,
        {
          backgroundColor: `${colors.primary}06`,
          borderColor: `${colors.primary}20`,
        },
      ]}
    >
      {/* Simple Layout: Large percentage + explanatory text */}
      <View style={styles.simpleLayout}>
        <Text style={[styles.percentageNumber, { color: '#ffffff' }]}>
            {percentage}%
          </Text>
          <Text style={[styles.timeframeLabel, { color: 'rgba(255, 255, 255, 0.7)' }]}>
          {getTimeframeDisplay(story.timeframe)}
            </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: scale(10),
    borderWidth: 1,
    paddingHorizontal: scale(12),
    paddingVertical: scale(14),
    minHeight: scale(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHalfWidth: {
    width: '48%', // 2 cards side by side with gap (slightly less than 50% to account for gap)
  },
  cardFullWidth: {
    width: '100%', // Full width for year and all time
  },
  simpleLayout: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageNumber: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: '800',
    letterSpacing: scale(-0.5),
    marginBottom: scale(4),
  },
  timeframeLabel: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.2),
    textTransform: 'lowercase',
    opacity: 0.7,
  },
});

