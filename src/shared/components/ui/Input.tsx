/**
 * Input Component
 * Based on screen_designs/postCreationScreen/code.html textarea
 * bg-black/20, border-white/20, focus:ring-2 focus:ring-primary/50
 */

import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import { colors } from '@config/theme.config';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export default function Input({
  label,
  error,
  maxLength,
  showCharCount = false,
  value,
  style,
  ...props
}: InputProps) {
  const charCount = value?.length || 0;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#666666"
        value={value}
        maxLength={maxLength}
        {...props}
      />

      <View style={styles.footer}>
        {error && <Text style={styles.error}>{error}</Text>}
        {showCharCount && maxLength && (
          <Text style={styles.charCount}>
            {charCount}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
  },
  charCount: {
    color: '#666666',
    fontSize: 12,
  },
});

