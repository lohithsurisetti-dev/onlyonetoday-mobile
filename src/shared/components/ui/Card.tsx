/**
 * Card Component with Glassmorphism Effect
 * Based on screen_designs HTML: .glassmorphism class
 * background: rgba(255, 255, 255, 0.1)
 * backdrop-filter: blur(10px)
 * border: 1px solid rgba(255, 255, 255, 0.2)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
  borderWidth?: number;
  padding?: number;
  variant?: 'glass' | 'solid';
}

export default function Card({
  children,
  style,
  borderColor,
  borderWidth = 0,
  padding = 16,
  variant = 'glass',
}: CardProps) {
  if (variant === 'glass') {
    return (
      <BlurView intensity={20} tint="dark" style={[styles.glassContainer, style]}>
        <View
          style={[
            styles.innerContainer,
            { padding },
            borderColor && borderWidth
              ? {
                  borderLeftWidth: borderWidth,
                  borderLeftColor: borderColor,
                }
              : null,
          ]}
        >
          {children}
        </View>
      </BlurView>
    );
  }

  // Solid variant - no blur
  return (
    <View
      style={[
        styles.solidContainer,
        { padding },
        borderColor && borderWidth
          ? {
              borderLeftWidth: borderWidth,
              borderLeftColor: borderColor,
            }
          : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  solidContainer: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  innerContainer: {
    // Padding is dynamic via props
  },
});

