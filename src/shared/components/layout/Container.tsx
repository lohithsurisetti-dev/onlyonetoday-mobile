/**
 * Container Component
 * Centers content with max width and horizontal padding
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export default function Container({ children, style, padding = 24 }: ContainerProps) {
  return <View style={[styles.container, { paddingHorizontal: padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480, // Max width for tablets
    alignSelf: 'center',
  },
});

