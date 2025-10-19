/**
 * Badge Component
 * Based on screen_designs tier badges
 * Used for displaying tier names, rankings, and scope indicators
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { getTierColors } from '@/shared/constants/tierColors';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'tier' | 'scope' | 'type' | 'default';
  color?: string;
  style?: ViewStyle;
}

export default function Badge({ children, variant = 'default', color, style }: BadgeProps) {
  const getColorForTier = () => {
    if (color) return color;

    // Use centralized tier colors
    const text = String(children).toLowerCase();
    if (text.includes('elite')) return getTierColors('elite').primary;
    if (text.includes('rare')) return getTierColors('rare').primary;
    if (text.includes('unique')) return getTierColors('unique').primary;
    if (text.includes('notable')) return getTierColors('notable').primary;
    if (text.includes('popular')) return getTierColors('popular').primary;
    if (text.includes('beloved')) return getTierColors('beloved').primary;
    return getTierColors('beloved').primary; // fallback
  };

  const badgeColor = variant === 'tier' ? getColorForTier() : color || '#8347eb';
  const textColor = '#ffffff'; // Always white text for consistency

  return (
    <View
      style={[
        styles.container,
        variant === 'tier' && styles.tierContainer,
        variant === 'scope' && styles.scopeContainer,
        variant === 'type' && styles.typeContainer,
        { backgroundColor: variant === 'tier' ? badgeColor : `${badgeColor}20` },
        { borderColor: variant === 'tier' ? 'transparent' : badgeColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: variant === 'tier' ? textColor : badgeColor },
          variant === 'tier' && styles.tierText,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tierContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scopeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

