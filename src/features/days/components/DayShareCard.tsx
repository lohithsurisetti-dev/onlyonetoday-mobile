/**
 * Day-Themed Share Card Component
 * Beautiful, dynamic shareable card for themed day posts
 * Adapts colors based on day theme
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import DayIcon from './DayIcon';
import { DayPost } from '../types';

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

// Helper function to convert hex color to dark background gradient
const getDayThemeBackgroundGradient = (color: string): string => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Create a very dark version (reduce brightness by ~85%)
  const darkR = Math.floor(r * 0.15);
  const darkG = Math.floor(g * 0.15);
  const darkB = Math.floor(b * 0.15);
  
  // Convert back to hex
  return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
};

type DayShareCardProps = {
  visible: boolean;
  onClose: () => void;
  post: DayPost;
  dayTheme: any;
};

// Animated floating star for background
const FloatingStar = ({ delay = 0, size = 2 }: { delay?: number; size?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -20,
            duration: 2000 + Math.random() * 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#ffffff',
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export default function DayShareCard({ visible, onClose, post, dayTheme }: DayShareCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const cardRef = useRef<View>(null);

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
              colors={['#0a0a1a', '#1a1a2e', getDayThemeBackgroundGradient(dayTheme.color) || '#0a0a1a']}
              style={styles.cardGradient}
            >
              {/* Floating Stars Background */}
              <View style={styles.starsContainer} pointerEvents="none">
                {[...Array(20)].map((_, i) => (
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

              {/* Content */}
              <View style={styles.cardContent}>
                {/* Top Section */}
                <View style={styles.topSection}>
                  {/* Header - Match ShareCard */}
                <View style={styles.cardHeader}>
                  <Text style={styles.brandName}>ONLYONE</Text>
                  <View style={[styles.brandDivider, { backgroundColor: dayTheme.color }]} />
                  <Text style={styles.brandTagline}>TODAY</Text>
                </View>

                {/* Day Icon & Name */}
                <View style={styles.daySection}>
                  <View style={[styles.dayIconGlow, { backgroundColor: `${dayTheme.color}40` }]} />
                    <DayIcon icon={dayTheme.icon} size={scale(50)} color={dayTheme.color} />
                  <Text style={[styles.dayName, { color: dayTheme.color }]}>
                    {dayTheme.name}
                  </Text>
                  <Text style={styles.dayVibe}>{dayTheme.vibe}</Text>
                </View>

                {/* Content Quote */}
                <View style={styles.quoteSection}>
                    <View style={styles.quoteBlur}>
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                      style={styles.quoteGradient}
                    >
                      <Text style={styles.quoteText} numberOfLines={5}>
                        "{post.content}"
                      </Text>
                    </LinearGradient>
                    </View>
                  </View>
                </View>

                {/* Bottom Section - Username, Date, Location, Footer */}
                <View style={styles.bottomSection}>
                  {/* Username and Date Section */}
                  <View style={styles.userInfoSection}>
                    <Text style={[styles.usernameText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                      @{post.username}
                    </Text>
                    <Text style={[styles.dateText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                      {new Date(post.timestamp).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Text>
                    {post.location && (
                      <View style={styles.locationInfoRow}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={dayTheme.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                          <Circle cx="12" cy="10" r="3" stroke={dayTheme.color} strokeWidth={1.5} />
                        </Svg>
                        <Text style={[styles.locationText, { color: 'rgba(255, 255, 255, 0.5)' }]}>
                          {post.location}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Welcoming Footer - Premium */}
                  <View style={[styles.footer, { borderTopColor: 'rgba(255, 255, 255, 0.1)' }]}>
                  <View style={styles.footerContent}>
                      <Text style={[styles.welcomeMessage, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                        Join the community. Every moment counts.
                      </Text>
                      <View style={styles.footerBrand}>
                        <View style={[styles.footerDot, { backgroundColor: dayTheme.color }]} />
                        <Text style={[styles.footerLink, { color: dayTheme.color }]}>onlyonetoday.com</Text>
                        <View style={[styles.footerDot, { backgroundColor: dayTheme.color }]} />
                    </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Camera Lens Corner Accents */}
              <View style={[styles.cornerTL, { borderColor: dayTheme.color }]} />
              <View style={[styles.cornerTR, { borderColor: dayTheme.color }]} />
              <View style={[styles.cornerBL, { borderColor: dayTheme.color }]} />
              <View style={[styles.cornerBR, { borderColor: dayTheme.color }]} />
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.8}>
              <LinearGradient
                colors={[`${dayTheme.color}30`, `${dayTheme.color}15`]}
                style={styles.actionButtonGradient}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.actionButtonText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleSaveImage} activeOpacity={0.8}>
              <LinearGradient
                colors={[`${dayTheme.color}30`, `${dayTheme.color}15`]}
                style={styles.actionButtonGradient}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.actionButtonText}>Save</Text>
              </LinearGradient>
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
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonTopRight: {
    position: 'absolute',
    top: scale(50),
    right: scale(20),
    zIndex: 1000,
    padding: scale(12),
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    borderRadius: scale(24),
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cardGradient: {
    width: '100%',
    height: '100%',
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    padding: scale(20),
    paddingTop: scale(24),
    paddingBottom: scale(16),
    zIndex: 2,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bottomSection: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  
  // Header - Match ShareCard
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

  // Day Section
  daySection: {
    alignItems: 'center',
    gap: scale(8),
    marginTop: scale(12),
    marginBottom: scale(8),
  },
  dayIconGlow: {
    position: 'absolute',
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    opacity: 0.3,
    top: scale(5),
  },
  dayName: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  dayVibe: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Quote Section
  quoteSection: {
    flex: 1,
    justifyContent: 'center',
    marginTop: scale(20),
    marginBottom: scale(10),
  },
  quoteBlur: {
    borderRadius: scale(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quoteGradient: {
    padding: scale(20),
    minHeight: scale(80),
  },
  quoteText: {
    fontSize: moderateScale(16, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(24, 0.2),
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Footer - Match ShareCard
  footer: {
    paddingTop: scale(12),
    borderTopWidth: 1.5,
    width: '100%',
  },
  footerContent: {
    alignItems: 'center',
  },
  userInfoSection: {
    alignItems: 'center',
    marginTop: scale(8),
    marginBottom: scale(12),
    gap: scale(4),
  },
  usernameText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  dateText: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
    letterSpacing: 0.2,
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
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  welcomeMessage: {
    fontSize: moderateScale(11, 0.2),
    textAlign: 'center',
    lineHeight: moderateScale(17, 0.2),
    marginBottom: scale(12),
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footerBrandRow: {
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

  // Camera Lens Corner Accents
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

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: scale(20),
    paddingHorizontal: scale(20),
  },
  actionButton: {
    flex: 1,
    borderRadius: scale(16),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(16),
  },
  actionButtonText: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

