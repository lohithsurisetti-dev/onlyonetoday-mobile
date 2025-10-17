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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuthStore } from '@/lib/stores/authStore';
import StreakShareCard from '../components/StreakShareCard';
import { getTierColors } from '@/shared/constants/tierColors';

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
          {/* Settings Icon - Top Right */}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
              <Path 
                d="M12 15a3 3 0 100-6 3 3 0 000 6z" 
                stroke="#ffffff" 
                strokeWidth={1.5} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <Path 
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" 
                stroke="#ffffff" 
                strokeWidth={1.5} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </Svg>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            {/* Header Card - Compact & Premium */}
            <View style={styles.headerCard}>
              <BlurView intensity={20} tint="dark" style={styles.headerBlur}>
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.08)', 'rgba(236, 72, 153, 0.04)', 'transparent'] as const}
                  style={styles.headerGradient}
                >
                  <View style={styles.headerContent}>
                    {/* Avatar with glow */}
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatarGlow} />
                      <Image
                        source={{ uri: profilePic }}
                        style={styles.avatar}
                      />
                    </View>
                    
                    <View style={styles.profileInfo}>
                      <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
                      <Text style={styles.username}>@{user?.username}</Text>

                      {/* Compact Stats - More Prominent */}
                      <View style={styles.compactStats}>
                        <View style={styles.compactStat}>
                          <Text style={styles.compactValue}>{userStats.totalPosts}</Text>
                          <Text style={styles.compactLabel}>Posts</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.compactStat}>
                          <Text style={styles.compactValue}>{userStats.uniquePosts}</Text>
                          <Text style={styles.compactLabel}>Posts</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.compactStat}>
                          <Text style={styles.compactValue}>{userStats.topTier}</Text>
                          <Text style={styles.compactLabel}>Elite</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
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
                  colors={['rgba(251, 113, 133, 0.2)', 'rgba(244, 63, 94, 0.12)'] as const}
                  style={styles.streakGradient}
                >
                  <View style={styles.streakHeader}>
                    <View style={styles.streakLeft}>
                      <Svg width={scale(28)} height={scale(28)} viewBox="0 0 24 24" fill="none">
                        <Path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" stroke="#fb7185" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                      <View style={styles.streakInfo}>
                        <Text style={styles.streakDays}>{userStats.streak} Days</Text>
                        <Text style={styles.streakLabel}>Current OOT Streak</Text>
                      </View>
                    </View>
                    <View style={styles.shareIconContainer}>
                      <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
                        <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#fb7185" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

              {recentPosts.map((post) => {
                const tierColors = getTierColors(post.tier);
                return (
                <View key={post.id} style={styles.postCard}>
                  <BlurView intensity={25} tint="dark" style={styles.postBlur}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)'] as const}
                      style={styles.postContent}
                    >
                      {/* Header - Username & Percentile */}
                      <View style={styles.postHeader}>
                        <Text style={styles.postUsername}>@{user?.username}</Text>
                        
                        <View style={{ flex: 1 }} />
                        
                        <View style={[styles.percentilePill, { borderColor: tierColors.primary }]}>
                          <Text style={[styles.percentileText, { color: tierColors.primary }]}>
                            Top {(100 - post.percentile).toFixed(1)}%
                          </Text>
                        </View>
                        
                        <TouchableOpacity style={styles.shareIconBtn} activeOpacity={0.6}>
                          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                            <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#c4b5fd" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </Svg>
                        </TouchableOpacity>
                      </View>

                      {/* Content */}
                      <Text style={styles.postBody}>{post.content}</Text>

                      {/* Footer - Time, Location */}
                      <View style={styles.postFooter}>
                        <Text style={styles.postTime}>{post.date}</Text>
                        <View style={styles.footerDot} />
                        <View style={styles.scopeTag}>
                          <Svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                            {post.scope === 'world' ? (
                              <Circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth={2.5} />
                            ) : (
                              <Path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="#6b7280" strokeWidth={2.5} />
                            )}
                          </Svg>
                          <Text style={styles.scopeText} numberOfLines={1}>
                            {post.scope === 'world' ? 'World' : post.location}
                          </Text>
                        </View>
                    </View>
                  </LinearGradient>
                </BlurView>
              </View>
              );
              })}
            </View>
          </ScrollView>
        </Animated.View>

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
  
  settingsButton: {
    position: 'absolute',
    top: scale(20),
    right: scale(20),
    zIndex: 100,
    padding: scale(10),
  },

  // Anonymous
  anonymousContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(40) },
  guestTitle: { fontSize: moderateScale(32, 0.3), fontWeight: '200', color: '#ffffff', letterSpacing: 2, marginBottom: scale(8) },
  guestSubtitle: { fontSize: moderateScale(14, 0.2), color: '#9ca3af', marginBottom: scale(40), textAlign: 'center' },
  guestButton: { paddingHorizontal: scale(48), paddingVertical: scale(16), borderRadius: scale(14) },
  guestButtonText: { color: '#ffffff', fontSize: moderateScale(16, 0.2), fontWeight: '600', letterSpacing: 0.5 },

  // Header Card - Compact & Visual
  headerCard: { marginHorizontal: scale(20), marginTop: scale(60), marginBottom: scale(16) },
  headerBlur: { borderRadius: scale(20), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.15)' },
  headerGradient: { padding: scale(20) },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: scale(16) },
  avatarContainer: { position: 'relative' },
  avatarGlow: { 
    position: 'absolute', 
    width: scale(74), 
    height: scale(74), 
    borderRadius: scale(37), 
    backgroundColor: '#8b5cf6',
    opacity: 0.15,
    top: scale(3),
    left: scale(3),
  },
  avatar: { width: scale(74), height: scale(74), borderRadius: scale(37), borderWidth: 2, borderColor: 'rgba(139, 92, 246, 0.4)' },
  profileInfo: { flex: 1, paddingVertical: scale(4) },
  initials: { fontSize: moderateScale(34, 0.4), fontWeight: '200', color: '#ffffff', letterSpacing: 3 },
  name: { fontSize: moderateScale(18, 0.3), fontWeight: '600', color: '#ffffff', letterSpacing: 0.3, marginBottom: scale(2) },
  username: { fontSize: moderateScale(12, 0.2), color: '#8b5cf6', fontWeight: '600', marginBottom: scale(12) },
  compactStats: { flexDirection: 'row', alignItems: 'center', gap: scale(12) },
  compactStat: { alignItems: 'flex-start' },
  compactValue: { fontSize: moderateScale(18, 0.3), fontWeight: '700', color: '#ffffff', marginBottom: scale(1), letterSpacing: 0.3 },
  compactLabel: { fontSize: moderateScale(9, 0.2), color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' },
  statDivider: { width: 1, height: scale(24), backgroundColor: 'rgba(255, 255, 255, 0.1)' },

  // Streak Card
  streakCard: { marginHorizontal: scale(20), marginBottom: scale(24) },
  streakBlur: { borderRadius: scale(20), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  streakGradient: { padding: scale(20) },
  streakHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: scale(14), flex: 1 },
  streakInfo: { flex: 1 },
  streakDays: { fontSize: moderateScale(20, 0.3), fontWeight: '700', color: '#ffffff', marginBottom: scale(2) },
  streakLabel: { fontSize: moderateScale(11, 0.2), color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500', letterSpacing: 0.3 },
  shareIconContainer: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: 'rgba(251, 113, 133, 0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(251, 113, 133, 0.3)' },

  // Posts Section
  postsSection: { paddingHorizontal: scale(20) },
  postsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(16) },
  postsTitle: { fontSize: moderateScale(12, 0.2), color: '#ffffff', fontWeight: '700', letterSpacing: 1.5 },
  seeAll: { fontSize: moderateScale(12, 0.2), color: '#8b5cf6', fontWeight: '700' },

  // Post Card - Match Feed Style
  postCard: { marginBottom: scale(12) },
  postBlur: { borderRadius: scale(16), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)' },
  postContent: { padding: scale(14) },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(8), marginBottom: scale(10) },
  postUsername: { fontSize: moderateScale(11, 0.2), color: '#8b5cf6', fontWeight: '700', letterSpacing: 0.3 },
  percentilePill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: scale(8), 
    paddingVertical: scale(4), 
    borderRadius: scale(10), 
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  percentileText: { fontSize: moderateScale(9, 0.2), fontWeight: '700', letterSpacing: 0.3 },
  shareIconBtn: { padding: scale(4) },
  postBody: { fontSize: moderateScale(13, 0.2), color: '#ffffff', lineHeight: moderateScale(19, 0.2), marginBottom: scale(12), fontWeight: '400' },
  postFooter: { flexDirection: 'row', alignItems: 'center', gap: scale(8) },
  postTime: { fontSize: moderateScale(9, 0.2), color: 'rgba(255, 255, 255, 0.4)', fontWeight: '500' },
  footerDot: { width: scale(3), height: scale(3), borderRadius: scale(1.5), backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  scopeTag: { flexDirection: 'row', alignItems: 'center', gap: scale(4), paddingHorizontal: scale(8), paddingVertical: scale(4), borderRadius: scale(8), backgroundColor: 'rgba(107, 114, 128, 0.12)', flex: 0 },
  scopeText: { fontSize: moderateScale(9, 0.2), color: '#9ca3af', fontWeight: '500', maxWidth: scale(100) },
});
