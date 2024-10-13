import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddActivityForm from '../components/AddActivityForm';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../helper/styleHelper';

export default function AddActivityScreen() {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <AddActivityForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});