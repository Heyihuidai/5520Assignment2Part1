import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { styleHelper } from '../helper/styleHelper';

export const IconButton = ({
  onPress,
  icon,
  iconFamily = 'Ionicons',
  size = 24,
  color,
  style,
  disabled = false,
}) => {
  const IconComponent = iconFamily === 'Ionicons' ? Ionicons : MaterialIcons;
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styleHelper.buttons.icon.base,
        pressed && styleHelper.buttons.icon.pressed,
        disabled && styleHelper.buttons.icon.disabled,
        style,
      ]}
      android_ripple={styleHelper.buttons.icon.ripple}
    >
      <IconComponent name={icon} size={size} color={color} />
    </Pressable>
  );
};