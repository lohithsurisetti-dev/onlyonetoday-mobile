/**
 * User Details Screen
 * Collect first name, last name, and validate username
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

type UserDetailsScreenProps = {
  navigation: any;
  route: {
    params: {
      method: 'phone' | 'email';
      contact: string;
    };
  };
};

export default function UserDetailsScreen({ navigation, route }: UserDetailsScreenProps) {
  const { method, contact } = route.params;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [errors, setErrors] = useState({ firstName: '', lastName: '', username: '' });

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

    // Debounce API call
    if (checkUsernameTimeout.current) {
      clearTimeout(checkUsernameTimeout.current);
    }

    checkUsernameTimeout.current = setTimeout(() => {
      // TODO: Check with backend API
      console.log('Checking username:', value);
      
      // Simulate API call
      setTimeout(() => {
        // Mock: usernames starting with 'test' are taken
        const isTaken = value.toLowerCase().startsWith('test');
        setUsernameStatus(isTaken ? 'taken' : 'available');
      }, 500);
    }, 500);
  };

  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric and underscore
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
    const newErrors = { firstName: '', lastName: '', username: '' };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

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

    setErrors(newErrors);

    if (isValid) {
      // Navigate to OTP verification
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
                <Text style={styles.title}>Tell us about yourself</Text>
                <Text style={styles.subtitle}>We'll send a verification code to</Text>
                <Text style={styles.contact}>{contact}</Text>
              </View>

              {/* Form Card */}
              <BlurView intensity={40} tint="dark" style={styles.card}>
                {/* First Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FIRST NAME</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      setErrors({ ...errors, firstName: '' });
                    }}
                    placeholder="John"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    autoCapitalize="words"
                    style={styles.input}
                  />
                  {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
                </View>

                {/* Last Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>LAST NAME</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      setErrors({ ...errors, lastName: '' });
                    }}
                    placeholder="Doe"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    autoCapitalize="words"
                    style={styles.input}
                  />
                  {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
                </View>

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
                    <Text style={styles.continueText}>Continue</Text>
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
    alignItems: 'center',
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
  contact: {
    fontSize: moderateScale(14, 0.2),
    color: '#8b5cf6',
    fontWeight: '600',
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
    paddingRight: scale(44),
  },
  usernameIcon: {
    position: 'absolute',
    right: scale(14),
    top: scale(14),
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: moderateScale(11, 0.2),
    marginTop: scale(6),
  },
  successText: {
    color: '#10b981',
    fontSize: moderateScale(11, 0.2),
    marginTop: scale(6),
  },
  hintText: {
    color: '#6b7280',
    fontSize: moderateScale(10, 0.2),
    marginTop: scale(4),
  },
  continueButton: {
    borderRadius: scale(12),
    overflow: 'hidden',
    marginTop: scale(8),
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  continueGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  continueText: {
    color: '#ffffff',
    fontSize: moderateScale(15, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

