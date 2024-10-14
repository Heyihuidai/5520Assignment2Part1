import React from 'react';
import { View, Alert } from 'react-native';
import AddActivityForm from '../components/AddActivityForm';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function AddActivityScreen() {
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  const handleFormSubmit = (success, errorMessage) => {
    if (!success) {
      Alert.alert(
        "Alert",
        errorMessage || "Invalid input. Please check all fields.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <AddActivityForm onSubmit={handleFormSubmit} />
    </View>
  );
}