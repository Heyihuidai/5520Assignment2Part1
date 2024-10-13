import React from 'react';
import { View } from 'react-native';
import AddDietEntryForm from '../components/AddDietEntryForm';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddDietEntryScreen() {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styleHelper.screens.formContainer, { backgroundColor: themeColors.background }]}>
      <AddDietEntryForm />
    </View>
  );
}