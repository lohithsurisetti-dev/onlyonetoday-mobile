/**
 * Screen Component
 * Wrapper for all screens with consistent styling and safe area
 */

import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  showGradient?: boolean;
  style?: ViewStyle;
}

export default function Screen({
  children,
  scrollable = false,
  showGradient = true,
  style,
}: ScreenProps) {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea}>
      {showGradient ? (
        <LinearGradient
          colors={['#0D0C1D', '#000000']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Container
            style={[styles.container, style]}
            contentContainerStyle={scrollable ? styles.scrollContent : undefined}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </Container>
        </LinearGradient>
      ) : (
        <View style={[styles.solidBackground, styles.gradient]}>
          <Container
            style={[styles.container, style]}
            contentContainerStyle={scrollable ? styles.scrollContent : undefined}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </Container>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0C1D',
  },
  gradient: {
    flex: 1,
  },
  solidBackground: {
    backgroundColor: '#0D0C1D',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
});

