/**
 * Notifications Screen
 * Shows user notifications and feature updates
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type NotificationScreenProps = {
  navigation: any;
};

interface Notification {
  id: string;
  type: 'update' | 'achievement' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Sample notifications
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'update',
    title: 'New Feature: Trending Leaderboard',
    message: 'Discover what\'s trending worldwide! Check out the new Trending tab to see popular topics from Spotify, Reddit, YouTube, and more.',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Top 1% Uniqueness!',
    message: 'Your post "Meditation at 3 AM" is in the top 1% most unique today. Keep being different!',
    timestamp: '5 hours ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'update',
    title: 'Feed Improvements',
    message: 'We\'ve added smooth animations and improved filtering options to make discovering unique posts even better.',
    timestamp: '1 day ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'social',
    title: 'Phoenix is Trending',
    message: 'Your city just made it to #5 in the global leaderboard! Amazing activity happening in your area.',
    timestamp: '2 days ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome to OnlyOne!',
    message: 'Start sharing what makes you unique. Every post shows you how different you are from the crowd.',
    timestamp: '3 days ago',
    isRead: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'update':
      return (
        <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2 17L12 22L22 17"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2 12L12 17L22 12"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'achievement':
      return (
        <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
            stroke="#ec4899"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
            stroke="#ec4899"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'social':
      return (
        <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    default:
      return (
        <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 16V12"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 8H12.01"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
  }
};

export default function NotificationsScreen({ navigation }: NotificationScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 19L5 12L12 5"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SAMPLE_NOTIFICATIONS.map((notification) => (
            <BlurView key={notification.id} intensity={20} tint="dark" style={styles.notificationCard}>
              <LinearGradient
                colors={
                  notification.isRead
                    ? ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.01)']
                    : ['rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0.02)']
                }
                style={styles.notificationGradient}
              >
                <View style={styles.notificationHeader}>
                  <View style={styles.iconContainer}>{getNotificationIcon(notification.type)}</View>
                  <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadTitle]}>
                        {notification.title}
                      </Text>
                      {!notification.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    padding: scale(4),
  },
  headerTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: scale(32),
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: scale(100),
  },
  notificationCard: {
    borderRadius: scale(16),
    overflow: 'hidden',
    marginBottom: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  notificationGradient: {
    padding: scale(16),
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: scale(12),
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(6),
  },
  notificationTitle: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  unreadTitle: {
    color: '#c4b5fd',
  },
  unreadDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#ec4899',
  },
  notificationMessage: {
    fontSize: moderateScale(13, 0.2),
    color: '#9ca3af',
    lineHeight: moderateScale(18, 0.2),
    marginBottom: scale(8),
  },
  notificationTime: {
    fontSize: moderateScale(11, 0.2),
    color: '#6b7280',
    fontWeight: '400',
  },
});

