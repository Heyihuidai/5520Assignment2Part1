import { useCallback } from 'react';
import { Platform } from 'react-native';
import { pressableConfig } from '../helper/styleHelper';

export const PRESSABLE_TYPES = pressableConfig.types;

export const usePressableFeedback = (type = PRESSABLE_TYPES.DEFAULT) => {
  const getDefaultConfig = useCallback(() => {
    const baseConfig = pressableConfig.styles.default;
    const typeConfig = pressableConfig.styles[type.toLowerCase()];
    
    return {
      ...baseConfig,
      ...typeConfig
    };
  }, [type]);

  const config = getDefaultConfig();

  const getPressableStyle = useCallback(
    ({ pressed, disabled }) => {
      const baseStyle = {
        transform: [
          { scale: pressed ? config.pressedScale : 1 }
        ]
      };
      
      // Apply opacity feedback on both platforms
      if (pressed) {
        baseStyle.opacity = config.pressedOpacity;
      }
      
      if (disabled) {
        baseStyle.opacity = config.disabledOpacity;
      }
      
      return baseStyle;
    },
    [config.pressedScale, config.pressedOpacity, config.disabledOpacity]
  );

  const getRippleConfig = useCallback(() => {
    if (Platform.OS !== 'android') return null;
    
    return {
      color: config.rippleColor,
      borderless: config.rippleBorderless,
      foreground: true
    };
  }, [config.rippleColor, config.rippleBorderless]);

  return {
    getPressableStyle,
    rippleConfig: getRippleConfig(),
  };
};