import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, View, StyleSheet } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from './src/lib/queryClient';
import { validateEnv } from './src/config/env';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/features/splash/SplashScreen';
import { useAuthStore } from './src/lib/stores/authStore';

// Validate environment variables on startup
validateEnv();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const appOpacity = useRef(new Animated.Value(0)).current;

  // Initialize auth session on app start
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  const handleSplashFinish = () => {
    // Crossfade: fade out splash while fading in app
    Animated.parallel([
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(appOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSplash(false);
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={styles.container}>
          <StatusBar style="light" backgroundColor="#0a0a1a" />
          
          {/* Main App - Always rendered underneath */}
          <Animated.View style={[styles.container, { opacity: appOpacity }]}>
            <AppNavigator />
          </Animated.View>

          {/* Splash Screen Overlay with fade out */}
          {showSplash && (
            <Animated.View 
              style={[styles.absoluteFill, { opacity: splashOpacity }]}
              pointerEvents={showSplash ? 'auto' : 'none'}
            >
              <SplashScreen onFinish={handleSplashFinish} />
            </Animated.View>
          )}
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a1a',
  },
});
