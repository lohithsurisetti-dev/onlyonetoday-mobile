/**
 * Badge Component
 * Based on screen_designs tier badges
 * Used for displaying tier names, rankings, and scope indicators
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'tier' | 'scope' | 'type' | 'default';
  color?: string;
  style?: ViewStyle;
}

export default function Badge({ children, variant = 'default', color, style }: BadgeProps) {
  const getTierColor = () => {
    if (color) return color;

    // Default tier colors
    const text = String(children).toLowerCase();
    if (text.includes('legendary') || text.includes('elite')) return '#FFD700';
    if (text.includes('epic') || text.includes('rare')) return '#9400D3';
    if (text.includes('unique')) return '#0070DD';
    if (text.includes('notable') || text.includes('uncommon')) return '#1E8449';
    return '#979797'; // common
  };

  const badgeColor = variant === 'tier' ? getTierColor() : color || '#8347eb';
  const textColor = variant === 'tier' && badgeColor === '#FFD700' ? '#000000' : '#ffffff';

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

