import React from 'react';
import { Pressable as RNPressable, Animated } from 'react-native';
import { usePressableFeedback, PRESSABLE_TYPES } from '../hooks/usePressableFeedback';

export const Pressable = ({ 
  children, 
  onPress,
  style,
  type = PRESSABLE_TYPES.DEFAULT,
  disabled,
  ...props 
}) => {
  const { getPressableStyle, rippleConfig } = usePressableFeedback(type);

  return (
    <RNPressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        typeof style === 'function' ? style({ pressed }) : style,
        getPressableStyle({ pressed, disabled }),
      ]}
      android_ripple={rippleConfig}
      {...props}
    >
      {children}
    </RNPressable>
  );
};