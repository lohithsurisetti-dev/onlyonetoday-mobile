/**
 * Day Summary Card Component
 * Larger card design for day summaries with more text content
 * Memoized for performance
 */

import React, { useRef, memo } from 'react';
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
  onPress: (post: any) => void;
  userReactions: Set<string>;
  tierColors: any;
}

function DaySummaryCard({ 
  post, 
  index, 
  onReact, 
  onShare,
  onPress,
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
      <TouchableOpacity
        onPress={() => onPress(post)}
        activeOpacity={0.9}
      >
        <BlurView intensity={25} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
            style={styles.gradient}
          >
            {/* Header with username's summary, tier pill, and share */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.username}>@{post.username}</Text>
                <Text style={styles.summaryLabel}>'s summary</Text>
              </View>
              
              <View style={{ flex: 1 }} />
              
              {/* V2: Show match count pill (no emoji) */}
              {post.matchCount !== undefined && (
                <View style={[styles.narrativeBadge, { borderColor: tierColors.primary }]}>
                  <Text style={[styles.narrativeBadgeText, { color: tierColors.primary }]}>
                    {post.matchCount} {post.matchCount === 1 ? 'person' : 'people'}
                  </Text>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => onShare(post)}
                activeOpacity={0.6}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>


          {/* Content - Limited with press hint */}
          <Text style={styles.summaryText} numberOfLines={3}>
            {post.content}
          </Text>
          <Text style={styles.tapHint}>Tap to read more</Text>

          {/* Footer - Time and Location on Same Line, Reactions */}
          <View style={styles.footer}>
            <View style={styles.timeLocationRow}>
              {post.time && (
                <Text style={styles.time}>{post.time}</Text>
              )}
              {(() => {
                const locationDisplay = post.scope === 'world' ? 'World' : 
                  post.scope === 'city' ? post.location_city :
                  post.scope === 'state' ? post.location_state :
                  post.location_country;
                
                if (locationDisplay) {
                  return (
                    <>
                      {post.time && <View style={styles.dot} />}
                      <View style={styles.scopeTag}>
                        <Svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                          {post.scope === 'world' ? (
                            <Circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={2.5} />
                          ) : (
                            <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={2.5} />
                          )}
                        </Svg>
                        <Text style={styles.scopeLabel} numberOfLines={1}>
                          {locationDisplay}
                        </Text>
                      </View>
                    </>
                  );
                }
                return null;
              })()}
            </View>

            <View style={{ flex: 1 }} />

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
      </TouchableOpacity>
    </Animated.View>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(DaySummaryCard);

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(14),
  },
  blur: {
    borderRadius: scale(22),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  gradient: {
    padding: scale(16),
    borderRadius: scale(22),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(10),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(10),
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  tierText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // V2: Narrative badge styles
  narrativeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(10),
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  narrativeBadgeEmoji: {
    fontSize: moderateScale(12, 0.2),
  },
  narrativeBadgeText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // V2: Narrative container and text
  narrativeContainer: {
    padding: scale(10),
    borderRadius: scale(12),
    marginBottom: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  narrativeText: {
    fontSize: moderateScale(13, 0.2),
    lineHeight: moderateScale(18, 0.2),
    fontWeight: '600',
    letterSpacing: 0.2,
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
    marginBottom: scale(8),
  },
  tapHint: {
    fontSize: moderateScale(11, 0.2),
    color: '#8b5cf6',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: scale(14),
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  username: {
    fontSize: moderateScale(11, 0.2),
    color: '#c4b5fd',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  time: {
    fontSize: moderateScale(9, 0.2),
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
  timeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  scopeLabel: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
    maxWidth: scale(80),
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

