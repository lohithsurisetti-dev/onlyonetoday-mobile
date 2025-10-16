/**
 * Loading Component
 * Displays activity indicator with optional text
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '@config/theme.config';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
}

export default function Loading({ size = 'large', text, color = colors.primary }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 12,
  },
});

