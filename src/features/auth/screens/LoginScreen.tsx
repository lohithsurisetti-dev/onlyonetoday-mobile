/**
 * Login Screen
 * Premium cosmic-themed login with email/password
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
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/authStore';

// Responsive scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Logging in with email:', email);

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        Alert.alert(
          'Login Failed',
          error.message || 'Invalid email or password. Please try again.'
        );
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        throw new Error('No user returned after login');
      }

      console.log('✅ Login successful! User ID:', data.user.id);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        console.error('⚠️ Profile fetch error:', profileError);
        // Continue anyway - user is authenticated
      }

      console.log('✅ Profile loaded:', profile);

      // Update auth store
      setUser({
        id: data.user.id,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        username: profile?.username || 'user',
        email: data.user.email || email,
        isAnonymous: false,
      });

      console.log('✅ User authenticated!');

      // Navigate to home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as never }],
      });
    } catch (error: any) {
      console.error('❌ Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'Something went wrong. Please try again.'
      );
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address to reset password.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'onlyone://reset-password',
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Check Your Email',
        'We sent you a password reset link. Please check your inbox.'
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to send reset email. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0f', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        {/* Floating Stars */}
        {[...Array(20)].map((_, i) => (
          <FloatingStar
            key={i}
            delay={i * 200}
          />
        ))}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUpAnim }],
                },
              ]}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={scale(24)} color="#ffffff" />
              </TouchableOpacity>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>WELCOME BACK</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
              </View>

              {/* Login Form */}
              <View style={styles.formContainer}>
                {/* Email Input */}
                <BlurView intensity={40} tint="dark" style={styles.inputCard}>
                  <Text style={styles.label}>EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={scale(20)}
                      color="rgba(255, 255, 255, 0.4)"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (errors.email) {
                          setErrors({ ...errors, email: undefined });
                        }
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  </View>
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </BlurView>

                {/* Password Input */}
                <BlurView intensity={40} tint="dark" style={styles.inputCard}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={scale(20)}
                      color="rgba(255, 255, 255, 0.4)"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) {
                          setErrors({ ...errors, password: undefined });
                        }
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={scale(20)}
                        color="rgba(255, 255, 255, 0.6)"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </BlurView>

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                  style={styles.forgotButton}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={styles.loginButton}
                >
                  <LinearGradient
                    colors={isLoading ? ['rgba(75, 85, 99, 0.5)', 'rgba(55, 65, 81, 0.5)'] : ['#8b5cf6', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.loginText}>Sign In</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Signup Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupPrompt}>Don't have an account?</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}
                    disabled={isLoading}
                  >
                    <Text style={styles.signupLink}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  gradient: {
    flex: 1,
  },
  star: {
    position: 'absolute',
    top: Math.random() * SCREEN_HEIGHT,
    left: Math.random() * SCREEN_WIDTH,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: scale(60),
    paddingBottom: scale(40),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
  },
  backButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(32),
  },
  header: {
    marginBottom: scale(40),
  },
  title: {
    fontSize: scale(32),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: scale(8),
    textShadowColor: 'rgba(139, 92, 246, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: scale(16),
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  formContainer: {
    gap: scale(20),
  },
  inputCard: {
    borderRadius: scale(16),
    padding: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  label: {
    fontSize: scale(12),
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1.5,
    marginBottom: scale(12),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: scale(16),
    color: '#ffffff',
    padding: 0,
  },
  passwordInput: {
    paddingRight: scale(40),
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    padding: scale(8),
  },
  errorText: {
    color: '#ef4444',
    fontSize: scale(12),
    marginTop: scale(8),
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: scale(-8),
  },
  forgotText: {
    fontSize: scale(14),
    color: '#8b5cf6',
    fontWeight: '600',
  },
  loginButton: {
    marginTop: scale(12),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  loginGradient: {
    paddingVertical: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(6),
    marginTop: scale(20),
  },
  signupPrompt: {
    fontSize: scale(14),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  signupLink: {
    fontSize: scale(14),
    color: '#ec4899',
    fontWeight: '700',
  },
});

