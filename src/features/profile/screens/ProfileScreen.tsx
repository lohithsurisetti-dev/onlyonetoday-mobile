/**
 * Profile Screen - Premium Card-Based Design
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuthStore } from '@/lib/stores/authStore';
import StreakShareCard from '../components/StreakShareCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type ProfileScreenProps = {
  navigation: any;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, isAuthenticated } = useAuthStore();
  const isAnonymous = !isAuthenticated || !user;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showStreakShare, setShowStreakShare] = useState(false);

  const userStats = {
    totalPosts: 42,
    uniquePosts: 28,
    streak: 7,
    topTier: 12,
  };

  // Random profile picture
  const [profilePic] = useState(`https://i.pravatar.cc/300?u=${user?.username || 'default'}`);

  const recentPosts = [
    { id: '1', content: 'Discovered a hidden rooftop garden', date: '2h', tier: 'elite', percentile: 99.8, scope: 'world' },
    { id: '2', content: 'Had breakfast underwater', date: '1d', tier: 'rare', percentile: 95.2, scope: 'city', location: 'Phoenix' },
    { id: '3', content: 'Wrote a poem in binary code', date: '2d', tier: 'unique', percentile: 87.5, scope: 'country', location: 'United States' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return '#a78bfa';
      case 'rare': return '#f9a8d4';
      case 'unique': return '#22d3ee';
      default: return '#6b7280';
    }
  };

  if (isAnonymous) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
          <View style={styles.anonymousContainer}>
            <Text style={styles.guestTitle}>Guest Mode</Text>
            <Text style={styles.guestSubtitle}>Create an account to unlock your profile</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.8}>
              <LinearGradient colors={['#8b5cf6', '#ec4899'] as const} style={styles.guestButton}>
                <Text style={styles.guestButtonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            {/* Header Card */}
            <View style={styles.headerCard}>
              <BlurView intensity={15} tint="dark" style={styles.headerBlur}>
                <View style={styles.headerContent}>
                  <Image
                    source={{ uri: profilePic }}
                    style={styles.avatar}
                  />
                  
                  <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
                  <Text style={styles.username}>@{user?.username}</Text>

                  {/* Compact Stats */}
                  <View style={styles.compactStats}>
                    <View style={styles.compactStat}>
                      <Text style={styles.compactValue}>{userStats.totalPosts}</Text>
                      <Text style={styles.compactLabel}>Posts</Text>
                    </View>
                    <View style={styles.compactStat}>
                      <Text style={styles.compactValue}>{userStats.uniquePosts}</Text>
                      <Text style={styles.compactLabel}>Unique</Text>
                    </View>
                    <View style={styles.compactStat}>
                      <Text style={styles.compactValue}>{userStats.topTier}</Text>
                      <Text style={styles.compactLabel}>Elite</Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </View>

            {/* Streak Card - Separate & Special */}
            <TouchableOpacity 
              style={styles.streakCard}
              onPress={() => setShowStreakShare(true)}
              activeOpacity={0.85}
            >
              <BlurView intensity={15} tint="dark" style={styles.streakBlur}>
                <LinearGradient
                  colors={['rgba(251, 146, 60, 0.15)', 'rgba(249, 115, 22, 0.08)'] as const}
                  style={styles.streakGradient}
                >
                  <View style={styles.streakHeader}>
                    <View style={styles.streakLeft}>
                      <Svg width={scale(28)} height={scale(28)} viewBox="0 0 24 24" fill="none">
                        <Path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                      <View style={styles.streakInfo}>
                        <Text style={styles.streakDays}>{userStats.streak} Days</Text>
                        <Text style={styles.streakLabel}>Current OOT Streak</Text>
                      </View>
                    </View>
                    <View style={styles.shareIconContainer}>
                      <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                        <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            {/* Recent Posts */}
            <View style={styles.postsSection}>
              <View style={styles.postsHeader}>
                <Text style={styles.postsTitle}>Recent Posts</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AllPosts')} activeOpacity={0.7}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>

              {recentPosts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <BlurView intensity={8} tint="dark" style={styles.postBlur}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.03)', 'transparent'] as const}
                      style={styles.postContent}
                    >
                      <View style={styles.postHeader}>
                        <View style={styles.tierContainer}>
                          <View style={[styles.tierIndicator, { backgroundColor: getTierColor(post.tier) }]} />
                          <Text style={[styles.tierLabel, { color: getTierColor(post.tier) }]}>
                            {post.tier.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.timeAgo}>{post.date}</Text>
                      </View>

                      <Text style={styles.postBody}>{post.content}</Text>

                      {/* Meta Row */}
                      <View style={styles.metaRow}>
                        <Text style={styles.percentileTag}>Top {(100 - post.percentile).toFixed(1)}%</Text>
                        
                        <View style={styles.scopeBadge}>
                          <Svg width={scale(9)} height={scale(9)} viewBox="0 0 24 24" fill="none">
                            {post.scope === 'world' ? (
                              <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth={2} />
                            ) : (
                              <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#6b7280" strokeWidth={2} />
                            )}
                          </Svg>
                          <Text style={styles.scopeLabel}>
                            {post.scope === 'world' ? 'World' : post.location}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Settings Button */}
        <TouchableOpacity 
          style={styles.settingsBtn} 
          onPress={() => Alert.alert('Settings', 'Coming soon')}
          activeOpacity={0.7}
        >
          <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="3" stroke="#c4b5fd" strokeWidth={1.5} />
            <Path d="M12 1v6m0 6v10M23 12h-6m-6 0H1" stroke="#c4b5fd" strokeWidth={1.5} />
          </Svg>
        </TouchableOpacity>

        <StreakShareCard
          visible={showStreakShare}
          onClose={() => setShowStreakShare(false)}
          streak={userStats.streak}
          username={user?.username || 'user'}
          firstName={user?.firstName || 'User'}
          lastName={user?.lastName || ''}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a1a' },
  gradient: { flex: 1 },
  content: { flex: 1 },
  scroll: { paddingBottom: scale(100) },

  // Anonymous
  anonymousContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(40) },
  guestTitle: { fontSize: moderateScale(32, 0.3), fontWeight: '200', color: '#ffffff', letterSpacing: 2, marginBottom: scale(8) },
  guestSubtitle: { fontSize: moderateScale(14, 0.2), color: '#9ca3af', marginBottom: scale(40), textAlign: 'center' },
  guestButton: { paddingHorizontal: scale(48), paddingVertical: scale(16), borderRadius: scale(14) },
  guestButtonText: { color: '#ffffff', fontSize: moderateScale(16, 0.2), fontWeight: '600', letterSpacing: 0.5 },

  // Settings
  settingsBtn: { position: 'absolute', top: scale(16), right: scale(20), zIndex: 100, padding: scale(8) },

  // Header Card
  headerCard: { marginHorizontal: scale(20), marginTop: scale(60), marginBottom: scale(16) },
  headerBlur: { borderRadius: scale(24), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  headerContent: { padding: scale(28), alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  avatar: { width: scale(90), height: scale(90), borderRadius: scale(45), marginBottom: scale(16), borderWidth: 2, borderColor: 'rgba(139, 92, 246, 0.3)' },
  initials: { fontSize: moderateScale(34, 0.4), fontWeight: '200', color: '#ffffff', letterSpacing: 3 },
  name: { fontSize: moderateScale(24, 0.3), fontWeight: '400', color: '#ffffff', letterSpacing: 0.5, marginBottom: scale(4) },
  username: { fontSize: moderateScale(14, 0.2), color: '#8b5cf6', fontWeight: '600', marginBottom: scale(20) },
  compactStats: { flexDirection: 'row', gap: scale(32), marginTop: scale(8) },
  compactStat: { alignItems: 'center' },
  compactValue: { fontSize: moderateScale(22, 0.3), fontWeight: '700', color: '#ffffff', marginBottom: scale(2) },
  compactLabel: { fontSize: moderateScale(10, 0.2), color: '#9ca3af', fontWeight: '500', letterSpacing: 0.5 },

  // Streak Card
  streakCard: { marginHorizontal: scale(20), marginBottom: scale(24) },
  streakBlur: { borderRadius: scale(20), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  streakGradient: { padding: scale(20) },
  streakHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: scale(14), flex: 1 },
  streakInfo: { flex: 1 },
  streakDays: { fontSize: moderateScale(20, 0.3), fontWeight: '700', color: '#ffffff', marginBottom: scale(2) },
  streakLabel: { fontSize: moderateScale(11, 0.2), color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500', letterSpacing: 0.3 },
  shareIconContainer: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: 'rgba(251, 191, 36, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },

  // Posts Section
  postsSection: { paddingHorizontal: scale(20) },
  postsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(16) },
  postsTitle: { fontSize: moderateScale(12, 0.2), color: '#ffffff', fontWeight: '700', letterSpacing: 1.5 },
  seeAll: { fontSize: moderateScale(12, 0.2), color: '#8b5cf6', fontWeight: '700' },

  // Post Card
  postCard: { marginBottom: scale(10) },
  postBlur: { borderRadius: scale(16), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)' },
  postContent: { padding: scale(12) },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(8) },
  tierContainer: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  tierIndicator: { width: scale(6), height: scale(6), borderRadius: scale(3) },
  tierLabel: { fontSize: moderateScale(9, 0.2), fontWeight: '700', letterSpacing: 0.8 },
  timeAgo: { fontSize: moderateScale(10, 0.2), color: '#6b7280', fontWeight: '500' },
  postBody: { fontSize: moderateScale(14, 0.2), color: '#ffffff', lineHeight: moderateScale(20, 0.2), marginBottom: scale(10), fontWeight: '400' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8), flexWrap: 'wrap' },
  percentileTag: { fontSize: moderateScale(10, 0.2), color: '#8b5cf6', fontWeight: '700', letterSpacing: 0.3 },
  scopeBadge: { flexDirection: 'row', alignItems: 'center', gap: scale(4), paddingHorizontal: scale(8), paddingVertical: scale(4), borderRadius: scale(8), backgroundColor: 'rgba(255, 255, 255, 0.04)' },
  scopeLabel: { fontSize: moderateScale(10, 0.2), color: '#9ca3af', fontWeight: '600', letterSpacing: 0.3 },
});
