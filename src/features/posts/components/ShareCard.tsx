/**
 * Premium Share Card Component
 * Beautiful, dynamic shareable card for social media
 * Adapts colors based on tier
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop, G } from 'react-native-svg';
import { getCosmicColors } from '@/shared/constants/cosmicColorPalette';
import { useAuthStore } from '@/lib/stores/authStore';

// Floating star component for subtle background animation
const FloatingStar = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

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
              toValue: 0.3,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
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
          transform: [{ translateY }, { translateX }, { scale }],
          opacity,
        },
      ]}
    />
  );
};

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
  console.warn('Share/Save features require a development build. Not available in Expo Go.');
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.4; // Portrait aspect ratio

const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type ShareCardProps = {
  visible: boolean;
  onClose: () => void;
  data: {
    // V2: Narrative fields
    narrative?: string;
    matchCount?: number;
    totalInScope?: number;
    emotionalTone?: 'unique' | 'shared' | 'common';
    celebration?: string;
    badge?: string;
    // Legacy fields (for backward compatibility)
    percentile?: {
      value: number;
      tier: string;
      displayText: string;
      comparison: string;
      badge: string;
      message: string;
    };
    content: string;
    vibe?: string;
    scope: string;
    locationCity?: string | null;
    locationState?: string | null;
    locationCountry?: string | null;
    locationDisplay?: string | null;
    inputType: string;
    temporal?: {
      week: { matches: number; total: number; comparison: string };
      allTime: { matches: number; total: number; comparison: string };
    };
  };
  tierColors: {
    primary: string;
    secondary: string;
    gradient: string[];
    glow: string;
    background: string;
    backgroundGradient: string;
  };
};

export default function ShareCard({ visible, onClose, data, tierColors }: ShareCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const cardRef = useRef<View>(null);
  
  // Get username from auth store
  const { user } = useAuthStore();
  
  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // Get cosmic colors for varied, cohesive design
  const cosmicColors = getCosmicColors(tierColors);

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

  // V2: Use narrative if available, otherwise fallback to percentile
  const hasNarrative = !!data.narrative;
  const radius = 55;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const progress = data.percentile ? 1 - data.percentile.value / 100 : 0;

  const handleShare = async () => {
    if (!captureRef || !Sharing) {
      Alert.alert('Not Available', 'Share feature requires a development build. Please build the app with "npx expo prebuild" and "npx expo run:ios"');
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
      Alert.alert('Not Available', 'Save feature requires a development build. Please build the app with "npx expo prebuild" and "npx expo run:ios"');
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
          <View ref={cardRef} style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: '#0a0a1a' }]}>
            <LinearGradient
              colors={['#0a0a1a', '#1a1a2e', cosmicColors.theme.backgroundGradient || '#0a0a1a']}
              style={styles.cardGradient}
            >
              {/* Floating Stars Background */}
              <View style={styles.starsContainer} pointerEvents="none">
                {[...Array(12)].map((_, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  >
                    <FloatingStar delay={i * 200} />
                  </View>
                ))}
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                {/* Top Section */}
                <View style={styles.topSection}>
                {/* Header - Premium */}
                <View style={styles.cardHeader}>
                  <Text style={styles.brandName}>ONLYONE</Text>
                    <View style={[styles.brandDivider, { backgroundColor: cosmicColors.theme.primary }]} />
                  <Text style={styles.brandTagline}>TODAY</Text>
                </View>

                  {/* Action and Results - Vertically Centered Together */}
                  <View style={styles.actionResultsContainer}>
                {/* User Action - THE HERO */}
                <View style={styles.actionHeroSection}>
                  <Text style={[styles.actionText, { color: cosmicColors.neutral.text.primary }]} numberOfLines={4}>
                    "{data.content}"
                  </Text>
                    </View>
                  
                    {/* Result Numbers Display - More Descriptive */}
                    {data.matchCount !== undefined ? (
                    <View style={styles.shareNumbersContainer}>
                        {(() => {
                          // Only truly unique if matchCount is 1 AND totalInScope is exactly 1 (not 0 or null)
                          const isTrulyUnique = (data.matchCount === 1 && data.totalInScope === 1);
                          const displayMatchCount = data.matchCount || 1;
                          // If totalInScope is 0/null but we have matchCount > 1, use matchCount as minimum
                          const displayTotal = isTrulyUnique 
                            ? 1 
                            : (data.totalInScope && data.totalInScope > 0 
                              ? data.totalInScope 
                              : Math.max(displayMatchCount, 1));
                          const percentage = isTrulyUnique 
                            ? 100
                            : (displayTotal > 0
                              ? ((displayMatchCount / displayTotal) * 100)
                              : 0);
                          
                          return (
                            <View style={styles.shareResultCard}>
                              <View style={[styles.shareResultMain, {
                                backgroundColor: `${cosmicColors.theme.primary}15`,
                                borderColor: `${cosmicColors.theme.primary}30`,
                              }]}>
                                <Text style={[styles.shareResultMainNumber, { color: cosmicColors.theme.primary }]}>
                                  {displayMatchCount.toLocaleString()}
                        </Text>
                                <Text style={[styles.shareResultMainLabel, { color: cosmicColors.neutral.text.secondary }]}>
                                  {isTrulyUnique ? 'First!' : `of ${displayTotal.toLocaleString()} people`}
                        </Text>
                      </View>
                              <Text style={[styles.shareResultSubtext, { color: cosmicColors.neutral.text.tertiary }]}>
                                {isTrulyUnique 
                                  ? "You're the first to share this!"
                                  : `${percentage.toFixed(1)}% of people did this today`
                                }
                      </Text>
                    </View>
                          );
                        })()}
                      </View>
                    ) : null}
                  </View>

                  {/* Legacy: Percentile Ring (fallback) */}
                  {data.matchCount === undefined && data.percentile ? (
                  <View style={styles.ringSection}>
                    {/* Glow */}
                    <View style={[styles.ringGlow, { backgroundColor: tierColors.glow }]} />
                    
                    <Svg width={140} height={140}>
                      <Defs>
                        <SvgLinearGradient id="shareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <Stop offset="0%" stopColor={tierColors.primary} stopOpacity="1" />
                          <Stop offset="50%" stopColor={tierColors.secondary} stopOpacity="1" />
                          <Stop offset="100%" stopColor={tierColors.primary} stopOpacity="0.9" />
                        </SvgLinearGradient>
                      </Defs>
                      
                      {/* Background circle */}
                      <Circle
                        cx={70}
                        cy={70}
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      
                      {/* Progress circle */}
                      {data.percentile && (
                        <Circle
                          cx={70}
                          cy={70}
                          r={radius}
                          stroke="url(#shareGrad)"
                          strokeWidth={strokeWidth}
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference * progress}
                          strokeLinecap="round"
                          rotation="-90"
                          origin="70, 70"
                        />
                      )}
                    </Svg>

                    {/* Center Content */}
                    {data.percentile && (
                      <View style={styles.ringCenter}>
                        <Text style={styles.centerPercentile}>{data.percentile.displayText}</Text>
                        <View style={[styles.centerTierBadge, { 
                          backgroundColor: `${tierColors.primary}30`,
                          borderColor: `${tierColors.primary}80`,
                        }]}>
                          <Text style={styles.centerTierText}>{data.percentile.tier?.toUpperCase() || 'UNKNOWN'}</Text>
                        </View>
                      </View>
                    )}
                    </View>
                  ) : null}
                </View>

                {/* Bottom Section - Username, Date, Location, Footer */}
                <View style={styles.bottomSection}>
                  {/* Username and Date Section */}
                  <View style={styles.userInfoSection}>
                    {user?.username && (
                      <Text style={[styles.usernameText, { color: cosmicColors.neutral.text.secondary }]}>
                        @{user.username}
                      </Text>
                    )}
                    <Text style={[styles.dateText, { color: cosmicColors.neutral.text.secondary }]}>
                      {formattedDate}
                    </Text>
                    {/* Location Display */}
                    {(data.locationDisplay || (data.locationCity || data.locationState || data.locationCountry)) && (
                      <View style={styles.locationInfoRow}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={cosmicColors.theme.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                          <Circle cx="12" cy="10" r="3" stroke={cosmicColors.theme.primary} strokeWidth={1.5} />
                        </Svg>
                        <Text style={[styles.locationText, { color: cosmicColors.neutral.text.tertiary }]}>
                          {data.locationDisplay || 
                            [data.locationCity, data.locationState, data.locationCountry]
                              .filter(Boolean)
                              .join(', ') || 
                            data.scope.charAt(0).toUpperCase() + data.scope.slice(1)}
                        </Text>
                  </View>
                )}
                  </View>

                {/* Welcoming Footer - Premium */}
                <View style={[styles.footer, { borderTopColor: cosmicColors.neutral.border }]}>
                  <View style={styles.footerContent}>
                    <Text style={[styles.welcomeMessage, { color: cosmicColors.neutral.text.secondary }]}>
                      Join the community. Every moment counts.
                    </Text>
                    <View style={styles.footerBrand}>
                        <View style={[styles.footerDot, { backgroundColor: cosmicColors.theme.primary }]} />
                        <Text style={[styles.footerLink, { color: cosmicColors.theme.primary }]}>onlyonetoday.com</Text>
                        <View style={[styles.footerDot, { backgroundColor: cosmicColors.theme.primary }]} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Decorative Corner Accents - Theme colors */}
              <View style={[styles.cornerTL, { borderColor: cosmicColors.theme.primary }]} />
              <View style={[styles.cornerTR, { borderColor: cosmicColors.theme.secondary }]} />
              <View style={[styles.cornerBL, { borderColor: cosmicColors.theme.primary }]} />
              <View style={[styles.cornerBR, { borderColor: cosmicColors.theme.secondary }]} />
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
                <Text style={styles.actionButtonText}>Save Image</Text>
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
    borderRadius: 24, // Match card border radius
  },
  cardContent: {
    flex: 1,
    padding: scale(20),
    paddingTop: scale(24),
    paddingBottom: scale(16),
    zIndex: 2,
    position: 'relative',
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  actionResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomSection: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  brandName: {
    fontSize: moderateScale(28, 0.3),
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
    marginVertical: scale(10),
    opacity: 0.8,
  },
  brandTagline: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: scale(3),
    opacity: 0.95,
  },
  ringSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(24),
    position: 'relative',
  },
  ringGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.12,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Action Hero Section - THE MAIN FOCUS
  actionHeroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(20),
    paddingHorizontal: scale(12),
    width: '100%',
  },
  actionText: {
    fontSize: moderateScale(28, 0.4),
    fontWeight: '800',
    lineHeight: moderateScale(38, 0.4),
    textAlign: 'center',
    letterSpacing: 0.2,
    fontStyle: 'italic',
  },
  shareNumbersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  shareResultCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  shareResultMain: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    borderRadius: scale(16),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(180),
    marginBottom: scale(8),
  },
  shareResultMainNumber: {
    fontSize: moderateScale(32, 0.4),
    fontWeight: '900',
    letterSpacing: scale(-0.5),
    textAlign: 'center',
    marginBottom: scale(4),
  },
  shareResultMainLabel: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    letterSpacing: scale(0.2),
    textAlign: 'center',
    opacity: 0.9,
  },
  shareResultSubtext: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.1),
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: scale(20),
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  userInfoSection: {
    alignItems: 'center',
    marginTop: scale(8),
    marginBottom: scale(12),
    gap: scale(4),
  },
  locationInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    marginTop: scale(2),
  },
  locationText: {
    fontSize: moderateScale(10, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.2),
    opacity: 0.6,
  },
  usernameText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    letterSpacing: scale(0.3),
    opacity: 0.8,
  },
  dateText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
    letterSpacing: scale(0.2),
    opacity: 0.6,
  },
  // V2: Narrative section - Supporting, not dominant
  narrativeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(24),
    paddingHorizontal: scale(20),
    width: '100%',
  },
  narrativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginBottom: scale(14),
    width: '100%',
    justifyContent: 'center',
  },
  narrativeBadgeEmoji: {
    fontSize: moderateScale(32, 0.3),
  },
  narrativeStoryText: {
    flex: 1,
    fontSize: moderateScale(16, 0.25),
    fontWeight: '600',
    lineHeight: moderateScale(22, 0.25),
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  matchCountBadge: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    borderRadius: scale(18),
    borderWidth: 1.5,
  },
  matchCountText: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  centerPercentile: {
    fontSize: moderateScale(26, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    marginBottom: scale(8),
  },
  centerTierBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(8),
    borderWidth: 1.5,
  },
  centerTierText: {
    fontSize: moderateScale(8, 0.2),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.2,
  },
  quoteSection: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    borderRadius: scale(18),
    borderWidth: 1.5,
    marginBottom: scale(20),
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: scale(12),
    left: scale(16),
    opacity: 0.3,
  },
  quoteText: {
    fontSize: moderateScale(16, 0.25),
    fontWeight: '500',
    lineHeight: moderateScale(24, 0.25),
    textAlign: 'center',
    fontStyle: 'italic',
    paddingTop: scale(4),
  },
  footer: {
    paddingTop: scale(12),
    borderTopWidth: 1.5,
    width: '100%',
  },
  footerContent: {
    alignItems: 'center',
  },
  welcomeMessage: {
    fontSize: moderateScale(11, 0.2),
    textAlign: 'center',
    lineHeight: moderateScale(17, 0.2),
    marginBottom: scale(12),
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  footerLink: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
    opacity: 0.4,
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
    opacity: 0.4,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
    opacity: 0.4,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
    opacity: 0.4,
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
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(14),
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

