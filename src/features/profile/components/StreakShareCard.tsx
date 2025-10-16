/**
 * Streak Share Card Component
 * Premium shareable card for OOT streak
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
import Svg, { Path } from 'react-native-svg';

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

type StreakShareCardProps = {
  visible: boolean;
  onClose: () => void;
  streak: number;
  username: string;
  firstName: string;
  lastName: string;
};

export default function StreakShareCard({ visible, onClose, streak, username, firstName, lastName }: StreakShareCardProps) {
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
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
              // Cosmic gradient with supernova pink accent
              colors={['#0b0b18', '#171a2c', '#2a1220']}
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

              {/* Content */}
              <View style={styles.cardContent}>
                {/* Header - Moved Up */}
                <View style={styles.cardHeader}>
                  <Text style={styles.brandName}>ONLYONE</Text>
                  <View style={styles.brandDivider} />
                  <Text style={styles.brandTagline}>TODAY</Text>
                </View>

                {/* Streak Display */}
                <View style={styles.streakSection}>
                  <View style={styles.flameContainer}>
                    <Svg width={160} height={160} viewBox="0 0 24 24" fill="none">
                      <Path 
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" 
                        stroke="#fb7185" 
                        strokeWidth={1.5}
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        fill="rgba(251, 113, 133, 0.2)"
                      />
                    </Svg>
                    <View style={styles.flameGlow} />
                    {/* Number centered inside flame */}
                    <View style={styles.flameCenterContent}>
                      <Text
                        style={[
                          styles.streakNumber,
                          {
                            // Fit 1–3 digit numbers nicely within the larger flame
                            fontSize:
                              String(streak).length >= 3
                                ? moderateScale(40, 0.4)
                                : String(streak).length === 2
                                ? moderateScale(48, 0.4)
                                : moderateScale(56, 0.4),
                          },
                        ]}
                      >
                        {streak}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.streakLabel}>DAY OOT STREAK</Text>
                  
                  {/* User Info */}
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{firstName} {lastName}</Text>
                    <Text style={styles.userHandle}>@{username}</Text>
                  </View>
                </View>

                {/* Footer with Message & URL */}
                <View style={styles.footer}>
                  <Text style={styles.footerMessage}>Join the community. Track your uniqueness.</Text>
                  <Text style={styles.footerLink}>onlyonetoday.com</Text>
                </View>
              </View>

              {/* Decorative Corner Accents */}
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </LinearGradient>
          </View>

          {/* Close Button below card */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <BlurView intensity={60} tint="dark" style={styles.closeButtonBlur}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </BlurView>
          </TouchableOpacity>

          {/* Action Buttons matching ShareCard layout */}
          <View style={[styles.actionButtons, { width: CARD_WIDTH }]}>
            <TouchableOpacity style={[styles.actionButton, { flex: 1 }]} activeOpacity={0.8} onPress={handleShare}>
              <View style={styles.actionButtonOutline}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.actionButtonText}>Share</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { flex: 1 }]} activeOpacity={0.8} onPress={handleSaveImage}>
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
  cardContent: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(10),
    paddingBottom: scale(12),
    justifyContent: 'space-between',
    zIndex: 1,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: scale(8),
    marginTop: scale(4),
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
    marginVertical: scale(10),
    backgroundColor: '#fb7185',
    opacity: 0.8,
  },
  brandTagline: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: scale(3),
    opacity: 0.95,
  },
  streakSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: scale(12),
    minHeight: scale(280),
    gap: scale(10),
  },
  flameContainer: {
    position: 'relative',
    marginBottom: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameGlow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#fb7185',
    opacity: 0.15,
  },
  flameCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: scale(8) }],
  },
  streakNumber: {
    fontSize: moderateScale(64, 0.4),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -2,
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  streakLabel: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '700',
    color: '#fb7185',
    letterSpacing: scale(3),
    marginTop: scale(6),
    marginBottom: scale(8),
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    gap: scale(4),
  },
  userName: {
    fontSize: moderateScale(16, 0.2),
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  userHandle: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    paddingTop: scale(16),
    paddingBottom: scale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    gap: scale(8),
  },
  footerMessage: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  footerLink: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#fb7185',
    borderRadius: 8,
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#fb7185',
    borderRadius: 8,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#fb7185',
    borderRadius: 8,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#fb7185',
    borderRadius: 8,
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
  },
  actionButton: {
    borderRadius: scale(14),
    overflow: 'hidden',
  },
  actionButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(14),
    borderRadius: scale(14),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  closeBetween: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBetweenBlur: {
    borderRadius: scale(22),
    overflow: 'hidden',
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

