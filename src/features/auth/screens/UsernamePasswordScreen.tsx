/**
 * Username & Password Screen
 * Collect username and password
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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signUp } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { supabase } from '@/lib/supabase';

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
  }, [translateY, translateX, opacity, starScale, delay]);

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

type UsernamePasswordScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      method: 'phone' | 'email';
      contact: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
    };
  };
};

export default function UsernamePasswordScreen({ navigation, route }: UsernamePasswordScreenProps) {
  const { method, contact, firstName, lastName, dateOfBirth } = route.params;
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [errors, setErrors] = useState({ username: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const checkUsernameTimeout = useRef<NodeJS.Timeout | null>(null);

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
  }, [fadeAnim, slideUpAnim]);

  const checkUsernameAvailability = (value: string) => {
    if (value.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');

    if (checkUsernameTimeout.current) {
      clearTimeout(checkUsernameTimeout.current);
    }

    checkUsernameTimeout.current = setTimeout(async () => {
      try {
        console.log('🔍 Checking username:', value.toLowerCase());
        
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', value.toLowerCase())
          .limit(1);

        console.log('✅ Username check response:', { data, error, hasData: data && data.length > 0 });

        if (error) {
          console.error('❌ Username check API error:', error);
          setUsernameStatus('idle');
          setErrors(prev => ({
            ...prev,
            username: `API Error: ${error.message}`
          }));
          return;
        }

        // If data array has items, username is taken
        const isTaken = data && data.length > 0;
        console.log(`📊 Username '${value}' is ${isTaken ? 'TAKEN' : 'AVAILABLE'}`);
        setUsernameStatus(isTaken ? 'taken' : 'available');
      } catch (error: any) {
        console.error('❌ Username check exception:', error);
        setUsernameStatus('idle');
        setErrors(prev => ({
          ...prev,
          username: `Error: ${error.message || 'Connection failed'}`
        }));
      }
    }, 500);
  };

  const handleUsernameChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
    setErrors({ ...errors, username: '' });
    
    if (cleaned.length >= 3) {
      checkUsernameAvailability(cleaned);
    } else {
      setUsernameStatus('idle');
    }
  };

  const handleContinue = async () => {
    const newErrors = { username: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'Username is already taken';
      isValid = false;
    } else if (usernameStatus === 'checking') {
      newErrors.username = 'Checking username...';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsLoading(true);
      
      try {
        // Sign up with Supabase
        const result = await signUp({
          email: contact, // Using contact as email
          password,
          firstName,
          lastName,
          username,
          dateOfBirth,
        });

        // Update auth store
        useAuthStore.getState().setUser({
          id: result.user.id,
          firstName,
          lastName,
          username,
          email: contact,
          isAnonymous: false,
        });

        // Navigate to home
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
      } catch (error: any) {
        Alert.alert(
          'Signup Failed',
          error.message || 'Failed to create account. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getUsernameIcon = () => {
    if (usernameStatus === 'checking') {
      return <ActivityIndicator size="small" color="#8b5cf6" />;
    }
    if (usernameStatus === 'available') {
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    }
    if (usernameStatus === 'taken') {
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M6 18L18 6M6 6l12 12" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    }
    return null;
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#2d1b4e']} style={styles.gradient}>
          {/* Floating Stars */}
          <View style={styles.starsContainer} pointerEvents="none">
            {[...Array(12)].map((_, i) => (
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
                <Text style={styles.title}>SECURE YOUR ACCOUNT</Text>
                <Text style={styles.subtitle}>Choose your username and password</Text>
              </View>

              {/* Form Card */}
              <BlurView intensity={40} tint="dark" style={styles.card}>
                {/* Username */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>USERNAME</Text>
                  <View style={styles.usernameContainer}>
                    <TextInput
                      value={username}
                      onChangeText={handleUsernameChange}
                      placeholder="johndoe"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      autoCapitalize="none"
                      style={[styles.input, styles.usernameInput]}
                    />
                    <View style={styles.usernameIcon}>
                      {getUsernameIcon()}
                    </View>
                  </View>
                  {errors.username ? (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  ) : usernameStatus === 'available' ? (
                    <Text style={styles.successText}>Username is available!</Text>
                  ) : null}
                  <Text style={styles.hintText}>Only letters, numbers, and underscores</Text>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <View style={styles.usernameContainer}>
                    <TextInput
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        setErrors({ ...errors, password: '' });
                      }}
                      placeholder="At least 8 characters"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      style={[styles.input, styles.usernameInput]}
                    />
                    <TouchableOpacity 
                      style={styles.usernameIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                    >
                      <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
                        {showPassword ? (
                          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#8b5cf6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <>
                            <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                          </>
                        )}
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                  <View style={styles.usernameContainer}>
                    <TextInput
                      value={confirmPassword}
                      onChangeText={(value) => {
                        setConfirmPassword(value);
                        setErrors({ ...errors, confirmPassword: '' });
                      }}
                      placeholder="Re-enter password"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      style={[styles.input, styles.usernameInput]}
                    />
                    <TouchableOpacity 
                      style={styles.usernameIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      activeOpacity={0.7}
                    >
                      <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
                        {showConfirmPassword ? (
                          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#8b5cf6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <>
                            <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                          </>
                        )}
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#8b5cf6', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.continueGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.continueText}>Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  keyboardView: {
    flex: 1,
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
    flexGrow: 1,
    padding: scale(24),
    paddingTop: scale(60),
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
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: scale(1),
    marginBottom: scale(12),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(13, 0.2),
    color: '#9ca3af',
    marginBottom: scale(4),
    textAlign: 'center',
  },
  card: {
    borderRadius: scale(24),
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: scale(24),
  },
  inputGroup: {
    marginBottom: scale(20),
  },
  inputLabel: {
    fontSize: moderateScale(10, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(1.5),
    fontWeight: '600',
    marginBottom: scale(8),
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: scale(14),
    color: '#ffffff',
    fontSize: moderateScale(15, 0.2),
    fontWeight: '300',
  },
  usernameContainer: {
    position: 'relative',
  },
  usernameInput: {
    paddingRight: scale(48),
  },
  usernameIcon: {
    position: 'absolute',
    right: scale(16),
    top: scale(16),
  },
  errorText: {
    fontSize: moderateScale(12, 0.2),
    color: '#ef4444',
    marginTop: scale(6),
  },
  successText: {
    fontSize: moderateScale(12, 0.2),
    color: '#10b981',
    marginTop: scale(6),
  },
  hintText: {
    fontSize: moderateScale(11, 0.2),
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: scale(6),
  },
  continueButton: {
    marginTop: scale(12),
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  continueText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 1,
  },
});

