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
import TrendingScreen from '@/features/trending/screens/TrendingScreen';
import TabBar from '@/shared/components/navigation/TabBar';

type MainTabsProps = {
  navigation: any;
};

// ProfileScreen now imported from features/profile

export default function MainTabs({ navigation }: MainTabsProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'feed' | 'create' | 'trending' | 'profile'>('home');

  const handleTabChange = (tab: 'home' | 'feed' | 'create' | 'trending' | 'profile') => {
    setActiveTab(tab);
  };

  // Hide footer on Create screen
  const showFooter = activeTab !== 'create';

  return (
    <View style={styles.container}>
      {/* Keep all screens mounted, show/hide with display */}
      <View style={[styles.screenContainer, activeTab !== 'home' && styles.hidden]}>
        <HomeScreen navigation={navigation} onTabChange={handleTabChange} />
      </View>
      <View style={[styles.screenContainer, activeTab !== 'feed' && styles.hidden]}>
        <FeedScreen />
      </View>
      <View style={[styles.screenContainer, activeTab !== 'create' && styles.hidden]}>
        <CreateScreen navigation={navigation} onBack={() => setActiveTab('home')} />
      </View>
      <View style={[styles.screenContainer, activeTab !== 'trending' && styles.hidden]}>
        <TrendingScreen />
      </View>
      <View style={[styles.screenContainer, activeTab !== 'profile' && styles.hidden]}>
        <ProfileScreen navigation={navigation} />
      </View>
      
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
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

