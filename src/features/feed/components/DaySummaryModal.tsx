/**
 * Day Summary Modal Component
 * Full content view for day summaries
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface DaySummaryModalProps {
  visible: boolean;
  onClose: () => void;
  post: any;
  tierColors: any;
  onShare: () => void;
}

export default function DaySummaryModal({
  visible,
  onClose,
  post,
  tierColors,
  onShare,
}: DaySummaryModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.overlayGradient,
            { opacity: fadeAnim },
          ]}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <BlurView intensity={60} tint="dark" style={styles.modalBlur}>
              <LinearGradient
                colors={['rgba(10, 10, 26, 0.98)', 'rgba(26, 26, 46, 0.98)', 'rgba(10, 10, 26, 0.98)']}
                style={styles.modalGradient}
              >
                {/* Decorative cosmic elements */}
                <View style={styles.cosmicAccent} />
                
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerContent}>
                    <View style={[styles.tierBadge, { backgroundColor: `${tierColors.primary}20`, borderColor: `${tierColors.primary}40` }]}>
                      <View style={[styles.tierDot, { backgroundColor: tierColors.primary }]} />
                      <Text style={[styles.tierText, { color: tierColors.primary }]}>
                        {post.percentile?.displayText}
                      </Text>
                    </View>
                    <Text style={styles.summaryLabel}>Day Summary</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M6 18L18 6M6 6l12 12" stroke="rgba(255, 255, 255, 0.8)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>

                {/* Content - Optimized for reading */}
                <ScrollView
                  style={styles.contentScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.contentContainer}
                >
                  <Text style={styles.contentText}>{post.content}</Text>
                  
                  {/* Gradient fade at bottom */}
                  <View style={styles.readingGradient} pointerEvents="none" />
                </ScrollView>

                {/* Meta bar */}
                <View style={styles.metaBar}>
                  <View style={styles.metaLeft}>
                    <Text style={styles.metaTime}>{post.time}</Text>
                    <View style={styles.metaDivider} />
                    <View style={styles.scopeContainer}>
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        {post.scope === 'world' ? (
                          <Circle cx="12" cy="12" r="10" stroke="#8b5cf6" strokeWidth={2} />
                        ) : (
                          <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#8b5cf6" strokeWidth={2} />
                        )}
                      </Svg>
                      <Text style={styles.scopeText}>
                        {post.scope === 'world' ? 'World' : 
                         post.scope === 'city' ? post.location_city :
                         post.scope === 'state' ? post.location_state :
                         post.location_country}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.shareIconBtn}
                    onPress={onShare}
                    activeOpacity={0.7}
                  >
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#c4b5fd" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContainer: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.80,
    borderRadius: scale(28),
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  modalBlur: {
    borderRadius: scale(28),
  },
  modalGradient: {
    borderRadius: scale(28),
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  cosmicAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(120),
    background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.15) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: scale(24),
    paddingBottom: scale(20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(12),
    borderWidth: 1,
  },
  tierDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  tierText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryLabel: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  closeBtn: {
    padding: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentScroll: {
    maxHeight: SCREEN_HEIGHT * 0.52,
    paddingHorizontal: scale(26),
  },
  contentContainer: {
    paddingBottom: scale(60),
  },
  contentText: {
    fontSize: moderateScale(17, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(30, 0.2),
    fontWeight: '400',
    textAlign: 'left',
    letterSpacing: 0.3,
  },
  readingGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(40),
    background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 26, 0.98) 100%)',
  },
  metaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: scale(18),
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.15)',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  metaTime: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  metaDivider: {
    width: scale(1),
    height: scale(14),
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  scopeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  scopeText: {
    fontSize: moderateScale(12, 0.2),
    color: '#8b5cf6',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  shareIconBtn: {
    padding: scale(10),
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
});

