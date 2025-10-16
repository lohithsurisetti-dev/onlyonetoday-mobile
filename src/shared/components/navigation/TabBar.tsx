/**
 * Premium Tab Bar - Unique footer navigation
 * Glassmorphism with floating icons and smooth animations
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuthStore } from '@/lib/stores/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type TabBarProps = {
  activeTab: 'home' | 'feed' | 'create' | 'trending' | 'profile';
  onTabChange: (tab: 'home' | 'feed' | 'create' | 'trending' | 'profile') => void;
};

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { user } = useAuthStore();
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef({
    home: new Animated.Value(1),
    feed: new Animated.Value(1),
    create: new Animated.Value(1),
    trending: new Animated.Value(1),
    profile: new Animated.Value(1),
  }).current;

  const tabs = ['home', 'feed', 'create', 'trending', 'profile'] as const;
  const activeIndex = tabs.indexOf(activeTab);

  useEffect(() => {
    // Animate indicator
    Animated.spring(indicatorAnim, {
      toValue: activeIndex,
      damping: 20,
      stiffness: 150,
      useNativeDriver: true,
    }).start();

    // Scale animation for active tab
    tabs.forEach((tab, index) => {
      Animated.spring(scaleAnims[tab], {
        toValue: index === activeIndex ? 1.1 : 1,
        damping: 15,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab]);

  const handlePress = (tab: typeof tabs[number]) => {
    // Haptic feedback would go here
    onTabChange(tab);
  };

  const getIcon = (tab: typeof tabs[number], isActive: boolean) => {
    const color = isActive ? '#ffffff' : '#6b7280';
    const size = 24;

    switch (tab) {
      case 'home':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'feed':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'trending':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'create':
        return null; // Handled separately as elevated button
      case 'profile':
        if (user?.username && !user.isAnonymous) {
          // Show profile picture placeholder or actual image
          return (
            <View style={[styles.profileIcon, isActive && styles.profileIconActive]}>
              <Text style={styles.profileInitial}>
                {user.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          );
        }
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      default:
        return null;
    }
  };

  const getLabel = (tab: typeof tabs[number]) => {
    switch (tab) {
      case 'home': return 'Home';
      case 'feed': return 'Feed';
      case 'create': return '';
      case 'trending': return 'Trending';
      case 'profile': return 'Profile';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        {/* Gradient overlay for premium look */}
        <LinearGradient
          colors={['rgba(26, 26, 46, 0.95)', 'rgba(10, 10, 26, 0.98)']}
          style={styles.gradient}
        >
        {/* Active indicator - Removed per user request */}
        {/* <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                {
                  translateX: indicatorAnim.interpolate({
                    inputRange: [0, 1, 2, 3, 4],
                    outputRange: [
                      SCREEN_WIDTH * 0.1 - scale(20),
                      SCREEN_WIDTH * 0.3 - scale(20),
                      SCREEN_WIDTH * 0.5 - scale(20),
                      SCREEN_WIDTH * 0.7 - scale(20),
                      SCREEN_WIDTH * 0.9 - scale(20),
                    ],
                  }),
                },
              ],
            },
          ]}
        /> */}

        <View style={styles.tabs}>
          {/* Home */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handlePress('home')}
            activeOpacity={0.7}
          >
            <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnims.home }] }]}>
              {getIcon('home', activeTab === 'home')}
            </Animated.View>
          </TouchableOpacity>

          {/* Feed */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handlePress('feed')}
            activeOpacity={0.7}
          >
            <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnims.feed }] }]}>
              {getIcon('feed', activeTab === 'feed')}
            </Animated.View>
          </TouchableOpacity>

          {/* Create (Center, Simple) */}
          <TouchableOpacity
            style={styles.createTab}
            onPress={() => handlePress('create')}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnims.create }] }}>
              <View style={styles.createIconContainer}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 4v16m8-8H4" stroke="#8b5cf6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* Trending */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handlePress('trending')}
            activeOpacity={0.7}
          >
            <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnims.trending }] }]}>
              {getIcon('trending', activeTab === 'trending')}
            </Animated.View>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handlePress('profile')}
            activeOpacity={0.7}
          >
            <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnims.profile }] }]}>
              {getIcon('profile', activeTab === 'profile')}
            </Animated.View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.2)',
    overflow: 'hidden',
  },
  gradient: {
    paddingBottom: scale(20), // Safe area for home indicator
    paddingTop: scale(8),
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: scale(40),
    height: 2,
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(64),
    paddingHorizontal: scale(8),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  createTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: moderateScale(10, 0.2),
    color: '#6b7280',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  labelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 2,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconActive: {
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  profileInitial: {
    fontSize: moderateScale(11, 0.2),
    color: '#ffffff',
    fontWeight: '700',
  },
  iconWrapper: {
    width: scale(24),
    height: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

