/**
 * Filter Sheet Modal
 * Ultra-premium bottom sheet with elegant cosmic design
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type FilterType = 'all' | 'unique' | 'common' | 'trending';
type ScopeFilter = 'world' | 'city' | 'state' | 'country';
type ReactionFilter = 'all' | 'funny' | 'creative' | 'must_try';
type InputTypeFilter = 'all' | 'action' | 'day';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  scopeFilter: ScopeFilter;
  onScopeFilterChange: (scope: ScopeFilter) => void;
  reactionFilter: ReactionFilter;
  onReactionFilterChange: (reaction: ReactionFilter) => void;
  inputTypeFilter: InputTypeFilter;
  onInputTypeFilterChange: (inputType: InputTypeFilter) => void;
  userLocation?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export default function FilterSheet({
  visible,
  onClose,
  filter,
  onFilterChange,
  scopeFilter,
  onScopeFilterChange,
  reactionFilter,
  onReactionFilterChange,
  inputTypeFilter,
  onInputTypeFilterChange,
  userLocation,
}: FilterSheetProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 10,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClearAll = () => {
    onFilterChange('all');
    onScopeFilterChange('world');
    onReactionFilterChange('all');
    onInputTypeFilterChange('all');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <BlurView intensity={100} tint="dark" style={styles.sheetBlur}>
          <LinearGradient
            colors={['#1a1a2e', '#0f0f1e', '#0a0a1a']}
            style={styles.sheetGradient}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />
            
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Filters</Text>
                <Text style={styles.sheetSubtitle}>Customize your feed</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                <BlurView intensity={40} tint="dark" style={styles.closeButtonBlur}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Post Type */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIndicator} />
                  <Text style={styles.sectionTitle}>Post Type</Text>
                </View>
                <View style={styles.optionsGrid}>
                  {(['all', 'unique', 'common', 'trending'] as FilterType[]).map((type) => {
                    const isActive = filter === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.optionButton, isActive && styles.optionButtonActive]}
                        onPress={() => onFilterChange(type)}
                        activeOpacity={0.7}
                      >
                        <BlurView intensity={isActive ? 60 : 20} tint="dark" style={styles.optionBlur}>
                          <LinearGradient
                            colors={isActive ? getFilterGradient(type) : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                            style={styles.optionGradient}
                          >
                            <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                              {type.toUpperCase()}
                            </Text>
                            {isActive && (
                              <View style={styles.activeIndicator}>
                                <Circle cx={4} cy={4} r={3} fill="#ffffff" />
                              </View>
                            )}
                          </LinearGradient>
                        </BlurView>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Content Type */}
              {filter !== 'trending' && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIndicator} />
                    <Text style={styles.sectionTitle}>Content Type</Text>
                  </View>
                  <View style={styles.optionsGrid}>
                    {(['all', 'action', 'day'] as InputTypeFilter[]).map((type) => {
                      const isActive = inputTypeFilter === type;
                      return (
                        <TouchableOpacity
                          key={type}
                          style={[styles.optionButton, isActive && styles.optionButtonActive]}
                          onPress={() => onInputTypeFilterChange(type)}
                          activeOpacity={0.7}
                        >
                          <BlurView intensity={isActive ? 60 : 20} tint="dark" style={styles.optionBlur}>
                            <LinearGradient
                              colors={isActive ? ['rgba(99, 102, 241, 0.4)', 'rgba(99, 102, 241, 0.2)'] : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                              style={styles.optionGradient}
                            >
                              <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                                {type === 'all' ? 'ALL' : type === 'action' ? 'ACTIONS' : 'DAYS'}
                              </Text>
                              {isActive && (
                                <View style={styles.activeIndicator}>
                                  <Circle cx={4} cy={4} r={3} fill="#ffffff" />
                                </View>
                              )}
                            </LinearGradient>
                          </BlurView>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Location Scope */}
              {filter !== 'trending' && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIndicator} />
                    <Text style={styles.sectionTitle}>Location Scope</Text>
                  </View>
                  <View style={styles.optionsGrid}>
                    {(['world', 'country', 'state', 'city'] as ScopeFilter[]).map((type) => {
                      const isActive = scopeFilter === type;
                      const isDisabled = type !== 'world' && !userLocation?.[type];
                      const displayLabel = type === 'world' ? 'WORLD' : (userLocation?.[type]?.toUpperCase() || type.toUpperCase());
                      
                      return (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.optionButton,
                            isActive && styles.optionButtonActive,
                            isDisabled && styles.optionButtonDisabled,
                          ]}
                          onPress={() => !isDisabled && onScopeFilterChange(type)}
                          activeOpacity={0.7}
                          disabled={isDisabled}
                        >
                          <BlurView intensity={isActive ? 60 : 20} tint="dark" style={styles.optionBlur}>
                            <LinearGradient
                              colors={isActive ? ['rgba(6, 182, 212, 0.4)', 'rgba(6, 182, 212, 0.2)'] : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                              style={styles.optionGradient}
                            >
                              <Text style={[styles.optionLabel, isActive && styles.optionLabelActive, isDisabled && styles.optionLabelDisabled]}>
                                {displayLabel}
                              </Text>
                              {isActive && !isDisabled && (
                                <View style={styles.activeIndicator}>
                                  <Circle cx={4} cy={4} r={3} fill="#ffffff" />
                                </View>
                              )}
                            </LinearGradient>
                          </BlurView>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Reactions */}
              {filter !== 'trending' && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIndicator} />
                    <Text style={styles.sectionTitle}>Reactions</Text>
                  </View>
                  <View style={styles.optionsGrid}>
                    {(['all', 'funny', 'creative', 'must_try'] as ReactionFilter[]).map((type) => {
                      const isActive = reactionFilter === type;
                      const label = type === 'all' ? 'ALL' : type === 'must_try' ? 'MUST TRY' : type.toUpperCase();
                      
                      return (
                        <TouchableOpacity
                          key={type}
                          style={[styles.optionButton, isActive && styles.optionButtonActive]}
                          onPress={() => onReactionFilterChange(type)}
                          activeOpacity={0.7}
                        >
                          <BlurView intensity={isActive ? 60 : 20} tint="dark" style={styles.optionBlur}>
                            <LinearGradient
                              colors={isActive ? getReactionGradient(type) : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                              style={styles.optionGradient}
                            >
                              <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                                {label}
                              </Text>
                              {isActive && (
                                <View style={styles.activeIndicator}>
                                  <Circle cx={4} cy={4} r={3} fill="#ffffff" />
                                </View>
                              )}
                            </LinearGradient>
                          </BlurView>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Clear All Button */}
              <TouchableOpacity style={styles.clearButton} onPress={handleClearAll} activeOpacity={0.8}>
                <BlurView intensity={40} tint="dark" style={styles.clearButtonBlur}>
                  <View style={styles.clearButtonContent}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="rgba(255, 255, 255, 0.6)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={styles.clearButtonText}>Reset Filters</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </Modal>
  );
}

// Helper functions
function getFilterGradient(type: FilterType): [string, string] {
  switch (type) {
    case 'trending':
      return ['rgba(251, 146, 60, 0.5)', 'rgba(251, 146, 60, 0.25)'];
    case 'unique':
      return ['rgba(139, 92, 246, 0.5)', 'rgba(139, 92, 246, 0.25)'];
    case 'common':
      return ['rgba(59, 130, 246, 0.5)', 'rgba(59, 130, 246, 0.25)'];
    default:
      return ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.12)'];
  }
}

function getReactionGradient(type: ReactionFilter): [string, string] {
  switch (type) {
    case 'funny':
      return ['rgba(234, 179, 8, 0.4)', 'rgba(234, 179, 8, 0.2)'];
    case 'creative':
      return ['rgba(168, 85, 247, 0.4)', 'rgba(168, 85, 247, 0.2)'];
    case 'must_try':
      return ['rgba(34, 197, 94, 0.4)', 'rgba(34, 197, 94, 0.2)'];
    default:
      return ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.12)'];
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.82,
    borderTopLeftRadius: scale(32),
    borderTopRightRadius: scale(32),
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  sheetBlur: {
    flex: 1,
  },
  sheetGradient: {
    flex: 1,
  },
  handleBar: {
    width: scale(48),
    height: scale(5),
    borderRadius: scale(2.5),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginTop: scale(14),
    marginBottom: scale(24),
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingBottom: scale(24),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  sheetTitle: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(139, 92, 246, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  sheetSubtitle: {
    fontSize: moderateScale(13, 0.2),
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: scale(2),
    letterSpacing: 0.3,
  },
  closeButton: {
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  closeButtonBlur: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(24),
    paddingBottom: scale(60),
    gap: scale(32),
  },
  section: {
    gap: scale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  sectionIndicator: {
    width: scale(3),
    height: scale(18),
    borderRadius: scale(1.5),
    backgroundColor: '#8b5cf6',
  },
  sectionTitle: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 2,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
  },
  optionButton: {
    flex: 1,
    minWidth: '47%',
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  optionButtonActive: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  optionButtonDisabled: {
    opacity: 0.25,
  },
  optionBlur: {
    borderRadius: scale(16),
  },
  optionGradient: {
    paddingVertical: scale(18),
    paddingHorizontal: scale(20),
    borderRadius: scale(16),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  optionLabel: {
    fontSize: moderateScale(13, 0.2),
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.2,
  },
  optionLabelActive: {
    color: '#ffffff',
  },
  optionLabelDisabled: {
    opacity: 0.3,
  },
  activeIndicator: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    width: scale(8),
    height: scale(8),
  },
  clearButton: {
    marginTop: scale(16),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  clearButtonBlur: {
    borderRadius: scale(16),
  },
  clearButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    paddingVertical: scale(18),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(16),
  },
  clearButtonText: {
    fontSize: moderateScale(15, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },
});
