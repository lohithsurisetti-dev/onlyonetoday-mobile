/**
 * Day Summary Card Component
 * Larger card design for day summaries with more text content
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface DaySummaryCardProps {
  post: any;
  index: number;
  onReact: (postId: string, reactionType: 'funny' | 'creative' | 'must_try') => void;
  onShare: (post: any) => void;
  userReactions: Set<string>;
  tierColors: any;
}

export default function DaySummaryCard({ 
  post, 
  index, 
  onReact, 
  onShare, 
  userReactions,
  tierColors 
}: DaySummaryCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
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
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={20} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={isTopTier ? ['rgba(139, 92, 246, 0.12)', 'rgba(236, 72, 153, 0.08)'] : ['rgba(59, 130, 246, 0.08)', 'rgba(26, 26, 46, 0.15)']}
          style={styles.gradient}
        >
          {/* Header with tier indicator and share */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {post.percentile && (
                <View style={[styles.tierBadge, { backgroundColor: `${tierColors.primary}30` }]}>
                  <View style={[styles.tierDot, { backgroundColor: tierColors.primary }]} />
                  <Text style={[styles.tierText, { color: tierColors.primary }]}>
                    {post.percentile.displayText}
                  </Text>
                </View>
              )}
              <Text style={styles.dateLabel}>Day Summary</Text>
            </View>
            
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => onShare(post)}
              activeOpacity={0.6}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Content - Expandable */}
          <Text style={styles.summaryText} numberOfLines={5}>
            {post.content}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.metaInfo}>
              <Text style={styles.time}>{post.time}</Text>
              <View style={styles.dot} />
              <View style={styles.scopeTag}>
                <Svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                  {post.scope === 'world' ? (
                    <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth={2.5} />
                  ) : (
                    <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#6b7280" strokeWidth={2.5} />
                  )}
                </Svg>
                <Text style={styles.scopeLabel} numberOfLines={1}>
                  {post.scope === 'world' ? 'World' : 
                   post.scope === 'city' ? post.location_city :
                   post.scope === 'state' ? post.location_state :
                   post.location_country}
                </Text>
              </View>
            </View>

            {/* Reactions - Compact */}
            <View style={styles.reactions}>
              {(['funny', 'creative', 'must_try'] as const).map(type => {
                const isActive = userReactions.has(`${post.id}-${type}`);
                const count = post[`${type}_count`];
                
                if (count === 0 && !isActive) return null;

                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.reactionBtn, isActive && styles.reactionBtnActive]}
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

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(14),
  },
  blur: {
    borderRadius: scale(22),
    overflow: 'hidden',
  },
  gradient: {
    padding: scale(16),
    borderRadius: scale(22),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(12),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flex: 1,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(8),
  },
  tierDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  tierText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dateLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  shareBtn: {
    padding: scale(4),
  },
  summaryText: {
    fontSize: moderateScale(15, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(23, 0.2),
    fontWeight: '400',
    marginBottom: scale(14),
  },
  footer: {
    gap: scale(10),
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(8),
  },
  time: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },
  dot: {
    width: scale(2),
    height: scale(2),
    borderRadius: scale(1),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scopeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  scopeLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    fontWeight: '500',
    maxWidth: scale(100),
  },
  reactions: {
    flexDirection: 'row',
    gap: scale(8),
    justifyContent: 'flex-end',
  },
  reactionBtn: {
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
  reactionBtnActive: {
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
});

