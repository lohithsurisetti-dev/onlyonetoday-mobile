/**
 * Premium Home Screen - Create Post
 * Luxurious design with smooth animations
 * Uses React Native Animated API (no reanimated dependency issues)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useCreatePost } from '../hooks/usePosts';
import { usePlatformStats } from '@/lib/hooks/useStats';
import type { InputType, Scope } from '@shared/types/common.types';

// Responsive scaling helper
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size; // Base design on iPhone 12 (375px)
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function HomeScreenPremium({ navigation }: any) {
  const [content, setContent] = useState('');
  const [inputType, setInputType] = useState<InputType>('action');
  const [scope, setScope] = useState<Scope>('world');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const [scopeContainerWidth, setScopeContainerWidth] = useState(0);

  const { mutate: createPost, isPending } = useCreatePost();
  const { stats } = usePlatformStats();

  // Animation values
  const tabSlideAnim = useRef(new Animated.Value(0)).current;
  const scopeSlideAnim = useRef(new Animated.Value(0)).current;
  const inputBorderAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const handleSubmit = () => {
    if (content.trim().length < 3) {
      setError('Please enter at least 3 characters');
      return;
    }

    setError('');
    
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    createPost(
      { content: content.trim(), inputType, scope },
      {
        onSuccess: () => {
          Alert.alert('Success!', 'Your post has been created');
          setContent('');
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to create post');
        },
      }
    );
  };

  const handleTypeChange = (type: InputType) => {
    setInputType(type);
    Animated.spring(tabSlideAnim, {
      toValue: type === 'action' ? 0 : 1,
      damping: 20,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleScopeChange = (newScope: Scope) => {
    setScope(newScope);
    const scopes: Scope[] = ['world', 'country', 'state', 'city'];
    const index = scopes.indexOf(newScope);
    Animated.spring(scopeSlideAnim, {
      toValue: index,
      damping: 20,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(inputBorderAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(inputBorderAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Interpolate border color
  const borderColor = inputBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 1)'],
  });

  const borderWidth = inputBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>ONLYONE</Text>
            <Text style={styles.subtitle}>DISCOVER YOUR UNIQUENESS</Text>
          </View>

          {/* Premium Stats Cards */}
          <View style={styles.statsRow}>
            <BlurView intensity={30} tint="dark" style={styles.statCard}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.15)', 'transparent']}
                style={styles.statGradient}
              >
                <Text style={styles.statLabel}>TODAY</Text>
                <Text style={styles.statValue}>
                  {stats?.totalPostsToday?.toLocaleString() || '0'}
                </Text>
                <Text style={styles.statSubtext}>Posts</Text>
              </LinearGradient>
            </BlurView>

            <BlurView intensity={30} tint="dark" style={styles.statCard}>
              <LinearGradient
                colors={['rgba(236, 72, 153, 0.15)', 'transparent']}
                style={styles.statGradient}
              >
                <Text style={styles.statLabel}>UNIQUE</Text>
                <Text style={styles.statValue}>
                  {stats?.uniqueActionsToday?.toLocaleString() || '0'}
                </Text>
                <Text style={styles.statSubtext}>Actions</Text>
              </LinearGradient>
            </BlurView>
          </View>

          {/* Main Card */}
          <BlurView intensity={40} tint="dark" style={styles.mainCard}>
            <Text style={styles.cardTitle}>What did you do today?</Text>

            {/* Premium Tab Selector */}
            <View 
              style={styles.tabContainer}
              onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
            >
              <View style={styles.tabBackground}>
                <Animated.View
                  style={[
                    styles.tabIndicator,
                    {
                      transform: [
                        {
                          translateX: tabSlideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (tabContainerWidth / 2) - 4], // Half width minus padding
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <View style={styles.tabButtons}>
                <TouchableOpacity
                  style={styles.tabButton}
                  onPress={() => handleTypeChange('action')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, inputType === 'action' && styles.tabTextActive]}>
                    Single Action
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.tabButton}
                  onPress={() => handleTypeChange('day')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, inputType === 'day' && styles.tabTextActive]}>
                    Day Summary
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Premium Input */}
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  borderColor,
                  borderWidth,
                },
              ]}
            >
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="I discovered a hidden rooftop garden..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                maxLength={500}
                style={styles.textInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <View style={styles.inputFooter}>
                {error ? <Text style={styles.errorText}>{error}</Text> : <View />}
                <Text style={styles.charCount}>{content.length}/500</Text>
              </View>
            </Animated.View>

            {/* Scope Selector */}
            <View style={styles.scopeContainer}>
              <Text style={styles.scopeLabel}>COMPARE WITHIN</Text>
              <View 
                style={styles.scopeSelector}
                onLayout={(e) => setScopeContainerWidth(e.nativeEvent.layout.width)}
              >
                <View style={styles.scopeBackground}>
                  <Animated.View
                    style={[
                      styles.scopeIndicator,
                      {
                        transform: [
                          {
                            translateX: scopeSlideAnim.interpolate({
                              inputRange: [0, 1, 2, 3],
                              outputRange: [
                                0,
                                (scopeContainerWidth / 4) - 4,
                                ((scopeContainerWidth / 4) * 2) - 4,
                                ((scopeContainerWidth / 4) * 3) - 4,
                              ],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </View>
                <View style={styles.scopeButtons}>
                  {(['world', 'country', 'state', 'city'] as Scope[]).map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.scopeButton}
                      onPress={() => handleScopeChange(s)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.scopeText, scope === s && styles.scopeTextActive]}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isPending}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#ec4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {isPending ? 'Creating...' : 'Discover My Uniqueness'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </BlurView>
        </Animated.ScrollView>
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
  scrollContent: {
    padding: scale(20),
    paddingBottom: scale(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: scale(28),
    marginTop: scale(8),
  },
  title: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: scale(4),
  },
  subtitle: {
    fontSize: moderateScale(11, 0.2),
    color: '#9ca3af',
    marginTop: scale(8),
    letterSpacing: scale(2),
    fontWeight: '300',
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(16),
    marginBottom: scale(28),
  },
  statCard: {
    flex: 1,
    borderRadius: scale(18),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: scale(16),
    alignItems: 'center',
  },
  statLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(6),
  },
  statValue: {
    fontSize: moderateScale(28, 0.4),
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: -1,
  },
  statSubtext: {
    fontSize: moderateScale(11, 0.2),
    color: '#6b7280',
    marginTop: scale(4),
    fontWeight: '300',
  },
  mainCard: {
    borderRadius: scale(22),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: scale(24),
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: scale(22),
    letterSpacing: 0.5,
  },
  tabContainer: {
    marginBottom: scale(20),
    position: 'relative',
    height: scale(50),
  },
  tabBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    width: '47%',
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButtons: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 1,
    height: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  tabText: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '500',
    color: '#6b7280',
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: scale(16),
    marginBottom: scale(20),
  },
  textInput: {
    padding: scale(16),
    color: '#ffffff',
    fontSize: moderateScale(16, 0.2),
    minHeight: scale(130),
    textAlignVertical: 'top',
    fontWeight: '300',
    lineHeight: moderateScale(24, 0.2),
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingBottom: scale(12),
  },
  errorText: {
    color: '#ef4444',
    fontSize: moderateScale(12, 0.2),
  },
  charCount: {
    color: '#6b7280',
    fontSize: moderateScale(11, 0.2),
    fontWeight: '500',
  },
  scopeContainer: {
    marginBottom: scale(24),
  },
  scopeLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(12),
    textAlign: 'center',
  },
  scopeSelector: {
    position: 'relative',
    height: scale(44),
  },
  scopeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  scopeIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    width: '23.5%',
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    borderRadius: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  scopeButtons: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 1,
    height: '100%',
  },
  scopeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  scopeText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '500',
    color: '#6b7280',
  },
  scopeTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: moderateScale(16, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
