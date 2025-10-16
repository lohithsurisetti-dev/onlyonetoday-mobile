/**
 * Main Tabs Navigator
 * Bottom tab navigation with premium custom tab bar
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '@/features/posts/screens/HomeScreen';
import CreateScreen from '@/features/posts/screens/CreateScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import FeedScreen from '@/features/feed/screens/FeedScreen';
import TabBar from '@/shared/components/navigation/TabBar';

type MainTabsProps = {
  navigation: any;
};

const TrendingScreen = () => (
  <SafeAreaView style={styles.placeholder} edges={['top']}>
    <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.placeholderGradient}>
      <Text style={styles.placeholderText}>Trending Screen</Text>
      <Text style={styles.placeholderSubtext}>Coming soon...</Text>
    </LinearGradient>
  </SafeAreaView>
);

// ProfileScreen now imported from features/profile

export default function MainTabs({ navigation }: MainTabsProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'feed' | 'create' | 'trending' | 'profile'>('home');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleTabChange = (tab: 'home' | 'feed' | 'create' | 'trending' | 'profile') => {
    // Ultra-smooth crossfade transition
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(tab);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen navigation={navigation} />;
      case 'feed':
        return <FeedScreen />;
      case 'create':
        return <CreateScreen navigation={navigation} onBack={() => setActiveTab('home')} />;
      case 'trending':
        return <TrendingScreen />;
      case 'profile':
        return <ProfileScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  // Hide footer on Create screen
  const showFooter = activeTab !== 'create';

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.screenContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {renderScreen()}
      </Animated.View>
      {showFooter && <TabBar activeTab={activeTab} onTabChange={handleTabChange} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  screenContainer: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  placeholderGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    letterSpacing: 1,
  },
});

