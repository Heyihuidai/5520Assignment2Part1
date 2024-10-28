import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export const Button = ({ 
  onPress, 
  children, 
  variant = 'primary', // primary, secondary, danger
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles[`${variant}Pressed`],
        style,
      ]}
      android_ripple={{
        color: variant === 'danger' ? '#ff6b6b' : '#4a90e2',
      }}
    >
      <Text style={[
        styles.text,
        styles[`${variant}Text`],
        disabled && styles.disabledText,
        textStyle,
      ]}>
        {children}
      </Text>
    </Pressable>
  );
};