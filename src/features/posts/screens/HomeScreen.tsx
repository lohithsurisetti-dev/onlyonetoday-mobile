/**
 * Home Screen - Create Post
 * Based on screen_designs/postCreationScreen/code.html
 * Allows users to submit their daily actions or summaries
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Screen, Container } from '@shared/components/layout';
import { Button, Card, Input } from '@shared/components/ui';
import { useCreatePost } from '../hooks/usePosts';
import { usePlatformStats } from '@/lib/hooks/useStats';
import type { InputType, Scope } from '@shared/types/common.types';

export default function HomeScreen({ navigation }: any) {
  const [content, setContent] = useState('');
  const [inputType, setInputType] = useState<InputType>('action');
  const [scope, setScope] = useState<Scope>('world');
  const [error, setError] = useState('');

  const { mutate: createPost, isPending } = useCreatePost();
  const { stats } = usePlatformStats();

  const handleSubmit = () => {
    // Validation
    if (content.trim().length < 3) {
      setError('Please enter at least 3 characters');
      return;
    }

    if (content.trim().length > 500) {
      setError('Content must be less than 500 characters');
      return;
    }

    setError('');

    // Create post
    createPost(
      {
        content: content.trim(),
        inputType,
        scope,
      },
      {
        onSuccess: (response) => {
          // Navigate to response screen
          Alert.alert('Success!', 'Your post has been created');
          setContent('');
          // TODO: Navigate to response screen when navigation is setup
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to create post');
        },
      }
    );
  };

  return (
    <Screen scrollable>
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>OnlyOne.Today</Text>
          <Text style={styles.subtitle}>Record. Compare. Discover.</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} padding={16}>
            <Text style={styles.statLabel}>Posts Today</Text>
            <Text style={styles.statValue}>{stats?.totalPostsToday?.toLocaleString() || '0'}</Text>
          </Card>
          <Card style={styles.statCard} padding={16}>
            <Text style={styles.statLabel}>Unique Actions</Text>
            <Text style={styles.statValue}>
              {stats?.uniqueActionsToday?.toLocaleString() || '0'}
            </Text>
          </Card>
        </View>

        {/* Main Input Card */}
        <Card padding={24} style={styles.mainCard}>
          <Text style={styles.cardTitle}>What did YOU do today?</Text>

          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <View style={styles.typeTabs}>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  inputType === 'action' && styles.typeTabActive,
                ]}
                onPress={() => setInputType('action')}
              >
                <Text
                  style={[
                    styles.typeTabText,
                    inputType === 'action' && styles.typeTabTextActive,
                  ]}
                >
                  Single Action
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  inputType === 'day' && styles.typeTabActive,
                ]}
                onPress={() => setInputType('day')}
              >
                <Text
                  style={[
                    styles.typeTabText,
                    inputType === 'day' && styles.typeTabTextActive,
                  ]}
                >
                  Day Summary
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Text Input */}
          <Input
            value={content}
            onChangeText={setContent}
            placeholder="Ate breakfast on a hot air balloon..."
            multiline
            maxLength={500}
            showCharCount
            error={error}
            style={styles.textInput}
          />

          {/* Scope Selector */}
          <View style={styles.scopeSelector}>
            <View style={styles.scopeButtons}>
              <TouchableOpacity
                style={[
                  styles.scopeButton,
                  scope === 'world' && styles.scopeButtonActive,
                ]}
                onPress={() => setScope('world')}
              >
                <Text
                  style={[
                    styles.scopeButtonText,
                    scope === 'world' && styles.scopeButtonTextActive,
                  ]}
                >
                  Worldwide
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.scopeButton,
                  scope === 'country' && styles.scopeButtonActive,
                ]}
                onPress={() => setScope('country')}
              >
                <Text
                  style={[
                    styles.scopeButtonText,
                    scope === 'country' && styles.scopeButtonTextActive,
                  ]}
                >
                  Country
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.scopeButton,
                  scope === 'state' && styles.scopeButtonActive,
                ]}
                onPress={() => setScope('state')}
              >
                <Text
                  style={[
                    styles.scopeButtonText,
                    scope === 'state' && styles.scopeButtonTextActive,
                  ]}
                >
                  State
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.scopeButton,
                  scope === 'city' && styles.scopeButtonActive,
                ]}
                onPress={() => setScope('city')}
              >
                <Text
                  style={[
                    styles.scopeButtonText,
                    scope === 'city' && styles.scopeButtonTextActive,
                  ]}
                >
                  City
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <Button onPress={handleSubmit} loading={isPending} style={styles.submitButton}>
            Discover My Uniqueness ✨
          </Button>
        </Card>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  mainCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  typeSelector: {
    marginBottom: 20,
  },
  typeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeTabActive: {
    backgroundColor: '#8347eb',
  },
  typeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0a0a0',
  },
  typeTabTextActive: {
    color: '#ffffff',
  },
  textInput: {
    marginBottom: 20,
  },
  scopeSelector: {
    marginBottom: 24,
  },
  scopeButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 24,
    padding: 4,
    gap: 4,
  },
  scopeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  scopeButtonActive: {
    backgroundColor: 'rgba(131, 71, 235, 0.8)',
  },
  scopeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a0a0a0',
  },
  scopeButtonTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    marginTop: 8,
  },
});

