import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.setting}>
        <Text style={[styles.settingText, { color: themeColors.text }]}>Dark Mode</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: styleHelper.spacing.medium,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: styleHelper.spacing.medium,
  },
  settingText: {
    fontSize: styleHelper.fontSize.medium,
  },
});