/**
 * Trending Share Card
 * Premium shareable card for trending posts
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

// Dynamic imports
let captureRef: any = null;
let MediaLibrary: any = null;
let Sharing: any = null;

try {
  const ViewShot = require('react-native-view-shot');
  captureRef = ViewShot.captureRef;
  MediaLibrary = require('expo-media-library');
  Sharing = require('expo-sharing');
} catch (error) {
  console.warn('Share/Save features require a development build.');
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface TrendingShareCardProps {
  visible: boolean;
  onClose: () => void;
  post: {
    content: string;
    source: string;
    count: number;
  };
}

export default function TrendingShareCard({ visible, onClose, post }: TrendingShareCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const cardRef = useRef<View>(null);

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

  const handleShare = async () => {
    if (!captureRef || !Sharing) {
      Alert.alert('Not Available', 'Share feature requires a development build.');
      return;
    }

    try {
      if (!cardRef.current) return;
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const handleSaveImage = async () => {
    if (!captureRef || !MediaLibrary) {
      Alert.alert('Not Available', 'Save feature requires a development build.');
      return;
    }

    try {
      if (!cardRef.current) return;
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save images');
        return;
      }
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success', 'Image saved to your gallery!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M people`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K people`;
    return `${count} people`;
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        
        <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View ref={cardRef} style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: '#0a0a1a' }]}>
            <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.cardGradient}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.brandName}>ONLYONE</Text>
                <View style={styles.brandDivider} />
                <Text style={styles.brandTagline}>TODAY</Text>
              </View>

              {/* Trending Badge */}
              <View style={styles.trendingBadge}>
                <View style={styles.trendingDot} />
                <Text style={styles.trendingText}>TRENDING NOW</Text>
              </View>

              {/* Content */}
              <View style={styles.contentSection}>
                <Text style={styles.quoteText} numberOfLines={4}>"{post.content}"</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.statCount}>{formatCount(post.count)}</Text>
                  <Text style={styles.statLabel}>are doing this</Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.welcomeTitle}>See what's trending worldwide</Text>
                <Text style={styles.welcomeMessage}>Discover what makes you different</Text>
                <Text style={styles.ctaUrl}>onlyonetoday.com</Text>
              </View>

              {/* Decorative Corners */}
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </LinearGradient>
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <BlurView intensity={60} tint="dark" style={styles.closeButtonBlur}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </BlurView>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={handleShare}>
              <View style={styles.actionButtonOutline}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.actionButtonText}>Share</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={handleSaveImage}>
              <View style={styles.actionButtonOutline}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.actionButtonText}>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: scale(24),
    paddingTop: scale(28),
    paddingBottom: scale(24),
    justifyContent: 'space-between',
  },
  cardHeader: {
    alignItems: 'center',
    gap: scale(10),
  },
  brandName: {
    fontSize: moderateScale(26, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: scale(6),
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  brandDivider: {
    width: scale(50),
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#a78bfa',
    opacity: 0.8,
  },
  brandTagline: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: scale(3),
    opacity: 0.95,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    alignSelf: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(12),
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  trendingDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#a78bfa',
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  trendingText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 1.5,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    gap: scale(20),
  },
  quoteText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: moderateScale(24, 0.2),
    textAlign: 'center',
    paddingHorizontal: scale(8),
  },
  statsRow: {
    alignItems: 'center',
    gap: scale(6),
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
    borderRadius: scale(14),
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  statCount: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  footer: {
    paddingTop: scale(20),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    gap: scale(8),
  },
  welcomeTitle: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  welcomeMessage: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  ctaUrl: {
    fontSize: moderateScale(15, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.2,
    marginTop: scale(4),
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: '#a78bfa',
    borderTopLeftRadius: 8,
    opacity: 0.5,
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#a78bfa',
    borderTopRightRadius: 8,
    opacity: 0.5,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: '#a78bfa',
    borderBottomLeftRadius: 8,
    opacity: 0.5,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#a78bfa',
    borderBottomRightRadius: 8,
    opacity: 0.5,
  },
  closeButton: {
    marginTop: scale(20),
    borderRadius: scale(28),
    overflow: 'hidden',
  },
  closeButtonBlur: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: scale(16),
    width: CARD_WIDTH,
  },
  actionButton: {
    flex: 1,
    borderRadius: scale(14),
    overflow: 'hidden',
  },
  actionButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(14),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButtonText: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    color: '#ffffff',
  },
});

