/**
 * Create Dream Screen (Placeholder)
 * Beautiful placeholder for upcoming dreams feature
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Floating star component
const FloatingStar = ({ delay = 0, size = 2 }: { delay?: number; size?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1500,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 1500,
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
          backgroundColor: '#a78bfa',
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
};

// Moon icon
const MoonIcon = ({ size = 80 }: { size?: number }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow effect */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size * 1.5,
          height: size * 1.5,
          borderRadius: (size * 1.5) / 2,
          backgroundColor: '#a78bfa',
          opacity: glowOpacity,
        }}
      />
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="#a78bfa"
          opacity={0.9}
        />
      </Svg>
    </View>
  );
};

interface CreateDreamScreenProps {
  navigation: any;
}

export default function CreateDreamScreen({ navigation }: CreateDreamScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']}
        style={styles.gradient}
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
              <FloatingStar delay={i * 200} size={1.5 + Math.random() * 2} />
            </View>
          ))}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#ffffff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Moon Icon */}
          <MoonIcon size={scale(100)} />

          {/* Title */}
          <Text style={styles.title}>Dreams</Text>
          <Text style={styles.subtitle}>Coming Soon</Text>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Share your dreams, nightmares, and daydreams with the world.
            </Text>
            <Text style={styles.description}>
              Discover how your subconscious connects with others through AI-powered dream matching.
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>AI-powered dream interpretation</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Find similar dreams from others</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Track dream symbols & emotions</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Personal dream insights</Text>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>
              This feature is being crafted with care and will be available soon.
            </Text>
          </View>

          {/* Back to Home Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#a78bfa', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.homeButtonGradient}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradient: {
    flex: 1,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: scale(60),
    left: scale(20),
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(30),
  },
  title: {
    fontSize: moderateScale(36, 0.3),
    fontWeight: '800',
    color: '#ffffff',
    marginTop: scale(30),
    marginBottom: scale(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(18, 0.2),
    fontWeight: '600',
    color: '#a78bfa',
    marginBottom: scale(30),
    textAlign: 'center',
  },
  descriptionContainer: {
    gap: scale(12),
    marginBottom: scale(40),
  },
  description: {
    fontSize: moderateScale(15, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: moderateScale(22, 0.2),
  },
  featuresList: {
    width: '100%',
    gap: scale(16),
    marginBottom: scale(40),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  featureDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#a78bfa',
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  featureText: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    flex: 1,
  },
  ctaContainer: {
    marginBottom: scale(40),
  },
  ctaText: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: moderateScale(20, 0.2),
    fontStyle: 'italic',
  },
  homeButton: {
    borderRadius: scale(16),
    overflow: 'hidden',
    width: '100%',
  },
  homeButtonGradient: {
    paddingVertical: scale(16),
    paddingHorizontal: scale(32),
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

