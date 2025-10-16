/**
 * Button Component
 * Based on screen_designs/postCreationScreen/code.html
 * Supports primary (gradient), secondary (outline), and ghost variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@config/theme.config';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export default function Button({
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Primary Button - Gradient (from HTML: bg-gradient-to-r from-[#8A2BE2] to-[#4A00E0])
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={['#8A2BE2', '#4A00E0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryText}>{children}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Secondary Button - Outline (from HTML: glassmorphism style)
  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[
          styles.container,
          styles.secondaryContainer,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.secondaryText}>{children}</Text>
        )}
      </TouchableOpacity>
    );
  }

  // Ghost Button - Subtle background
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        styles.ghostContainer,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text style={styles.ghostText}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    // Glow effect from HTML
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  ghostContainer: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

