/**
 * App Navigator
 * Stack navigation for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@features/posts/screens/HomeScreen';
import ResponseScreen from '@features/posts/screens/ResponseScreen';

export type RootStackParamList = {
  Home: undefined;
  Response: {
    postId?: string;
    percentile?: any;
    content?: string;
    scope?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0a0a1a' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Response" component={ResponseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

