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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const checkUsernameTimeout = useRef<NodeJS.Timeout>();

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

  const checkUsernameAvailability = (value: string) => {
    if (value.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');

    if (checkUsernameTimeout.current) {
      clearTimeout(checkUsernameTimeout.current);
    }

    checkUsernameTimeout.current = setTimeout(() => {
      setTimeout(() => {
        const isTaken = value.toLowerCase().startsWith('test');
        setUsernameStatus(isTaken ? 'taken' : 'available');
      }, 500);
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

  const handleContinue = () => {
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
      navigation.navigate('OTPVerification', {
        method,
        contact,
        firstName,
        lastName,
        username,
      });
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
                <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>

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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Choose your username and password</Text>
              </View>

              {/* Form Card */}
              <BlurView intensity={30} tint="dark" style={styles.formCard}>
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
                      <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
                        {showPassword ? (
                          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z" stroke="rgba(255, 255, 255, 0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <>
                            <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="rgba(255, 255, 255, 0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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
                      <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
                        {showConfirmPassword ? (
                          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z" stroke="rgba(255, 255, 255, 0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <>
                            <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="rgba(255, 255, 255, 0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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
                    <Text style={styles.continueText}>Send OTP</Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: scale(24),
    paddingTop: scale(16),
  },
  backButton: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(20),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: scale(32),
  },
  title: {
    fontSize: moderateScale(32, 0.3),
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  formCard: {
    borderRadius: scale(20),
    overflow: 'hidden',
    padding: scale(24),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputGroup: {
    marginBottom: scale(20),
  },
  inputLabel: {
    fontSize: moderateScale(11, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    marginBottom: scale(8),
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    fontSize: moderateScale(15, 0.2),
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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

