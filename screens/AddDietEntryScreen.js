import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddDietEntryForm from '../components/AddDietEntryForm';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../helper/styleHelper';

export default function AddDietEntryScreen() {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <AddDietEntryForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});