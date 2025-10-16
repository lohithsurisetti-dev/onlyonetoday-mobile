import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from './src/lib/queryClient';
import { validateEnv } from './src/config/env';
import HomeScreen from './src/features/posts/screens/HomeScreen';
import ResponseScreen from './src/features/posts/screens/ResponseScreen';

// Validate environment variables on startup
validateEnv();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <ResponseScreen />
          {/* <HomeScreen /> */}
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
