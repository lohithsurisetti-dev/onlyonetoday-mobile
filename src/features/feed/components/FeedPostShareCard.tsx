/**
 * Feed Post Share Card
 * Welcoming shareable card for feed posts - encourages others to try the app
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
import Svg, { Path, Circle } from 'react-native-svg';
import { getEmotionalToneColors } from '@/shared/constants/emotionalToneColors';

// Dynamic imports for Expo Go compatibility
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

// Floating star component
const FloatingStar = ({ delay = 0, size = 2 }: { delay?: number; size?: number }) => {
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
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }, { translateX }, { scale: starScale }],
          opacity,
        },
      ]}
    />
  );
};

interface FeedPostShareCardProps {
  visible: boolean;
  onClose: () => void;
  post: {
    content: string;
    username?: string;
    time?: string;
    location_city?: string;
    location_state?: string;
    location_country?: string;
    scope?: string;
    // V2: Narrative fields
    matchCount?: number;
    totalInScope?: number;
    emotionalTone?: 'unique' | 'shared' | 'common';
    // Legacy fields
    percentile?: {
      tier: string;
      displayText: string;
      comparison: string;
    };
  };
  tierColors: {
    primary: string;
    secondary: string;
    glow: string;
  };
}

export default function FeedPostShareCard({ visible, onClose, post, tierColors }: FeedPostShareCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const cardRef = useRef<View>(null);

  // Get gradient color based on emotional tone
  const emotionalToneColors = getEmotionalToneColors(post.emotionalTone);
  const bottomGradientColor = emotionalToneColors.backgroundGradient;

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

  const handleShare = async () => {
    if (!captureRef || !Sharing) {
      Alert.alert('Not Available', 'Share feature requires a development build.');
      return;
    }

    try {
      if (!cardRef.current) return;

      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
      });

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

      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success', 'Image saved to your gallery!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        {/* Close Button - Top Right */}
        <TouchableOpacity 
          style={styles.closeButtonTopRight}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        
        <Animated.View
          style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* The Shareable Card */}
          <View ref={cardRef} style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: '#0b0b18' }]}>
            <LinearGradient
              colors={['#0b0b18', '#171a2c', bottomGradientColor]}
              locations={[0, 0.5, 1]}
              style={styles.cardGradient}
            >
              {/* Floating Stars Background */}
              <View style={styles.starsBackground} pointerEvents="none">
                {[...Array(15)].map((_, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  >
                    <FloatingStar delay={i * 100} size={2 + Math.random() * 2} />
                  </View>
                ))}
              </View>

              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.brandName}>ONLYONE</Text>
                <View style={[styles.brandDivider, { backgroundColor: tierColors.primary }]} />
                <Text style={styles.brandTagline}>TODAY</Text>
              </View>

              {/* Top Section */}
              <View style={styles.topSection}>
              {/* Main Content */}
              <View style={styles.contentSection}>
                  {/* Quote - Highlighted Action */}
                  <View style={[styles.quoteContainer, {
                    borderColor: `${tierColors.primary}40`,
                    backgroundColor: `${tierColors.primary}08`,
                  }]}>
                    <Text style={[styles.quoteText, {
                      color: '#ffffff',
                      textShadowColor: `${tierColors.primary}40`,
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 8,
                    }]} numberOfLines={4}>
                    "{post.content}"
                  </Text>
                </View>
                
                  {/* Result Numbers Display */}
                  {post.matchCount !== undefined ? (
                    <View style={styles.resultCard}>
                      <View style={[styles.resultMain, {
                        backgroundColor: `${tierColors.primary}15`,
                        borderColor: `${tierColors.primary}30`,
                      }]}>
                        <Text style={[styles.resultMainNumber, { color: tierColors.primary }]}>
                          {post.matchCount.toLocaleString()}
                        </Text>
                        <Text style={[styles.resultMainLabel, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                          {(() => {
                            const isTrulyUnique = (post.matchCount === 1 && post.totalInScope === 1);
                            return isTrulyUnique ? 'First!' : `of ${(post.totalInScope || 1).toLocaleString()} people`;
                          })()}
                        </Text>
                      </View>
                      {post.totalInScope && post.totalInScope > 1 && (
                        <Text style={styles.resultSubtext}>
                          {((post.matchCount || 1) / (post.totalInScope || 1) * 100).toFixed(1)}% of people did this today
                        </Text>
                      )}
                  </View>
                ) : null}
                </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.bottomSection}>
                {/* User Info Section */}
                <View style={styles.userInfoSection}>
                  {post.username && (
                    <Text style={styles.usernameText}>@{post.username}</Text>
                  )}
                  {/* Time and Location on Same Line */}
                  <View style={styles.timeLocationRow}>
                    {post.time && (
                      <Text style={styles.dateText}>{post.time}</Text>
                    )}
                    {(() => {
                      const locationParts: string[] = [];
                      if (post.location_city) locationParts.push(post.location_city);
                      if (post.location_state) locationParts.push(post.location_state);
                      if (post.location_country) locationParts.push(post.location_country);
                      const locationDisplay = locationParts.length > 0 
                        ? locationParts.join(', ')
                        : (post.scope === 'world' ? 'World' : post.scope?.charAt(0).toUpperCase() + post.scope?.slice(1) || '');
                      
                      if (locationDisplay) {
                        return (
                          <>
                            {post.time && <View style={styles.dotSeparator} />}
                            <View style={styles.locationRow}>
                              <Svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                                <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                                <Circle cx="12" cy="10" r="3" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={1.5} />
                              </Svg>
                              <Text style={[styles.locationText, { color: 'rgba(255, 255, 255, 0.4)' }]}>
                                {locationDisplay}
                              </Text>
                            </View>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </View>
                </View>

                {/* Footer */}
              <View style={styles.footer}>
                <View style={styles.ctaContainer}>
                  <Text style={styles.ctaText}>Download now</Text>
                  <Text style={styles.ctaUrl}>onlyonetoday.com</Text>
                  </View>
                </View>
              </View>

              {/* Decorative Corners */}
              <View style={[styles.cornerTL, { borderColor: tierColors.primary }]} />
              <View style={[styles.cornerTR, { borderColor: tierColors.primary }]} />
              <View style={[styles.cornerBL, { borderColor: tierColors.primary }]} />
              <View style={[styles.cornerBR, { borderColor: tierColors.primary }]} />
            </LinearGradient>
          </View>

          {/* Action Buttons */}
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
    position: 'relative',
    borderRadius: 24,
    paddingHorizontal: scale(24),
    paddingTop: scale(28),
    paddingBottom: scale(24),
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    width: '100%',
  },
  starsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
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
    opacity: 0.8,
  },
  brandTagline: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: scale(3),
    opacity: 0.95,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    gap: scale(20),
    alignItems: 'center',
  },
  quoteContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  quoteText: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: moderateScale(28, 0.3),
    textAlign: 'center',
    letterSpacing: scale(0.2),
  },
  achievementBadge: {
    borderRadius: scale(16),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  achievementGradient: {
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(14),
    borderRadius: scale(16),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  achievementEmoji: {
    fontSize: moderateScale(28, 0.3),
    textAlign: 'center',
    marginBottom: scale(4),
  },
  achievementRank: {
    fontSize: moderateScale(15, 0.2),
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: scale(2),
    textAlign: 'center',
    lineHeight: moderateScale(16, 0.2),
  },
  resultCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  resultMain: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(120),
    marginBottom: scale(6),
  },
  resultMainNumber: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '800',
    letterSpacing: scale(-0.3),
    textAlign: 'center',
    marginBottom: scale(2),
  },
  resultMainLabel: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '600',
    letterSpacing: scale(0.1),
    textAlign: 'center',
  },
  resultSubtext: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.1),
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: scale(20),
  },
  userInfoSection: {
    alignItems: 'center',
    gap: scale(6),
    marginBottom: scale(4),
    marginTop: 'auto',
  },
  usernameText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    letterSpacing: scale(0.3),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  locationText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.2),
  },
  dateText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.2),
    color: 'rgba(255, 255, 255, 0.4)',
  },
  footer: {
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    marginTop: scale(4),
  },
  welcomeTitle: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  welcomeMessage: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: moderateScale(18, 0.2),
    paddingHorizontal: scale(12),
  },
  ctaContainer: {
    marginTop: scale(4),
    alignItems: 'center',
    gap: scale(4),
  },
  ctaText: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },
  ctaUrl: {
    fontSize: moderateScale(15, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.2,
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
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
    borderBottomRightRadius: 8,
    opacity: 0.5,
  },
  closeButtonTopRight: {
    position: 'absolute',
    top: scale(50),
    right: scale(20),
    padding: scale(12),
    zIndex: 1000,
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

