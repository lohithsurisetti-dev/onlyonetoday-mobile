/**
 * Screen Transition Wrapper
 * Provides smooth, premium fade + slight scale transitions
 * Consistent across the entire app
 */

import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

type ScreenTransitionProps = {
  children: React.ReactNode;
};

export default function ScreenTransition({ children }: ScreenTransitionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    // Smooth entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

