/**
 * Dream Card Component
 * Dreamy & immersive card with night sky atmosphere
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Twinkling star component
const TwinklingStar = ({ delay = 0, size = 2, top = '50%', left = '50%' }: { 
  delay?: number; 
  size?: number;
  top?: string;
  left?: string;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const starScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 1500 + Math.random() * 1000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(starScale, {
              toValue: 1.2,
              duration: 1500 + Math.random() * 1000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(starScale, {
              toValue: 0.8,
              duration: 1500 + Math.random() * 1000,
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
        {
          position: 'absolute',
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#ffffff',
          shadowColor: '#a78bfa',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          opacity,
          transform: [{ scale: starScale }],
        },
      ]}
    />
  );
};

// Large moon with subtle glow (no background)
const DreamMoon = () => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        right: scale(20),
        top: scale(30),
        transform: [{ translateY }],
        opacity: 0.3,
      }}
    >
      {/* Moon */}
      <Svg width={scale(60)} height={scale(60)} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="#d4c5f9"
          opacity={0.8}
        />
      </Svg>
    </Animated.View>
  );
};

interface DreamCardProps {
  onPress: () => void;
}

export default function DreamCard({ onPress }: DreamCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.dreamCardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.dreamCardWrapper}>
          <LinearGradient
            colors={['#1e1456', '#2a1b5c', '#1a1447', '#251a5a']}
            locations={[0, 0.4, 0.7, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dreamCardGradient}
          >
            {/* Radial gradient overlay for depth */}
            <View style={styles.radialOverlay}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.15)', 'transparent', 'rgba(45, 27, 105, 0.3)']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.radialGradient}
              />
            </View>

            {/* Twinkling stars background */}
            <View style={styles.starsContainer} pointerEvents="none">
              <TwinklingStar delay={0} size={2.5} top="15%" left="12%" />
              <TwinklingStar delay={200} size={1.5} top="25%" left="85%" />
              <TwinklingStar delay={400} size={3} top="45%" left="20%" />
              <TwinklingStar delay={600} size={1.5} top="55%" left="75%" />
              <TwinklingStar delay={800} size={2} top="35%" left="55%" />
              <TwinklingStar delay={1000} size={1.5} top="75%" left="30%" />
              <TwinklingStar delay={1200} size={2.5} top="12%" left="65%" />
              <TwinklingStar delay={1400} size={1.5} top="65%" left="88%" />
              <TwinklingStar delay={1600} size={2} top="80%" left="50%" />
              <TwinklingStar delay={1800} size={1.5} top="28%" left="40%" />
            </View>

            {/* Floating moon */}
            <DreamMoon />

            {/* Content */}
            <View style={styles.dreamCardContent}>
              {/* Title and subtitle */}
              <View style={styles.dreamCardHeader}>
                <Text style={styles.dreamCardTitle}>Dreams</Text>
                <Text style={styles.dreamCardSubtitle}>
                  Connect through your subconscious
                </Text>
              </View>

              {/* Features - 2x2 Grid */}
              <View style={styles.featuresGrid}>
                <View style={styles.featureRow}>
                  <View style={styles.featureItem}>
                    <LinearGradient
                      colors={['#a78bfa', '#8b5cf6']}
                      style={styles.featureDot}
                    />
                    <Text style={styles.featureText}>AI Interpretation</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <LinearGradient
                      colors={['#a78bfa', '#8b5cf6']}
                      style={styles.featureDot}
                    />
                    <Text style={styles.featureText}>Dream Matching</Text>
                  </View>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.featureItem}>
                    <LinearGradient
                      colors={['#a78bfa', '#8b5cf6']}
                      style={styles.featureDot}
                    />
                    <Text style={styles.featureText}>24h Dream Circles</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <LinearGradient
                      colors={['#a78bfa', '#8b5cf6']}
                      style={styles.featureDot}
                    />
                    <Text style={styles.featureText}>Symbol Tracking</Text>
                  </View>
                </View>
              </View>

              {/* Coming soon */}
              <LinearGradient
                colors={['rgba(167, 139, 250, 0.25)', 'rgba(139, 92, 246, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.comingSoonContainer}
              >
                <Text style={styles.comingSoonText}>Coming soon</Text>
                <Text style={styles.comingSoonArrow}>→</Text>
              </LinearGradient>
            </View>

            {/* Mist overlay at bottom */}
            <LinearGradient
              colors={['transparent', 'rgba(26, 20, 71, 0.8)', 'rgba(26, 20, 71, 0.95)']}
              locations={[0, 0.5, 1]}
              style={styles.mistOverlay}
              pointerEvents="none"
            />
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dreamCardContainer: {
    marginBottom: scale(20),
  },
  dreamCardWrapper: {
    borderRadius: scale(20),
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  dreamCardGradient: {
    padding: scale(24),
    position: 'relative',
    minHeight: scale(200),
  },
  radialOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialGradient: {
    flex: 1,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dreamCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  dreamCardHeader: {
    marginBottom: scale(16),
  },
  dreamCardTitle: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: scale(4),
  },
  dreamCardSubtitle: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    lineHeight: moderateScale(18, 0.2),
    letterSpacing: 0.2,
  },
  featuresGrid: {
    flexDirection: 'column',
    gap: scale(8),
    marginBottom: scale(16),
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    flex: 1,
  },
  featureDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
  },
  featureText: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: 0.2,
    flex: 1,
  },
  comingSoonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(16),
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    marginTop: scale(4),
  },
  comingSoonText: {
    fontSize: moderateScale(13, 0.2),
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  comingSoonArrow: {
    fontSize: moderateScale(18, 0.2),
    color: '#d4c5f9',
    fontWeight: '700',
  },
  mistOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(80),
  },
});

