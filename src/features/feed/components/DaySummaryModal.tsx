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
            <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.15)', 'rgba(236, 72, 153, 0.1)', 'rgba(26, 26, 46, 0.95)']}
                style={styles.modalGradient}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <View style={[styles.tierBadge, { backgroundColor: `${tierColors.primary}30` }]}>
                      <View style={[styles.tierDot, { backgroundColor: tierColors.primary }]} />
                      <Text style={[styles.tierText, { color: tierColors.primary }]}>
                        {post.percentile?.displayText}
                      </Text>
                    </View>
                    <Text style={styles.dateLabel}>Day Summary</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                  style={styles.contentScroll}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.contentText}>{post.content}</Text>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.metaRow}>
                    <Text style={styles.time}>{post.time}</Text>
                    <View style={styles.dot} />
                    <View style={styles.scopeTag}>
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        {post.scope === 'world' ? (
                          <Circle cx="12" cy="12" r="10" stroke="#8b5cf6" strokeWidth={2.5} />
                        ) : (
                          <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#8b5cf6" strokeWidth={2.5} />
                        )}
                      </Svg>
                      <Text style={styles.scopeLabel}>
                        {post.scope === 'world' ? 'World' : 
                         post.scope === 'city' ? post.location_city :
                         post.scope === 'state' ? post.location_state :
                         post.location_country}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={onShare}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['rgba(139, 92, 246, 0.3)', 'rgba(124, 58, 237, 0.2)']}
                      style={styles.shareBtnGradient}
                    >
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                      <Text style={styles.shareBtnText}>Share</Text>
                    </LinearGradient>
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
    padding: scale(20),
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.75,
    borderRadius: scale(24),
    overflow: 'hidden',
  },
  modalBlur: {
    borderRadius: scale(24),
  },
  modalGradient: {
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: scale(20),
    paddingBottom: scale(16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flex: 1,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(10),
  },
  tierDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(3.5),
  },
  tierText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dateLabel: {
    fontSize: moderateScale(11, 0.2),
    color: '#9ca3af',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentScroll: {
    maxHeight: SCREEN_HEIGHT * 0.45,
    paddingHorizontal: scale(20),
  },
  contentText: {
    fontSize: moderateScale(16, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(26, 0.2),
    fontWeight: '400',
  },
  footer: {
    padding: scale(20),
    paddingTop: scale(16),
    gap: scale(14),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  time: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  dot: {
    width: scale(3),
    height: scale(3),
    borderRadius: scale(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scopeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
  },
  scopeLabel: {
    fontSize: moderateScale(11, 0.2),
    color: '#8b5cf6',
    fontWeight: '600',
  },
  shareBtn: {
    borderRadius: scale(14),
    overflow: 'hidden',
  },
  shareBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(14),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  shareBtnText: {
    fontSize: moderateScale(14, 0.2),
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

