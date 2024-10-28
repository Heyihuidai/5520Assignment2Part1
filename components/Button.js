import React from 'react';
import { Pressable, Text } from 'react-native';
import { styleHelper } from '../helper/styleHelper';

export const Button = ({ 
  onPress, 
  children, 
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styleHelper.buttons.base,
        styleHelper.buttons.variants[variant],
        pressed && styleHelper.buttons.variants[`${variant}Pressed`],
        disabled && styleHelper.buttons.states.disabled,
        style,
      ]}
      android_ripple={{
        color: variant === 'danger' ? '#ff6b6b' : '#4a90e2',
      }}
    >
      <Text style={[
        styleHelper.buttons.text.base,
        styleHelper.buttons.text[variant],
        disabled && styleHelper.buttons.text.disabled,
        textStyle,
      ]}>
        {children}
      </Text>
    </Pressable>
  );
};