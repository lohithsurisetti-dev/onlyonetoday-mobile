/**
 * Filter Sheet Modal
 * Comprehensive bottom sheet with all filter options
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
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
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
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim, backgroundColor: 'rgba(0, 0, 0, 0.7)' }]} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <BlurView intensity={90} tint="dark" style={styles.sheetBlur}>
            <LinearGradient
              colors={['#1a1a2e', '#0a0a1a']}
              style={styles.sheetGradient}
            >
              {/* Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.handleBar} />
                <View style={styles.headerRow}>
                  <Text style={styles.sheetTitle}>Filters</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                      <Path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Post Type */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Post Type</Text>
                  <View style={styles.optionsGrid}>
                    {(['all', 'unique', 'common', 'trending'] as FilterType[]).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.option,
                          filter === type && styles.optionActive,
                          filter === type && getFilterActiveStyle(type),
                        ]}
                        onPress={() => onFilterChange(type)}
                      >
                        <Text style={styles.optionEmoji}>
                          {type === 'trending' ? '🔥' : type === 'unique' ? '✨' : type === 'common' ? '👥' : '📋'}
                        </Text>
                        <Text style={[styles.optionText, filter === type && styles.optionTextActive]}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                        {filter === type && (
                          <View style={styles.checkmark}>
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                              <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Content Type */}
                {filter !== 'trending' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Content Type</Text>
                    <View style={styles.optionsGrid}>
                      {(['all', 'action', 'day'] as InputTypeFilter[]).map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.option,
                            inputTypeFilter === type && styles.optionActive,
                            inputTypeFilter === type && { backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: 'rgba(99, 102, 241, 0.5)' },
                          ]}
                          onPress={() => onInputTypeFilterChange(type)}
                        >
                          <Text style={styles.optionEmoji}>
                            {type === 'action' ? '⚡' : type === 'day' ? '📅' : '📝'}
                          </Text>
                          <Text style={[styles.optionText, inputTypeFilter === type && styles.optionTextActive]}>
                            {type === 'all' ? 'All' : type === 'action' ? 'Actions' : 'Days'}
                          </Text>
                          {inputTypeFilter === type && (
                            <View style={styles.checkmark}>
                              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                                <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Location Scope */}
                {filter !== 'trending' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location Scope</Text>
                    <View style={styles.optionsGrid}>
                      <TouchableOpacity
                        style={[
                          styles.option,
                          scopeFilter === 'city' && styles.optionActive,
                          scopeFilter === 'city' && { backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: 'rgba(6, 182, 212, 0.5)' },
                          !userLocation?.city && styles.optionDisabled,
                        ]}
                        onPress={() => userLocation?.city && onScopeFilterChange('city')}
                        disabled={!userLocation?.city}
                      >
                        <Text style={styles.optionEmoji}>🏙️</Text>
                        <Text style={[styles.optionText, scopeFilter === 'city' && styles.optionTextActive]}>
                          {userLocation?.city || 'City'}
                        </Text>
                        {scopeFilter === 'city' && (
                          <View style={styles.checkmark}>
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                              <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                          </View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.option,
                          scopeFilter === 'state' && styles.optionActive,
                          scopeFilter === 'state' && { backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: 'rgba(6, 182, 212, 0.5)' },
                          !userLocation?.state && styles.optionDisabled,
                        ]}
                        onPress={() => userLocation?.state && onScopeFilterChange('state')}
                        disabled={!userLocation?.state}
                      >
                        <Text style={styles.optionEmoji}>🗺️</Text>
                        <Text style={[styles.optionText, scopeFilter === 'state' && styles.optionTextActive]}>
                          {userLocation?.state || 'State'}
                        </Text>
                        {scopeFilter === 'state' && (
                          <View style={styles.checkmark}>
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                              <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                          </View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.option,
                          scopeFilter === 'country' && styles.optionActive,
                          scopeFilter === 'country' && { backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: 'rgba(6, 182, 212, 0.5)' },
                          !userLocation?.country && styles.optionDisabled,
                        ]}
                        onPress={() => userLocation?.country && onScopeFilterChange('country')}
                        disabled={!userLocation?.country}
                      >
                        <Text style={styles.optionEmoji}>🌍</Text>
                        <Text style={[styles.optionText, scopeFilter === 'country' && styles.optionTextActive]}>
                          {userLocation?.country || 'Country'}
                        </Text>
                        {scopeFilter === 'country' && (
                          <View style={styles.checkmark}>
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                              <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                          </View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.option,
                          scopeFilter === 'world' && styles.optionActive,
                          scopeFilter === 'world' && { backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: 'rgba(6, 182, 212, 0.5)' },
                        ]}
                        onPress={() => onScopeFilterChange('world')}
                      >
                        <Text style={styles.optionEmoji}>🌐</Text>
                        <Text style={[styles.optionText, scopeFilter === 'world' && styles.optionTextActive]}>
                          World
                        </Text>
                        {scopeFilter === 'world' && (
                          <View style={styles.checkmark}>
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                              <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Reactions */}
                {filter !== 'trending' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Filter by Reactions</Text>
                    <View style={styles.optionsGrid}>
                      {(['all', 'funny', 'creative', 'must_try'] as ReactionFilter[]).map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.option,
                            reactionFilter === type && styles.optionActive,
                            reactionFilter === type && getReactionActiveStyle(type),
                          ]}
                          onPress={() => onReactionFilterChange(type)}
                        >
                          <Text style={styles.optionEmoji}>
                            {type === 'funny' ? '😂' : type === 'creative' ? '🎨' : type === 'must_try' ? '🔥' : '✅'}
                          </Text>
                          <Text style={[styles.optionText, reactionFilter === type && styles.optionTextActive]}>
                            {type === 'all' ? 'All' : type === 'funny' ? 'Funny' : type === 'creative' ? 'Creative' : 'Must Try'}
                          </Text>
                          {reactionFilter === type && (
                            <View style={styles.checkmark}>
                              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                                <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Clear All Button */}
                <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                  <LinearGradient
                    colors={['#ef4444', '#dc2626']}
                    style={styles.clearButtonGradient}
                  >
                    <Text style={styles.clearButtonText}>Clear All Filters</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Helper functions
function getFilterActiveStyle(type: FilterType) {
  switch (type) {
    case 'trending':
      return { backgroundColor: 'rgba(251, 146, 60, 0.2)', borderColor: 'rgba(251, 146, 60, 0.5)' };
    case 'unique':
      return { backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.5)' };
    case 'common':
      return { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.5)' };
    default:
      return { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)' };
  }
}

function getReactionActiveStyle(type: ReactionFilter) {
  switch (type) {
    case 'funny':
      return { backgroundColor: 'rgba(234, 179, 8, 0.2)', borderColor: 'rgba(234, 179, 8, 0.5)' };
    case 'creative':
      return { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.5)' };
    case 'must_try':
      return { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.5)' };
    default:
      return { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)' };
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    overflow: 'hidden',
  },
  sheetBlur: {
    flex: 1,
  },
  sheetGradient: {
    flex: 1,
  },
  sheetHeader: {
    paddingTop: scale(12),
    paddingBottom: scale(16),
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  handleBar: {
    width: scale(40),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginBottom: scale(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: scale(40),
  },
  section: {
    marginBottom: scale(28),
  },
  sectionTitle: {
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: scale(12),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  option: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    padding: scale(14),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionActive: {
    borderWidth: 2,
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionEmoji: {
    fontSize: moderateScale(20, 0.2),
  },
  optionText: {
    flex: 1,
    fontSize: moderateScale(14, 0.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  optionTextActive: {
    color: '#ffffff',
  },
  checkmark: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    marginTop: scale(12),
    borderRadius: scale(14),
    overflow: 'hidden',
  },
  clearButtonGradient: {
    paddingVertical: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: moderateScale(16, 0.2),
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

