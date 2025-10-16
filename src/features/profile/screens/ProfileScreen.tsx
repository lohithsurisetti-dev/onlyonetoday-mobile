/**
 * Profile Screen
 * Shows user profile for both registered and anonymous users
 * For registered: profile info, stats, post history
 * For anonymous: prompt to sign up
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

// Floating star component
const FloatingStar = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const starScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -30,
              duration: 3000 + Math.random() * 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 20,
              duration: 2500 + Math.random() * 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -20,
              duration: 2500 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 2500 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.15,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(starScale, {
              toValue: 1,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(starScale, {
              toValue: 0.5,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(starScale, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          transform: [{ translateY }, { translateX }, { scale: starScale }],
          opacity,
        },
      ]}
    />
  );
};

type ProfileScreenProps = {
  navigation: any;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, isAnonymous, logout } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const [showStreakShare, setShowStreakShare] = useState(false);

  // Mock data - replace with real API calls
  const userStats = {
    totalPosts: 42,
    uniquePosts: 28,
    streak: 7,
    topTier: 12,
  };

  // Mock recent posts - replace with real API calls
  const recentPosts = [
    { id: '1', content: 'Discovered a hidden rooftop garden', date: '2 hours ago', tier: 'elite', percentile: 99.8 },
    { id: '2', content: 'Had breakfast underwater', date: '1 day ago', tier: 'rare', percentile: 95.2 },
    { id: '3', content: 'Wrote a poem in binary code', date: '2 days ago', tier: 'unique', percentile: 87.5 },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings screen coming soon!');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return '#8b5cf6';
      case 'rare': return '#ec4899';
      case 'unique': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  // Anonymous User View
  if (isAnonymous) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
          {/* Floating Stars */}
          <View style={styles.starsContainer} pointerEvents="none">
            {[...Array(15)].map((_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              >
                <FloatingStar delay={i * 200} />
              </View>
            ))}
          </View>

          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Anonymous Header */}
              <View style={styles.anonymousHeader}>
                <View style={styles.guestAvatar}>
                  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <Text style={styles.anonymousTitle}>Guest User</Text>
                <Text style={styles.anonymousSubtitle}>Create an account to save your posts</Text>
              </View>

              {/* Sign Up Card */}
              <BlurView intensity={40} tint="dark" style={styles.signupCard}>
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)']}
                  style={styles.signupGradient}
                >
                  <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#8b5cf6" strokeWidth={1.5} />
                    <Path d="M12 6v12M18 12H6" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                  
                  <Text style={styles.signupTitle}>Unlock Your Uniqueness</Text>
                  <Text style={styles.signupDescription}>
                    Create an account to track your posts, view your stats, and compete on the leaderboard
                  </Text>

                  <View style={styles.featuresList}>
                    {[
                      'Track your uniqueness over time',
                      'See your post history & stats',
                      'Compete with others globally',
                      'Earn badges and achievements',
                    ].map((feature, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                          <Path d="M5 13l4 4L19 7" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.signupButton} onPress={handleSignup} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#8b5cf6', '#ec4899']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.signupButtonGradient}
                    >
                      <Text style={styles.signupButtonText}>Create Account</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </BlurView>
            </ScrollView>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Registered User View
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
        {/* Floating Stars */}
        <View style={styles.starsContainer} pointerEvents="none">
          {[...Array(15)].map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <FloatingStar delay={i * 200} />
            </View>
          ))}
        </View>

          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Settings Icon - Top Right */}
          <TouchableOpacity 
            style={styles.settingsIcon} 
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#8b5cf6', '#ec4899']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </Text>
                </LinearGradient>
              </View>
              
              <Text style={styles.profileName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.profileUsername}>@{user?.username}</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {[
                { label: 'Posts', value: userStats.totalPosts, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', hasShare: false },
                { label: 'Unique', value: userStats.uniquePosts, icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', hasShare: false },
                { label: 'OOT Streak', value: `${userStats.streak}d`, icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z', hasShare: true },
                { label: 'Elite', value: userStats.topTier, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', hasShare: false },
              ].map((stat, idx) => (
                <BlurView key={idx} intensity={30} tint="dark" style={styles.statBox}>
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.15)', 'transparent']}
                    style={styles.statBoxGradient}
                  >
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                      <Path d={stat.icon} stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    {stat.hasShare && (
                      <TouchableOpacity 
                        style={styles.miniShareButton}
                        onPress={() => setShowStreakShare(true)}
                        activeOpacity={0.7}
                      >
                        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                          <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      </TouchableOpacity>
                    )}
                  </LinearGradient>
                </BlurView>
              ))}
            </View>

            {/* Recent Posts Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT POSTS</Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('AllPosts')}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {recentPosts.map((post, idx) => (
              <Animated.View
                key={post.id}
                style={[
                  { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }
                ]}
              >
                <BlurView intensity={30} tint="dark" style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={[styles.tierBadge, { backgroundColor: `${getTierColor(post.tier)}20` }]}>
                      <Text style={[styles.tierText, { color: getTierColor(post.tier) }]}>
                        {post.tier.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.postDate}>{post.date}</Text>
                  </View>
                  
                  <Text style={styles.postContent}>{post.content}</Text>
                  
                  <View style={styles.postFooter}>
                    <View style={styles.percentileContainer}>
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Circle cx="12" cy="12" r="10" stroke="#8b5cf6" strokeWidth={2} />
                        <Path d="M12 6v6l4 2" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" />
                      </Svg>
                      <Text style={styles.percentileText}>{post.percentile}th percentile</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path d="M9 5l7 7-7 7" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Streak Share Card Modal */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradient: {
    flex: 1,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
    paddingBottom: scale(120),
  },
  
  // Anonymous User Styles
  anonymousHeader: {
    alignItems: 'center',
    marginTop: scale(20),
    marginBottom: scale(28),
  },
  guestAvatar: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  anonymousTitle: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: scale(6),
  },
  anonymousSubtitle: {
    fontSize: moderateScale(13, 0.2),
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: scale(16),
  },
  signupCard: {
    borderRadius: scale(20),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  signupGradient: {
    padding: scale(24),
    alignItems: 'center',
  },
  signupTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginTop: scale(16),
    marginBottom: scale(10),
    textAlign: 'center',
  },
  signupDescription: {
    fontSize: moderateScale(13, 0.2),
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: moderateScale(20, 0.2),
    marginBottom: scale(20),
    paddingHorizontal: scale(8),
  },
  featuresList: {
    width: '100%',
    marginBottom: scale(20),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  featureText: {
    fontSize: moderateScale(12, 0.2),
    color: '#e5e7eb',
    marginLeft: scale(10),
    fontWeight: '300',
    flex: 1,
  },
  signupButton: {
    width: '100%',
    borderRadius: scale(12),
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  signupButtonGradient: {
    paddingVertical: scale(14),
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(15, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Registered User Styles
  profileHeader: {
    alignItems: 'center',
    marginTop: scale(12),
    marginBottom: scale(24),
  },
  avatarContainer: {
    marginBottom: scale(12),
  },
  avatarGradient: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: moderateScale(32, 0.4),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 2,
  },
  profileName: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: scale(4),
    textAlign: 'center',
    paddingHorizontal: scale(16),
  },
  profileUsername: {
    fontSize: moderateScale(13, 0.2),
    color: '#8b5cf6',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
    marginBottom: scale(24),
    justifyContent: 'space-between',
  },
  statBox: {
    width: (SCREEN_WIDTH - scale(42)) / 2,
    minWidth: scale(150),
    borderRadius: scale(14),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  statBoxGradient: {
    padding: scale(14),
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(24, 0.4),
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginTop: scale(6),
  },
  statLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    letterSpacing: 0.5,
    fontWeight: '500',
    marginTop: scale(4),
  },
  miniShareButton: {
    position: 'absolute',
    bottom: scale(12),
    right: scale(12),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(11, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(1.5),
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: moderateScale(11, 0.2),
    color: '#8b5cf6',
    fontWeight: '600',
  },
  postCard: {
    borderRadius: scale(14),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: scale(14),
    marginBottom: scale(10),
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(10),
    flexWrap: 'wrap',
    gap: scale(8),
  },
  tierBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(6),
  },
  tierText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  postDate: {
    fontSize: moderateScale(10, 0.2),
    color: '#6b7280',
    fontWeight: '500',
  },
  postContent: {
    fontSize: moderateScale(14, 0.2),
    color: '#ffffff',
    lineHeight: moderateScale(20, 0.2),
    marginBottom: scale(10),
    fontWeight: '300',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  percentileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  percentileText: {
    fontSize: moderateScale(11, 0.2),
    color: '#8b5cf6',
    fontWeight: '500',
  },
  settingsIcon: {
    position: 'absolute',
    top: scale(12),
    right: scale(16),
    zIndex: 10,
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

