/**
 * OTP Verification Screen
 * 6-digit code entry with auto-focus and animations
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/lib/stores/authStore';
import { supabase } from '@/lib/supabase';

// Responsive scaling
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

type OTPVerificationScreenProps = {
  navigation: any;
  route: {
    params: {
      method: 'phone' | 'email';
      contact: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      dateOfBirth?: string;
    };
  };
};

export default function OTPVerificationScreen({ navigation, route }: OTPVerificationScreenProps) {
  const { method, contact, firstName, lastName, username, dateOfBirth } = route.params;
  const { setUser } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

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

    // Focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 300);

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when complete
    if (index === 5 && value) {
      const code = [...newOtp.slice(0, 5), value].join('');
      handleVerify(code);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      console.log('📧 Resending OTP to:', contact);

      // Send OTP again - handle both signup and login flows
      const otpOptions: any = {};
      
      // Only include user metadata if we're in signup flow
      if (firstName && lastName && username) {
        otpOptions.data = {
          first_name: firstName,
          last_name: lastName,
          username: username,
          date_of_birth: dateOfBirth,
        };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: contact,
        options: otpOptions
      });

      if (error) {
        console.error('❌ Resend OTP error:', error);
        Alert.alert(
          'Failed to Resend Code',
          error.message || 'Failed to resend verification code. Please try again.'
        );
        return;
      }

      console.log('✅ OTP resent successfully');
      
      // Reset timer and OTP inputs
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
      
      Alert.alert(
        'Code Sent',
        'A new verification code has been sent to your email.'
      );
    } catch (error: any) {
      console.error('❌ Resend error:', error);
      Alert.alert(
        'Failed to Resend Code',
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (code: string) => {
    try {
      console.log('🔐 Verifying OTP:', code);
      console.log('📧 Email:', contact);
      
      setIsLoading(true);

      // Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: contact,
        token: code,
        type: 'email',
      });

      if (error) {
        console.error('❌ OTP verification failed:', error);
        Alert.alert(
          'Invalid Code',
          'The code you entered is incorrect or has expired. Please try again.'
        );
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        throw new Error('No user returned after OTP verification');
      }

      console.log('✅ OTP verified! User ID:', data.user.id);

      // If signup flow, create profile
      if (username && firstName && lastName) {
        console.log('📝 Creating profile for new user...');
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username.toLowerCase().trim(),
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth || null,
            signup_source: 'mobile',
          });

        if (profileError) {
          console.error('⚠️ Profile creation error:', profileError);
          
          // Check if it's a duplicate username error (race condition)
          if (profileError.code === '23505' || profileError.message.includes('unique') || profileError.message.includes('duplicate')) {
            Alert.alert(
              'Username Already Taken',
              'This username was taken while you were signing up. Please go back and choose a different username.',
              [
                {
                  text: 'Go Back',
                  onPress: () => {
                    // Sign out and go back
                    supabase.auth.signOut();
                    navigation.goBack();
                  },
                  style: 'default'
                }
              ]
            );
            setIsLoading(false);
            return;
          }
          
          // For other errors, show warning but continue
          Alert.alert(
            'Profile Creation Warning',
            'Your account was created, but there was an issue saving your profile. You may need to complete your profile later.',
            [{ text: 'OK' }]
          );
        } else {
          console.log('✅ Profile created successfully');
        }

        // Update auth store with signup data
        setUser({
          id: data.user.id,
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: contact,
          isAnonymous: false,
        });
      } else {
        // Login flow - fetch existing profile or create one if it doesn't exist
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          console.log('⚠️ Profile not found - user needs to sign up first');
          
          // Sign out the user since they don't have a profile
          await supabase.auth.signOut();
          
          Alert.alert(
            'Account Not Found',
            'No account found with this email. It looks like you\'re trying to log in, but you need to create an account first.',
            [
              {
                text: 'Create Account',
                onPress: () => navigation.navigate('Signup'),
                style: 'default'
              },
              {
                text: 'Try Different Email',
                onPress: () => navigation.goBack(),
                style: 'cancel'
              }
            ]
          );
          
          setIsLoading(false);
          return;
        } else {
          console.log('✅ Profile loaded');

          // Update auth store with profile data
          setUser({
            id: data.user.id,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            username: profile.username || 'user',
            email: contact,
            isAnonymous: false,
          });
        }
      }

      console.log('✅ User authenticated and profile created!');

      // Navigate to home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as never }],
      });
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      Alert.alert(
        'Verification Failed',
        error.message || 'Failed to verify code. Please try again.'
      );
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    handleResendCode();
  };

  return (
    <View style={styles.safeArea}>
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

        <View style={styles.container}>
          {/* Header with Back Button */}
          <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
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
            {/* Header Text */}
            <View style={styles.header}>
              <Text style={styles.title}>ENTER VERIFICATION CODE</Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit code to
              </Text>
              <Text style={styles.contact}>{contact}</Text>
            </View>

            {/* OTP Inputs - No Card */}
            <View style={styles.otpSection}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpInputWrapper}>
                    <TextInput
                      ref={(ref) => { inputRefs.current[index] = ref; }}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      style={[
                        styles.otpInput,
                        digit && styles.otpInputFilled,
                      ]}
                    />
                  </View>
                ))}
              </View>

              {/* Resend */}
              <View style={styles.resendContainer}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>Resend code in {timer}s</Text>
                ) : (
                  <TouchableOpacity 
                    onPress={handleResend} 
                    activeOpacity={0.7}
                    disabled={isResending}
                    style={styles.resendButton}
                  >
                    {isResending ? (
                      <View style={styles.resendLoadingContainer}>
                        <ActivityIndicator size="small" color="#8b5cf6" />
                        <Text style={[styles.resendText, { marginLeft: 8 }]}>Sending...</Text>
                      </View>
                    ) : (
                      <Text style={styles.resendText}>Resend Code</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Verify Button - Separate Card */}
            <BlurView intensity={40} tint="dark" style={styles.card}>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => handleVerify(otp.join(''))}
                disabled={!otp.every(d => d) || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={otp.every(d => d) && !isLoading ? ['#8b5cf6', '#ec4899'] : ['rgba(75, 85, 99, 0.5)', 'rgba(55, 65, 81, 0.5)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.verifyGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={[styles.verifyText, !otp.every(d => d) && styles.verifyTextDisabled]}>
                      Verify Code
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>

            {/* Help Text */}
            <Text style={styles.helpText}>
              Check your {method === 'phone' ? 'messages' : 'inbox'} for the code
            </Text>
          </Animated.View>
        </View>
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
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  topBar: {
    paddingTop: scale(60),
    paddingBottom: scale(12),
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
    paddingBottom: scale(60),
  },
  header: {
    alignItems: 'center',
    marginBottom: scale(40),
  },
  title: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: scale(1),
    marginBottom: scale(16),
  },
  subtitle: {
    fontSize: moderateScale(14, 0.2),
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: scale(6),
  },
  contact: {
    fontSize: moderateScale(15, 0.2),
    color: '#8b5cf6',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  otpSection: {
    marginBottom: scale(24),
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(10),
    marginBottom: scale(24),
  },
  otpInputWrapper: {
    // Wrapper for potential future animations
  },
  otpInput: {
    width: scale(48),
    height: scale(60),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: scale(14),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: moderateScale(26, 0.3),
    fontWeight: '300',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    borderRadius: scale(16),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  verifyButton: {
    overflow: 'hidden',
  },
  verifyGradient: {
    paddingVertical: scale(18),
    alignItems: 'center',
  },
  verifyText: {
    color: '#ffffff',
    fontSize: moderateScale(16, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  verifyTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  resendContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: moderateScale(13, 0.2),
    color: '#6b7280',
    fontWeight: '500',
  },
  resendText: {
    fontSize: moderateScale(13, 0.2),
    color: '#8b5cf6',
    fontWeight: '600',
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    fontSize: moderateScale(12, 0.2),
    color: '#6b7280',
    textAlign: 'center',
    marginTop: scale(28),
    lineHeight: moderateScale(18, 0.2),
  },
});

