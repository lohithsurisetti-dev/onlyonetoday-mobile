/**
 * Create Dream Screen
 * Form to create a dream post with interpretation
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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { createDreamPost, type DreamType, type Scope } from '@/lib/api/dreams';
import { useLocation } from '@/lib/hooks/useLocation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import DreamIcon from '../components/DreamIcon';
import { colors } from '@/config/theme.config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Helper function to get dream type color
const getDreamTypeColor = (type: string): string => {
  switch (type) {
    case 'night_dream':
      return 'rgba(99, 102, 241, 0.3)'; // Indigo
    case 'daydream':
      return 'rgba(251, 191, 36, 0.3)'; // Amber
    case 'lucid_dream':
      return 'rgba(168, 85, 247, 0.3)'; // Purple
    case 'nightmare':
      return 'rgba(239, 68, 68, 0.3)'; // Red
    default:
      return 'rgba(255, 255, 255, 0.1)';
  }
};

// Helper function to get scope color
const getScopeColor = (scope: string): string => {
  switch (scope) {
    case 'world':
      return 'rgba(59, 130, 246, 0.3)'; // Blue
    case 'country':
      return 'rgba(34, 197, 94, 0.3)'; // Green
    case 'state':
      return 'rgba(251, 191, 36, 0.3)'; // Amber
    case 'city':
      return 'rgba(168, 85, 247, 0.3)'; // Purple
    default:
      return 'rgba(255, 255, 255, 0.1)';
  }
};

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

interface CreateDreamScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateDream'>;
}

export default function CreateDreamScreen({ navigation }: CreateDreamScreenProps) {
  const { location } = useLocation();
  
  const [content, setContent] = useState('');
  const [dreamType, setDreamType] = useState<DreamType>('night_dream');
  const [clarity, setClarity] = useState(5);
  const [scope, setScope] = useState<Scope>('world');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = async () => {
    if (content.trim().length < 10) {
      setError('Please describe your dream (at least 10 characters)');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
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

    try {
      console.log('🚀 Starting dream creation...', {
        contentLength: content.trim().length,
        dreamType,
        clarity,
        scope,
      });

      // Add timeout to prevent infinite loading (90 seconds to allow for AI processing)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 90 seconds. The dream interpretation may be taking longer than expected. Please try again.')), 90000); // 90 second timeout
      });

      const result = await Promise.race([
        createDreamPost({
        content: content.trim(),
        dreamType,
        clarity,
        scope,
        locationCity: location?.city || null,
        locationState: location?.state || null,
        locationCountry: location?.country || null,
        }),
        timeoutPromise,
      ]) as any;

      console.log('📥 Dream creation response:', {
        success: result?.success,
        hasPost: !!result?.post,
        error: result?.error,
      });

      if (!result || !result.success || !result.post) {
        const errorMsg = result?.error || 'Failed to create dream. Please check your connection and try again.';
        console.error('❌ Dream creation failed:', errorMsg);
        setError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Dream created successfully, navigating...');

      // Navigate to response screen with interpretation
      navigation.navigate('DreamResponse', {
        dream: result.post,
        content: content.trim(),
      });

      setContent('');
      setIsSubmitting(false);
    } catch (err: any) {
      console.error('❌ Dream creation exception:', err);
      const errorMessage = err?.message || err?.error || 'Failed to create dream. Please try again.';
      console.error('Error details:', {
        message: err?.message,
        error: err?.error,
        stack: err?.stack,
      });
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const dreamTypes: { type: DreamType; label: string }[] = [
    { type: 'night_dream', label: 'Night Dream' },
    { type: 'daydream', label: 'Daydream' },
    { type: 'lucid_dream', label: 'Lucid Dream' },
    { type: 'nightmare', label: 'Nightmare' },
  ];

  const scopes: { value: Scope; label: string }[] = [
    { value: 'world', label: 'Worldwide' },
    { value: 'country', label: 'Country' },
    { value: 'state', label: 'State' },
    { value: 'city', label: 'City' },
  ];

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={[colors.backgroundDark, '#1a1a3a', '#2d1b4e']}
        style={styles.gradient}
        pointerEvents="box-none"
      >
        {/* Floating Stars */}
        <View style={styles.starsContainer} pointerEvents="none">
          {[...Array(30)].map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <FloatingStar delay={i * 150} />
            </View>
          ))}
        </View>

        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
        >
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
              <Text style={styles.title}>Share Your Dream</Text>
            <Text style={styles.subtitle}>Let AI interpret your subconscious</Text>
            </View>
            <View style={styles.backButton} />
          </View>

          {/* Main Card */}
          <View style={styles.mainCardWrapper}>
          <BlurView intensity={40} tint="dark" style={styles.mainCard}>
            {/* Dream Type Pills */}
            <Text style={styles.label}>DREAM TYPE</Text>
            <View style={styles.dreamTypePills}>
              {dreamTypes.map((dt) => {
                const isActive = dreamType === dt.type;
                return (
                <TouchableOpacity
                  key={dt.type}
                  style={[
                      styles.dreamTypePill,
                      isActive && { backgroundColor: getDreamTypeColor(dt.type) },
                  ]}
                  onPress={() => setDreamType(dt.type)}
                  activeOpacity={0.7}
                >
                    <DreamIcon type={dt.type} size={14} color="#ffffff" />
                    <Text style={styles.dreamTypePillText}>
                      {dt.type === 'night_dream' ? 'Night' :
                       dt.type === 'daydream' ? 'Day' :
                       dt.type === 'lucid_dream' ? 'Lucid' :
                       'Nightmare'}
                  </Text>
                </TouchableOpacity>
                );
              })}
            </View>

            {/* Content Input */}
            <Text style={styles.label}>DESCRIBE YOUR DREAM</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={content}
                onChangeText={(text) => {
                  setContent(text);
                  if (error) setError('');
                }}
                placeholder="I dreamed I was flying over mountains at sunset..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                maxLength={1000}
                scrollEnabled={true}
                style={styles.textInput}
              />
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{content.length}/1000</Text>
              </View>
            </View>

            {/* Clarity Slider */}
            <Text style={styles.label}>CLARITY: {clarity}/10</Text>
            <View style={styles.clarityContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.clarityButton,
                    clarity >= value && styles.clarityButtonActive,
                  ]}
                  onPress={() => setClarity(value)}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            {/* Scope Pills */}
            <Text style={styles.label}>COMPARE WITHIN</Text>
            <View style={styles.scopePills}>
              {scopes.map((s) => (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.scopePill,
                    scope === s.value && { backgroundColor: getScopeColor(s.value) },
                  ]}
                  onPress={() => setScope(s.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.scopePillText}>
                    {s.value === 'world' ? 'World' :
                     s.value === 'country' ? 'Country' :
                     s.value === 'state' ? 'State' :
                     'City'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  onPress={() => setError('')}
                  style={{ marginTop: scale(8) }}
                >
                  <Text style={[styles.errorText, { fontSize: moderateScale(11, 0.2), opacity: 0.7 }]}>
                    Dismiss
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Submit Button */}
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitText}>
                    {isSubmitting ? 'Interpreting...' : 'Get Dream Insights'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </BlurView>
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
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
  },
  star: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    padding: scale(20),
    paddingTop: scale(60),
    paddingBottom: scale(100),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: scale(24),
    marginTop: scale(0),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(-8),
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
  title: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  mainCardWrapper: {
    borderRadius: scale(24),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainCard: {
    padding: scale(24),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  label: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    color: colors.textTertiary,
    marginTop: scale(20),
    marginBottom: scale(12),
    letterSpacing: 1,
  },
  dreamTypePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: scale(8),
  },
  dreamTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dreamTypePillText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: scale(8),
    maxHeight: scale(200),
  },
  textInput: {
    padding: scale(16),
    color: colors.textPrimary,
    fontSize: moderateScale(15, 0.2),
    lineHeight: moderateScale(22, 0.2),
    minHeight: scale(120),
    textAlignVertical: 'top',
  },
  inputFooter: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(12),
    alignItems: 'flex-end',
  },
  charCount: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
  },
  clarityContainer: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: scale(8),
  },
  clarityButton: {
    flex: 1,
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  clarityButtonActive: {
    backgroundColor: colors.primary,
  },
  scopePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: scale(8),
  },
  scopePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scopePillText: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  errorContainer: {
    marginTop: scale(12),
    padding: scale(12),
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#f87171',
    fontSize: moderateScale(13, 0.2),
    textAlign: 'center',
  },
  submitButton: {
    marginTop: scale(24),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  submitText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
});
