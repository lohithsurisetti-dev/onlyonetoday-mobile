/**
 * Signup Screen - Phone/Email OTP or Anonymous
 * Premium design with smooth animations
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
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/lib/stores/authStore';

// Responsive scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Floating star component (reused)
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

type SignupScreenProps = {
  navigation: any; // Will type properly when added to navigator
};

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { setAnonymous } = useAuthStore();
  
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [toggleContainerWidth, setToggleContainerWidth] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const toggleSlideAnim = useRef(new Animated.Value(0)).current;

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

  const handleMethodChange = (newMethod: 'phone' | 'email') => {
    setMethod(newMethod);
    setInput('');
    setError('');
    Animated.spring(toggleSlideAnim, {
      toValue: newMethod === 'phone' ? 0 : 1,
      damping: 20,
      stiffness: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleContinueAnonymous = () => {
    // Set anonymous user
    setAnonymous();
    // Navigate to main app
    navigation.replace('Main');
  };

  const handleSendOTP = () => {
    if (!input.trim()) {
      setError(`Please enter your ${method === 'phone' ? 'phone number' : 'email'}`);
      return;
    }

    if (method === 'email' && !input.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (method === 'phone' && input.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    
    // Navigate to user details screen
    navigation.navigate('UserDetails', {
      method,
      contact: input,
    });
  };

  const handleOpenTerms = async () => {
    const url = 'https://onlyone.today/terms'; // Replace with your actual URL
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.log('Cannot open URL:', url);
    }
  };

  const handleOpenPrivacy = async () => {
    const url = 'https://onlyone.today/privacy'; // Replace with your actual URL
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.log('Cannot open URL:', url);
    }
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
                <Text style={styles.title}>Welcome to</Text>
                <Text style={styles.appName}>ONLYONE</Text>
                <Text style={styles.subtitle}>Track your everyday moments</Text>
              </View>

              {/* Main Card */}
              <BlurView intensity={40} tint="dark" style={styles.card}>
                {/* Method Toggle - Home Screen Style */}
                <View 
                  style={styles.methodToggle}
                  onLayout={(e) => setToggleContainerWidth(e.nativeEvent.layout.width)}
                >
                  <View style={styles.toggleBackground}>
                    <Animated.View
                      style={[
                        styles.toggleIndicator,
                        {
                          transform: [
                            {
                              translateX: toggleSlideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, (toggleContainerWidth / 2) - 4],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.toggleButtons}>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => handleMethodChange('phone')}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.toggleText, method === 'phone' && styles.toggleTextActive]}>
                        Phone
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => handleMethodChange('email')}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.toggleText, method === 'email' && styles.toggleTextActive]}>
                        Email
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Input */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>
                    {method === 'phone' ? 'PHONE NUMBER' : 'EMAIL ADDRESS'}
                  </Text>
                  <TextInput
                    value={input}
                    onChangeText={(text) => {
                      setInput(text);
                      setError('');
                    }}
                    placeholder={method === 'phone' ? '+1 234 567 8900' : 'you@example.com'}
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity style={styles.otpButton} onPress={handleSendOTP} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#8b5cf6', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.otpGradient}
                  >
                    <Text style={styles.otpButtonText}>Continue</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Anonymous Button */}
                <TouchableOpacity
                  style={styles.anonymousButton}
                  onPress={handleContinueAnonymous}
                  activeOpacity={0.7}
                >
                  <Text style={styles.anonymousText}>Continue as Guest</Text>
                </TouchableOpacity>
              </BlurView>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>By continuing, you agree to our </Text>
                <TouchableOpacity onPress={handleOpenTerms} activeOpacity={0.7}>
                  <Text style={styles.footerLink}>Terms</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}> & </Text>
                <TouchableOpacity onPress={handleOpenPrivacy} activeOpacity={0.7}>
                  <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInPrompt}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'center',
    padding: scale(24),
  },
  content: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: scale(40),
  },
  title: {
    fontSize: moderateScale(16, 0.2),
    color: '#9ca3af',
    letterSpacing: scale(2),
    fontWeight: '300',
  },
  appName: {
    fontSize: moderateScale(36, 0.3),
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: scale(6),
    marginTop: scale(8),
    textShadowColor: 'rgba(139, 92, 246, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: moderateScale(12, 0.2),
    color: '#6b7280',
    marginTop: scale(8),
    letterSpacing: scale(1.5),
    fontWeight: '300',
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
  methodToggle: {
    marginBottom: scale(24),
    position: 'relative',
    height: scale(50),
  },
  toggleBackground: {
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
  toggleIndicator: {
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
  toggleButtons: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 1,
    height: '100%',
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '500',
    color: '#6b7280',
    letterSpacing: 0.3,
  },
  toggleTextActive: {
    color: '#ffffff',
    fontWeight: '600',
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
    padding: scale(16),
    color: '#ffffff',
    fontSize: moderateScale(16, 0.2),
    fontWeight: '300',
  },
  errorText: {
    color: '#ef4444',
    fontSize: moderateScale(11, 0.2),
    marginTop: scale(6),
  },
  otpButton: {
    borderRadius: scale(12),
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  otpGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  otpButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(15, 0.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(24),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    paddingHorizontal: scale(16),
    fontSize: moderateScale(11, 0.2),
    color: '#6b7280',
    fontWeight: '600',
  },
  anonymousButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  anonymousText: {
    color: '#9ca3af',
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(24),
    paddingHorizontal: scale(32),
  },
  footerText: {
    fontSize: moderateScale(11, 0.2),
    color: '#6b7280',
    lineHeight: moderateScale(18, 0.2),
  },
  footerLink: {
    fontSize: moderateScale(11, 0.2),
    color: '#8b5cf6',
    lineHeight: moderateScale(18, 0.2),
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(6),
    marginTop: scale(20),
  },
  signInPrompt: {
    fontSize: scale(14),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  signInLink: {
    fontSize: scale(14),
    color: '#ec4899',
    fontWeight: '700',
  },
});

