/**
 * Trending Modal Component
 * Premium popup to show trending item details
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface TrendingModalProps {
  visible: boolean;
  onClose: () => void;
  onExploreTrending: () => void;
  item: {
    content: string;
    source: string;
    count: number;
    rank: number;
  } | null;
}

export default function TrendingModal({ visible, onClose, onExploreTrending, item }: TrendingModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!item) return null;

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#a78bfa';
    if (rank === 2) return '#8b5cf6';
    if (rank === 3) return '#7c3aed';
    return 'rgba(255, 255, 255, 0.5)';
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share trending item:', item);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Dark Overlay */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.card}>
          <BlurView intensity={40} tint="dark" style={styles.cardBlur}>
            <LinearGradient
              colors={['rgba(26, 26, 46, 0.98)', 'rgba(10, 10, 26, 0.98)']}
              style={styles.cardGradient}
            >
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
                <View style={styles.buttonCircle}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
                <View style={styles.buttonCircle}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
              </TouchableOpacity>

              {/* Rank Badge */}
              <View style={styles.rankBadge}>
                <LinearGradient
                  colors={[getRankColor(item.rank), `${getRankColor(item.rank)}80`]}
                  style={styles.rankGradient}
                >
                  <Text style={styles.rankText}>#{item.rank}</Text>
                </LinearGradient>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.contentText}>{item.content}</Text>
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Source</Text>
                  <Text style={styles.statValue}>{item.source}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Activity</Text>
                  <Text style={styles.statValue}>{formatCount(item.count)}</Text>
                </View>
              </View>

              {/* Explore Button */}
              <TouchableOpacity style={styles.exploreButton} onPress={onExploreTrending} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#a78bfa', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.exploreGradient}
                >
                  <Text style={styles.exploreText}>Explore Trending</Text>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 12h14M12 5l7 7-7 7" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  card: {
    width: '100%',
    maxWidth: scale(360),
    borderRadius: scale(24),
    overflow: 'hidden',
  },
  cardBlur: {
    borderRadius: scale(24),
  },
  cardGradient: {
    padding: scale(24),
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: scale(16),
    right: scale(16),
    zIndex: 10,
  },
  shareButton: {
    position: 'absolute',
    top: scale(16),
    left: scale(16),
    zIndex: 10,
  },
  buttonCircle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rankBadge: {
    alignSelf: 'center',
    marginTop: scale(24),
    marginBottom: scale(20),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  rankGradient: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(16),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rankText: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  content: {
    marginBottom: scale(24),
  },
  contentText: {
    fontSize: moderateScale(18, 0.2),
    lineHeight: moderateScale(28, 0.2),
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(24),
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
    borderRadius: scale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: scale(4),
  },
  statLabel: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: moderateScale(15, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  divider: {
    width: 1,
    height: scale(32),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  exploreButton: {
    borderRadius: scale(14),
    overflow: 'hidden',
  },
  exploreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(14),
    paddingHorizontal: scale(20),
    borderRadius: scale(14),
  },
  exploreText: {
    fontSize: moderateScale(15, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});

