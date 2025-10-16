/**
 * Filter Sheet Modal
 * Premium bottom sheet with cosmic theme matching our app design
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
import Svg, { Path } from 'react-native-svg';

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
            colors={['#1a1a2e', '#0a0a1a']}
            style={styles.sheetGradient}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />
            
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
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
                <Text style={styles.sectionTitle}>POST TYPE</Text>
                <View style={styles.optionsRow}>
                  {(['all', 'unique', 'common', 'trending'] as FilterType[]).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionCard,
                        filter === type && styles.optionCardActive,
                      ]}
                      onPress={() => onFilterChange(type)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={filter === type ? getFilterGradient(type) : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                        style={styles.optionCardGradient}
                      >
                        <Text style={styles.optionEmoji}>
                          {type === 'trending' ? '🔥' : type === 'unique' ? '✨' : type === 'common' ? '👥' : '📋'}
                        </Text>
                        <Text style={[styles.optionText, filter === type && styles.optionTextActive]}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                        {filter === type && (
                          <View style={styles.checkBadge}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                              <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Content Type */}
              {filter !== 'trending' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>CONTENT TYPE</Text>
                  <View style={styles.optionsRow}>
                    {(['all', 'action', 'day'] as InputTypeFilter[]).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.optionCard,
                          inputTypeFilter === type && styles.optionCardActive,
                        ]}
                        onPress={() => onInputTypeFilterChange(type)}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={inputTypeFilter === type ? ['rgba(99, 102, 241, 0.3)', 'rgba(99, 102, 241, 0.15)'] : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                          style={styles.optionCardGradient}
                        >
                          <Text style={styles.optionEmoji}>
                            {type === 'action' ? '⚡' : type === 'day' ? '📅' : '📝'}
                          </Text>
                          <Text style={[styles.optionText, inputTypeFilter === type && styles.optionTextActive]}>
                            {type === 'all' ? 'All' : type === 'action' ? 'Actions' : 'Days'}
                          </Text>
                          {inputTypeFilter === type && (
                            <View style={styles.checkBadge}>
                              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                                <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            </View>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Location Scope */}
              {filter !== 'trending' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>LOCATION SCOPE</Text>
                  <View style={styles.optionsRow}>
                    {(['world', 'country', 'state', 'city'] as ScopeFilter[]).map((type) => {
                      const isDisabled = type !== 'world' && !userLocation?.[type];
                      return (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.optionCard,
                            scopeFilter === type && styles.optionCardActive,
                            isDisabled && styles.optionCardDisabled,
                          ]}
                          onPress={() => !isDisabled && onScopeFilterChange(type)}
                          activeOpacity={0.7}
                          disabled={isDisabled}
                        >
                          <LinearGradient
                            colors={scopeFilter === type ? ['rgba(6, 182, 212, 0.3)', 'rgba(6, 182, 212, 0.15)'] : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                            style={styles.optionCardGradient}
                          >
                            <Text style={[styles.optionEmoji, isDisabled && { opacity: 0.3 }]}>
                              {type === 'world' ? '🌐' : type === 'country' ? '🌍' : type === 'state' ? '🗺️' : '🏙️'}
                            </Text>
                            <Text style={[styles.optionText, scopeFilter === type && styles.optionTextActive, isDisabled && { opacity: 0.3 }]}>
                              {type === 'world' ? 'World' : userLocation?.[type] || type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                            {scopeFilter === type && !isDisabled && (
                              <View style={styles.checkBadge}>
                                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                                  <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                              </View>
                            )}
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Reactions */}
              {filter !== 'trending' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>FILTER BY REACTIONS</Text>
                  <View style={styles.optionsRow}>
                    {(['all', 'funny', 'creative', 'must_try'] as ReactionFilter[]).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.optionCard,
                          reactionFilter === type && styles.optionCardActive,
                        ]}
                        onPress={() => onReactionFilterChange(type)}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={reactionFilter === type ? getReactionGradient(type) : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                          style={styles.optionCardGradient}
                        >
                          <Text style={styles.optionEmoji}>
                            {type === 'funny' ? '😂' : type === 'creative' ? '🎨' : type === 'must_try' ? '🔥' : '✅'}
                          </Text>
                          <Text style={[styles.optionText, reactionFilter === type && styles.optionTextActive]}>
                            {type === 'all' ? 'All' : type === 'funny' ? 'Funny' : type === 'creative' ? 'Creative' : 'Must Try'}
                          </Text>
                          {reactionFilter === type && (
                            <View style={styles.checkBadge}>
                              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                                <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            </View>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Clear All Button */}
              <TouchableOpacity style={styles.clearButton} onPress={handleClearAll} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.clearButtonGradient}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.clearButtonText}>Clear All Filters</Text>
                </LinearGradient>
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
      return ['rgba(251, 146, 60, 0.4)', 'rgba(251, 146, 60, 0.2)'];
    case 'unique':
      return ['rgba(139, 92, 246, 0.4)', 'rgba(139, 92, 246, 0.2)'];
    case 'common':
      return ['rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.2)'];
    default:
      return ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'];
  }
}

function getReactionGradient(type: ReactionFilter): [string, string] {
  switch (type) {
    case 'funny':
      return ['rgba(234, 179, 8, 0.3)', 'rgba(234, 179, 8, 0.15)'];
    case 'creative':
      return ['rgba(168, 85, 247, 0.3)', 'rgba(168, 85, 247, 0.15)'];
    case 'must_try':
      return ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.15)'];
    default:
      return ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'];
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    overflow: 'hidden',
  },
  sheetBlur: {
    flex: 1,
  },
  sheetGradient: {
    flex: 1,
    paddingBottom: scale(40),
  },
  handleBar: {
    width: scale(40),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginTop: scale(12),
    marginBottom: scale(20),
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingBottom: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sheetTitle: {
    fontSize: moderateScale(26, 0.3),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(24),
    gap: scale(28),
  },
  section: {
    gap: scale(14),
  },
  sectionTitle: {
    fontSize: moderateScale(12, 0.2),
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.5,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  optionCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  optionCardActive: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  optionCardDisabled: {
    opacity: 0.3,
  },
  optionCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    padding: scale(16),
    borderRadius: scale(16),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionEmoji: {
    fontSize: moderateScale(22, 0.2),
  },
  optionText: {
    flex: 1,
    fontSize: moderateScale(15, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  optionTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  checkBadge: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    borderRadius: scale(16),
    overflow: 'hidden',
    marginTop: scale(8),
  },
  clearButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    paddingVertical: scale(18),
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: scale(16),
  },
  clearButtonText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
