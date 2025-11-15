/**
 * App Navigator
 * Stack navigation for the app
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import SignupScreen from '@/features/auth/screens/SignupScreen';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import UserDetailsScreen from '@/features/auth/screens/UserDetailsScreen';
import UsernamePasswordScreen from '@/features/auth/screens/UsernamePasswordScreen';
import OTPVerificationScreen from '@/features/auth/screens/OTPVerificationScreen';
import MainTabs from './MainTabs';
import ResponseScreen from '@features/posts/screens/ResponseScreen';
import AllPostsScreen from '@/features/profile/screens/AllPostsScreen';
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import DaysHubScreen from '@/features/days/screens/DaysHubScreen';
import DayFeedScreen from '@/features/days/screens/DayFeedScreen';
import CreateDreamScreen from '@/features/dreams/screens/CreateDreamScreen';
import DreamResponseScreen from '@/features/dreams/screens/DreamResponseScreen';
import { DayOfWeek } from '@/features/days/types';
import { useAuthStore } from '@/lib/stores/authStore';
import type { DreamPost } from '@/lib/api/dreams';

export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  UserDetails: {
    method: 'phone' | 'email';
    contact: string;
  };
  UsernamePassword: {
    method: 'phone' | 'email';
    contact: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  OTPVerification: {
    method: 'phone' | 'email';
    contact: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  Main: undefined;
  Response: {
    postId?: string;
    percentile?: any;
    content?: string;
    scope?: string;
    matchCount?: number;
    displayText?: string;
    tier?: string;
    temporal?: {
      week: {
        matches: number;
        total: number;
        comparison: string;
      };
      month: {
        matches: number;
        total: number;
        comparison: string;
      };
      year: {
        matches: number;
        total: number;
        comparison: string;
      };
      allTime: {
        matches: number;
        total: number;
        comparison: string;
      };
      insight: string;
    };
  };
  AllPosts: undefined;
  Notifications: undefined;
  Settings: undefined;
  DaysHub: undefined;
  DayFeed: {
    day: DayOfWeek;
  };
  CreateDream: undefined;
  DreamResponse: {
    dream: DreamPost;
    content: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Wait for auth initialization
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  // Show loading while checking auth
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated && user && !user.isAnonymous ? "Main" : "Signup"}
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 350,
          contentStyle: { backgroundColor: '#0a0a1a' },
        }}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
        <Stack.Screen name="UsernamePassword" component={UsernamePasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="Response" 
          component={ResponseScreen}
          options={{
            presentation: 'modal',
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen 
          name="AllPosts" 
          component={AllPostsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="DaysHub" 
          component={DaysHubScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="DayFeed" 
          component={DayFeedScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="CreateDream" 
          component={CreateDreamScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="DreamResponse" 
          component={DreamResponseScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

