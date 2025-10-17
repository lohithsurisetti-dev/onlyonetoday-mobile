/**
 * Login Screen
 * Premium cosmic-themed login with OTP authentication
 * Matches signup screen styling
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/authStore';

// Responsive scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Floating star component (same as signup)
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
              duration: 2000 + Math.random() * 1000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 1500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.2,
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
          transform: [
            { translateY },
            { translateX },
            { scale: starScale },
          ],
          opacity,
        },
      ]}
    >
      <Svg width={scale(6)} height={scale(6)} viewBox="0 0 24 24">
        <Path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="#ffffff"
        />
      </Svg>
    </Animated.View>
  );
};

type LoginScreenProps = {
  navigation: any;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      console.log('📧 Sending login OTP to:', email);

      // Send OTP for login
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
      });

      if (error) {
        console.error('❌ OTP send error:', error);
        Alert.alert(
          'Failed to Send OTP',
          error.message || 'Failed to send verification code. Please try again.'
        );
        setIsLoading(false);
        return;
      }

      console.log('✅ OTP sent successfully');

      // Navigate to OTP verification
      navigation.navigate('OTPVerification', {
        method: 'email',
        contact: email.trim(),
      });
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'Something went wrong. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
        {/* Floating Stars Background */}
        <View style={styles.starsContainer} pointerEvents="none">
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <FloatingStar delay={i * 100} />
            </View>
          ))}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <Animated.View style={{ opacity: fadeAnim }}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path d="M15 18l-6-6 6-6" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUpAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>WELCOME BACK</Text>
                <Text style={styles.subtitle}>Enter your email to continue</Text>
              </View>

              {/* Login Card */}
              <BlurView intensity={20} tint="dark" style={styles.card}>
                {/* Email Input */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : null}
                </View>

                {/* Info Text */}
                <Text style={styles.infoText}>
                  We'll send you a verification code to sign in
                </Text>

                {/* Continue Button */}
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={isLoading ? ['rgba(107, 114, 128, 0.5)', 'rgba(107, 114, 128, 0.3)'] : ['#8b5cf6', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.continueGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.continueText}>Send OTP</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </BlurView>

              {/* Signup Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupPrompt}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={isLoading}>
                  <Text style={styles.signupLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: scale(60),
    paddingBottom: scale(40),
    paddingHorizontal: scale(24),
  },
  backButton: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(16),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: scale(32),
  },
  title: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: scale(1),
    marginBottom: scale(12),
  },
  subtitle: {
    fontSize: moderateScale(13, 0.2),
    color: '#9ca3af',
    marginBottom: scale(4),
  },
  card: {
    width: '100%',
    borderRadius: scale(24),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: scale(24),
  },
  inputSection: {
    marginBottom: scale(20),
  },
  inputLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(10),
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    color: '#ffffff',
    fontSize: moderateScale(15, 0.2),
  },
  errorText: {
    color: '#ef4444',
    fontSize: moderateScale(11, 0.2),
    marginTop: scale(6),
    marginLeft: scale(4),
  },
  infoText: {
    fontSize: moderateScale(12, 0.2),
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: scale(24),
    lineHeight: moderateScale(18, 0.2),
  },
  continueButton: {
    width: '100%',
    borderRadius: scale(12),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  continueGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#ffffff',
    fontSize: moderateScale(15, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(6),
    marginTop: scale(32),
  },
  signupPrompt: {
    fontSize: moderateScale(13, 0.2),
    color: '#6b7280',
  },
  signupLink: {
    fontSize: moderateScale(13, 0.2),
    color: '#ec4899',
    fontWeight: '600',
  },
});
