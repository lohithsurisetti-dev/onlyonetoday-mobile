/**
 * Create Screen - Create Post
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { useCreatePost } from '../hooks/usePosts';
import { usePlatformStats } from '@/lib/hooks/useStats';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLocation } from '@/lib/hooks/useLocation';
import type { InputType, Scope } from '@shared/types/common.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

// Responsive scaling helper
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size; // Base design on iPhone 12 (375px)
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

type CreateScreenProps = {
  navigation: any;
  onBack?: () => void;
};

export default function CreateScreen({ navigation, onBack }: CreateScreenProps) {
  const { user } = useAuthStore();
  const { location, isLoading: locationLoading, requestLocationPermission } = useLocation();
  
  const [content, setContent] = useState('');
  const [inputType, setInputType] = useState<InputType>('action');
  const [scope, setScope] = useState<Scope>('world');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const [scopeContainerWidth, setScopeContainerWidth] = useState(0);

  const { mutate: createPost, isPending } = useCreatePost();
  // const { stats } = usePlatformStats();
  const stats = null;

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

    // Create post with real API
    createPost(
      { 
        content: content.trim(), 
        inputType, 
        scope,
        locationCity: location?.city || null,
        locationState: location?.state || null,
        locationCountry: location?.country || null,
      },
      {
        onSuccess: (response) => {
          console.log('✅ Post created successfully:', response);
          navigation.navigate('Response', {
            content: content.trim(),
            scope,
            percentile: response.percentile || undefined,
            postId: response.post?.id,
            matchCount: response.matchCount,
            displayText: response.percentile?.displayText,
          });
          setContent('');
        },
        onError: (error: any) => {
          console.error('❌ Post creation failed:', error);
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

  const handleScopeChange = async (newScope: Scope) => {
    setScope(newScope);
    const scopes: Scope[] = ['world', 'country', 'state', 'city'];
    const index = scopes.indexOf(newScope);
    Animated.spring(scopeSlideAnim, {
      toValue: index,
      damping: 20,
      stiffness: 200,
      useNativeDriver: true,
    }).start();

    // Request location permission if country, state, or city is selected
    if (newScope !== 'world' && !location) {
      await requestLocationPermission();
    }
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
    <View style={styles.safeArea}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient} pointerEvents="box-none">
        {/* Floating Stars Background */}
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

        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onBack ? onBack() : navigation.goBack()}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>CREATE POST</Text>
            <Text style={styles.subtitle}>SHARE YOUR MOMENT</Text>
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
                            outputRange: [0, tabContainerWidth / 2], // Exactly half width
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

              {/* Location Display */}
              {scope !== 'world' && (
                <View style={styles.locationDisplay}>
                  {locationLoading ? (
                    <View style={styles.locationLoadingContainer}>
                      <ActivityIndicator size="small" color="#8b5cf6" />
                      <Text style={styles.locationLoadingText}>Fetching location...</Text>
                    </View>
                  ) : location ? (
                    <View style={styles.locationTextContainer}>
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                        <Path d="M12 21C10.73 21 7.67 16.69 7.14 15.88C5.78 13.73 5 12.06 5 10C5 5.58 8.03 3 12 3C15.97 3 19 5.58 19 10C19 12.06 18.22 13.73 16.86 15.88C16.33 16.69 13.27 21 12 21Z" stroke="#8b5cf6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        <Path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#8b5cf6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                      <Text style={styles.locationText}>
                        {
                          scope === 'city' 
                            ? [location.city, location.state, location.country].filter(Boolean).join(', ')
                            : scope === 'state'
                            ? [location.state, location.country].filter(Boolean).join(', ')
                            : location.country
                        }
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
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
                    {isPending ? 'Creating...' : 'Discover'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </BlurView>
        </Animated.ScrollView>
      </LinearGradient>
    </View>
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
  scrollContent: {
    padding: scale(20),
    paddingTop: scale(60),
    paddingBottom: scale(100),
  },
  backButton: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(16),
    marginLeft: scale(-8),
  },
  header: {
    alignItems: 'center',
    marginBottom: scale(24),
    marginTop: scale(0),
  },
  title: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: scale(2),
  },
  subtitle: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    marginTop: scale(8),
    letterSpacing: scale(2),
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
    right: '50%',
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
  locationDisplay: {
    marginTop: scale(12),
    paddingHorizontal: scale(8),
  },
  locationLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    justifyContent: 'center',
  },
  locationLoadingText: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  locationTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
  },
  locationText: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(139, 92, 246, 0.9)',
    fontWeight: '500',
    letterSpacing: 0.3,
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
