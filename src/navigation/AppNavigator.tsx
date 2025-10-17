/**
 * App Navigator
 * Stack navigation for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '@/features/auth/screens/SignupScreen';
import UserDetailsScreen from '@/features/auth/screens/UserDetailsScreen';
import OTPVerificationScreen from '@/features/auth/screens/OTPVerificationScreen';
import MainTabs from './MainTabs';
import ResponseScreen from '@features/posts/screens/ResponseScreen';
import AllPostsScreen from '@/features/profile/screens/AllPostsScreen';
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import DaysHubScreen from '@/features/days/screens/DaysHubScreen';
import DayFeedScreen from '@/features/days/screens/DayFeedScreen';
import { DayOfWeek } from '@/features/days/types';

export type RootStackParamList = {
  Signup: undefined;
  UserDetails: {
    method: 'phone' | 'email';
    contact: string;
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
  };
  AllPosts: undefined;
  Notifications: undefined;
  Settings: undefined;
  DaysHub: undefined;
  DayFeed: {
    day: DayOfWeek;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signup"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 350,
          contentStyle: { backgroundColor: '#0a0a1a' },
        }}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

