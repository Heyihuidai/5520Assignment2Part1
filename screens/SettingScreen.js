import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <View style={styleHelper.screens.setting}>
        <Text style={[styleHelper.screens.settingText, { color: themeColors.text }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: styleHelper.colors.primary }}
          thumbColor={isDarkMode ? styleHelper.colors.secondary : "#f4f3f4"}
        />
      </View>
    </View>
  );
}