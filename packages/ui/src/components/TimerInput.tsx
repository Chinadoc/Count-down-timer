import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { TimerInputProps } from '../types';

export const TimerInput: React.FC<TimerInputProps> = ({
  inputSeconds,
  onChangeText,
  disabled,
  placeholder = 'Enter seconds',
  accessibilityLabel,
}) => (
  <TextInput
    style={[styles.input, disabled && styles.disabled]}
    value={inputSeconds}
    onChangeText={onChangeText}
    keyboardType="numeric"
    placeholder={placeholder}
    accessibilityLabel={accessibilityLabel}
    placeholderTextColor="#999"
    editable={!disabled}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    width: 200,
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
});
