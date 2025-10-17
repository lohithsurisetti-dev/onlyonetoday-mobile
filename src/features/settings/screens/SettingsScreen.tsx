/**
 * Settings Screen - Premium Design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/lib/stores/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type SettingsScreenProps = {
  navigation: any;
};

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { user, signOut } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Signup' }],
    });
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { 
          label: 'Edit Profile', 
          icon: 'user',
          onPress: () => console.log('Edit profile')
        },
        { 
          label: 'Change Password', 
          icon: 'lock',
          onPress: () => console.log('Change password')
        },
        { 
          label: 'Privacy', 
          icon: 'shield',
          onPress: () => console.log('Privacy')
        },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { 
          label: 'Push Notifications', 
          icon: 'bell',
          toggle: true,
          value: pushEnabled,
          onToggle: setPushEnabled
        },
        { 
          label: 'Email Notifications', 
          icon: 'mail',
          toggle: true,
          value: emailEnabled,
          onToggle: setEmailEnabled
        },
      ]
    },
    {
      title: 'About',
      items: [
        { 
          label: 'Terms of Service', 
          icon: 'file',
          onPress: () => console.log('Terms')
        },
        { 
          label: 'Privacy Policy', 
          icon: 'file',
          onPress: () => console.log('Privacy policy')
        },
        { 
          label: 'Help & Support', 
          icon: 'help',
          onPress: () => console.log('Help')
        },
        { 
          label: 'App Version', 
          icon: 'info',
          rightText: '1.0.0'
        },
      ]
    },
  ];

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'user':
        return <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'lock':
        return <Path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'shield':
        return <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'bell':
        return <Path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'mail':
        return <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'file':
        return <Path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7zM13 2v7h7" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'help':
        return <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'info':
        return <Path d="M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      case 'logout':
        return <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#0a0a1a', '#1a1a2e', '#0a0a1a']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
                <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{ width: scale(24) }} />
          </View>

          {/* User Info Card */}
          <View style={styles.userCard}>
            <BlurView intensity={25} tint="dark" style={styles.userBlur}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.05)'] as const}
                style={styles.userGradient}
              >
                <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
                <Text style={styles.userEmail}>@{user?.username}</Text>
              </LinearGradient>
            </BlurView>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              <View style={styles.sectionCard}>
                <BlurView intensity={25} tint="dark" style={styles.sectionBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)'] as const}
                    style={styles.sectionGradient}
                  >
                    {section.items.map((item, itemIndex) => (
                      <React.Fragment key={itemIndex}>
                        <TouchableOpacity
                          style={styles.settingItem}
                          onPress={item.toggle ? undefined : item.onPress}
                          activeOpacity={item.toggle ? 1 : 0.7}
                          disabled={item.toggle || !item.onPress}
                        >
                          <View style={styles.settingLeft}>
                            <View style={styles.iconContainer}>
                              <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
                                {renderIcon(item.icon)}
                              </Svg>
                            </View>
                            <Text style={styles.settingLabel}>{item.label}</Text>
                          </View>
                          
                          <View style={styles.settingRight}>
                            {item.rightText && (
                              <Text style={styles.settingValue}>{item.rightText}</Text>
                            )}
                            {item.toggle && item.onToggle && (
                              <Switch
                                value={item.value}
                                onValueChange={item.onToggle}
                                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(139, 92, 246, 0.5)' }}
                                thumbColor={item.value ? '#8b5cf6' : '#f4f3f4'}
                              />
                            )}
                            {!item.toggle && !item.rightText && (
                              <Svg width={scale(20)} height={scale(20)} viewBox="0 0 24 24" fill="none">
                                <Path d="M9 18l6-6-6-6" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            )}
                          </View>
                        </TouchableOpacity>
                        
                        {itemIndex < section.items.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </React.Fragment>
                    ))}
                  </LinearGradient>
                </BlurView>
              </View>
            </View>
          ))}

          {/* Sign Out Button */}
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <BlurView intensity={25} tint="dark" style={styles.signOutBlur}>
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.08)'] as const}
                style={styles.signOutGradient}
              >
                <View style={styles.signOutContent}>
                  <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
                    {renderIcon('logout')}
                  </Svg>
                  <Text style={styles.signOutText}>Sign Out</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a1a' },
  gradient: { flex: 1 },
  scroll: { paddingBottom: scale(100) },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
  },
  backButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 1,
  },
  
  userCard: {
    marginHorizontal: scale(20),
    marginBottom: scale(24),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  userBlur: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  userGradient: {
    padding: scale(20),
    alignItems: 'center',
  },
  userName: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: scale(4),
  },
  userEmail: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  
  section: {
    marginBottom: scale(24),
    paddingHorizontal: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: scale(12),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionCard: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  sectionBlur: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  sectionGradient: {
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(10),
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  settingLabel: {
    fontSize: moderateScale(15, 0.2),
    color: '#ffffff',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  settingValue: {
    fontSize: moderateScale(14, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: scale(64),
  },
  
  signOutButton: {
    marginHorizontal: scale(20),
    marginTop: scale(12),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  signOutBlur: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  signOutGradient: {
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(16),
    gap: scale(12),
  },
  signOutText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '500',
    color: '#ef4444',
  },
});

