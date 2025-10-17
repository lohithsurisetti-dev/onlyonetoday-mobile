/**
 * Days Hub Screen
 * Central hub showing all 7 themed days with premium cosmic design
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCurrentDay, getAllDayThemes, DayOfWeek, DayTheme } from '../types';
import DayIcon from '../components/DayIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type DaysHubScreenProps = {
  navigation: any;
};

export default function DaysHubScreen({ navigation }: DaysHubScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const currentDay = getCurrentDay();
  const allDays = getAllDayThemes();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const getDayStatus = (day: DayOfWeek): 'current' | 'past' | 'future' => {
    const dayOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentIndex = dayOrder.indexOf(currentDay);
    const dayIndex = dayOrder.indexOf(day);

    if (dayIndex === currentIndex) return 'current';
    if (dayIndex < currentIndex) return 'past';
    return 'future';
  };

  const getDaysUntil = (day: DayOfWeek): number => {
    const dayOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentIndex = dayOrder.indexOf(currentDay);
    const dayIndex = dayOrder.indexOf(day);
    
    if (dayIndex === currentIndex) return 0;
    if (dayIndex > currentIndex) return dayIndex - currentIndex;
    return 7 - currentIndex + dayIndex;
  };

  const getParticipantCount = (day: DayOfWeek): number => {
    // Mock data - will be replaced with API
    const counts: Record<DayOfWeek, number> = {
      monday: 2431,
      tuesday: 1892,
      wednesday: 2156,
      thursday: 1543,
      friday: 2789,
      saturday: 1678,
      sunday: 1234,
    };
    return counts[day];
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Daily Vibes</Text>
              <Text style={styles.headerSubtitle}>Seven days, seven communities</Text>
            </View>
            <View style={styles.backButton} />
          </View>

          {/* Days Grid */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {allDays.map((day, index) => {
              const status = getDayStatus(day.id);
              const daysUntil = getDaysUntil(day.id);
              const participants = getParticipantCount(day.id);

              return (
                <DayCard
                  key={day.id}
                  day={day}
                  status={status}
                  daysUntil={daysUntil}
                  participants={participants}
                  index={index}
                  onPress={() => navigation.navigate('DayFeed', { day: day.id })}
                />
              );
            })}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

// ============================================================================
// DAY CARD COMPONENT
// ============================================================================

interface DayCardProps {
  day: DayTheme;
  status: 'current' | 'past' | 'future';
  daysUntil: number;
  participants: number;
  index: number;
  onPress: () => void;
}

function DayCard({ day, status, daysUntil, participants, index, onPress }: DayCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for current day
    if (status === 'current') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  const getStatusBadge = () => {
    if (status === 'current') {
      return (
        <View style={[styles.statusBadge, styles.statusBadgeCurrent]}>
          <View style={styles.liveDot} />
          <Text style={styles.statusBadgeText}>POST NOW</Text>
        </View>
      );
    }
    if (status === 'future') {
      return (
        <View style={[styles.statusBadge, styles.statusBadgeFuture]}>
          <Text style={styles.statusBadgeText}>Opens in {daysUntil}d</Text>
        </View>
      );
    }
    return (
      <View style={[styles.statusBadge, styles.statusBadgePast]}>
        <Text style={styles.statusBadgeText}>This Week</Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.dayCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: status === 'current' ? pulseAnim : 1 },
          ],
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <BlurView intensity={status === 'current' ? 30 : 20} tint="dark" style={styles.cardBlur}>
          <LinearGradient
            colors={
              status === 'current'
                ? [`${day.color}15`, `${day.color}08`, 'rgba(255, 255, 255, 0.03)']
                : ['rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)', 'transparent']
            }
            style={styles.cardGradient}
          >
            {/* Glow effect for current day */}
            {status === 'current' && (
              <View style={[styles.cardGlow, { backgroundColor: day.color, opacity: 0.1 }]} />
            )}

            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <DayIcon icon={day.icon} size={scale(28)} color={day.color} />
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.dayName}>{day.name}</Text>
                  <Text style={styles.dayVibe}>{day.shortDesc}</Text>
                </View>
              </View>
              {getStatusBadge()}
            </View>

            {/* Description */}
            <Text style={styles.dayDescription} numberOfLines={2}>
              {day.description}
            </Text>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.participantCount}>
                <View style={[styles.participantDot, { backgroundColor: day.color }]} />
                <Text style={styles.participantText}>
                  {status === 'current' 
                    ? `${participants.toLocaleString()} sharing today`
                    : status === 'past'
                    ? `${participants.toLocaleString()} shared this week`
                    : 'Be ready to share'}
                </Text>
              </View>

              <View style={styles.arrowContainer}>
                <Text style={[styles.arrow, { color: day.color }]}>→</Text>
              </View>
            </View>

            {/* Border accent */}
            <View style={[styles.cardBorder, { borderColor: day.color, opacity: status === 'current' ? 0.4 : 0.15 }]} />
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: scale(60),
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: scale(24),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: moderateScale(28, 0.3),
    color: '#ffffff',
    fontWeight: '300',
  },
  headerCenter: {
    alignItems: 'center',
    gap: scale(4),
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(100),
    gap: scale(14),
  },

  // Day Card
  dayCard: {
    marginBottom: scale(2),
  },
  cardBlur: {
    borderRadius: scale(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardGradient: {
    padding: scale(18),
    position: 'relative',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(20),
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(20),
    borderWidth: 1.5,
    pointerEvents: 'none',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flex: 1,
  },
  cardTitleContainer: {
    flex: 1,
  },
  dayName: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
    marginBottom: scale(2),
  },
  dayVibe: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Status Badges
  statusBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(10),
    borderWidth: 1,
  },
  statusBadgeCurrent: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  statusBadgeFuture: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  statusBadgePast: {
    backgroundColor: 'rgba(161, 161, 170, 0.12)',
    borderColor: 'rgba(161, 161, 170, 0.3)',
  },
  statusBadgeText: {
    fontSize: moderateScale(9, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  liveDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#22c55e',
  },

  // Description
  dayDescription: {
    fontSize: moderateScale(12, 0.2),
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: moderateScale(18, 0.2),
    marginBottom: scale(14),
    fontWeight: '400',
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  participantDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
  },
  participantText: {
    fontSize: moderateScale(10, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  arrowContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
  },
});

