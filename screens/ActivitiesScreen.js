import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ItemsList from '../components/ItemsList';
import { useTheme } from '../context/ThemeContext';
import { styleHelper, getThemeColors } from '../helper/styleHelper';

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);

  return (
    <View style={[styleHelper.screens.container, { backgroundColor: themeColors.background }]}>
      <ItemsList type="activity" />
      <TouchableOpacity
        style={styleHelper.screens.addButton}
        onPress={() => navigation.navigate('AddActivity')}
      >
        <Ionicons name="add" size={30} color={styleHelper.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}